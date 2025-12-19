import React, { useRef, useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import CanvasOverlay from './components/CanvasOverlay';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import LayerManager from './components/LayerManager';
import SettingsPanel from './components/SettingsPanel';
import useRecorder from './hooks/useRecorder';
import useStore from './store/useStore';
import { saveProject, scheduleAutoSave, cancelAutoSave } from './services/database';

function App() {
  // Zustand Store
  const {
    videoUrl,
    isPlaying,
    tool,
    color,
    brushSize,
    activeStamp,
    duration,
    progress,
    bookmarks,
    isSidebarOpen,
    currentLayer,
    layers,
    settings,
    setVideoUrl,
    setIsPlaying,
    setTool,
    setColor,
    setBrushSize,
    setActiveStamp,
    setDuration,
    setProgress,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleSidebar,
  } = useStore();

  // Local UI State
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [clearTrigger, setClearTrigger] = useState(0);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const canvasOverlayRef = useRef(null);

  // Recording hook
  const { isRecording, startRecording, stopRecording, saveRecording } = useRecorder();

  // Check if current video is YouTube
  const isYouTube = videoUrl && /youtube|youtu\.be/.test(videoUrl);

  // Container resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [isSidebarOpen, showLayerManager]);

  // Auto-switch to cursor mode for YouTube videos
  useEffect(() => {
    if (isYouTube) {
      setTool('cursor');
    }
  }, [isYouTube, setTool]);

  // Apply theme to document
  useEffect(() => {
    const { theme } = useStore.getState();
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  // Listen to theme changes
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.theme,
      (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
      }
    );
    return unsubscribe;
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const shortcut = settings.shortcuts;
      const key = e.key.toLowerCase();
      const isMod = e.ctrlKey || e.metaKey;

      // Check for undo/redo
      if (isMod && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      if (isMod && key === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Tool shortcuts
      const toolMap = {
        [shortcut.pen]: 'pen',
        [shortcut.eraser]: 'eraser',
        [shortcut.cursor]: 'cursor',
        [shortcut.text]: 'text',
        [shortcut.rectangle]: 'rectangle',
        [shortcut.circle]: 'circle',
        [shortcut.arrow]: 'arrow',
        [shortcut.stamp]: 'stamp',
      };

      if (toolMap[key]) {
        setTool(toolMap[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.shortcuts, setTool]);

  // Auto-save functionality
  useEffect(() => {
    if (!settings.autoSave || !currentProjectId) {
      cancelAutoSave();
      return;
    }

    const projectData = {
      id: currentProjectId,
      name: 'Current Project',
      videoUrl,
      layers,
      annotations: [], // Would come from canvas
      bookmarks,
    };

    scheduleAutoSave(projectData, settings.autoSaveInterval);

    return () => cancelAutoSave();
  }, [settings.autoSave, settings.autoSaveInterval, currentProjectId, videoUrl, layers, bookmarks]);

  // Event Handlers
  const handlePlayPause = () => {
    if (isYouTube) {
      console.log('YouTube video - use iframe controls');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (!isYouTube && videoRef.current && videoRef.current.pause) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClear = () => {
    setClearTrigger((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (canvasOverlayRef.current) {
      canvasOverlayRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasOverlayRef.current) {
      canvasOverlayRef.current.redo();
    }
  };

  const handleDownload = () => {
    if (canvasOverlayRef.current) {
      canvasOverlayRef.current.download();
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true,
      });
      await startRecording(stream);
    } catch (err) {
      console.error('Error starting screen capture:', err);
    }
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      const filename = prompt('Enter filename to save recording:', 'recording');
      if (filename) {
        saveRecording(blob, filename);
      }
    }
  };

  const handleAddBookmark = async () => {
    const currentTime = videoRef.current ? videoRef.current.getCurrentTime() : 0;
    const note = prompt('Enter a note for this timestamp:', 'Important Moment');
    
    if (note) {
      let thumbnail = null;
      if (canvasOverlayRef.current && canvasOverlayRef.current.getSnapshot) {
        try {
          thumbnail = await canvasOverlayRef.current.getSnapshot();
        } catch (e) {
          console.error('Snapshot failed', e);
        }
      }

      addBookmark({
        id: Date.now(),
        time: currentTime,
        text: note,
        note: note,
        thumbnail: thumbnail,
      });

      if (!isSidebarOpen) {
        toggleSidebar();
      }
    }
  };

  const handleEditBookmark = (id, newText) => {
    updateBookmark(id, { text: newText, note: newText });
  };

  const handleJumpToTime = (time) => {
    if (videoRef.current) {
      videoRef.current.seekTo(time);
      if (!isPlaying && !isYouTube) setIsPlaying(true);
    }
  };

  const handleDeleteBookmark = (id) => {
    deleteBookmark(id);
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.seekTo(time);
    }
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        name: prompt('Enter project name:', 'My Project') || 'Untitled',
        videoUrl,
        layers,
        annotations: [], // TODO: Get from canvas
        bookmarks,
      };

      const projectId = await saveProject(projectData);
      setCurrentProjectId(projectId);
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Container */}
        <div className={`flex-1 flex items-center justify-center p-8 transition-all duration-300 ${showTimeline ? 'pb-32' : 'pb-24'}`}>
          <div
            ref={containerRef}
            className="relative w-full h-full max-w-6xl aspect-video rounded-2xl shadow-2xl ring-1 ring-white/10 bg-black transition-all"
          >
            <VideoPlayer
              ref={videoRef}
              videoUrl={videoUrl}
              isPlaying={isPlaying}
              onProgress={(state) => setProgress(state.playedSeconds)}
              onDuration={(dur) => setDuration(dur)}
            />
            <CanvasOverlay
              ref={canvasOverlayRef}
              width={containerSize.width}
              height={containerSize.height}
              tool={tool}
              color={color}
              brushSize={brushSize}
              clearTrigger={clearTrigger}
              isYouTube={isYouTube}
              activeStamp={activeStamp}
              videoUrl={videoUrl}
              currentLayer={currentLayer}
              layers={layers}
            />
          </div>
        </div>

        {/* Right Sidebar - Bookmarks */}
        <div
          className={`absolute right-0 top-0 h-full z-40 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } flex`}
        >
          <Sidebar
            isOpen={true}
            bookmarks={bookmarks}
            onJump={handleJumpToTime}
            onDelete={handleDeleteBookmark}
            onEdit={handleEditBookmark}
            onClose={toggleSidebar}
          />
        </div>

        {/* Right Panel - Layer Manager */}
        <div
          className={`absolute right-0 top-0 h-full z-30 transition-transform duration-300 transform ${
            showLayerManager ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ right: isSidebarOpen ? '320px' : '0' }}
        >
          {showLayerManager && <LayerManager />}
        </div>
      </div>

      {/* Timeline */}
      {showTimeline && (
        <div className="absolute bottom-20 left-0 right-0 z-20">
          <Timeline videoRef={videoRef} onSeek={handleSeek} />
        </div>
      )}

      {/* Floating Toolbar */}
      <Toolbar
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        tool={tool}
        setTool={setTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        color={color}
        setColor={setColor}
        onClear={handleClear}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
        activeStamp={activeStamp}
        setActiveStamp={setActiveStamp}
        onAddBookmark={handleAddBookmark}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isYouTube={isYouTube}
        onSaveProject={handleSaveProject}
        onToggleTimeline={() => setShowTimeline(!showTimeline)}
        showTimeline={showTimeline}
        onToggleLayers={() => setShowLayerManager(!showLayerManager)}
        showLayers={showLayerManager}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default App;
