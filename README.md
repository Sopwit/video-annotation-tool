# 🎬 Video Annotation Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.5.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg?style=for-the-badge)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)

**A modern, cross-platform video analysis and annotation suite powered by on-device AI.**

[🌐 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | [📖 Full Documentation](docs/)

</div>

---

## 🌟 Highlights

- **🧠 On-Device AI**: Detect objects and people locally in video frames using TensorFlow.js.
- **✏️ Vector Drawing Suite**: Pen, Rectangle, Circle, Arrow, Line, Text, and Smart Emoji Stamps.
- **🔍 Infinite Canvas**: Zoom up to 500% with smooth pan and pixel-perfect coordinate mapping.
- **🎙️ Timeline Voice Memos**: Record synchronized audio commentary directly on timestamps.
- **🎥 Universal Playback**: Native support for MP4, WebM, OGG, MOV, AVI, MKV, and YouTube streams.
- **📐 Multi-Layer System**: Layer ordering, visibility toggling, and independent opacity control.
- **💾 100% Local & Private**: Instant IndexedDB persistence with PNG, SVG, CSV, and JSON exports.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20+`
- **npm**: `v10+`

### Installation & Run

```bash
# Clone and install dependencies
git clone https://github.com/Sopwit/video-annotation-tool.git
cd video-annotation-tool
npm install

# Start development with hot-reload
npm run electron:dev
```

### Quality Checks & Build

```bash
# Run tests, lint, and production bundle
npm test
npm run lint
npm run build

# Package desktop application
npm run electron:build        # Current OS
npm run electron:build:all    # macOS, Windows & Linux
```

---

## ⌨️ Essential Shortcuts

| Action | Shortcut | Action | Shortcut |
| :--- | :--- | :--- | :--- |
| **Play / Pause** | `Space` | **Undo / Redo** | `Ctrl+Z` / `Ctrl+Shift+Z` |
| **Frame Step** | `Left` / `Right` | **Save Project** | `Ctrl+S` |
| **Seek 1s** | `Shift + Left/Right` | **Export PNG** | `Ctrl+E` |
| **Zoom / Pan** | `Ctrl+Wheel` / `Shift+Drag` | **Notes / Layers** | `Ctrl+B` / `Ctrl+L` |
| **Drawing Tools** | `P` / `E` / `C` / `T` / `S` | **Reset View** | `Esc` |

👉 **[View Full Keyboard Shortcuts Reference](docs/SHORTCUTS.md)**

---

## 📚 Documentation Index

| Guide | Description |
| :--- | :--- |
| [🏛️ Architecture Guide](docs/ARCHITECTURE.md) | Technical stack, components, and subsystem design |
| [⌨️ Shortcuts Reference](docs/SHORTCUTS.md) | Complete list of keybindings and controls |
| [🚀 Implementation Guide](docs/IMPLEMENTATION_GUIDE.md) | Deep dive into features, APIs, and state flows |
| [🗺️ Project Roadmap](docs/ROADMAP.md) | Milestone planning and upcoming capabilities |
| [📜 Changelog](CHANGELOG.md) | Release history and unreleased enhancements |

---

## 📝 License

Distributed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

<div align="center">

**Crafted with precision by [Sopwit](https://github.com/Sopwit)**

</div>
