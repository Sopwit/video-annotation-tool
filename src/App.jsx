import React, { useState, useRef, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import CanvasOverlay from './components/CanvasOverlay';
import Toolbar from './components/Toolbar';
import useRecorder from './hooks/useRecorder';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(2);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Check if current video is YouTube
  const isYouTube = videoUrl && /youtube|youtu\.be/.test(videoUrl);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

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

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Auto-switch to cursor mode for YouTube videos to allow interaction
  useEffect(() => {
    if (isYouTube) {
      setTool('cursor');
    }
  }, [isYouTube]);

  const handlePlayPause = () => {
    if (isYouTube) {
      // YouTube videos are controlled by iframe's own controls
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

  const handleStartRecording = async () => {
    // We need to capture the container element
    // However, MediaRecorder works with MediaStream.
    // To capture a DOM element, we can use html2canvas or getDisplayMedia.
    // But getDisplayMedia captures the whole screen or window.
    // The user requirement says "record button... screen recording will be taken".
    // "ekran kaydı alınacak" usually implies screen recording.
    // Let's use getDisplayMedia for simplicity and better performance than canvas hacking.

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

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-blue-500/30">

      {/* Main Content Area */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pb-24">
        <div
          ref={containerRef}
          className="relative w-full h-full max-w-6xl aspect-video rounded-2xl shadow-2xl ring-1 ring-white/10 bg-black"
        >
          <VideoPlayer
            ref={videoRef}
            videoUrl={videoUrl}
            isPlaying={isPlaying}
            onProgress={(state) => setProgress(state.played)}
            onDuration={(dur) => setDuration(dur)}
          />
          <CanvasOverlay
            width={containerSize.width}
            height={containerSize.height}
            tool={tool}
            color={color}
            brushSize={brushSize}
            clearTrigger={clearTrigger}
            isYouTube={isYouTube}
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
        isYouTube={isYouTube}
      />
    </div>
  );
}

export default App;
