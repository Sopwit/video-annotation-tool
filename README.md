# 🎬 Video Annotation Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.5.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-production--ready-success.svg?style=for-the-badge)
![CI](https://github.com/Sopwit/video-annotation-tool/actions/workflows/ci.yml/badge.svg)

**A professional-grade, cross-platform video analysis suite powered by AI.**
_Annotate, Analyze, and Export with precision._

[🌐 English](README.md) | [🇹🇷 Türkçe](README.tr.md)

</div>

---

## 📖 Overview

**Video Annotation Tool** is a state-of-the-art desktop application built on **Electron** and **React**, designed for sports coaches, researchers, and content creators. It bridges the gap between simple video players and complex editing software by providing a lightweight, "Liquid Glass" interface focused entirely on analysis.

With **on-device AI** for object detection and a **vector-based drawing engine**, you can analyze footage frame-by-frame without your data ever leaving your machine.

## ✨ Key Features

### 🧠 **Smart Analysis & AI**

- **AI Object Detection**: Instantly highlight people and objects using integrated TensorFlow.js models.
- **Voice Memos**: Record audio commentary directly synchronized with the timeline.
- **Infinite Canvas**: Deep zoom (500%) and pan capabilities for pixel-perfect detail.

### 🎥 **Video Control**

- **Universal Format Support**: plays MP4, WebM, OGG, MOV, AVI, MKV.
- **Frame-Perfect Navigation**: Step through video frame-by-frame for precise marking.
- **Visual Scrubber**: See your annotations and bookmarks visualised on the timeline.

### ✏️ **Professional Creative Suite**

- **Vector Tools**: Pen, Line, Rectangle, Circle, Arrow with adjustable strokes and opacity.
- **Smart Stamps**: Quick feedback with built-in emoji stamps (✅ ❌ ❓ ❗).
- **Non-Destructive Editing**: Every stroke is a layer. Move, resize, or delete at any time.

### 💾 **Data & Export**

- **100% Local**: Projects are saved to IndexedDB. No cloud uploads.
- **Export Power**: Save frames as **PNG**, annotations as **SVG**, or data as **CSV/JSON**.

---

## 🛠️ Technology Stack

Built with modern, performance-focused technologies:

| Core                                                                          | UI / UX                                                             | Intelligence                                                                          | Storage                                                                     |
| :---------------------------------------------------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- |
| ![Electron](https://img.shields.io/badge/Electron-darkblue?style=flat-square) | ![React](https://img.shields.io/badge/React-blue?style=flat-square) | ![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-orange?style=flat-square) | ![Dexie.js](https://img.shields.io/badge/Dexie.js-yellow?style=flat-square) |
| **Node.js**                                                                   | **Tailwind CSS**                                                    | **Coco SSD**                                                                          | **IndexedDB**                                                               |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **npm** (v10 or higher recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Sopwit/video-annotation-tool.git

# Navigate to the project directory
cd video-annotation-tool

# Install dependencies
npm install
```

### Development

Run the app in development mode with hot-reload:

```bash
npm run electron:dev
```

### Quality Checks

Run repository quality gates before opening a PR:

```bash
npm run clean
npm run lint
npm run test
npm run build
```

### Production Build

Create a standalone executable for your OS:

```bash
# Build for current OS
npm run electron:build

# Build for all platforms
npm run electron:build:all
```

---

## 📂 Project Structure

```bash
video-annotation-tool/
├── 🔌 backend/       # Electron main process & IPC handlers
├── ⚛️ src/           # React frontend application
│   ├── components/  # Reusable UI components
│   ├── services/    # Business logic (AI, Audio, Export)
│   ├── store/       # State management (Zustand)
│   └── themes/      # Theme styles
├── ⚙️ config/        # Environment & App configuration
└── 📦 release/       # Compiled production builds
```

---

## ⌨️ Keyboard Shortcuts

| Action         | Shortcut                                          |
| :------------- | :------------------------------------------------ |
| **Tools**      | `P` (Pen), `E` (Eraser), `C` (Cursor), `T` (Text) |
| **Shapes**     | `R` (Rect), `O` (Circle), `A` (Arrow), `L` (Line) |
| **Navigation** | `Space` (Play/Pause), `Left/Right` (Frame Step)   |
| **Canvas**     | `Ctrl + Scroll` (Zoom), `Shift + Drag` (Pan)      |
| **Edit**       | `Ctrl + Z` (Undo), `Del` (Delete Selected)        |

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE.md` for more information.

---

<div align="center">

**Made with ❤️ by [Sopwit](https://github.com/Sopwit)**

</div>
