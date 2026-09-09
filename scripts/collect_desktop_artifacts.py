"""Raccoglie e rinomina gli installer Tauri in modo prevedibile."""

from __future__ import annotations

import argparse
import hashlib
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUNDLE_ROOT = ROOT / "src-tauri" / "target" / "release" / "bundle"

ARTIFACT_PATTERNS = {
    "windows": [("nsis/*.exe", "setup.exe")],
    "linux": [("appimage/*.AppImage", "AppImage"), ("deb/*.deb", "deb")],
    "macos": [("dmg/*.dmg", "dmg")],
}


def locate_one(pattern: str) -> Path:
    matches = sorted(BUNDLE_ROOT.glob(pattern))
    if len(matches) != 1:
        raise RuntimeError(f"Atteso un artefatto per {pattern}, trovati {len(matches)}.")
    return matches[0]


def collect(platform: str, architecture: str, version: str) -> list[Path]:
    output_dir = ROOT / "desktop-artifacts"
    output_dir.mkdir(exist_ok=True)
    collected: list[Path] = []
    for pattern, extension in ARTIFACT_PATTERNS[platform]:
        source = locate_one(pattern)
        destination = output_dir / (
            f"JAVA_linguo-v{version}-{platform}-{architecture}.{extension}"
        )
        shutil.copy2(source, destination)
        digest = hashlib.sha256(destination.read_bytes()).hexdigest()
        checksum = destination.with_suffix(destination.suffix + ".sha256")
        checksum.write_text(f"{digest}  {destination.name}\n", encoding="utf-8")
        collected.extend([destination, checksum])
    return collected


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", choices=sorted(ARTIFACT_PATTERNS), required=True)
    parser.add_argument("--architecture", required=True)
    parser.add_argument(
        "--version",
        default=(ROOT / "VERSION").read_text(encoding="utf-8").strip(),
    )
    arguments = parser.parse_args()
    for artifact in collect(arguments.platform, arguments.architecture, arguments.version):
        print(artifact.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
