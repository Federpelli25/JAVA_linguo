"""Crea il backend Python one-file richiesto dal bundle Tauri."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD_ROOT = ROOT / ".desktop-build"
BINARY_NAME = "java-linguo-backend"


def host_target_triple() -> str:
    result = subprocess.run(
        ["rustc", "--print", "host-tuple"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0 or not result.stdout.strip():
        raise RuntimeError(
            "Rust non è disponibile: installalo da https://rustup.rs oppure passa "
            "--target-triple."
        )
    return result.stdout.strip()


def sidecar_filename(target_triple: str) -> str:
    suffix = ".exe" if "windows" in target_triple else ""
    return f"{BINARY_NAME}-{target_triple}{suffix}"


def build_sidecar(target_triple: str) -> Path:
    if not (ROOT / "dist" / "client" / "index.html").exists():
        raise RuntimeError("Frontend assente: esegui prima 'npm run build'.")

    pyinstaller_dist = BUILD_ROOT / "dist"
    pyinstaller_work = BUILD_ROOT / "work"
    spec_dir = BUILD_ROOT / "spec"
    shutil.rmtree(BUILD_ROOT, ignore_errors=True)
    pyinstaller_dist.mkdir(parents=True)
    pyinstaller_work.mkdir(parents=True)
    spec_dir.mkdir(parents=True)

    command = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--onefile",
        "--clean",
        "--noconfirm",
        "--name",
        BINARY_NAME,
        "--distpath",
        str(pyinstaller_dist),
        "--workpath",
        str(pyinstaller_work),
        "--specpath",
        str(spec_dir),
        "--add-data",
        f"{ROOT / 'dist' / 'client'}{os.pathsep}dist/client",
        "--add-data",
        f"{ROOT / 'VERSION'}{os.pathsep}.",
    ]
    if os.name == "nt":
        command.append("--noconsole")
    command.append(str(ROOT / "avvia.py"))
    subprocess.run(command, cwd=ROOT, check=True)

    extension = ".exe" if os.name == "nt" else ""
    built_binary = pyinstaller_dist / f"{BINARY_NAME}{extension}"
    if not built_binary.exists():
        raise RuntimeError(f"PyInstaller non ha prodotto {built_binary}.")

    destination = ROOT / "src-tauri" / "binaries" / sidecar_filename(target_triple)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(built_binary, destination)
    print(f"Sidecar pronto: {destination.relative_to(ROOT)}")
    return destination


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--target-triple", help="triple Rust del sistema di destinazione")
    arguments = parser.parse_args()
    target_triple = arguments.target_triple or host_target_triple()
    build_sidecar(target_triple)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
