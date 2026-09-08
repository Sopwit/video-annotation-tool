# Video Annotation Tool — Release Notes v1.0.0

> **Release Version:** `v1.0.0`  
> **Release Date:** September 8, 2026  
> **Target Platforms:** Windows (x64), macOS (Apple Silicon arm64), Linux (x86_64, amd64)  
> **Repository:** [Sopwit/video-annotation-tool](https://github.com/Sopwit/video-annotation-tool)

---

## 🚀 Overview

We are excited to announce the official release of **Video Annotation Tool v1.0.0** — a modern, cross-platform desktop application designed for sports coaches, video analysts, computer vision researchers, and content creators. 

v1.0.0 combines local on-device machine learning with a high-performance vector canvas, allowing frame-accurate video examination, multi-layer drawing, and synchronized audio notes — completely private and offline.

---

## 🌟 Key Highlights & Features

### 🧠 On-Device AI Object Detection (Magic Wand)
- **Zero Cloud Latency & Total Privacy:** Integrates **TensorFlow.js (WebGL backend)** with **COCO-SSD** to recognize and outline people, vehicles, sports equipment, and objects directly on individual video frames.
- **Lazy Loaded:** Model weights are loaded on-demand, ensuring instant startup time.

### 🎨 High-Precision Infinite Vector Canvas
- **500% Smooth Zoom & Pan:** Inspect every pixel with dynamic wheel zoom and drag-to-pan.
- **Ref-Synchronized 60 FPS Drawing Engine:** Canvas state is synchronized via memory refs to eliminate asynchronous state lag during fast cursor strokes.
- **Aspect-Ratio Aware Coordinate Projection:** Drawing coordinates automatically compensate for letterboxing and aspect ratio distortions at any scale level.
- **Rich Annotation Toolset:** Freehand brush, straight lines, rectangles, circles, directional arrows, and customizable color/stroke controls.

### ⏱️ Frame-Accurate Scrubbing & Timeline
- **Frame Stepping:** Navigate with `1/30s` frame precision using `Left` / `Right` arrow keys.
- **Time Jumping:** Jump by `1s` using `Shift + Left` / `Shift + Right`.
- **Keyframe Bookmarking:** Mark critical action moments (`Ctrl + B`) with timestamp thumbnails.
- **Voice Notes:** Record voice commentary synced to exact timeline timestamps using the Web Audio API.

### ⚡ Comprehensive Keyboard Shortcuts
- `Space`: Play / Pause playback.
- `[` / `]`: Adjust playback speed (0.25x to 2x).
- `Ctrl + B`: Add Bookmark / Keyframe.
- `Ctrl + L`: Toggle Layer Manager drawer.
- `Ctrl + T`: Open AI Object Detection palette.
- `Ctrl + S`: Quick-save project to IndexedDB.
- `Ctrl + E`: Open Export dialog.
- `Ctrl + ,`: Open Settings modal.

### 💾 Robust Persistence & RFC 4180 Export
- **Local Database (IndexedDB):** Powered by **Dexie 4.x** for instantaneous local autosave and session recovery.
- **Standards-Compliant Exports:** RFC 4180 compliant CSV export with proper quotation escaping, structured JSON project exports, and high-resolution PNG snapshot renders.

---

## 📦 Distribution Packages

| Platform | Target | File Name | Description |
| :--- | :--- | :--- | :--- |
| **Windows** | Setup Installer | `Video.Annotation.Tool-Setup-1.0.0.exe` | Standard Windows installer with desktop & start menu shortcuts |
| **Windows** | Portable Executable | `Video.Annotation.Tool-Portable-1.0.0.exe` | Standalone zero-install executable for USB or quick runs |
| **macOS** | Apple Silicon DMG | `Video.Annotation.Tool-1.0.0-mac-arm64.dmg` | Drag-and-drop installer for Apple Silicon (M1/M2/M3/M4) |
| **macOS** | ZIP Archive | `Video.Annotation.Tool-1.0.0-mac-arm64.zip` | Standalone application bundle |
| **Linux** | AppImage | `Video.Annotation.Tool-1.0.0-linux-x86_64.AppImage` | Universal self-contained Linux executable |
| **Linux** | Debian / Ubuntu | `Video.Annotation.Tool-1.0.0-linux-amd64.deb` | Native deb package for Ubuntu, Debian, Mint |
| **Linux** | RPM Package | `Video.Annotation.Tool-1.0.0-linux-x86_64.rpm` | Native rpm package for Fedora, RHEL, openSUSE |

---

## ⚠️ Known Packaging Advisory (Under Active Investigation)

- **Linux Discover / Software Center Crash:** Early reports indicate that the Linux `.deb` and `.AppImage` packages encounter installation crashes on some desktop environments (e.g. KDE Discover). The root cause in the Electron runtime entry-point and sandbox configuration is being debugged and will be addressed in an upcoming `v1.0.1` patch release.
- **macOS & Windows Deployment Verification:** Users are advised to test portable/installer executables and report any startup anomalies on GitHub Issues.

---

## 🛠️ Verification & Source Code

- **GitHub Release:** [https://github.com/Sopwit/video-annotation-tool/releases/tag/v1.0.0](https://github.com/Sopwit/video-annotation-tool/releases/tag/v1.0.0)
- **Documentation:**
  - Architecture Guide: [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
  - Keyboard Shortcuts: [`docs/SHORTCUTS.md`](../docs/SHORTCUTS.md)
  - Implementation & Contributing: [`docs/IMPLEMENTATION_GUIDE.md`](../docs/IMPLEMENTATION_GUIDE.md)
