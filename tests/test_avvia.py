import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import avvia


class SandboxCommandTests(unittest.TestCase):
    def test_only_documented_commands_are_allowed(self) -> None:
        self.assertEqual(avvia.command_arguments("  java   Main.java  "), ("java", "Main.java"))
        with self.assertRaises(ValueError):
            avvia.command_arguments("powershell Remove-Item important.txt")

    def test_docker_command_applies_isolation_limits(self) -> None:
        with tempfile.TemporaryDirectory() as temporary, patch("avvia.shutil.which", return_value="docker"):
            command = avvia.build_docker_command(
                Path(temporary),
                "javac Main.java",
                "studio-java-test",
                "eclipse-temurin:25-jdk",
            )
        joined = " ".join(command)
        self.assertIn("--network none", joined)
        self.assertIn("--memory 256m", joined)
        self.assertIn("--pids-limit 64", joined)
        self.assertIn("--read-only", command)
        self.assertIn("ALL", command)
        self.assertNotIn("shell", joined)

    def test_invalid_image_falls_back_to_official_default(self) -> None:
        with patch.dict("avvia.os.environ", {"JAVA_SANDBOX_IMAGE": "bad image; command"}):
            self.assertEqual(avvia.sandbox_image(), avvia.DEFAULT_SANDBOX_IMAGE)


if __name__ == "__main__":
    unittest.main()
