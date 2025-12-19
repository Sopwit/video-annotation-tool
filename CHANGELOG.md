# Changelog

All notable changes to the Video Annotation Tool project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for v1.1 (Q1 2026)

- Annotation persistence (save/load as JSON)
- Enhanced export options (SVG, CSV)
- Recent files list
- Drag-and-drop file loading
- Tooltips for all tools
- Dark/Light theme toggle
- Performance optimizations
- Auto-save functionality

See [ROADMAP.md](ROADMAP.md) for detailed feature planning.

---

## [1.0.0] - 2025-12-19

### 🎉 Initial Release - Foundation Complete

#### Added - Core Features

**Video Playback**

- ✅ Local video file support (MP4, WebM, OGG, MOV, AVI, MKV)
- ✅ YouTube video URL support
- ✅ Play/pause controls
- ✅ Progress tracking and seeking
- ✅ Duration display

**Drawing Tools**

- ✅ Pen tool (freehand drawing)
- ✅ Eraser tool
- ✅ Rectangle shape tool
- ✅ Circle shape tool
- ✅ Arrow tool
- ✅ Text annotation tool
- ✅ Stamp/Sticker tool (emoji-based)
- ✅ Color picker (full spectrum)
- ✅ Brush size control (1-20px)

**Canvas Features**

- ✅ HTML5 Canvas-based annotation layer
- ✅ Undo/Redo functionality (with history)
- ✅ Clear canvas option
- ✅ Download annotations as PNG
- ✅ Canvas state management
- ✅ Responsive canvas sizing

**Bookmarks & Timeline**

- ✅ Add timestamp bookmarks with notes
- ✅ Automatic thumbnail capture for bookmarks
- ✅ Jump to specific bookmarks
- ✅ Edit bookmark notes
- ✅ Delete bookmarks
- ✅ Bookmark sidebar panel
- ✅ Sorted timeline display

**User Interface**

- ✅ Modern dark theme design
- ✅ Floating toolbar with all controls
- ✅ Collapsible sidebar panel
- ✅ Video URL input dialog
- ✅ Responsive layout
- ✅ Smooth animations and transitions
- ✅ Professional icon set (Lucide React)

**Keyboard Shortcuts**

- ✅ P - Pen tool
- ✅ E - Eraser tool
- ✅ C - Cursor/Select mode
- ✅ T - Text tool
- ✅ R - Rectangle tool
- ✅ O - Circle tool
- ✅ A - Arrow tool
- ✅ S - Stamp tool
- ✅ Cmd/Ctrl+Z - Undo
- ✅ Cmd/Ctrl+Shift+Z - Redo
- ✅ Cmd/Ctrl+Y - Redo (alternative)

**Recording Features**

- ✅ Built-in screen recording
- ✅ MediaRecorder API integration
- ✅ Record with audio
- ✅ Save recordings locally
- ✅ Custom filename support

**Cross-Platform Desktop**

- ✅ Electron-based native application
- ✅ macOS support (DMG, ZIP)
- ✅ Windows support (NSIS installer, Portable)
- ✅ Linux support (AppImage, DEB, RPM)
- ✅ Native file dialogs
- ✅ IPC communication (secure)
- ✅ Platform-specific window controls

#### Technical Stack

**Frontend**

- React 19.2.0 - Latest React with improved performance
- Vite 7.2.4 - Lightning-fast development and building
- Tailwind CSS 3.4.17 - Modern utility-first styling
- react-player 3.4.0 - Multi-format video playback
- Lucide React 0.555.0 - Beautiful, consistent icons

**Desktop Framework**

- Electron 34.2.0 - Cross-platform native apps
- electron-builder 25.2.0 - Multi-platform packaging

**Developer Tools**

- ESLint 9.39.1 - Code quality
- Vite for HMR - Fast development
- concurrently & wait-on - Dev server orchestration

#### Project Structure

**Documentation**

- ✅ Comprehensive README.md (English)
- ✅ Complete README.tr.md (Turkish)
- ✅ Bilingual navigation between docs
- ✅ Detailed installation instructions
- ✅ Build instructions for all platforms
- ✅ Project structure documentation
- ✅ CHANGELOG.md
- ✅ ROADMAP.md (detailed feature planning)
- ✅ LICENSE.md (MIT)

**Build System**

- ✅ Development mode with hot-reload
- ✅ Production build optimization
- ✅ Platform-specific builds
- ✅ Multi-architecture support
- ✅ Automated build scripts
- ✅ Icon guidelines (build/README.md)

**Code Quality**

- ✅ ESLint configuration
- ✅ Modular component architecture
- ✅ Custom React hooks
- ✅ Clean separation of concerns
- ✅ Git version control
- ✅ Proper .gitignore configuration

#### Architecture Highlights

**Component Structure**

```
src/
├── App.jsx           # Main application container
├── components/
│   ├── VideoPlayer.jsx      # Video playback wrapper
│   ├── CanvasOverlay.jsx    # Annotation canvas layer
│   ├── Toolbar.jsx          # Main control toolbar
│   └── Sidebar.jsx          # Bookmarks panel
└── hooks/
    └── useRecorder.js       # Screen recording logic
```

**Electron Architecture**

```
electron/
├── main.js          # Main process (window management, IPC)
└── preload.js       # Secure renderer-main bridge
```

#### Performance Considerations

- Optimized canvas rendering
- ResizeObserver for responsive sizing
- Event delegation for performance
- Proper cleanup in useEffect hooks
- Minimal re-renders with proper state management

#### Known Limitations (v1.0.0)

- No annotation persistence (will be added in v1.1)
- No multi-layer support
- Export limited to PNG format
- No cloud integration
- No collaboration features
- YouTube videos use iframe (limited control)

---

## Version History Summary

- **1.0.0** (2025-12-19) - Initial release with core annotation features
- **1.1.x** (Planned Q1 2026) - Save/load, enhanced export, UI improvements
- **1.2.x** (Planned Q2 2026) - Timeline system, frame-level precision
- **1.3.x** (Planned Q3 2026) - Collaboration and cloud features
- **2.0.x** (Planned Q4 2026) - AI-powered analysis
- **2.1.x** (Planned Q1 2027) - Video editing suite
- **2.2.x** (Planned Q2 2027) - Professional features
- **3.0.x** (Planned Q3-Q4 2027) - Full platform with plugin system

See [ROADMAP.md](ROADMAP.md) for detailed version planning and feature roadmap.

---

## Contributing

We welcome contributions! Please see our contribution guidelines in the README.

For feature requests and bug reports, please [open an issue](https://github.com/Sopwit/video-annotation-tool/issues).

---

## Upgrade Notes

### From v0.x to v1.0

This is the first official release. No upgrade path needed.

### Future Upgrades

Migration guides will be provided for major version upgrades that affect data formats or APIs.

---

**For the full development roadmap and future plans, see [ROADMAP.md](ROADMAP.md)**
