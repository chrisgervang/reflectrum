# Reflectrum

A new approach to smart mirror design.

![Project Banner](https://cdn.hackaday.io/images/1212081462347619100.jpg)

Reflectrum now builds as a static React application with Vite and runs in
Chromium kiosk mode. Electron and JSPM are no longer required.

## Development

Requires Node.js 20.19 or newer.

```sh
npm ci
npm run dev
```

Create the production build with:

```sh
npm run build
```

The build is written to `dist/`.

## Input

Reflectrum accepts several equivalent controls so it can work with a keyboard,
scroll wheel, or programmable dial pad.

| Action | Inputs |
| --- | --- |
| Previous item | Arrow Up, Page Up, media previous, wheel up |
| Next item | Arrow Down, Page Down, media next, wheel down |
| Select/forward | Arrow Right, Enter, Space, media play/pause, primary/middle/browser-forward button |
| Back | Arrow Left, Escape, Backspace, browser-back/secondary button |
| Main menu | Hold the back input |

### Logitech MX Creative Dialpad

The Dialpad is handled as a standard Bluetooth HID device; Reflectrum does not
depend on Logi Options+. Vertical roller and horizontal dial events navigate,
forward/select buttons open the highlighted item, and back buttons return to
the previous screen. Bursty wheel events are throttled to one action every 90
ms by default.

Open `http://127.0.0.1:3000/?input-debug=1` on the mirror to see each raw
keyboard, wheel, or mouse event and the Reflectrum action it produces. Controls
that appear as unusual function keys can be mapped without rebuilding:

```js
window.REFLECTRUM_CONFIG = {
  input: {
    keyMap: {
      F13: 'DISPLAY_TOGGLE',
      F14: 'DOWN_CLICK',
      F15: 'PRIMARY_CLICK',
      F16: 'SECONDARY_CLICK',
    },
  },
};
```

See [deploy/README.md](deploy/README.md#logitech-mx-creative-dialpad) for
Bluetooth pairing and Linux-level diagnostics.

On macOS, auxiliary mouse buttons are intercepted before Chromium delivers
them to page JavaScript. The project includes a small native compatibility
helper that converts Dialpad buttons 3–6 to Escape, Return, Arrow Up, and Arrow
Down. Install it with `./macos/install.sh`; macOS will require Accessibility
and Input Monitoring permission for the `Reflectrum Dialpad` background app.

## Runtime configuration

`public/reflectrum-config.js` supplies deployment-time defaults. Do not commit
precise location data. Browser `localStorage` takes precedence over the tracked
defaults. Configure weather with a deployment-local value such as:

```js
window.REFLECTRUM_CONFIG = {
  username: 'Mirror',
  location: { lat: 0, long: 0, name: 'City, State' },
};
```

Weather uses the keyless Open-Meteo forecast API. When no location is
configured, Reflectrum asks the browser for its current position. Calendar
reads a private iCalendar feed through the loopback-only Pi service; see
[deploy/README.md](deploy/README.md#calendar-feed).

Night Shift runs at the Raspberry Pi compositor level, outside Chromium, so
navigation and browser refreshes cannot interrupt the tint. Its location and
color temperatures are deployment settings documented in
[deploy/README.md](deploy/README.md#night-shift).

## Raspberry Pi kiosk

See [deploy/README.md](deploy/README.md). The production setup serves the app
at `http://127.0.0.1:3000`, rotates `HDMI-A-1` 90 degrees under Wayland/Labwc,
and opens Chromium automatically when the `pi` desktop session starts.

This does not replace or reconfigure the ADS-B feeder services.
