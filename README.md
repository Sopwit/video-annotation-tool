# Video Annotation Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![Status](https://img.shields.io/badge/status-production--ready-success.svg)

**A powerful cross-platform video annotation tool with multi-layer support, frame-perfect timeline, and professional features**

[🌐 English](README.md) | [🇹🇷 Türkçe](README.tr.md)

</div>

---

## 📖 Overview

Video Annotation Tool is a professional, cross-platform desktop application that allows you to annotate videos with precision. Built with React and Electron, it offers multi-layer annotation support, frame-by-frame navigation, and a comprehensive set of drawing tools perfect for education, sports analysis, content creation, and research.

## ✨ Features

### 🎥 **Video Playback & Control**

- ✅ Local video file support (MP4, WebM, OGG, MOV, AVI, MKV)
- ✅ YouTube video URL support
- ✅ Play/pause/stop controls
- ✅ Progress tracking and seeking
- ✅ Frame-by-frame navigation (+/- 1 frame at 30fps)
- ✅ Timeline visualization with bookmark markers
- ✅ Precise time display (HH:MM:SS)

### ✏️ **Advanced Drawing Tools**

- ✅ **Pen** - Freehand drawing
- ✅ **Eraser** - Remove annotations
- ✅ **Line** - Straight line tool
- ✅ **Rectangle** - Draw rectangles
- ✅ **Circle** - Draw circles
- ✅ **Arrow** - Directional arrows
- ✅ **Text** - Add text annotations
- ✅ **Stamp** - Emoji stamps (✅ ❌ ❓ ❗ ⭐ 🎯)
- ✅ Color picker with palette
- ✅ Adjustable brush size (1-20px)

### 📐 **Multi-Layer System**

- ✅ Create unlimited annotation layers
- ✅ Individual layer visibility toggle
- ✅ Layer opacity control (0-100%)
- ✅ Lock/unlock layers
- ✅ Rename layers
- ✅ Layer reordering
- ✅ Isolated editing per layer

### 💾 **Save & Export**

- ✅ Save projects to IndexedDB
- ✅ Load saved projects
- ✅ Auto-save (configurable interval)
- ✅ Export as PNG (with video background)
- ✅ Export as SVG (vector format)
- ✅ Export as JSON (project data)
- ✅ Export bookmarks as CSV
- ✅ Copy annotations to clipboard
- ✅ Batch screenshot export

### 📌 **Bookmarks & Timeline**

- ✅ Add timestamp bookmarks with notes
- ✅ Automatic thumbnail capture
- ✅ Jump to specific timestamps
- ✅ Edit bookmark notes
- ✅ Delete bookmarks
- ✅ Visual timeline with markers
- ✅ Sorted bookmark list

### ⚙️ **Professional Features**

- ✅ Undo/Redo with full history
- ✅ Keyboard shortcuts (fully customizable)
- ✅ Screen recording capability
- ✅ Settings panel with tabs
- ✅ Auto-save configuration
- ✅ Dark theme (Light theme coming soon)
- ✅ Grid overlay options
- ✅ Recent files tracking
- ✅ Responsive UI

### 🖥️ **Cross-Platform Desktop**

- ✅ Native macOS app (DMG, ZIP)
- ✅ Native Windows app (NSIS installer, Portable)
- ✅ Native Linux app (AppImage, DEB, RPM)
- ✅ Platform-specific window controls
- ✅ Native file dialogs
- ✅ Secure IPC communication

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** (v16 or higher) and **npm** installed:

- **Node.js**: [Download & Install Node.js](https://nodejs.org/)
- **npm**: Comes bundled with Node.js

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Sopwit/video-annotation-tool.git
cd video-annotation-tool
```

2. **Install dependencies**

```bash
npm install
```

### Development

To run the application in development mode:

```bash
npm run electron:dev
```

This will:

- Start the Vite development server
- Launch the Electron application
- Enable hot-reload for faster development
- Open DevTools for debugging

### Building for Production

#### Build for your current platform

```bash
npm run electron:build
```

#### Build for specific platforms

```bash
# macOS (DMG and ZIP)
npm run electron:build:mac

# Windows (NSIS installer and portable)
npm run electron:build:win

# Linux (AppImage, DEB, and RPM)
npm run electron:build:linux

# Build for all platforms
npm run electron:build:all
```

Built applications will be available in the `release` folder.

**Note**: Before building, add icon files to the `build/` directory:

- `icon.icns` (macOS)
- `icon.ico` (Windows)
- `icon.png` (Linux - 512x512px)

See `build/README.md` for details.

## 📂 Project Structure

```
video-annotation-tool/
├── electron/              # Electron main process
│   ├── main.cjs          # Main process entry
│   └── preload.cjs       # Preload script
├── src/                  # React application
│   ├── store/           # State management
│   │   └── useStore.js  # Zustand store
│   ├── services/        # Business logic
│   │   ├── database.js      # IndexedDB service
│   │   └── exportService.js # Export utilities
│   ├── components/      # React components
│   │   ├── VideoPlayer.jsx
│   │   ├── CanvasOverlay.jsx
│   │   ├── Toolbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Timeline.jsx
│   │   ├── LayerManager.jsx
│   │   └── SettingsPanel.jsx
│   ├── hooks/           # Custom hooks
│   │   └── useRecorder.js
│   ├── App.jsx          # Main component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── build/               # Build resources (icons)
└── release/             # Built apps (after build)
```

## 🛠️ Built With

### Core Technologies

- [**React 19**](https://react.dev/) - Latest React with improved performance
- [**Electron 34**](https://www.electronjs.org/) - Cross-platform desktop framework
- [**Vite 7**](https://vitejs.dev/) - Next-generation frontend tooling
- [**Tailwind CSS 3**](https://tailwindcss.com/) - Utility-first CSS framework

### Libraries

- [**Zustand**](https://github.com/pmndrs/zustand) - State management
- [**Dexie**](https://dexie.org/) - IndexedDB wrapper
- [**React Player**](https://www.npmjs.com/package/react-player) - Video playback
- [**Lucide React**](https://lucide.dev/) - Beautiful icons
- [**html2canvas**](https://html2canvas.hertzen.com/) - Screenshot generation
- [**file-saver**](https://github.com/eligrey/FileSaver.js/) - File downloads

## ⌨️ Keyboard Shortcuts

### Tools

- `P` - Pen tool
- `E` - Eraser
- `C` - Cursor/Select mode
- `T` - Text tool
- `R` - Rectangle
- `O` - Circle
- `A` - Arrow
- `S` - Stamp

### Actions

- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Cmd/Ctrl + Y` - Redo (alternative)

**All shortcuts are customizable in Settings!**

## 🎯 Usage

1. **Launch the application**
2. **Load a video**:
   - Click the link icon to add a video URL
   - Or drag & drop a local video file
3. **Choose your tool** from the toolbar
4. **Create layers** for organized annotations
5. **Draw annotations** directly on the video
6. **Add bookmarks** at important timestamps
7. **Use timeline** for frame-perfect navigation
8. **Save your project** for later use
9. **Export** in your preferred format

## 💡 Use Cases

### 🎓 Education

- Create annotated lesson videos
- Highlight important concepts
- Add explanatory notes
- Frame-by-frame demonstrations

### 🏀 Sports Analysis

- Tactical analysis with layers
- Player tracking
- Movement patterns
- Performance review

### 🎬 Content Creation

- Video markup for editing
- Notes for post-production
- Collaboration annotations
- Quick screen captures

### 🔬 Research

- Scientific video analysis
- Behavioral studies
- Data collection
- Precise measurements

## 🔄 What's New in v1.2

### Major Features

- ✨ **Multi-layer annotation system**
- ✨ **Advanced timeline with frame navigation**
- ✨ **Professional layer management**
- ✨ **Save/Load projects (IndexedDB)**
- ✨ **Auto-save functionality**
- ✨ **Multiple export formats** (PNG, SVG, JSON, CSV)
- ✨ **Settings panel** with customization
- ✨ **Keyboard shortcut customization**
- ✨ **Line drawing tool**
- ✨ **Enhanced performance**

See [CHANGELOG.md](CHANGELOG.md) for complete details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and future development.

## 📚 Documentation

- [CHANGELOG.md](CHANGELOG.md) - Version history
- [ROADMAP.md](ROADMAP.md) - Future plans
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Developer guide
- [build/README.md](build/README.md) - Icon creation guide

## 🐛 Known Issues

- Light theme toggle available but CSS not implemented yet
- Layer reordering UI present, logic in development
- Storage statistics placeholder in settings

These are minor issues and don't affect core functionality.

## 💬 Support

If you encounter any issues or have questions:

1. Check the [documentation](IMPLEMENTATION_GUIDE.md)
2. Review [CHANGELOG.md](CHANGELOG.md)
3. Open an issue on GitHub

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by the need for accessible video annotation tools
- Built with love using open-source technologies

## 📧 Contact

**Sopwit** - [@Sopwit](https://github.com/Sopwit)

**Project Link**: [https://github.com/Sopwit/video-annotation-tool](https://github.com/Sopwit/video-annotation-tool)

---

<div align="center">

**Made with ❤️ by [Sopwit](https://github.com/Sopwit)**

⭐ Star this repo if you find it useful!

</div>
