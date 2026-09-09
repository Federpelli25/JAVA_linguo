import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import build_sidecar, collect_desktop_artifacts


ROOT = Path(__file__).resolve().parents[1]


class DesktopConfigurationTests(unittest.TestCase):
    def test_product_name_and_versions_are_synchronized(self) -> None:
        tauri_config = json.loads((ROOT / "src-tauri" / "tauri.conf.json").read_text())
        package = json.loads((ROOT / "package.json").read_text())
        version = (ROOT / "VERSION").read_text().strip()

        self.assertEqual(tauri_config["productName"], "JAVA_linguo")
        self.assertEqual(tauri_config["identifier"], "com.federpelli25.java-linguo")
        self.assertEqual(tauri_config["version"], version)
        self.assertEqual(package["version"], version)
        self.assertEqual(
            tauri_config["bundle"]["externalBin"],
            ["binaries/java-linguo-backend"],
        )

    def test_sidecar_name_matches_tauri_target_convention(self) -> None:
        self.assertEqual(
            build_sidecar.sidecar_filename("x86_64-pc-windows-msvc"),
            "java-linguo-backend-x86_64-pc-windows-msvc.exe",
        )
        self.assertEqual(
            build_sidecar.sidecar_filename("aarch64-apple-darwin"),
            "java-linguo-backend-aarch64-apple-darwin",
        )


class DesktopArtifactTests(unittest.TestCase):
    def test_windows_installer_gets_stable_name_and_checksum(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            temporary_root = Path(temporary)
            bundle_root = temporary_root / "bundle"
            installer = bundle_root / "nsis" / "generated.exe"
            installer.parent.mkdir(parents=True)
            installer.write_bytes(b"installer-test")

            with patch.object(collect_desktop_artifacts, "ROOT", temporary_root), patch.object(
                collect_desktop_artifacts, "BUNDLE_ROOT", bundle_root
            ):
                artifacts = collect_desktop_artifacts.collect("windows", "x64", "0.4.0")

            output = temporary_root / "desktop-artifacts" / (
                "JAVA_linguo-v0.4.0-windows-x64.setup.exe"
            )
            checksum = output.with_suffix(".exe.sha256")
            self.assertEqual(artifacts, [output, checksum])
            self.assertEqual(output.read_bytes(), b"installer-test")
            self.assertEqual(
                checksum.read_text().split()[0],
                hashlib.sha256(b"installer-test").hexdigest(),
            )


if __name__ == "__main__":
    unittest.main()
