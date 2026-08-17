#!/opt/pipx/venvs/solaar/bin/python
"""Run Solaar's HID++ listener and diversion rules without its GTK UI."""

from __future__ import annotations

import logging
import signal
import threading
import time

from gi.repository import GLib
from logitech_receiver import diversion
from solaar import configuration, listener


logging.basicConfig(
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger("reflectrum.solaar")
loop = GLib.MainLoop()
stopping = threading.Event()

HEADLESS_KEY_CODES = {
    "Escape": diversion.evdev.ecodes.KEY_ESC,
    "Return": diversion.evdev.ecodes.KEY_ENTER,
    "F13": diversion.evdev.ecodes.KEY_F13,
    "Down": diversion.evdev.ecodes.KEY_DOWN,
}


def evaluate_keypress(self, feature, notification, device, last_result):
    """Emit the small Reflectrum key set without a GTK/GDK key map."""
    for key_name in self.key_names:
        key_code = HEADLESS_KEY_CODES.get(key_name)
        if key_code is None:
            logger.warning("no headless key code configured for %s", key_name)
            continue
        if self.action != diversion.RELEASE:
            diversion.simulate_uinput(diversion.evdev.ecodes.EV_KEY, key_code, 1)
        if self.action != diversion.DEPRESS:
            diversion.simulate_uinput(diversion.evdev.ecodes.EV_KEY, key_code, 0)
    time.sleep(0.01)
    return None


def emit_key(key_code):
    diversion.simulate_uinput(diversion.evdev.ecodes.EV_KEY, key_code, 1)
    diversion.simulate_uinput(diversion.evdev.ecodes.EV_KEY, key_code, 0)


def dial_wheel_loop():
    """Translate the Dialpad's horizontal wheel around Cog 0.16's DRM bug."""
    cooldown_seconds = 0.11
    while not stopping.is_set():
        dial = None
        try:
            for path in diversion.evdev.list_devices():
                candidate = diversion.evdev.InputDevice(path)
                if candidate.name == "MX Dialpad Mouse":
                    dial = candidate
                    break
                candidate.close()

            if dial is None:
                stopping.wait(2)
                continue

            logger.info("capturing Dialpad wheel from %s", dial.path)
            dial.grab()
            last_action_at = 0.0
            for event in dial.read_loop():
                if stopping.is_set():
                    break
                if (
                    event.type != diversion.evdev.ecodes.EV_REL
                    or event.code != diversion.evdev.ecodes.REL_HWHEEL
                    or event.value == 0
                ):
                    continue

                now = time.monotonic()
                if now - last_action_at < cooldown_seconds:
                    continue
                last_action_at = now
                key_code = (
                    diversion.evdev.ecodes.KEY_UP
                    if event.value < 0
                    else diversion.evdev.ecodes.KEY_DOWN
                )
                emit_key(key_code)
        except OSError as error:
            logger.warning("Dialpad wheel reader restarting: %s", error)
            stopping.wait(2)
        finally:
            if dial is not None:
                try:
                    dial.ungrab()
                except OSError:
                    pass
                dial.close()


def status_changed(device, alert=None, reason=None, refresh=False):
    logger.info("device status changed: %s (%s)", device, reason or "no reason")


def setting_changed(device, setting_class, values):
    logger.debug("setting changed for %s: %s=%s", device, setting_class, values)


def error_callback(reason, path):
    logger.error("Solaar device error for %s: %s", path, reason)


def stop(_signum, _frame):
    stopping.set()
    loop.quit()


def main():
    signal.signal(signal.SIGINT, stop)
    signal.signal(signal.SIGTERM, stop)

    diversion.KeyPress.evaluate = evaluate_keypress
    if not diversion.setup_uinput():
        raise RuntimeError("Could not create the Solaar virtual keyboard")

    threading.Thread(target=dial_wheel_loop, name="dial-wheel", daemon=True).start()
    listener.setup_scanner(status_changed, setting_changed, error_callback)
    configuration.defer_saves = True
    listener.start_all()
    try:
        loop.run()
    finally:
        listener.stop_all()


if __name__ == "__main__":
    main()
