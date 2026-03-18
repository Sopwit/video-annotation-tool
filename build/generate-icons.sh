#!/usr/bin/env bash
set -euo pipefail

if ! command -v convert >/dev/null 2>&1; then
  echo "Error: ImageMagick 'convert' command is required." >&2
  exit 1
fi

SOURCE_IMAGE="${1:-public/icon.svg}"
BUILD_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$BUILD_DIR/.." && pwd)"

if [[ ! -f "$PROJECT_ROOT/$SOURCE_IMAGE" ]]; then
  echo "Error: source image not found at '$PROJECT_ROOT/$SOURCE_IMAGE'" >&2
  exit 1
fi

echo "Generating Linux icon..."
convert -background none -resize 512x512 "$PROJECT_ROOT/$SOURCE_IMAGE" "$BUILD_DIR/icon.png"

echo "Generating Windows icon..."
convert "$BUILD_DIR/icon.png" -define icon:auto-resize=256,128,96,64,48,32,16 "$BUILD_DIR/icon.ico"

if command -v iconutil >/dev/null 2>&1 && command -v sips >/dev/null 2>&1; then
  echo "Generating macOS icon..."
  ICONSET_DIR="$BUILD_DIR/icon.iconset"
  rm -rf "$ICONSET_DIR"
  mkdir -p "$ICONSET_DIR"

  sips -z 16 16 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_16x16.png" >/dev/null
  sips -z 32 32 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_16x16@2x.png" >/dev/null
  sips -z 32 32 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_32x32.png" >/dev/null
  sips -z 64 64 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_32x32@2x.png" >/dev/null
  sips -z 128 128 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_128x128.png" >/dev/null
  sips -z 256 256 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_128x128@2x.png" >/dev/null
  sips -z 256 256 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_256x256.png" >/dev/null
  sips -z 512 512 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_256x256@2x.png" >/dev/null
  sips -z 512 512 "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_512x512.png" >/dev/null
  cp "$BUILD_DIR/icon.png" "$ICONSET_DIR/icon_512x512@2x.png"

  iconutil -c icns "$ICONSET_DIR" -o "$BUILD_DIR/icon.icns"
  rm -rf "$ICONSET_DIR"
else
  echo "Skipping macOS icon generation (iconutil/sips not available)."
fi

echo "Icon generation complete."
