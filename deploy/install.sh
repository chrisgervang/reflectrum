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

for command in chromium cog curl mkswap python3 setfacl solaar swapon swapoff wlr-randr wlsunset; do
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
install -o root -g root -m 0755 \
  "$repo_root/deploy/reflectrum-cog" \
  /usr/local/bin/reflectrum-cog
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-cog.service" \
  /etc/systemd/system/reflectrum-cog.service
install -o root -g root -m 0755 \
  "$repo_root/deploy/reflectrum-zram" \
  /usr/local/sbin/reflectrum-zram
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-zram.service" \
  /etc/systemd/system/reflectrum-zram.service
install -o root -g root -m 0644 \
  "$repo_root/deploy/99-reflectrum-zram.conf" \
  /etc/sysctl.d/99-reflectrum-zram.conf
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-kiosk.service" \
  /etc/systemd/user/reflectrum-kiosk.service
install -o root -g root -m 0755 \
  "$repo_root/deploy/reflectrum-night-shift" \
  /usr/local/bin/reflectrum-night-shift
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-night-shift.service" \
  /etc/systemd/user/reflectrum-night-shift.service
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-night-shift.desktop" \
  /etc/xdg/autostart/reflectrum-night-shift.desktop
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-kiosk.desktop" \
  /etc/xdg/autostart/reflectrum-kiosk.desktop
install -o root -g root -m 0755 \
  "$repo_root/deploy/reflectrum-mx-dialpad" \
  /usr/local/bin/reflectrum-mx-dialpad
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-mx-dialpad.desktop" \
  /etc/xdg/autostart/reflectrum-mx-dialpad.desktop
install -o root -g root -m 0755 \
  "$repo_root/deploy/reflectrum_solaar_headless.py" \
  /usr/local/lib/reflectrum/reflectrum_solaar_headless.py
install -o root -g root -m 0644 \
  "$repo_root/deploy/reflectrum-solaar-headless.service" \
  /etc/systemd/system/reflectrum-solaar-headless.service

install -d -o pi -g pi -m 0755 /home/pi/.config/solaar
install -o pi -g pi -m 0644 \
  "$repo_root/deploy/reflectrum-solaar-rules.yaml" \
  /home/pi/.config/solaar/rules.yaml
install -o root -g root -m 0644 \
  "$repo_root/deploy/42-reflectrum-logitech-permissions.rules" \
  /etc/udev/rules.d/42-reflectrum-logitech-permissions.rules
install -o root -g root -m 0644 \
  "$repo_root/deploy/50-reflectrum-power.rules" \
  /etc/polkit-1/rules.d/50-reflectrum-power.rules
udevadm control --reload-rules
modprobe uinput
udevadm trigger --subsystem-match=misc --action=change
udevadm trigger --subsystem-match=hidraw --action=change
setfacl --remove-all /dev/uinput
chgrp input /dev/uinput
chmod 0660 /dev/uinput

systemctl daemon-reload
systemctl reenable reflectrum-zram.service
systemctl restart reflectrum-zram.service
sysctl -p /etc/sysctl.d/99-reflectrum-zram.conf
if systemctl list-unit-files dphys-swapfile.service >/dev/null 2>&1; then
  systemctl disable --now dphys-swapfile.service
fi
systemctl --global enable reflectrum-kiosk.service
systemctl --global enable reflectrum-night-shift.service
systemctl enable --now reflectrum-web.service
systemctl disable lightdm.service
systemctl enable --now reflectrum-solaar-headless.service reflectrum-cog.service

if command -v raspi-config >/dev/null 2>&1; then
  raspi-config nonint do_blanking 1
fi

echo 'Reflectrum installed with the Cog direct-DRM kiosk.'
