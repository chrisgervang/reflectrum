#!/usr/bin/env python3
import argparse
import json
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

MAX_CALENDAR_BYTES = 5 * 1024 * 1024


class ReflectrumHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path == "/api/calendar":
            self.serve_calendar()
            return
        super().do_GET()

    def send_json_error(self, status, message):
        payload = json.dumps({"error": message}).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def serve_calendar(self):
        feed_url = os.environ.get("REFLECTRUM_CALENDAR_ICS_URL", "")
        if not feed_url:
            self.send_json_error(503, "Calendar feed is not configured.")
            return
        if urlsplit(feed_url).scheme != "https":
            self.send_json_error(503, "Calendar feed must use HTTPS.")
            return

        try:
            request = Request(feed_url, headers={"User-Agent": "Reflectrum/0.1"})
            with urlopen(request, timeout=15) as response:
                payload = response.read(MAX_CALENDAR_BYTES + 1)
            if len(payload) > MAX_CALENDAR_BYTES:
                raise ValueError("Calendar feed is too large.")
        except (HTTPError, URLError, TimeoutError, ValueError):
            self.send_json_error(502, "Calendar feed could not be downloaded.")
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/calendar; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "private, max-age=300")
        self.end_headers()
        self.wfile.write(payload)


def main():
    parser = argparse.ArgumentParser(description="Serve Reflectrum and its local integrations.")
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=3000)
    parser.add_argument("--directory", required=True)
    args = parser.parse_args()

    handler = partial(ReflectrumHandler, directory=args.directory)
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
