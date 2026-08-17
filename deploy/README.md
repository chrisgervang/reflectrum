# Raspberry Pi deployment

Reflectrum coexists with the FlightAware feeder:

- ADS-B retains Lighttpd and its existing ports.
- `reflectrum-web.service` serves the static build on loopback port 3000.
- `reflectrum-cog.service` opens WPE WebKit directly on DRM/KMS, rotates the
  native display 90 degrees, and avoids a desktop compositor entirely.
- `reflectrum-solaar-headless.service` translates the MX Creative Dialpad's
  vendor buttons and two wheel directions into ordinary Linux keys.
- compressed RAM swap replaces the SD-card swap file.

Build on a development computer so the Pi does not need Node.js:

```sh
npm ci
npm run build
```

The Pi needs Cog/WPE, Chromium as the recovery renderer, Solaar, and the
existing Wayland utilities used by that fallback:

```sh
sudo apt install acl cog chromium solaar wlr-randr wlsunset
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
npm run pi:refresh      # restart Cog and its input bridge without rebuilding
npm run pi:screenshare  # open TigerVNC when using the Chromium fallback
```

`pi:deploy` also installs the tracked loopback server, renderer and input
services, udev permissions, and Solaar rules while preserving all
deployment-local config and secret environment files.

These commands use the Raspberry Pi's `adsb.local` mDNS name by default, so
DHCP address changes do not require script updates. Override it with
`REFLECTRUM_PI_HOST`. Deployment intentionally leaves
`/opt/reflectrum/reflectrum-config.js` and `/etc/reflectrum/calendar.env`
untouched.

Cog is the default Pi renderer because its direct-DRM path avoids Chromium,
Xwayland, and labwc composition overhead. It runs the live display at its native
1366×768 mode and rotates the GLES output 90 degrees clockwise. The application
keeps its low-memory behavior through `performance=low`, while retaining smooth
CSS transitions at the native scale. Optional settings belong in
`/etc/reflectrum/cog.env`:

```ini
REFLECTRUM_COG_VIDEO_MODE=1366x768
REFLECTRUM_COG_ROTATION=3
REFLECTRUM_DEVICE_SCALE_FACTOR=1
REFLECTRUM_COG_MEMORY_LIMIT=512
```

`REFLECTRUM_COG_ROTATION` is the number of counter-clockwise 90-degree
increments; `3` is 90 degrees clockwise. The installed Cog 0.16 Wayland plug-in
is not used because it aborts while exporting DMA buffers on this Pi image.

`reflectrum-zram.service` allocates 50% of physical RAM as fast compressed swap
and disables `dphys-swapfile`; the existing `/var/swap` file is left intact for
easy rollback. Optional settings belong in `/etc/reflectrum/zram.env`:

```ini
REFLECTRUM_ZRAM_PERCENT=50
REFLECTRUM_ZRAM_ALGORITHM=lz4
```

Verify the active swap and renderer command with:

```sh
swapon --show
systemctl status reflectrum-zram
pgrep -af '/usr/bin/cog|/usr/lib/chromium/chromium'
```

Direct DRM has no Wayland surface for WayVNC to capture. `pi:screenshare`
therefore exits with an explanation while Cog is active. Use the Chromium
fallback below when actual remote display capture is required; use `npm run dev`
for routine UI work from the Mac.

The live Motorola display identifies as `HDMI-A-1`, with a preferred mode of
1366×768 at 60 Hz. Cog's GLES rotation presents it as a 768×1366 portrait
workspace.

## System settings

The Settings page exposes guarded reboot and shutdown actions. Each action
requires two select presses, and Back cancels the confirmation. The browser can
only POST `reboot` or `shutdown` to the loopback server. The tracked polkit rule
allows the `pi` kiosk account only the matching logind power actions; it does not
grant shell or general sudo access.

Override the URL with `REFLECTRUM_URL` in `/etc/reflectrum/cog.env`.

## Renderer recovery and comparison

Chromium, LightDM, labwc, and the original graphical services remain installed
as a recovery renderer. Switch away from Cog with:

```sh
sudo systemctl disable --now reflectrum-cog.service reflectrum-solaar-headless.service
sudo systemctl enable --now lightdm.service
```

Return to the direct renderer with:

```sh
sudo systemctl disable --now lightdm.service
sudo systemctl enable --now reflectrum-solaar-headless.service reflectrum-cog.service
```

Starting LightDM stops Cog because the units conflict. Re-enabling Cog stops the
display manager and restores the headless Dialpad bridge.

## Night Shift

Install the Bookworm `wlsunset` package before the initial Reflectrum install:

```sh
sudo apt install wlsunset
```

The `reflectrum-night-shift` user service is retained for the Chromium fallback
and talks directly to labwc's `wlr-gamma-control` interface. It defaults to San
Francisco (`37.8`, `-122.4`), 6500 K during the day, and 4000 K at night.

Night Shift is unavailable in direct-DRM mode: Cog owns KMS and exposes neither
a Wayland gamma-control protocol nor an external gamma interface. The service is
therefore not started with Cog. This is an explicit performance tradeoff, not a
browser overlay.

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
journalctl -u reflectrum-cog --no-pager
journalctl -u reflectrum-solaar-headless --no-pager
journalctl -u reflectrum-web --no-pager
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
translates the Dialpad's four HID++ buttons into ordinary keys that Reflectrum
can receive.

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

Then temporarily set `REFLECTRUM_URL=http://127.0.0.1:3000/?input-debug=1` in
`/etc/reflectrum/cog.env`, restart Cog, and exercise every button, roller
direction, dial direction, and dial press. The overlay shows the raw browser
event and mapped Reflectrum command.

The system-level headless listener marks all four buttons as diverted and
applies these rules without GTK or a graphical login:

| Dialpad control | Reflectrum action |
| --- | --- |
| Back Button | Back |
| Forward Button | Select/forward |
| Button 6 | Fade and toggle physical display power |
| Left Scroll As Button 7 | Next item |

The large wheel reports horizontal high-resolution mouse-wheel events. Cog
0.16's DRM input back end loses one direction, so the headless bridge grabs only
the `MX Dialpad Mouse` event device and emits debounced Up/Down keys for both
signs. The smaller bottom-right control remains mapped to Next item.

The installer also adds a version-pinned `uinput` udev rule. It grants the
dedicated service's `input` group read/write access to Logitech `hidraw` devices
and `/dev/uinput`. Members of that group can observe Logitech raw events and
inject system-wide input, so this configuration is appropriate only for the
dedicated, trusted mirror account. The service runs as `pi`, not root.

If a control does not reach Reflectrum, inspect the Linux input layer:

```sh
sudo libinput debug-events
sudo evtest
```

Solaar handles the vendor HID++ buttons outside the browser, avoiding WebHID's
interactive permission prompt. Fixed Linux key codes replace Solaar's GTK key
map in headless mode. Reflectrum itself remains device-independent.

Button 6 emits `F13`, which Reflectrum reserves for display power. The app fades
to an opaque black curtain and restores the UI with a short fade. That curtain
is the effective mirror mode under full-KMS Cog because the Pi firmware ignores
legacy `vcgencmd display_power` DPMS requests while Cog owns DRM. The Chromium
fallback additionally powers the Wayland output through `wlr-randr`. Other
navigation input is ignored while the curtain is active. Test the service
directly with:

```sh
curl http://127.0.0.1:3000/api/display
```
