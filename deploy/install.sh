#!/usr/bin/env bash
set -Eeuo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
source_dir=${1:-$repo_root/dist}

if [[ $EUID -ne 0 ]]; then
  echo 'Run this installer with sudo.' >&2
  exit 1
fi

if [[ ! -f $source_dir/index.html ]]; then
  echo "No production build found at $source_dir" >&2
  echo 'Run npm ci && npm run build before installing.' >&2
  exit 1
fi

for command in chromium curl python3 wlr-randr; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Required command is missing: $command" >&2
    exit 1
  }
done

install -d -o pi -g pi -m 0755 /opt/reflectrum
cp -a "$source_dir"/. /opt/reflectrum/
chown -R pi:pi /opt/reflectrum

install -d -o root -g root -m 0755 /usr/local/lib/reflectrum /etc/reflectrum
install -o root -g root -m 0755 \
  "$repo_root/deploy/reflectrum_server.py" \
  /usr/local/lib/reflectrum/reflectrum_server.py

install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-web.service" \
  /etc/systemd/system/reflectrum-web.service
install -o root -g root -m 0755 \
  "$repo_root/deploy/reflectrum-kiosk" \
  /usr/local/bin/reflectrum-kiosk
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-kiosk.desktop" \
  /etc/xdg/autostart/reflectrum-kiosk.desktop

systemctl daemon-reload
systemctl enable --now reflectrum-web.service

if command -v raspi-config >/dev/null 2>&1; then
  raspi-config nonint do_blanking 1
fi

echo 'Reflectrum installed. Log out and back in, or reboot, to start kiosk mode.'
