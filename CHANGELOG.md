# Changelog

All notable changes to the Video Annotation Tool project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for v1.4 (Q1 2026)

- Advanced drawing tools (highlighter, blur, polygon)
- Annotation templates and presets
- Cloud sync capabilities
- Real-time collaboration features
- Video trimming tools
- Command palette (Cmd+K)
- Context menus

See [ROADMAP.md](ROADMAP.md) for detailed feature planning.

---

## [1.3.0] - 2025-12-19

### 🎉 Major Release - Professional UI Transformation

#### Added - Professional Features

**Welcome Screen**

- ✨ Professional onboarding experience
- ✨ Hero section with gradient logo and title
- ✨ **Drag & Drop Zone** - Video file drag-and-drop support
- ✨ **URL Loading Card** - YouTube and direct video links
- ✨ **Recent Projects Panel** - Quick access to last 3 projects
- ✨ **Quick Start Templates** - Education, Sports Analysis, Product Review
- ✨ Keyboard shortcut hints (Cmd+O, ?)
- ✨ Shine animations on hover
- ✨ Auto-show when no video loaded

**Toast Notification System**

- ✅ Real-time user feedback system
- ✅ 4 notification types (success, error, warning, info)
- ✅ Auto-dismiss after 3 seconds (configurable)
- ✅ Icons and color coding
- ✅ Slide-down animations
- ✅ Manual close button
- ✅ Multiple toast support (stacking)
- ✅ Glass morphism effects
- ✅ Integrated in 11 user actions

**Status Bar**

- 📊 Live layer information (visible/total count)
- ⏱️ FPS display (frames per second)
- 🎨 Active tool indicator
- 💾 Storage usage display
- ✨ Hover tooltips
- ✨ Icon-based visualization
- ✨ Fixed bottom positioning

**Keyboard Shortcuts Help**

- ⌨️ Comprehensive shortcuts guide (26 shortcuts)
- ⌨️ 4 categories: Tools, Actions, Playback, View
- ⌨️ Modal dialog with gradient design
- ⌨️ kbd tags for visual shortcuts
- ⌨️ ? key to open
- ⌨️ ESC to close
- ⌨️ Animated entrance

#### Improved

**User Experience**

- Enhanced first-run experience with welcome screen
- Real-time feedback on all major actions
- Professional look and feel throughout
- Smooth animations and transitions
- Better onboarding for new users
- Quick access to recent work
- Template-based quick starts

**Developer Experience**

- Centralized toast notification management
- Reusable notification components
- Clean state management for UI
- Modular component architecture
- Easy to extend and customize

#### Technical

**New Components**

- `src/components/WelcomeScreen.jsx` (159 lines)
- `src/components/ToastContainer.jsx` (58 lines)
- `src/components/StatusBar.jsx` (55 lines)
- `src/components/KeyboardShortcutsHelp.jsx` (177 lines)

**Store Updates**

- Added `toasts` state array
- Added `addToast(toast)` action
- Added `removeToast(id)` action

**App Integration**

- Welcome screen on first load
- Toast notifications on 11 actions
- Status bar always visible
- Keyboard help accessible via ?
- ESC key closes all modals

---

## [1.2.1] - 2025-12-19

### 🔧 Fixed

- **Z-Index Hierarchy**: Completely reorganized z-index system to prevent UI conflicts
  - Toolbar: z-index 50
  - Sidebar: z-index 40
  - Layer Manager: z-index 35
  - Timeline: z-index 30
  - Canvas: z-index 10
  - Modals: z-index 100+
- **Layout System**: Redesigned layout to prevent panel overlaps
  - Calculated dimensions for sidebar and layer manager
  - Responsive padding adjustments
  - Smooth transitions for all panels
- **Function Hoisting Issues**: Fixed React hoisting errors
  - Used `useCallback` for all event handlers
  - Proper dependency arrays
  - Eliminated "accessed before declaration" errors

### ✨ Added

- **Global CSS Improvements**
  - CSS variables for z-index hierarchy
  - Smooth scrollbar styling
  - Glass morphism utilities
  - Animation keyframes (fadeIn, slideUp, slideDown, slideLeft, slideRight)
  - Accessibility focus styles
  - Selection styling
- **Enhanced Animations**
  - Panel slide animations
  - Fade transitions
  - Smooth state changes
- **Better UX**
  - Confirmation dialog before clearing canvas
  - Non-overlapping panels
  - Proper fixed positioning
  - Responsive layout calculations

### 🎨 Improved

- **Code Quality**
  - All event handlers use `useCallback`
  - Proper effect dependencies
  - Cleaner component structure
  - Better performance with memoization

---

## [1.2.0] - 2025-12-19

### 🎉 Major Release - Professional Features

#### Added - Core Features

**Multi-Layer System**

- ✅ Create unlimited annotation layers
- ✅ Individual layer visibility toggle
- ✅ Layer opacity control (0-100%)
- ✅ Lock/unlock layers
- ✅ Rename layers
- ✅ Layer reorderingUI (logic in progress)
- ✅ Isolated editing per layer

**Advanced Timeline**

- ✅ Visual timeline with progress bar
- ✅ Draggable playhead
- ✅ Bookmark visualization on timeline
- ✅ Hover time preview
- ✅ Frame-by-frame navigation (+/- 1 frame)
- ✅ Time jump controls (+/- 1 second)
- ✅ Precise timestamp display

**Persistence & Storage**

- ✅ IndexedDB integration (Dexie)
- ✅ Save/Load projects
- ✅ Auto-save functionality (configurable interval)
- ✅ Project management system
- ✅ Recent files tracking
- ✅ Storage utilities

**Enhanced Export**

- ✅ Export as PNG (with video background)
- ✅ Export as SVG (vector format)
- ✅ Export as JSON (project data)
- ✅ Export bookmarks as CSV
- ✅ Copy to clipboard
- ✅ Batch screenshot export
- ✅ Full project export

**Settings & Customization**

- ✅ Comprehensive settings panel
- ✅ **Theme System** (Dark & Light themes)
- ✅ Keyboard shortcut customization
- ✅ Auto-save configuration
- ✅ Grid display options
- ✅ Tooltip preferences

**New Drawing Tools**

- ✅ Line tool (straight lines)
- ✅ Enhanced existing tools

**Professional UI**

- ✅ Modern dark theme
- ✅ Light theme support
- ✅ Glass morphism effects
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Accessibility features

#### Technical Stack Updates

**New Dependencies**

- `zustand` (^4.5.0) - State management
- `dexie` (^4.0.0) - IndexedDB wrapper
- `lodash` (^4.17.21) - Utility functions
- `date-fns` (^3.0.0) - Date formatting
- `react-colorful` (^5.6.1) - Color picker
- `html2canvas` (^1.4.1) - Screenshot generation
- `file-saver` (^2.0.5) - File downloads

**Architecture**

- Global state management with Zustand
- Persistent storage with IndexedDB
- Service layer architecture
- Modular component design
- Custom hooks pattern

---

## [1.0.0] - 2025-12-18

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
- ✅ Automatic thumbnail capture
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

- React 19.2.0
- Vite 7.2.4
- Tailwind CSS 3.4.17
- react-player 3.4.0
- Lucide React 0.555.0

**Desktop Framework**

- Electron 34.2.0
- electron-builder 24.13.3

**Developer Tools**

- ESLint 9.39.1
- Vite for HMR
- concurrently & wait-on

---

## Version Comparison

| Feature        | v1.0  | v1.2         | v1.2.1       |
| -------------- | ----- | ------------ | ------------ |
| Drawing Tools  | 8     | 9            | 9            |
| Layers         | 1     | ∞            | ∞            |
| Export Formats | 1     | 4            | 4            |
| Persistence    | ❌    | ✅           | ✅           |
| Timeline       | Basic | Advanced     | Advanced     |
| Settings       | ❌    | ✅           | ✅           |
| Themes         | Dark  | Dark + Light | Dark + Light |
| Z-Index Issues | -     | Minor        | ✅ Fixed     |
| Layout Issues  | -     | Minor        | ✅ Fixed     |

---

## Upgrade Notes

### From v1.2.0 to v1.2.1

- No data migration needed
- UI improvements automatic
- Smoother experience

### From v1.0 to v1.2

- Projects now saveable
- New layer system
- Settings automatically migrated

---

**For the full development roadmap and future plans, see [ROADMAP.md](ROADMAP.md)**
