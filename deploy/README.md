# Raspberry Pi deployment

Reflectrum coexists with the FlightAware feeder:

- ADS-B retains Lighttpd and its existing ports.
- `reflectrum-web.service` serves the static build on loopback port 3000.
- the desktop autostart entry rotates `HDMI-A-1` 90 degrees with `wlr-randr`
  and opens Chromium in kiosk mode.

Build on a development computer so the Pi does not need Node.js:

```sh
npm ci
npm run build
```

Copy the checkout, including `dist/`, to the Pi and run:

```sh
sudo ./deploy/install.sh
sudo reboot
```

The live Motorola display identifies as `HDMI-A-1`, with a preferred mode of
1366×768 at 60 Hz. After the 90-degree Wayland transform, applications see a
768×1366 portrait workspace.

Override the output, rotation, or URL by setting `REFLECTRUM_OUTPUT`,
`REFLECTRUM_ROTATION`, or `REFLECTRUM_URL` in the graphical session before the
autostart entry runs.

Useful diagnostics:

```sh
systemctl status reflectrum-web
journalctl -u reflectrum-web --no-pager
wlr-randr
curl --fail http://127.0.0.1:3000/
```

## Calendar feed

Reflectrum reads a private, read-only iCalendar feed through its loopback-only
server. Put the feed URL in a root-owned environment file; never add it to this
repository or `reflectrum-config.js`.

```sh
sudoedit /etc/reflectrum/calendar.env
```

Add this line using the secret iCalendar address supplied by your calendar
provider:

```ini
REFLECTRUM_CALENDAR_ICS_URL=https://calendar-provider.example/private/basic.ics
```

Then protect the file and restart the service:

```sh
sudo chmod 600 /etc/reflectrum/calendar.env
sudo systemctl restart reflectrum-web
```

Chromium requests `/api/calendar`, so the private feed URL is never stored in
the static application.

## Logitech MX Creative Dialpad

Pair the Dialpad directly with BlueZ. Put it in pairing mode, then run:

```sh
bluetoothctl
power on
agent on
default-agent
scan on
devices
pair DEVICE_MAC
trust DEVICE_MAC
connect DEVICE_MAC
quit
```

Replace `DEVICE_MAC` with the address shown by `devices`. Confirm that it is
available after pairing and after a reboot:

```sh
bluetoothctl devices Paired
bluetoothctl info DEVICE_MAC
```

Then load `http://127.0.0.1:3000/?input-debug=1` in Chromium and exercise every
button, roller direction, dial direction, and dial press. The overlay shows the
raw browser event and mapped Reflectrum command.

If a control does not reach Chromium, inspect the Linux input layer:

```sh
sudo libinput debug-events
sudo evtest
```

Record the event codes before adding a userspace input daemon. The current
adapter deliberately uses standard HID events and deployment-local key maps;
it does not require a vendor driver or an unattended browser permission.
