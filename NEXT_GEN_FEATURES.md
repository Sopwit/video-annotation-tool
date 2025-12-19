# 🚀 Next-Gen Features Implementation Plan (v1.6.0)

We are taking the Video Annotation Tool to the next level with **AI**, **Voice**, and **Advanced Canvas** controls.

## 1. 🤖 AI Object Detection ("Magic Wand")

**Goal:** Automatically detect objects (person, car, ball, etc.) in the current video frame and create bounding box annotations.

- **Tech:** TensorFlow.js + COCO-SSD model.
- **UI:** A new "Magic" button in the toolbar.
- **Flow:**
  1. User pauses video.
  2. Clicks "AI Detect".
  3. System analyzes frame.
  4. Adds Rectangle annotations with labels for detected objects.

## 2. 🎙️ Voice Annotations

**Goal:** Allow users to attach voice notes to specific timestamps.

- **Tech:** Web Audio API (MediaRecorder).
- **UI:** Microphone icon in Sidebar/Toolbar.
- **Flow:**
  1. User clicks "Add Voice Note".
  2. Records audio (max 30s).
  3. Bookmark is created with audio player attached.
  4. In sidebar, user can play back the note.

## 3. 🔍 Zoom & Pan (Infinite Canvas)

**Goal:** Allow deep zoom and panning for precise annotations.

- **Tech:** CSS Transforms (`matrix` or `scale/translate`).
- **UI:** Mouse wheel to zoom, Space+Drag to pan.
- **Flow:**
  1. User scrolls up -> content zooms in centered on cursor.
  2. User holds Space -> cursor changes to Hand -> drags to move viewport.
  3. Drawing still works correctly at any zoom level (requires coordinate transformation).

---

## 📅 Execution Roadmap

### Phase 1: AI Magic 🤖

- [ ] Install `@tensorflow/tfjs` and `@tensorflow-models/coco-ssd`
- [ ] Create `src/services/aiService.js`
- [ ] Add "Magic" button to Toolbar
- [ ] Connect AI service to Annotation Store
- [ ] Test on video frames

### Phase 2: Voice Notes 🎙️

- [ ] Update `useStore` to support voice data in bookmarks
- [ ] Create `AudioRecorder` component
- [ ] Update `Sidebar` to display audio controls for bookmarks
- [ ] Test recording and playback

### Phase 3: Zoom & Pan 🔍

- [ ] Create `ZoomContainer` wrapper component
- [ ] Implement wheel and drag logic
- [ ] Update `CanvasOverlay` to handle coordinate math (screen -> canvas space)
- [ ] Add reset zoom button to UI

---

**Target Version:** v1.6.0 "NextGen"
