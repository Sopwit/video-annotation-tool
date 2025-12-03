import React, { useState, useRef, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import CanvasOverlay from './components/CanvasOverlay';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import useRecorder from './hooks/useRecorder';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(2);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0); // Played seconds
  const [clearTrigger, setClearTrigger] = useState(0);
  
  // New Features State
  const [bookmarks, setBookmarks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeStamp, setActiveStamp] = useState('✅');

  // Check if current video is YouTube
  const isYouTube = videoUrl && /youtube|youtu\.be/.test(videoUrl);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const canvasOverlayRef = useRef(null);

  const { isRecording, startRecording, stopRecording, saveRecording } = useRecorder();

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    // Observer for resize is better than window resize for flex containers
    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [isSidebarOpen]); // Update size when sidebar toggles

  // Auto-switch to cursor mode for YouTube videos to allow interaction
  useEffect(() => {
    if (isYouTube) {
      setTool('cursor');
    }
  }, [isYouTube]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
            handleRedo();
        } else {
            handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else {
        switch (e.key.toLowerCase()) {
            case 'p': setTool('pen'); break;
            case 'e': setTool('eraser'); break;
            case 'c': setTool('cursor'); break;
            case 't': setTool('text'); break;
            case 'r': setTool('rectangle'); break;
            case 'o': setTool('circle'); break;
            case 'a': setTool('arrow'); break;
            case 's': setTool('stamp'); break;
            default: break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    setClearTrigger(prev => prev + 1);
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
        video: { cursor: "always" },
        audio: true
      });
      await startRecording(stream);
    } catch (err) {
      console.error("Error starting screen capture:", err);
    }
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      const filename = prompt("Enter filename to save recording:", "recording");
      if (filename) {
        saveRecording(blob, filename);
      }
    }
  };

  // Bookmark Logic
  const handleAddBookmark = async () => {
    // Get accurate time from VideoPlayer (ReactPlayer)
    const currentTime = videoRef.current ? videoRef.current.getCurrentTime() : 0;
    
    const note = prompt("Enter a note for this timestamp:", "Important Moment");
    if (note) {
        // Capture snapshot for thumbnail
        let thumbnail = null;
        if (canvasOverlayRef.current && canvasOverlayRef.current.getSnapshot) {
            try {
                thumbnail = await canvasOverlayRef.current.getSnapshot();
            } catch (e) {
                console.error("Snapshot failed", e);
            }
        }

        setBookmarks(prev => [...prev, { 
            id: Date.now(), 
            time: currentTime, 
            text: note,
            thumbnail: thumbnail 
        }].sort((a, b) => a.time - b.time));
        
        setIsSidebarOpen(true);
    }
  };

  const handleEditBookmark = (id, newText) => {
      setBookmarks(prev => prev.map(b => b.id === id ? { ...b, text: newText } : b));
  };

  const handleJumpToTime = (time) => {
    if (videoRef.current) {
        videoRef.current.seekTo(time);
        if (!isPlaying && !isYouTube) setIsPlaying(true);
    }
  };

  const handleDeleteBookmark = (id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-blue-500/30 flex flex-col">

      {/* Main Content Area with Sidebar Layout */}
      <div className="flex-1 flex overflow-hidden pb-24 relative">
          
          {/* Video Container */}
          <div className="flex-1 flex items-center justify-center p-8 transition-all duration-300">
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
                videoUrl={videoUrl} // Pass videoUrl
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={`absolute right-0 top-0 h-full z-40 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex`}>
             <Sidebar 
                isOpen={true} // Always rendered but hidden by translate
                bookmarks={bookmarks}
                onJump={handleJumpToTime}
                onDelete={handleDeleteBookmark}
                onEdit={handleEditBookmark}
                onClose={() => setIsSidebarOpen(false)}
             />
          </div>
      </div>

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
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        isYouTube={isYouTube}
      />
    </div>
  );
}

export default App;
