import React, { useRef, useEffect, useState, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import CanvasOverlay from './components/CanvasOverlay';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import LayerManager from './components/LayerManager';
import SettingsPanel from './components/SettingsPanel';
import WelcomeScreen from './components/WelcomeScreen';
import ToastContainer from './components/ToastContainer';
import StatusBar from './components/StatusBar';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import useRecorder from './hooks/useRecorder';
import useStore from './store/useStore';
import { saveProject, scheduleAutoSave, cancelAutoSave } from './services/database';
import { detectObjects } from './services/aiService';

function App() {
  // Zustand Store
  const {
    videoUrl,
    isPlaying,
    tool,
    color,
    brushSize,
    activeStamp,
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
    addToast,
    addRecentFile,
  } = useStore();

  // Local UI State
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [clearTrigger, setClearTrigger] = useState(0);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  
  // Custom Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

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
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [isSidebarOpen, showLayerManager, showTimeline]);

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

  // Event Handlers
  const handleUndo = useCallback(() => {
    if (canvasOverlayRef.current) {
      canvasOverlayRef.current.undo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (canvasOverlayRef.current) {
      canvasOverlayRef.current.redo();
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const shortcut = settings.shortcuts;
      const key = e.key.toLowerCase();
      const isMod = e.ctrlKey || e.metaKey;

      // Keyboard shortcuts help
      if (key === '?' && !isMod) {
        e.preventDefault();
        setShowShortcutsHelp(true);
        return;
      }

      // Esc to close modals
      if (key === 'escape') {
        setShowShortcutsHelp(false);
        setShowSettings(false);
        setZoomLevel(1); // Reset Zoom
        setPanOffset({ x: 0, y: 0 });
        return;
      }

      // Undo/Redo
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
  }, [settings.shortcuts, setTool, handleUndo, handleRedo]);

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
      annotations: [],
      bookmarks,
    };

    scheduleAutoSave(projectData, settings.autoSaveInterval);
    return () => cancelAutoSave();
  }, [settings.autoSave, settings.autoSaveInterval, currentProjectId, videoUrl, layers, bookmarks]);

  const handleLoadVideo = useCallback((url) => {
    if (!url) return;
    
    setVideoUrl(url);
    
    // Add to recent files
    addRecentFile({
      path: url,
      name: url.includes('youtube') ? 'YouTube Video' : url.split('/').pop(),
      type: url.includes('youtube') ? 'youtube' : 'local',
    });
    
    addToast({
      type: 'success',
      message: 'Video loaded successfully!',
    });
  }, [setVideoUrl, addRecentFile, addToast]);

  const handlePlayPause = useCallback(() => {
    if (isYouTube) {
      addToast({
        type: 'info',
        message: 'Use YouTube player controls for playback',
      });
      return;
    }
    setIsPlaying(!isPlaying);
  }, [isYouTube, isPlaying, setIsPlaying, addToast]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    if (!isYouTube && videoRef.current && videoRef.current.pause) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isYouTube, setIsPlaying]);

  const handleClear = useCallback(() => {
    if (confirm('Clear all annotations on current layer?')) {
      setClearTrigger((prev) => prev + 1);
      addToast({
        type: 'info',
        message: 'Canvas cleared',
      });
    }
  }, [addToast]);

  const handleDownload = useCallback(() => {
    if (canvasOverlayRef.current) {
      canvasOverlayRef.current.download();
      addToast({
        type: 'success',
        message: 'Annotation exported as PNG',
      });
    }
  }, [addToast]);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true,
      });
      await startRecording(stream);
      addToast({
        type: 'success',
        message: 'Screen recording started',
      });
    } catch (err) {
      console.error('Error starting screen capture:', err);
      addToast({
        type: 'error',
        message: 'Failed to start recording',
      });
    }
  }, [startRecording, addToast]);

  const handleStopRecording = useCallback(async () => {
    const blob = await stopRecording();
    if (blob) {
      const filename = prompt('Enter filename to save recording:', 'recording');
      if (filename) {
        saveRecording(blob, filename);
        addToast({
          type: 'success',
          message: 'Recording saved successfully',
        });
      }
    }
  }, [stopRecording, saveRecording, addToast]);

  const handleAddBookmark = useCallback(async () => {
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
      
      addToast({
        type: 'success',
        message: 'Bookmark added',
      });
    }
  }, [addBookmark, isSidebarOpen, toggleSidebar, addToast]);

  const handleEditBookmark = useCallback((id, newText) => {
    updateBookmark(id, { text: newText, note: newText });
    addToast({
      type: 'info',
      message: 'Bookmark updated',
    });
  }, [updateBookmark, addToast]);

  const handleJumpToTime = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.seekTo(time);
      if (!isPlaying && !isYouTube) setIsPlaying(true);
    }
  }, [isPlaying, isYouTube, setIsPlaying]);

  const handleDeleteBookmark = useCallback((id) => {
    deleteBookmark(id);
    addToast({
      type: 'info',
      message: 'Bookmark deleted',
    });
  }, [deleteBookmark, addToast]);

  const handleSeek = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.seekTo(time);
    }
  }, []);

  const handleSaveProject = useCallback(async () => {
    try {
      const projectData = {
        name: prompt('Enter project name:', 'My Project') || 'Untitled',
        videoUrl,
        layers,
        annotations: [],
        bookmarks,
      };

      const projectId = await saveProject(projectData);
      setCurrentProjectId(projectId);
      addToast({
        type: 'success',
        message: 'Project saved successfully!',
      });
    } catch (error) {
      console.error('Error saving project:', error);
      addToast({
        type: 'error',
        message: 'Failed to save project',
      });
    }
  }, [videoUrl, layers, bookmarks, addToast]);

  const handleOpenRecent = useCallback((project) => {
    // TODO: Implement project loading
    addToast({
      type: 'info',
      message: `Opening ${project.name}...`,
    });
  }, [addToast]);

  // Voice Note Event Listener
  useEffect(() => {
    const handleAddVoiceNote = (e) => {
        const { audioUrl } = e.detail;
        if (videoRef.current) {
            const currentTime = videoRef.current.getCurrentTime();
            addBookmark({
                id: Date.now(),
                time: currentTime,
                text: "Voice Note 🎙️",
                audioUrl: audioUrl,
                thumbnail: null // Or generate one
            });
            addToast({
                type: 'success',
                message: 'Voice Note Added!'
            });
        }
    };

    window.addEventListener('addVoiceNote', handleAddVoiceNote);
    return () => window.removeEventListener('addVoiceNote', handleAddVoiceNote);
  }, [addBookmark, addToast]);

  const handleAiDetect = useCallback(async () => {
    if (!videoRef.current) return;
    
    const internalPlayer = videoRef.current.getInternalPlayer();
    
    // Check if valid video element
    if (!internalPlayer || !(internalPlayer instanceof HTMLVideoElement)) {
       addToast({
        type: 'error',
        message: 'AI Detection only works on local video files.',
      });
      return;
    }

    try {
      addToast({
        type: 'info',
        message: 'Analyzing frame with AI... Please wait.',
      });
      setIsPlaying(false);

      const aiAnnotations = await detectObjects(internalPlayer);

      if (aiAnnotations.length === 0) {
        addToast({
          type: 'info',
          message: 'No objects detected.',
        });
        return;
      }

      if (canvasOverlayRef.current) {
        canvasOverlayRef.current.addAiAnnotations(aiAnnotations);
      }

      addToast({
        type: 'success',
        message: `Detected ${aiAnnotations.length} objects!`,
      });

    } catch (error) {
      console.error('AI Error:', error);
      addToast({
        type: 'error',
        message: 'AI Analysis failed.',
      });
    }
  }, [addToast, setIsPlaying]);



  // Calculate layout dimensions
  const sidebarWidth = isSidebarOpen ? 320 : 0;
  const layerManagerWidth = showLayerManager ? 280 : 0;
  const timelineHeight = showTimeline ? 160 : 0;

  // Show welcome screen if no video loaded
  if (!videoUrl) {
    return (
      <div className="relative w-screen h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
        {/* Liquid Glass Animated Background */}
        <div className="liquid-glass-bg" />
        
        <WelcomeScreen 
          onLoadVideo={handleLoadVideo}
          onOpenRecent={handleOpenRecent}
        />
        <ToastContainer />
        <KeyboardShortcutsHelp 
          isOpen={showShortcutsHelp} 
          onClose={() => setShowShortcutsHelp(false)} 
        />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Video Container */}
        <div 
          className="flex-1 flex items-center justify-center p-4"
          style={{
            paddingRight: sidebarWidth + layerManagerWidth + 16,
            paddingBottom: timelineHeight + 96,
          }}
        >
          <div
            ref={containerRef}
            className="relative w-full h-full max-w-6xl aspect-video rounded-xl shadow-2xl ring-1 ring-white/10 bg-black overflow-hidden"
            style={{ zIndex: 'var(--z-video)' }}
            onWheel={(e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    setZoomLevel(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 1), 5));
                }
            }}
            onMouseDown={(e) => {
                if (e.button === 1 || (e.shiftKey)) { // Middle mouse or Shift+Click to Pan
                    setIsPanning(true);
                    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
                    e.preventDefault();
                }
            }}
            onMouseMove={(e) => {
                if (isPanning) {
                     setPanOffset({
                        x: e.clientX - startPan.x,
                        y: e.clientY - startPan.y
                    });
                }
            }}
            onMouseUp={() => setIsPanning(false)}
            onMouseLeave={() => setIsPanning(false)}
          >
           <div 
             className="w-full h-full transition-transform duration-100 ease-out origin-top-left"
             style={{
                 transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                 cursor: isPanning ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default')
             }}
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
              // Pass zoom props to coordinate mapping if needed, 
              // for now simple transform scales everything visually which matches overlay
            />
           </div>
           
           {/* Zoom Info Indicator */}
           {zoomLevel > 1 && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs pointer-events-none backdrop-blur-sm z-50">
                {(zoomLevel * 100).toFixed(0)}%
            </div>
           )}
          </div>
        </div>

        {/* Right Sidebar - Bookmarks */}
        <div
          className={`fixed right-0 top-0 h-full transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ 
            zIndex: 'var(--z-sidebar)',
            width: '320px',
          }}
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
          className={`fixed top-0 h-full transition-all duration-300 ease-in-out ${
            showLayerManager ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ 
            zIndex: 'var(--z-layer-manager)',
            right: isSidebarOpen ? '320px' : '0',
            width: '280px',
          }}
        >
          {showLayerManager && <LayerManager />}
        </div>
      </div>

      {/* Timeline */}
      {showTimeline && (
        <div 
          className="fixed bottom-20 left-0 right-0 animate-slide-up"
          style={{ zIndex: 'var(--z-timeline)' }}
        >
          <Timeline onSeek={handleSeek} />
        </div>
      )}

      {/* Toolbar */}
      <div 
        className="fixed bottom-0 left-0 right-0"
        style={{ zIndex: 'var(--z-toolbar)' }}
      >
        <Toolbar
          videoUrl={videoUrl}
          setVideoUrl={handleLoadVideo}
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
          onAiDetect={handleAiDetect}
        />
      </div>

      {/* Status Bar */}
      <StatusBar 
        videoName={videoUrl.split('/').pop() || 'Video'} 
        fps={30}
      />

      {/* Modals */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <KeyboardShortcutsHelp 
        isOpen={showShortcutsHelp} 
        onClose={() => setShowShortcutsHelp(false)} 
      />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
