# Raspberry Pi deployment

Reflectrum coexists with the FlightAware feeder:

- ADS-B retains Lighttpd and its existing ports.
- `reflectrum-web.service` serves the static build on loopback port 3000.
- the desktop autostart entry rotates `HDMI-A-1` 90 degrees with `wlr-randr`
  and opens Chromium in kiosk mode.
- Pi 3 hardware automatically uses a low-overhead Chromium profile and skips
  snapshot-based page transitions.
- compressed RAM swap replaces the SD-card swap file.
- `wlsunset` adjusts display color temperature through labwc's Wayland gamma
  controls; Night Shift is not rendered inside Chromium.

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

After the initial installation, routine work from the development Mac is one
command per task:

```sh
npm run pi:deploy       # check, build, copy generated assets, restart kiosk
npm run pi:refresh      # restart Chromium without rebuilding
npm run pi:screenshare  # restore the SSH tunnel and open tuned TigerVNC
```

`pi:deploy` also installs the tracked loopback server, systemd units, and Solaar
rules while preserving all deployment-local config and secret environment files.
Reboot once when the Dialpad rule changes so the running Solaar session reloads
it.

These commands use the Raspberry Pi's `adsb.local` mDNS name by default, so
DHCP address changes do not require script updates. Override it with
`REFLECTRUM_PI_HOST`. Deployment intentionally leaves
`/opt/reflectrum/reflectrum-config.js` and `/etc/reflectrum/calendar.env`
untouched.

The performance setup launches Chromium's native binary directly under Wayland,
avoiding the desktop wrapper's accessibility and extension flags. On a Pi 3 it
also caps renderer processes and adds `performance=low` to the kiosk URL.
Override automatic detection with `REFLECTRUM_PERFORMANCE_MODE=normal` or `low`
in `/etc/reflectrum/kiosk.env`. Low mode also reduces the Dialpad wheel throttle
from 90 ms to 40 ms and shortens the menu highlight motion from 180 ms to 55 ms.

`reflectrum-zram.service` allocates 50% of physical RAM as fast compressed swap
and disables `dphys-swapfile`; the existing `/var/swap` file is left intact for
easy rollback. Optional settings belong in `/etc/reflectrum/zram.env`:

```ini
REFLECTRUM_ZRAM_PERCENT=50
REFLECTRUM_ZRAM_ALGORITHM=lz4
```

Verify the active swap and lean browser command with:

```sh
swapon --show
systemctl status reflectrum-zram
pgrep -af /usr/lib/chromium/chromium
```

The screen-share launcher favors responsiveness on the Raspberry Pi 3: it
disables remote resizing, reduces Tight/JPEG quality, lowers compression work,
and rate-limits pointer updates. WayVNC stays disabled between sessions; the
launcher starts it before opening TigerVNC and stops it when the viewer exits.
Set `REFLECTRUM_VNC_LOCAL_PORT` if port 5900 is already used locally.

The live Motorola display identifies as `HDMI-A-1`, with a preferred mode of
1366×768 at 60 Hz. After the 90-degree Wayland transform, applications see a
768×1366 portrait workspace.

## System settings

The Settings page exposes guarded reboot and shutdown actions. Each action
requires two select presses, and Back cancels the confirmation. The browser can
only POST `reboot` or `shutdown` to the loopback server. The tracked polkit rule
allows the `pi` kiosk account only the matching logind power actions; it does not
grant shell or general sudo access.

Override the output, rotation, or URL by setting `REFLECTRUM_OUTPUT`,
`REFLECTRUM_ROTATION`, or `REFLECTRUM_URL` in the graphical session before the
autostart entry runs.

## Night Shift

Install the Bookworm `wlsunset` package before the initial Reflectrum install:

```sh
sudo apt install wlsunset
```

The `reflectrum-night-shift` user service talks directly to labwc's
`wlr-gamma-control` interface. It defaults to San Francisco (`37.8`, `-122.4`),
6500 K during the day, and 4000 K at night. Solar elevation controls the smooth
transition, so page changes and Chromium refreshes cannot interrupt the tint.
The desktop autostart entry starts the service whenever the kiosk session logs
in, including after a reboot.

Override the defaults in `/etc/reflectrum/night-shift.env`:

```ini
REFLECTRUM_NIGHT_SHIFT_LATITUDE=37.8
REFLECTRUM_NIGHT_SHIFT_LONGITUDE=-122.4
REFLECTRUM_NIGHT_SHIFT_DAY_TEMPERATURE=6500
REFLECTRUM_NIGHT_SHIFT_NIGHT_TEMPERATURE=4000
```

Then reload it inside the graphical session:

```sh
systemctl --user restart reflectrum-night-shift.service
systemctl --user status reflectrum-night-shift.service
```

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

## Linear assigned tasks

Create a personal API key in Linear and keep it in a root-owned environment
file; the key must never be placed in the static runtime config or repository.

```sh
sudoedit /etc/reflectrum/linear.env
```

Add the secret and restart the loopback service:

```ini
REFLECTRUM_LINEAR_API_KEY=lin_api_replace_me
```

```sh
sudo chmod 600 /etc/reflectrum/linear.env
sudo systemctl restart reflectrum-web
```

The Linear page lists active issues assigned to the key owner. Select opens a
confirmation card; select a second time completes the issue, while back cancels.
The server verifies ownership again immediately before the update.

## Home Assistant dashboard

Reflectrum's Home page is read-only. It auto-groups locks, lights, sensors, and
network-related entities, and requests numeric history for small trend lines.
Create a long-lived Home Assistant access token and store the URL and token only
on the Pi:

```sh
sudoedit /etc/reflectrum/home-assistant.env
```

```ini
REFLECTRUM_HOME_ASSISTANT_URL=http://home-assistant-host:8123
REFLECTRUM_HOME_ASSISTANT_TOKEN=replace_with_a_long_lived_token
```

```sh
sudo chmod 600 /etc/reflectrum/home-assistant.env
sudo systemctl restart reflectrum-web
```

The loopback service returns only allowlisted state fields and exposes no Home
Assistant mutation route. To put specific numeric entities first in the history
request, add their entity IDs to `homeAssistant.historyEntities` in the Pi's
untracked `reflectrum-config.js`.

## Logitech MX Creative Dialpad

Install Solaar 1.1.19 or newer before running the Reflectrum installer. Solaar
translates the Dialpad's four HID++ buttons into ordinary keys that Chromium
can receive; the wheels continue to use standard vertical and horizontal HID
scroll events.

```sh
sudo apt install solaar
solaar --version
```

Confirm that `solaar show` detects `MX Creative Dialpad` and lists Back Button,
Forward Button, Button 6, and Left Scroll As Button 7. If the distribution
package is older than 1.1.19 or does not detect the Dialpad, install the pinned
version using Solaar's documented PyPI or pipx method before continuing.

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

At graphical login, `reflectrum-mx-dialpad` starts Solaar, marks all four
buttons as diverted, and applies these rules:

| Dialpad control | Reflectrum action |
| --- | --- |
| Back Button | Back |
| Forward Button | Select/forward |
| Button 6 | Fade and toggle physical display power |
| Left Scroll As Button 7 | Next item |

The installer also adds Solaar's version-pinned `uinput` udev rule so these
synthetic key events work under the Pi's Wayland session. Reboot after the
first installation so the graphical session receives the new device ACLs.

If a control does not reach Chromium, inspect the Linux input layer:

```sh
sudo libinput debug-events
sudo evtest
```

Solaar handles the vendor HID++ buttons outside the browser, avoiding WebHID's
interactive permission prompt. Reflectrum itself remains device-independent.

Button 6 emits `F13`, which Reflectrum reserves for display power. The app fades
to black before asking the loopback service to disable the live Wayland output,
and enables HDMI with its 90-degree transform before revealing the UI. Older
non-Wayland Pi images fall back to `vcgencmd`. Other navigation input is ignored
while the display is off. Override the defaults with
`REFLECTRUM_DISPLAY_OUTPUT` and `REFLECTRUM_DISPLAY_ROTATION` in a service
environment file. Test the service directly with:

```sh
curl http://127.0.0.1:3000/api/display
```
