# Video Annotation Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![Status](https://img.shields.io/badge/status-production--ready-success.svg)

**A powerful cross-platform video annotation tool with AI detection, multi-layer support, and professional analysis features.**

[🌐 English](README.md) | [🇹🇷 Türkçe](README.tr.md)

</div>

---

## 📖 Overview

**Video Annotation Tool** is a professional, cross-platform desktop application designed for precise video analysis and annotation. Built with **React** and **Electron**, it combines a modern "Liquid Glass" interface with powerful tools like AI object detection, voice notes, and frame-by-frame navigation.

Whether for **sports analysis**, **educational content**, **medical research**, or **video editing workflows**, this tool provides a robust environment to mark up, analyze, and export video data securely on your local machine.

## ✨ Key Features

### 🧠 **Smart Analysis & AI**

- ✅ **AI Object Detection** ("Magic Wand") - Automatically detect persons and objects in any video frame using on-device machine learning (TensorFlow.js).
- ✅ **Voice Annotations** - Record audio notes directly onto the timeline for quick feedback.
- ✅ **Infinite Canvas** - Zoom up to 500% and Pan freely to annotate fine details with pixel-perfect precision.

### 🎥 **Video Control**

- ✅ **Universal Format Support** - Plays MP4, WebM, OGG, MOV, AVI, MKV.
- ✅ **YouTube Support** - Load and annotate standard YouTube videos (limited AI features).
- ✅ **Frame-Perfect Navigation** - Step forward/backward frame-by-frame.
- ✅ **Visual Timeline** - See bookmarks and annotations as markers on a scrubber.

### ✏️ **Professional Drawing Suite**

- ✅ **Vector Tools** - Pen, Line, Rectangle, Circle, Arrow.
- ✅ **Text & Stamps** - Add rich text labels or quick emoji status stamps (✅ ❌ ❓ ❗).
- ✅ **Styling** - Full color palette, adjustable stroke width, and opacity control.
- ✅ **Eraser & Editing** - Edit, move, or delete any specific annotation.

### 📐 **Layer Management**

- ✅ **Multi-Layer System** - Organize drawings on unlimited layers (e.g., "Offense", "Defense", "Notes").
- ✅ **Layer Controls** - Lock, hide, rename, reorder, or adjust opacity per layer.

### 💾 **Save, Load & Export**

- ✅ **Project Persistence** - Auto-save projects locally (IndexedDB).
- ✅ **Export Options** - Save annotated frames as **PNG**, vector data as **SVG**, or project structure as **JSON**.
- ✅ **Data Export** - Export bookmarks and timecodes to **CSV**.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **npm**

### Installation

```bash
git clone https://github.com/Sopwit/video-annotation-tool.git
cd video-annotation-tool
npm install
```

### Running Locally

```bash
npm run electron:dev
```

### Building for Production

```bash
# Build for your current OS
npm run electron:build

# Build for all platforms (Mac, Win, Linux)
npm run electron:build:all
```

The compiled application will act as a standalone desktop app.

## 📂 Project Structure

```
video-annotation-tool/
├── backend/             # Electron main process (formerly electron/)
│   ├── main.cjs
│   └── preload.cjs
├── src/                 # React application
│   ├── components/
│   ├── services/
│   ├── store/
│   ├── themes/
│   └── App.jsx
├── config/              # Configuration files
├── scripts/             # Build and maintenance scripts
├── tests/               # Unit and E2E tests
├── docs/                # Documentation
└── release/             # Production Builds
```

## ⌨️ Keyboard Shortcuts

| Key             | Tool/Action              |
| :-------------- | :----------------------- |
| **P**           | Pen Tool                 |
| **E**           | Eraser                   |
| **C**           | Cursor/Select            |
| **R**           | Rectangle                |
| **O**           | Circle                   |
| **A**           | Arrow                    |
| **T**           | Text                     |
| **Ctrl+Z**      | Undo                     |
| **Esc**         | Reset View / Close Modal |
| **Shift+Drag**  | Pan Canvas               |
| **Ctrl+Scroll** | Zoom In/Out              |

## 📚 Documentation

For more detailed information, please refer to the `docs/` folder:

- [Developer Implementation Guide](docs/IMPLEMENTATION_GUIDE.md) - Architecture and code explanations.
- [Roadmap & Future Plans](docs/ROADMAP.md) - Upcoming features.
- [Changelog](CHANGELOG.md) - Version history.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit Pull Requests or report issues.

## 📝 License

This project is licensed under the **MIT License**. See [LICENSE.md](LICENSE.md) for more details.

---

<div align="center">

**Made with ❤️ by [Sopwit](https://github.com/Sopwit)**

</div>
