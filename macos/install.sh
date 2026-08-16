#!/usr/bin/env bash
set -Eeuo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
app_dir="$HOME/Applications/Reflectrum Dialpad.app"
executable="$app_dir/Contents/MacOS/ReflectrumDialpad"
launch_agent="$HOME/Library/LaunchAgents/io.reflectrum.dialpad.plist"
log_file="$HOME/Library/Logs/Reflectrum Dialpad.log"
build_dir=$(mktemp -d)
trap 'rm -rf "$build_dir"' EXIT

for command in codesign plutil swiftc; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Required command is missing: $command" >&2
    exit 1
  }
done

swiftc -O "$script_dir/ReflectrumDialpad.swift" -o "$build_dir/ReflectrumDialpad"

install -d "$app_dir/Contents/MacOS" "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
install -m 0755 "$build_dir/ReflectrumDialpad" "$executable"
install -m 0644 "$script_dir/Info.plist" "$app_dir/Contents/Info.plist"
codesign --force --sign - --identifier io.reflectrum.dialpad "$app_dir"

install -m 0644 "$script_dir/io.reflectrum.dialpad.plist" "$launch_agent"
plutil -replace ProgramArguments -json "[\"$executable\"]" "$launch_agent"
plutil -replace StandardOutPath -string "$log_file" "$launch_agent"
plutil -replace StandardErrorPath -string "$log_file" "$launch_agent"
plutil -lint "$app_dir/Contents/Info.plist" "$launch_agent"

launchctl bootout "gui/$UID/io.reflectrum.dialpad" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$UID" "$launch_agent"

echo "Installed Reflectrum Dialpad."
echo "If prompted, enable it in Privacy & Security > Accessibility and Input Monitoring."
echo "Log: $log_file"
