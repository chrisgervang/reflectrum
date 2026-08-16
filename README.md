# Reflectrum

A portrait smart-mirror interface designed for simple directional input.

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
| Previous item | Arrow Up, Page Up, wheel up |
| Next item | Arrow Down, Page Down, wheel down |
| Select/forward | Arrow Right, Enter, Space, primary mouse button |
| Back | Arrow Left, Escape, Backspace, secondary/browser-back mouse button |
| Main menu | Hold the back input |

## Runtime configuration

`public/reflectrum-config.js` supplies deployment-time defaults. Do not commit
API keys or precise location data. Browser `localStorage` takes precedence over
the tracked defaults.

The old Forecast.io integration is retained only as legacy code and has no
tracked API key. Weather and calendar services need new providers before those
widgets can show live data.

## Raspberry Pi kiosk

See [deploy/README.md](deploy/README.md). The production setup serves the app
at `http://127.0.0.1:3000`, rotates `HDMI-A-1` 90 degrees under Wayland/Labwc,
and opens Chromium automatically when the `pi` desktop session starts.

This does not replace or reconfigure the ADS-B feeder services.
