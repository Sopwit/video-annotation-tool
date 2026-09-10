#!/usr/bin/env bash
set -euo pipefail

PLATFORM="${1:?platform is required}"
ARCHITECTURE="${2:?architecture is required}"

run_with_startup_check() {
  local executable="$1"
  shift

  "$executable" "$@" >/tmp/video-annotation-tool-smoke.log 2>&1 &
  local application_pid=$!
  sleep 10

  if ! kill -0 "$application_pid" 2>/dev/null; then
    set +e
    wait "$application_pid"
    local exit_code=$?
    set -e
    cat /tmp/video-annotation-tool-smoke.log
    echo "Application exited during startup (exit code: $exit_code)." >&2
    exit 1
  fi

  kill "$application_pid"
  wait "$application_pid" 2>/dev/null || true
}

case "$PLATFORM" in
  linux)
    deb_path="$(find release -maxdepth 1 -type f -name '*.deb' -print -quit)"
    rpm_path="$(find release -maxdepth 1 -type f -name '*.rpm' -print -quit)"
    appimage_path="$(find release -maxdepth 1 -type f -name '*.AppImage' -print -quit)"
    [[ -n "$deb_path" && -n "$rpm_path" && -n "$appimage_path" ]]

    dpkg-deb --info "$deb_path" >/dev/null
    rpm -qpl "$rpm_path" >/dev/null
    case "$ARCHITECTURE" in
      x64)
        dpkg-deb --field "$deb_path" Architecture | grep -qx amd64
        rpm -qp --queryformat '%{ARCH}\n' "$rpm_path" | grep -qx x86_64
        ;;
      arm64)
        dpkg-deb --field "$deb_path" Architecture | grep -qx arm64
        rpm -qp --queryformat '%{ARCH}\n' "$rpm_path" | grep -qx aarch64
        ;;
    esac
    chmod +x "$appimage_path"
    "$appimage_path" --appimage-extract >/dev/null
    test -x squashfs-root/video-annotation-tool
    test -f squashfs-root/resources/app.asar
    rm -rf squashfs-root

    sudo dpkg --install "$deb_path"
    trap 'sudo dpkg --remove video-annotation-tool >/dev/null 2>&1 || true' EXIT
    test -x /usr/bin/video-annotation-tool
    test -f /usr/share/applications/com.sopwit.videoannotationtool.desktop
    set +e
    xvfb-run --auto-servernum timeout 15s /usr/bin/video-annotation-tool \
      >/tmp/video-annotation-tool-smoke.log 2>&1
    exit_code=$?
    set -e
    if [[ $exit_code -ne 124 ]]; then
      cat /tmp/video-annotation-tool-smoke.log
      echo "Installed application exited during startup (exit code: $exit_code)." >&2
      exit 1
    fi
    ;;
  mac)
    dmg_path="$(find release -maxdepth 1 -type f -name "*mac-${ARCHITECTURE}.dmg" -print -quit)"
    app_path="$(find release -maxdepth 2 -type d -name 'Video Annotation Tool.app' -print -quit)"
    [[ -n "$dmg_path" && -n "$app_path" ]]
    hdiutil verify "$dmg_path"
    test -f "$app_path/Contents/Resources/app.asar"
    run_with_startup_check "$app_path/Contents/MacOS/Video Annotation Tool"
    ;;
  *)
    echo "Unsupported smoke-test platform: $PLATFORM" >&2
    exit 2
    ;;
esac
