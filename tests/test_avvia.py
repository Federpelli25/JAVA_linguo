import http.client
import io
import json
import tempfile
import threading
import unittest
from http import HTTPStatus
from pathlib import Path
from unittest.mock import patch

import avvia


class SandboxCommandTests(unittest.TestCase):
    def test_only_documented_commands_are_allowed(self) -> None:
        self.assertEqual(avvia.command_arguments("  java   Main.java  "), ("java", "Main.java"))
        with self.assertRaises(ValueError):
            avvia.command_arguments("powershell Remove-Item important.txt")

    def test_docker_command_applies_isolation_limits(self) -> None:
        with tempfile.TemporaryDirectory() as temporary, patch(
            "avvia.shutil.which", return_value="docker"
        ):
            source_file = Path(temporary) / "Main.java"
            source_file.write_text("class Main {}", encoding="utf-8")
            command = avvia.build_docker_command(
                source_file,
                "javac Main.java",
                "studio-java-test",
                avvia.DEFAULT_SANDBOX_IMAGE,
            )

        joined = " ".join(command)
        self.assertIn("--network none", joined)
        self.assertIn("--memory 256m", joined)
        self.assertIn("--memory-swap 256m", joined)
        self.assertIn("--pids-limit 64", joined)
        self.assertIn("--read-only", command)
        self.assertIn("--pull never", joined)
        self.assertIn("--user 65532:65532", joined)
        self.assertIn("--security-opt no-new-privileges=true", joined)
        self.assertIn("--ipc none", joined)
        self.assertIn("--ulimit nofile=256:256", joined)
        self.assertIn("/workspace:rw,nosuid,nodev,size=32m,mode=1777", command)
        self.assertIn("target=/workspace/Main.java,readonly", joined)
        self.assertNotIn("--privileged", command)
        self.assertNotIn("seccomp=unconfined", joined)
        self.assertNotIn("shell", joined)

    def test_legacy_image_tag_is_migrated_to_pinned_default(self) -> None:
        with patch.dict("avvia.os.environ", {"JAVA_SANDBOX_IMAGE": avvia.LEGACY_SANDBOX_IMAGE}):
            self.assertEqual(avvia.sandbox_image(), avvia.DEFAULT_SANDBOX_IMAGE)
            self.assertTrue(avvia.image_is_pinned(avvia.sandbox_image()))

    def test_invalid_image_falls_back_to_pinned_default(self) -> None:
        with patch.dict("avvia.os.environ", {"JAVA_SANDBOX_IMAGE": "bad image; command"}):
            self.assertEqual(avvia.sandbox_image(), avvia.DEFAULT_SANDBOX_IMAGE)

    def test_output_is_bounded_before_it_reaches_python_memory(self) -> None:
        class FakeProcess:
            def __init__(self) -> None:
                self.stdout = io.BytesIO(b"x" * (avvia.MAX_OUTPUT_BYTES + 100))

            def wait(self, timeout: int) -> int:
                return 0

            def kill(self) -> None:
                return None

        with patch("avvia.subprocess.Popen", return_value=FakeProcess()), patch(
            "avvia.force_remove_container"
        ) as remove:
            exit_code, output, timed_out, limited = avvia.run_docker_process(
                ["docker", "run"], "studio-java-test"
            )

        self.assertEqual(exit_code, 125)
        self.assertFalse(timed_out)
        self.assertTrue(limited)
        self.assertLessEqual(len(output.encode("utf-8")), avvia.MAX_OUTPUT_BYTES + 100)
        self.assertIn("Output interrotto", output)
        remove.assert_called_once_with("studio-java-test")


class RequestSecurityTests(unittest.TestCase):
    def setUp(self) -> None:
        avvia.reset_rate_limit()

    def test_host_and_origin_must_match_local_server(self) -> None:
        self.assertTrue(avvia.host_is_allowed("127.0.0.1:8765", 8765))
        self.assertTrue(avvia.host_is_allowed("localhost:8765", 8765))
        self.assertFalse(avvia.host_is_allowed("example.com:8765", 8765))
        self.assertFalse(avvia.host_is_allowed("127.0.0.1:9999", 8765))
        self.assertTrue(avvia.origin_is_allowed("http://127.0.0.1:8765", 8765))
        self.assertFalse(avvia.origin_is_allowed("https://example.com", 8765))

    def test_session_cookie_is_http_only_data_not_a_javascript_token(self) -> None:
        valid = f"theme=dark; {avvia.SESSION_COOKIE_NAME}={avvia.LAB_API_TOKEN}"
        self.assertTrue(avvia.session_cookie_is_valid(valid))
        self.assertFalse(avvia.session_cookie_is_valid(f"{avvia.SESSION_COOKIE_NAME}=wrong"))

    def test_rate_limit_uses_a_sliding_window(self) -> None:
        with patch("avvia.RATE_LIMIT_REQUESTS", 2), patch(
            "avvia.RATE_LIMIT_WINDOW_SECONDS", 60
        ):
            self.assertEqual(avvia.rate_limit_allows_request(now=100), (True, 0))
            self.assertEqual(avvia.rate_limit_allows_request(now=101), (True, 0))
            allowed, retry_after = avvia.rate_limit_allows_request(now=102)
            self.assertFalse(allowed)
            self.assertGreater(retry_after, 0)
            self.assertEqual(avvia.rate_limit_allows_request(now=161), (True, 0))


class AppHandlerSecurityTests(unittest.TestCase):
    def setUp(self) -> None:
        avvia.reset_rate_limit()
        self.docker_status = patch("avvia.docker_status", return_value=(True, "Sandbox pronta"))
        self.docker_status.start()
        self.server = avvia.LocalAppServer(("127.0.0.1", 0), avvia.AppHandler)
        self.port = self.server.server_port
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self) -> None:
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)
        self.docker_status.stop()

    def request(
        self,
        method: str,
        path: str,
        body: bytes | None = None,
        headers: dict[str, str] | None = None,
    ) -> tuple[int, dict[str, str], bytes]:
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(method, path, body=body, headers=headers or {})
        response = connection.getresponse()
        response_body = response.read()
        response_headers = {name.lower(): value for name, value in response.getheaders()}
        connection.close()
        return response.status, response_headers, response_body

    def session_cookie(self) -> str:
        status, headers, body = self.request("GET", "/app-config.json")
        self.assertEqual(status, HTTPStatus.OK)
        self.assertNotIn("labApiToken", json.loads(body))
        return headers["set-cookie"].split(";", 1)[0]

    def test_config_sets_protected_cookie_and_security_headers(self) -> None:
        status, headers, body = self.request("GET", "/app-config.json")
        payload = json.loads(body)

        self.assertEqual(status, HTTPStatus.OK)
        self.assertNotIn("labApiToken", payload)
        self.assertIn("HttpOnly", headers["set-cookie"])
        self.assertIn("SameSite=Strict", headers["set-cookie"])
        self.assertEqual(headers["x-content-type-options"], "nosniff")
        self.assertEqual(headers["x-frame-options"], "DENY")
        self.assertIn("frame-ancestors 'none'", headers["content-security-policy"])
        self.assertEqual(headers["cache-control"], "no-store")

    def test_invalid_host_is_rejected(self) -> None:
        status, _, _ = self.request(
            "GET", "/app-config.json", headers={"Host": f"example.com:{self.port}"}
        )
        self.assertEqual(status, HTTPStatus.MISDIRECTED_REQUEST)

    def test_post_requires_same_origin_and_valid_session_cookie(self) -> None:
        cookie = self.session_cookie()
        body = json.dumps({"code": "class Main {}", "command": "not allowed"}).encode()
        base_headers = {
            "Content-Type": "application/json",
            "Cookie": cookie,
        }

        status, _, _ = self.request("POST", "/api/lab/command", body, base_headers)
        self.assertEqual(status, HTTPStatus.FORBIDDEN)

        headers = {
            **base_headers,
            "Origin": f"http://127.0.0.1:{self.port}",
            "Cookie": f"{avvia.SESSION_COOKIE_NAME}=wrong",
        }
        status, _, _ = self.request("POST", "/api/lab/command", body, headers)
        self.assertEqual(status, HTTPStatus.FORBIDDEN)

        headers["Cookie"] = cookie
        status, _, response_body = self.request("POST", "/api/lab/command", body, headers)
        self.assertEqual(status, HTTPStatus.BAD_REQUEST)
        self.assertIn("Comando non consentito", json.loads(response_body)["error"])

    def test_post_rejects_non_object_json_and_oversized_code(self) -> None:
        cookie = self.session_cookie()
        headers = {
            "Content-Type": "application/json",
            "Cookie": cookie,
            "Origin": f"http://127.0.0.1:{self.port}",
        }

        status, _, _ = self.request("POST", "/api/lab/command", b"[]", headers)
        self.assertEqual(status, HTTPStatus.BAD_REQUEST)

        body = json.dumps(
            {
                "code": "x" * (avvia.MAX_CODE_CHARACTERS + 1),
                "command": "java Main.java",
            }
        ).encode()
        status, _, response_body = self.request("POST", "/api/lab/command", body, headers)
        self.assertEqual(status, HTTPStatus.BAD_REQUEST)
        self.assertIn("supera il limite", json.loads(response_body)["error"])

    def test_post_rejects_request_body_over_limit(self) -> None:
        cookie = self.session_cookie()
        headers = {
            "Content-Type": "application/json",
            "Cookie": cookie,
            "Origin": f"http://127.0.0.1:{self.port}",
        }
        body = b"x" * (avvia.MAX_REQUEST_BYTES + 1)

        status, _, response_body = self.request(
            "POST", "/api/lab/command", body, headers
        )

        self.assertEqual(status, HTTPStatus.BAD_REQUEST)
        self.assertIn("troppo grande", json.loads(response_body)["error"])

    def test_second_sandbox_is_rejected_while_one_is_running(self) -> None:
        cookie = self.session_cookie()
        headers = {
            "Content-Type": "application/json",
            "Cookie": cookie,
            "Origin": f"http://127.0.0.1:{self.port}",
        }
        body = json.dumps(
            {"code": "class Main {}", "command": "java Main.java"}
        ).encode()

        self.assertTrue(avvia._sandbox_slots.acquire(blocking=False))
        try:
            status, response_headers, response_body = self.request(
                "POST", "/api/lab/command", body, headers
            )
        finally:
            avvia._sandbox_slots.release()

        self.assertEqual(status, HTTPStatus.TOO_MANY_REQUESTS)
        self.assertEqual(response_headers["retry-after"], "1")
        self.assertIn("già eseguendo", json.loads(response_body)["error"])


if __name__ == "__main__":
    unittest.main()
