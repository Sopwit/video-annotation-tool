# Build Icons Guide

This directory contains platform-specific icon files for building the application.

## Required Icon Files

For building distributable packages, you need to provide the following icon files:

### macOS (.icns)

- **File**: `icon.icns`
- **Size**: 512x512px (and scaled versions)
- **Format**: Apple Icon Image format

### Windows (.ico)

- **File**: `icon.ico`
- **Sizes**: Multiple sizes (16x16, 32x32, 48x48, 256x256)
- **Format**: Windows Icon format

### Linux (.png)

- **File**: `icon.png`
- **Size**: 512x512px minimum
- **Format**: PNG with transparency

## Quick Start

### Option 1: Use SVG Icon (Included)

A placeholder SVG icon is available at `public/icon.svg`. You can use online converters to create platform-specific icons:

1. Go to https://cloudconvert.com/ or https://convertico.com/
2. Upload `public/icon.svg`
3. Convert to:
   - `.icns` for macOS
   - `.ico` for Windows
   - `.png` (512x512) for Linux
4. Place the converted files in this `build/` directory

### Option 2: Create Custom Icons

#### Using Icon Generation Tools:

- **macOS**: Use `iconutil` command-line tool
- **Windows**: Use tools like IcoFX or online converters
- **Linux**: Use GIMP or ImageMagick

#### Recommended Tools:

- **electron-icon-builder**: `npm install -g electron-icon-builder`
- **icon-gen**: `npm install -g icon-gen`

#### Example with electron-icon-builder:

```bash
# Install the tool
npm install -g electron-icon-builder

# Generate all icons from a single 1024x1024 PNG
electron-icon-builder --input=./source-icon.png --output=./build --flatten
```

## Icon Design Guidelines

### General Guidelines

- Use a simple, recognizable design
- Include the app's primary function in the icon
- Test icon appearance at different sizes
- Use high contrast for small sizes
- Avoid too much detail

### Color Palette

The included SVG uses:

- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Accent: Red (#ef4444)
- Background: White/Transparent

### Testing Icons

After creating icons, test them by:

1. Running `npm run electron:build`
2. Checking the built application
3. Verifying the icon appears correctly in:
   - Application launcher
   - Taskbar/Dock
   - Window title bar
   - About dialog

## Current Status

✅ **SVG template available**: `public/icon.svg`
⚠️ **Platform icons needed**: Convert SVG to .icns, .ico, .png

## File Structure

```
build/
├── README.md          # This file
├── icon.icns         # (You need to add) macOS icon
├── icon.ico          # (You need to add) Windows icon
└── icon.png          # (You need to add) Linux icon (512x512)
```

## Troubleshooting

### Build fails with "icon not found"

- Make sure all three icon files exist in this directory
- Check file names are exactly: `icon.icns`, `icon.ico`, `icon.png`
- Verify file permissions

### Icon doesn't display in built app

- Clear electron-builder cache: `rm -rf ~/.electron-builder`
- Rebuild the application
- Check icon file sizes and formats

### Icon looks pixelated

- Ensure source image is at least 1024x1024
- Use PNG with transparency for better quality
- Re-generate with higher quality settings

## Resources

- [Electron Icon Requirements](https://www.electronjs.org/docs/latest/tutorial/application-distribution#custom-windows-icons)
- [macOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Windows Icon Guidelines](https://docs.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-design)
- [Linux Icon Guidelines](https://freedesktop.org/wiki/Specifications/icon-theme-spec/)

## Quick Command Reference

```bash
# Convert SVG to PNG (using ImageMagick)
convert -background none -size 512x512 public/icon.svg build/icon.png

# Convert PNG to ICNS (macOS)
mkdir icon.iconset
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
iconutil -c icns icon.iconset

# Convert PNG to ICO (using ImageMagick)
convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 build/icon.ico
```

---

**Note**: For production builds, use high-quality, professionally designed icons that represent your brand.
