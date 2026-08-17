#!/usr/bin/env python3
import argparse
import json
import os
import shutil
import subprocess
import threading
import time
import re
from datetime import datetime, timedelta, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urlencode, urlsplit
from urllib.request import Request, urlopen

MAX_CALENDAR_BYTES = 5 * 1024 * 1024
MAX_JSON_BYTES = 1024
MAX_LINEAR_BYTES = 2 * 1024 * 1024
MAX_HOME_ASSISTANT_BYTES = 10 * 1024 * 1024
LINEAR_API_URL = "https://api.linear.app/graphql"
LINEAR_CACHE_SECONDS = 60
LINEAR_CACHE = {"issues": None, "stored_at": 0}
LINEAR_CACHE_LOCK = threading.Lock()
HOME_ENTITY_PATTERN = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
HOME_STATES_CACHE = {"states": None, "stored_at": 0}
HOME_STATES_CACHE_LOCK = threading.Lock()
DISPLAY_POWER_LOCK = threading.Lock()
SYSTEM_POWER_COMMANDS = {
    "reboot": "reboot",
    "shutdown": "poweroff",
}


class ReflectrumHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/api/calendar":
            self.serve_calendar()
            return
        if path == "/api/display":
            self.serve_display_status()
            return
        if path == "/api/linear/issues":
            self.serve_linear_issues()
            return
        if path == "/api/home/states":
            self.serve_home_states()
            return
        if path == "/api/home/history":
            self.serve_home_history()
            return
        super().do_GET()

    def do_POST(self):
        path = urlsplit(self.path).path
        if path == "/api/display":
            self.set_display_power()
            return
        if path == "/api/system/power":
            self.set_system_power()
            return
        if path == "/api/linear/issues/complete":
            self.complete_linear_issue()
            return
        self.send_json_error(404, "Not found.")

    def send_json(self, status, value):
        payload = json.dumps(value).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def send_json_error(self, status, message):
        self.send_json(status, {"error": message})

    def same_origin_request(self):
        origin = self.headers.get("Origin")
        host = self.headers.get("Host")
        return not origin or urlsplit(origin).netloc == host

    def read_json_request(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            raise ValueError("Invalid request size.")
        if length < 1 or length > MAX_JSON_BYTES:
            raise ValueError("Invalid request size.")
        try:
            return json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            raise ValueError("Invalid JSON request.") from error

    def linear_graphql(self, query, variables=None):
        api_key = os.environ.get("REFLECTRUM_LINEAR_API_KEY", "")
        if not api_key:
            raise RuntimeError("Linear is not configured.")
        body = json.dumps({"query": query, "variables": variables or {}}).encode("utf-8")
        request = Request(
            LINEAR_API_URL,
            data=body,
            headers={
                "Authorization": api_key,
                "Content-Type": "application/json",
                "User-Agent": "Reflectrum/0.1",
            },
            method="POST",
        )
        with urlopen(request, timeout=15) as response:
            payload = response.read(MAX_LINEAR_BYTES + 1)
        if len(payload) > MAX_LINEAR_BYTES:
            raise ValueError("Linear response is too large.")
        result = json.loads(payload)
        if result.get("errors"):
            raise ValueError("Linear returned a GraphQL error.")
        return result.get("data", {})

    def home_assistant_request(self, path):
        base_url = os.environ.get("REFLECTRUM_HOME_ASSISTANT_URL", "").rstrip("/")
        token = os.environ.get("REFLECTRUM_HOME_ASSISTANT_TOKEN", "")
        if urlsplit(base_url).scheme not in ("http", "https") or not token:
            raise RuntimeError("Home Assistant is not configured.")
        request = Request(
            f"{base_url}{path}",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
                "User-Agent": "Reflectrum/0.1",
            },
        )
        with urlopen(request, timeout=20) as response:
            payload = response.read(MAX_HOME_ASSISTANT_BYTES + 1)
        if len(payload) > MAX_HOME_ASSISTANT_BYTES:
            raise ValueError("Home Assistant response is too large.")
        return json.loads(payload)

    @staticmethod
    def normalize_home_state(state):
        attributes = state.get("attributes") or {}
        return {
            "entityId": state.get("entity_id"),
            "state": state.get("state"),
            "lastChanged": state.get("last_changed"),
            "name": attributes.get("friendly_name") or state.get("entity_id"),
            "unit": attributes.get("unit_of_measurement"),
            "deviceClass": attributes.get("device_class"),
            "icon": attributes.get("icon"),
        }

    def serve_home_states(self):
        with HOME_STATES_CACHE_LOCK:
            cached = HOME_STATES_CACHE["states"]
            age = time.monotonic() - HOME_STATES_CACHE["stored_at"]
        if cached is not None and age < 15:
            self.send_json(200, {"entities": cached, "stale": False})
            return
        try:
            states = self.home_assistant_request("/api/states")
            normalized = [
                self.normalize_home_state(state)
                for state in states
                if HOME_ENTITY_PATTERN.match(state.get("entity_id", ""))
            ]
        except RuntimeError as error:
            self.send_json_error(503, str(error))
            return
        except (HTTPError, URLError, TimeoutError, ValueError, TypeError, json.JSONDecodeError):
            if cached is not None:
                self.send_json(200, {"entities": cached, "stale": True})
                return
            self.send_json_error(502, "Home Assistant states could not be loaded.")
            return
        with HOME_STATES_CACHE_LOCK:
            HOME_STATES_CACHE["states"] = normalized
            HOME_STATES_CACHE["stored_at"] = time.monotonic()
        self.send_json(200, {"entities": normalized, "stale": False})

    def serve_home_history(self):
        query = parse_qs(urlsplit(self.path).query)
        entities = [value for value in query.get("entities", [""])[0].split(",") if value]
        if not entities or len(entities) > 12 or any(not HOME_ENTITY_PATTERN.match(value) for value in entities):
            self.send_json_error(400, "Provide one to twelve valid entity IDs.")
            return
        try:
            hours = int(query.get("hours", ["24"])[0])
        except ValueError:
            hours = 0
        if hours < 1 or hours > 168:
            self.send_json_error(400, "History hours must be between 1 and 168.")
            return
        start = datetime.now(timezone.utc) - timedelta(hours=hours)
        start_value = quote(start.isoformat(timespec="seconds"))
        parameters = urlencode({
            "filter_entity_id": ",".join(entities),
            "minimal_response": "",
            "no_attributes": "",
        })
        try:
            history = self.home_assistant_request(f"/api/history/period/{start_value}?{parameters}")
        except RuntimeError as error:
            self.send_json_error(503, str(error))
            return
        except (HTTPError, URLError, TimeoutError, ValueError, TypeError, json.JSONDecodeError):
            self.send_json_error(502, "Home Assistant history could not be loaded.")
            return

        series = []
        for states in history:
            points = []
            entity_id = None
            for state in states:
                entity_id = state.get("entity_id") or entity_id
                try:
                    value = float(state.get("state"))
                except (TypeError, ValueError):
                    continue
                points.append({"at": state.get("last_changed"), "value": value})
            if entity_id and points:
                series.append({"entityId": entity_id, "points": points[-300:]})
        self.send_json(200, {"series": series, "hours": hours})

    def serve_linear_issues(self):
        query = """
          query ReflectrumAssignedIssues($after: String) {
            viewer {
              assignedIssues(first: 50, after: $after) {
                nodes {
                  id identifier title priority dueDate updatedAt url
                  state { id name type color }
                  project { name }
                }
                pageInfo { hasNextPage endCursor }
              }
            }
          }
        """
        with LINEAR_CACHE_LOCK:
            cached = LINEAR_CACHE["issues"]
            age = time.monotonic() - LINEAR_CACHE["stored_at"]
        if cached is not None and age < LINEAR_CACHE_SECONDS:
            self.send_json(200, {"issues": cached, "stale": False})
            return

        try:
            nodes = []
            after = None
            for _page in range(4):
                data = self.linear_graphql(query, {"after": after})
                connection = data["viewer"]["assignedIssues"]
                nodes.extend(connection["nodes"])
                page_info = connection["pageInfo"]
                if not page_info["hasNextPage"]:
                    break
                after = page_info["endCursor"]
        except RuntimeError as error:
            self.send_json_error(503, str(error))
            return
        except (HTTPError, URLError, TimeoutError, ValueError, KeyError, TypeError):
            if cached is not None:
                self.send_json(200, {"issues": cached, "stale": True})
                return
            self.send_json_error(502, "Assigned Linear issues could not be loaded.")
            return
        active = [
            issue for issue in nodes
            if issue.get("state", {}).get("type") not in ("completed", "canceled")
        ]
        active.sort(key=lambda issue: issue.get("updatedAt") or "", reverse=True)
        active.sort(key=lambda issue: issue.get("dueDate") or "9999-12-31")
        active.sort(key=lambda issue: issue.get("priority") if issue.get("priority") in range(1, 5) else 99)
        with LINEAR_CACHE_LOCK:
            LINEAR_CACHE["issues"] = active
            LINEAR_CACHE["stored_at"] = time.monotonic()
        self.send_json(200, {"issues": active, "stale": False})

    def complete_linear_issue(self):
        if not self.same_origin_request():
            self.send_json_error(403, "Cross-origin Linear updates are not allowed.")
            return
        try:
            body = self.read_json_request()
        except ValueError as error:
            self.send_json_error(400, str(error))
            return
        issue_id = body.get("id") if isinstance(body, dict) else None
        if not isinstance(issue_id, str) or not issue_id or len(issue_id) > 64:
            self.send_json_error(400, "A valid Linear issue ID is required.")
            return

        lookup = """
          query ReflectrumCompletionState($id: String!) {
            viewer { id }
            issue(id: $id) {
              id identifier title
              assignee { id }
              state { id name type color }
              team { states { nodes { id name type } } }
            }
          }
        """
        mutation = """
          mutation ReflectrumCompleteIssue($id: String!, $stateId: String!) {
            issueUpdate(id: $id, input: { stateId: $stateId }) {
              success
              issue { id identifier title state { id name type color } }
            }
          }
        """
        try:
            data = self.linear_graphql(lookup, {"id": issue_id})
            issue = data.get("issue")
            viewer = data.get("viewer")
            assignee = (issue or {}).get("assignee") or {}
            if not issue or not viewer or assignee.get("id") != viewer.get("id"):
                self.send_json_error(403, "Only your assigned issues can be completed here.")
                return
            if issue.get("state", {}).get("type") == "completed":
                self.send_json(200, {"issue": issue})
                return
            completed = next(
                (state for state in issue["team"]["states"]["nodes"] if state["type"] == "completed"),
                None,
            )
            if not completed:
                raise ValueError("No completed workflow state is available.")
            result = self.linear_graphql(
                mutation,
                {"id": issue["id"], "stateId": completed["id"]},
            )["issueUpdate"]
            if not result.get("success"):
                raise ValueError("Linear did not complete the issue.")
        except RuntimeError as error:
            self.send_json_error(503, str(error))
            return
        except (HTTPError, URLError, TimeoutError, ValueError, KeyError, TypeError):
            self.send_json_error(502, "The Linear issue could not be completed.")
            return
        with LINEAR_CACHE_LOCK:
            LINEAR_CACHE["stored_at"] = 0
        self.send_json(200, {"issue": result["issue"]})

    def display_command(self, power=None):
        wayland_command = shutil.which("wlr-randr")
        runtime_dir = os.environ.get("XDG_RUNTIME_DIR", f"/run/user/{os.getuid()}")
        wayland_display = os.environ.get("WAYLAND_DISPLAY", "wayland-0")
        wayland_socket = os.path.join(runtime_dir, wayland_display)
        if wayland_command and os.path.exists(wayland_socket):
            output_name = os.environ.get("REFLECTRUM_DISPLAY_OUTPUT", "HDMI-A-1")
            rotation = os.environ.get("REFLECTRUM_DISPLAY_ROTATION", "90")
            allowed_rotations = {"normal", "90", "180", "270", "flipped", "flipped-90", "flipped-180", "flipped-270"}
            if rotation not in allowed_rotations:
                rotation = "90"
            environment = os.environ.copy()
            environment.setdefault("XDG_RUNTIME_DIR", runtime_dir)
            environment.setdefault("WAYLAND_DISPLAY", wayland_display)
            if power is not None:
                command = [wayland_command, "--output", output_name, "--off"]
                if power == "on":
                    command = [wayland_command, "--output", output_name, "--on", "--transform", rotation]
                subprocess.run(
                    command,
                    capture_output=True,
                    check=True,
                    env=environment,
                    text=True,
                    timeout=3,
                )
            result = subprocess.run(
                [wayland_command],
                capture_output=True,
                check=True,
                env=environment,
                text=True,
                timeout=3,
            )
            lines = result.stdout.splitlines()
            for index, line in enumerate(lines):
                if line.startswith(f"{output_name} ") or line == output_name:
                    block = lines[index + 1:]
                    enabled = next((value for value in block if value.strip().startswith("Enabled:")), "")
                    if enabled.strip() == "Enabled: yes":
                        return "on"
                    if enabled.strip() == "Enabled: no":
                        return "off"
                    break
            raise ValueError("Configured Wayland output was not found.")

        executable = shutil.which("vcgencmd")
        if not executable:
            raise FileNotFoundError("Display control is unavailable")
        command = [executable, "display_power"]
        if power is not None:
            command.append("1" if power == "on" else "0")
        result = subprocess.run(command, capture_output=True, check=True, text=True, timeout=3)
        if "display_power=1" in result.stdout:
            return "on"
        if "display_power=0" in result.stdout:
            return "off"
        return "unknown"

    def serve_display_status(self):
        try:
            with DISPLAY_POWER_LOCK:
                power = self.display_command()
        except (FileNotFoundError, subprocess.SubprocessError, ValueError) as error:
            self.log_error("Display status command failed: %r", error)
            self.send_json(200, {"power": "on", "supported": False})
            return
        self.send_json(200, {"power": power, "supported": True})

    def set_display_power(self):
        if not self.same_origin_request():
            self.send_json_error(403, "Cross-origin display control is not allowed.")
            return

        try:
            request = self.read_json_request()
        except ValueError as error:
            self.send_json_error(400, str(error))
            return
        power = request.get("power") if isinstance(request, dict) else None
        if power not in ("on", "off"):
            self.send_json_error(400, "Power must be on or off.")
            return

        try:
            with DISPLAY_POWER_LOCK:
                actual = self.display_command(power)
        except FileNotFoundError as error:
            self.log_error("Display power command is unavailable: %r", error)
            self.send_json_error(501, "Hardware display control is unavailable.")
            return
        except (subprocess.SubprocessError, ValueError) as error:
            self.log_error("Display power command failed: %r", error)
            self.send_json_error(502, "Display power command failed.")
            return
        self.send_json(200, {"power": actual, "supported": True})

    def run_system_power_command(self, command):
        executable = shutil.which("systemctl")
        if not executable:
            self.log_error("System power command is unavailable.")
            return
        try:
            subprocess.run(
                [executable, "--no-wall", command],
                check=True,
                capture_output=True,
                text=True,
                timeout=10,
            )
        except subprocess.SubprocessError as error:
            self.log_error("System power command failed: %r", error)

    def set_system_power(self):
        if not self.same_origin_request():
            self.send_json_error(403, "Cross-origin system power control is not allowed.")
            return
        try:
            request = self.read_json_request()
        except ValueError as error:
            self.send_json_error(400, str(error))
            return
        action = request.get("action") if isinstance(request, dict) else None
        command = SYSTEM_POWER_COMMANDS.get(action)
        if not command:
            self.send_json_error(400, "Action must be reboot or shutdown.")
            return

        self.send_json(202, {"accepted": True, "action": action})
        timer = threading.Timer(1, self.run_system_power_command, args=(command,))
        timer.daemon = True
        timer.start()

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
