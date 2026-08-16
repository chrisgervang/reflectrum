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
