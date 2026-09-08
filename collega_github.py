"""Configura il remote GitHub senza salvare token nel progetto."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ENV_FILE = ROOT / ".env"


def git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *args], cwd=ROOT, check=False, text=True, capture_output=True)


def update_env(repository_url: str) -> None:
    lines = ENV_FILE.read_text(encoding="utf-8").splitlines() if ENV_FILE.exists() else []
    kept = [line for line in lines if not line.startswith("GITHUB_REPOSITORY_URL=")]
    kept.append(f"GITHUB_REPOSITORY_URL={repository_url}")
    ENV_FILE.write_text("\n".join(kept) + "\n", encoding="utf-8")


def main() -> int:
    repository_url = input("URL del repository GitHub: ").strip()
    valid = re.fullmatch(r"https://github\.com/[\w.-]+/[\w.-]+(?:\.git)?", repository_url)
    if not valid:
        print("URL non valido. Usa https://github.com/utente/repository")
        return 1
    if git("rev-parse", "--git-dir").returncode != 0 and git("init", "-b", "main").returncode != 0:
        print("Non è stato possibile inizializzare Git.")
        return 1
    current = git("remote", "get-url", "origin")
    args = ("remote", "set-url", "origin", repository_url) if current.returncode == 0 else ("remote", "add", "origin", repository_url)
    result = git(*args)
    if result.returncode != 0:
        print(result.stderr.strip())
        return 1
    update_env(repository_url.removesuffix(".git"))
    print("Remote origin configurato. Nessun token è stato salvato nel progetto.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

