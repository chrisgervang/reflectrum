import io
import json
import pathlib
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "deploy"))

from reflectrum_server import ReflectrumHandler  # noqa: E402


class ReflectrumServerTests(unittest.TestCase):
    def make_handler(self, headers=None, body=b""):
        handler = ReflectrumHandler.__new__(ReflectrumHandler)
        handler.headers = headers or {}
        handler.rfile = io.BytesIO(body)
        return handler

    def test_display_command_uses_wayland_output_and_restores_rotation(self):
        handler = self.make_handler()
        results = [
            SimpleNamespace(stdout=""),
            SimpleNamespace(stdout='HDMI-A-1 "Display"\n  Enabled: no\n'),
        ]
        with patch("reflectrum_server.shutil.which", return_value="/usr/bin/wlr-randr"), patch(
            "reflectrum_server.os.path.exists", return_value=True
        ), patch(
            "reflectrum_server.subprocess.run", side_effect=results
        ) as run:
            self.assertEqual(handler.display_command("off"), "off")
        self.assertEqual(run.call_args_list[0].args[0], [
            "/usr/bin/wlr-randr", "--output", "HDMI-A-1", "--off"
        ])
        self.assertEqual(run.call_args_list[1].args[0], ["/usr/bin/wlr-randr"])

    def test_display_command_uses_firmware_control_without_wayland(self):
        handler = self.make_handler()
        result = SimpleNamespace(stdout="display_power=0\n")
        with patch(
            "reflectrum_server.shutil.which",
            side_effect=["/usr/bin/wlr-randr", "/usr/bin/vcgencmd"],
        ), patch("reflectrum_server.os.path.exists", return_value=False), patch(
            "reflectrum_server.subprocess.run", return_value=result
        ) as run:
            self.assertEqual(handler.display_command("off"), "off")
        self.assertEqual(run.call_args.args[0], ["/usr/bin/vcgencmd", "display_power", "0"])

    def test_json_body_is_bounded_and_parsed(self):
        body = json.dumps({"power": "on"}).encode()
        handler = self.make_handler({"Content-Length": str(len(body))}, body)
        self.assertEqual(handler.read_json_request(), {"power": "on"})

        oversized = self.make_handler({"Content-Length": "999999"})
        with self.assertRaisesRegex(ValueError, "request size"):
            oversized.read_json_request()

    def test_cross_origin_mutations_are_rejected(self):
        allowed = self.make_handler({"Origin": "http://127.0.0.1:3000", "Host": "127.0.0.1:3000"})
        rejected = self.make_handler({"Origin": "https://attacker.example", "Host": "127.0.0.1:3000"})
        self.assertTrue(allowed.same_origin_request())
        self.assertFalse(rejected.same_origin_request())

    def test_system_power_is_allowlisted_and_deferred(self):
        body = json.dumps({"action": "reboot"}).encode()
        handler = self.make_handler(
            {
                "Content-Length": str(len(body)),
                "Origin": "http://127.0.0.1:3000",
                "Host": "127.0.0.1:3000",
            },
            body,
        )
        handler.send_json = Mock()
        timer = Mock()
        with patch("reflectrum_server.threading.Timer", return_value=timer) as timer_class:
            handler.set_system_power()
        handler.send_json.assert_called_once_with(202, {"accepted": True, "action": "reboot"})
        timer_class.assert_called_once_with(1, handler.run_system_power_command, args=("reboot",))
        self.assertTrue(timer.daemon)
        timer.start.assert_called_once_with()

        invalid_body = json.dumps({"action": "hibernate"}).encode()
        invalid = self.make_handler(
            {"Content-Length": str(len(invalid_body))},
            invalid_body,
        )
        invalid.send_json_error = Mock()
        invalid.set_system_power()
        invalid.send_json_error.assert_called_once_with(400, "Action must be reboot or shutdown.")

    def test_home_state_exposes_only_dashboard_fields(self):
        normalized = ReflectrumHandler.normalize_home_state({
            "entity_id": "lock.front_door",
            "state": "locked",
            "last_changed": "2026-08-16T20:00:00Z",
            "context": {"secret": "not returned"},
            "attributes": {
                "friendly_name": "Front Door",
                "device_class": "lock",
                "access_token": "not returned",
            },
        })
        self.assertEqual(normalized["name"], "Front Door")
        self.assertNotIn("context", normalized)
        self.assertNotIn("access_token", normalized)


if __name__ == "__main__":
    unittest.main()
