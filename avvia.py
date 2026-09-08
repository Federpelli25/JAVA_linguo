"""Avvia Studio Java nel browser usando la sola libreria standard Python."""

from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist" / "client"


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


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def do_GET(self) -> None:  # noqa: N802
        if urlparse(self.path).path == "/app-config.json":
            payload = json.dumps({"githubRepositoryUrl": os.getenv("GITHUB_REPOSITORY_URL", "")}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

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
    print(f"\nStudio Java è attivo su {url}")
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
