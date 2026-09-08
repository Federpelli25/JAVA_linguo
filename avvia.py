"""Avvia Studio Java e il laboratorio Docker isolato usando Python standard."""

from __future__ import annotations

import hmac
import json
import os
import re
import secrets
import shutil
import socket
import subprocess
import sys
import tempfile
import threading
import time
import uuid
import webbrowser
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist" / "client"
VERSION_FILE = ROOT / "VERSION"
DEFAULT_REPOSITORY = "https://github.com/Federpelli25/JAVA_linguo"
DEFAULT_SANDBOX_IMAGE = "eclipse-temurin:25-jdk"
MAX_REQUEST_BYTES = 64_000
MAX_CODE_CHARACTERS = 30_000
MAX_OUTPUT_CHARACTERS = 20_000
RUN_TIMEOUT_SECONDS = 12
LAB_API_TOKEN = secrets.token_urlsafe(32)
IMAGE_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/:@-]{0,199}$")
ALLOWED_COMMANDS = {
    "java --version": ("java", "--version"),
    "javac Main.java": ("javac", "Main.java"),
    "java Main.java": ("java", "Main.java"),
}


def load_environment() -> None:
    env_file = ROOT / ".env"
    if not env_file.exists():
        return
    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def app_version() -> str:
    try:
        return VERSION_FILE.read_text(encoding="utf-8").strip()
    except OSError:
        return "dev"


def sandbox_image() -> str:
    image = os.getenv("JAVA_SANDBOX_IMAGE", DEFAULT_SANDBOX_IMAGE).strip()
    return image if IMAGE_PATTERN.fullmatch(image) else DEFAULT_SANDBOX_IMAGE


def ensure_build() -> None:
    if (DIST / "index.html").exists():
        return
    print("Prima compilazione dell'interfaccia in corso…")
    npm = "npm.cmd" if os.name == "nt" else "npm"
    result = subprocess.run([npm, "run", "build"], cwd=ROOT, check=False)
    if result.returncode != 0 or not (DIST / "index.html").exists():
        raise RuntimeError("Esegui 'npm install' e poi 'npm run build'.")


def choose_port(preferred: int) -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        try:
            probe.bind(("127.0.0.1", preferred))
            return preferred
        except OSError:
            probe.bind(("127.0.0.1", 0))
            return int(probe.getsockname()[1])


def normalized_command(command: str) -> str:
    return " ".join(command.strip().split())


def command_arguments(command: str) -> tuple[str, ...]:
    normalized = normalized_command(command)
    try:
        return ALLOWED_COMMANDS[normalized]
    except KeyError as error:
        raise ValueError(
            "Comando non consentito. Usa: java --version, javac Main.java o java Main.java."
        ) from error


def docker_status(image: str) -> tuple[bool, str]:
    docker = shutil.which("docker")
    if docker is None:
        return False, "Docker non è installato o non è presente nel PATH."
    try:
        daemon = subprocess.run(
            [docker, "info", "--format", "{{.ServerVersion}}"],
            capture_output=True,
            text=True,
            timeout=4,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired):
        return False, "Docker non risponde. Avvia Docker Desktop e riprova."
    if daemon.returncode != 0:
        return False, "Docker Desktop non è in esecuzione."
    try:
        image_check = subprocess.run(
            [docker, "image", "inspect", image],
            capture_output=True,
            text=True,
            timeout=4,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired):
        return False, "Non è stato possibile verificare l'immagine Java."
    if image_check.returncode != 0:
        return False, f"Immagine assente. Esegui: docker pull {image}"
    return True, f"Docker {daemon.stdout.strip()} · JDK isolato pronto"


def build_docker_command(
    workspace: Path,
    command: str,
    container_name: str,
    image: str,
) -> list[str]:
    docker = shutil.which("docker") or "docker"
    mount = f"type=bind,source={workspace.resolve()},target=/workspace"
    return [
        docker,
        "run",
        "--name",
        container_name,
        "--rm",
        "--network",
        "none",
        "--memory",
        "256m",
        "--cpus",
        "1",
        "--pids-limit",
        "64",
        "--read-only",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        "--tmpfs",
        "/tmp:rw,nosuid,nodev,size=32m",
        "--mount",
        mount,
        "--workdir",
        "/workspace",
        "--env",
        "HOME=/tmp",
        image,
        *command_arguments(command),
    ]


def run_in_sandbox(code: str, command: str, image: str) -> dict[str, object]:
    if len(code) > MAX_CODE_CHARACTERS:
        raise ValueError(f"Il file supera il limite di {MAX_CODE_CHARACTERS} caratteri.")
    normalized = normalized_command(command)
    command_arguments(normalized)
    ready, reason = docker_status(image)
    if not ready:
        raise RuntimeError(reason)

    container_name = f"studio-java-{uuid.uuid4().hex[:12]}"
    started = time.monotonic()
    with tempfile.TemporaryDirectory(prefix="studio-java-lab-") as temporary:
        workspace = Path(temporary)
        (workspace / "Main.java").write_text(code, encoding="utf-8")
        docker_command = build_docker_command(workspace, normalized, container_name, image)
        try:
            result = subprocess.run(
                docker_command,
                capture_output=True,
                text=True,
                timeout=RUN_TIMEOUT_SECONDS,
                check=False,
            )
            output = "\n".join(part.strip() for part in (result.stdout, result.stderr) if part.strip())
            if not output:
                output = "Comando completato senza output."
            return {
                "ok": result.returncode == 0,
                "command": normalized,
                "exitCode": result.returncode,
                "durationMs": round((time.monotonic() - started) * 1000),
                "output": output[:MAX_OUTPUT_CHARACTERS],
            }
        except subprocess.TimeoutExpired:
            docker = shutil.which("docker") or "docker"
            subprocess.run(
                [docker, "rm", "--force", container_name],
                capture_output=True,
                timeout=4,
                check=False,
            )
            return {
                "ok": False,
                "command": normalized,
                "exitCode": 124,
                "durationMs": round((time.monotonic() - started) * 1000),
                "output": f"Esecuzione interrotta dopo {RUN_TIMEOUT_SECONDS} secondi.",
            }


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def send_json(self, payload: dict[str, object], status: HTTPStatus = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status.value)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self) -> None:  # noqa: N802
        if urlparse(self.path).path == "/app-config.json":
            image = sandbox_image()
            available, reason = docker_status(image)
            self.send_json(
                {
                    "appVersion": app_version(),
                    "githubRepositoryUrl": os.getenv("GITHUB_REPOSITORY_URL", DEFAULT_REPOSITORY),
                    "labApiToken": LAB_API_TOKEN,
                    "labSandbox": {
                        "available": available,
                        "message": reason,
                        "image": image,
                        "commands": list(ALLOWED_COMMANDS),
                    },
                }
            )
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if urlparse(self.path).path != "/api/lab/command":
            self.send_json({"ok": False, "error": "Endpoint non trovato."}, HTTPStatus.NOT_FOUND)
            return
        supplied_token = self.headers.get("X-Studio-Java-Token", "")
        if not hmac.compare_digest(supplied_token, LAB_API_TOKEN):
            self.send_json({"ok": False, "error": "Sessione non valida."}, HTTPStatus.FORBIDDEN)
            return
        if self.headers.get_content_type() != "application/json":
            self.send_json({"ok": False, "error": "Invia dati JSON."}, HTTPStatus.UNSUPPORTED_MEDIA_TYPE)
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            content_length = 0
        if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
            self.send_json({"ok": False, "error": "Richiesta vuota o troppo grande."}, HTTPStatus.BAD_REQUEST)
            return
        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
            code = payload.get("code", "")
            command = payload.get("command", "")
            if not isinstance(code, str) or not isinstance(command, str):
                raise ValueError("Codice e comando devono essere testo.")
            self.send_json(run_in_sandbox(code, command, sandbox_image()))
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as error:
            self.send_json({"ok": False, "error": str(error)}, HTTPStatus.BAD_REQUEST)
        except RuntimeError as error:
            self.send_json({"ok": False, "error": str(error)}, HTTPStatus.SERVICE_UNAVAILABLE)
        except (OSError, subprocess.SubprocessError):
            self.send_json(
                {"ok": False, "error": "Il laboratorio non ha potuto avviare il container."},
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )

    def log_message(self, format: str, *args: object) -> None:
        if len(args) > 1 and str(args[1]) == "200":
            return
        super().log_message(format, *args)


def main() -> int:
    load_environment()
    try:
        ensure_build()
    except RuntimeError as error:
        print(f"Errore: {error}")
        input("Premi Invio per chiudere…")
        return 1

    try:
        preferred_port = int(os.getenv("APP_PORT", "8765"))
    except ValueError:
        preferred_port = 8765
    port = choose_port(preferred_port)
    url = f"http://127.0.0.1:{port}"
    server = ThreadingHTTPServer(("127.0.0.1", port), AppHandler)
    if os.getenv("STUDIO_JAVA_NO_BROWSER") != "1":
        threading.Timer(0.7, lambda: webbrowser.open(url)).start()
    print(f"\nStudio Java {app_version()} è attivo su {url}")
    print("Il codice del laboratorio viene eseguito soltanto in Docker.")
    print("Premi Ctrl+C per chiudere.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStudio Java chiuso.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
