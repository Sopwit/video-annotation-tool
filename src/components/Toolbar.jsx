import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Pen, Eraser, StopCircle, Trash2, Link as LinkIcon, X, Maximize2, MousePointer2, Circle, ArrowRight, Type, Undo, Redo, Download, Sticker, BookmarkPlus, PanelRightOpen, PanelRightClose, Save, Settings, Layers, Film, Minus, Sparkles, Mic, Move } from 'lucide-react';

const Toolbar = ({
    videoUrl,
    setVideoUrl,
    isPlaying,
    onPlayPause,
    onStop,
    tool,
    setTool,
    brushSize,
    setBrushSize,
    isRecording,
    onStartRecording,
    onStopRecording,
    color,
    setColor,
    onClear,
    onUndo,
    onRedo,
    onDownload,
    activeStamp,
    setActiveStamp,
    onAddBookmark,
    onToggleSidebar,
    isSidebarOpen,
    isYouTube,
    onSaveProject,
    onToggleTimeline,
    showTimeline,
    onToggleLayers,
    showLayers,
    onOpenSettings,
    onAiDetect,
}) => {
    const [showUrlDialog, setShowUrlDialog] = useState(false);
    const [inputValue, setInputValue] = useState(videoUrl);
    
    // Popover States
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showBrushSize, setShowBrushSize] = useState(false);
    const [showStampPicker, setShowStampPicker] = useState(false);

    const colorPickerRef = useRef(null);
    const brushSizeRef = useRef(null);
    const stampPickerRef = useRef(null);

    // Close popovers when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
            if (brushSizeRef.current && !brushSizeRef.current.contains(event.target)) {
                setShowBrushSize(false);
            }
            if (stampPickerRef.current && !stampPickerRef.current.contains(event.target)) {
                setShowStampPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUrlSubmit = () => {
        setVideoUrl(inputValue.trim());
        setShowUrlDialog(false);
    };

    const handleUrlChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleOpenDialog = () => {
        setInputValue(videoUrl);
        setShowUrlDialog(true);
    };

    const handleCloseDialog = () => {
        setShowUrlDialog(false);
        setInputValue(videoUrl);
    };

    const stamps = ['✅', '❌', '❓', '❗', '⭐', '🎯'];

    return (
        <>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 liquid-toolbar rounded-2xl p-3 flex items-center gap-3 shadow-2xl z-50 transition-all max-w-[95vw] overflow-x-auto float-subtle glow-blue">


                {/* URL Input Button */}
                <button
                    onClick={handleOpenDialog}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl liquid-button transition-colors cursor-pointer text-white/70 hover:text-white"
                    title="Add Video URL"
                >
                    <LinkIcon size={18} />
                </button>

                <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />

                {/* Playback Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={onPlayPause}
                        disabled={isYouTube}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${isYouTube
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-white/10 text-white'
                            }`}
                        title={isYouTube ? "YouTube videos are controlled via iframe controls" : (isPlaying ? "Pause" : "Play")}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                    </button>
                    <button
                        onClick={onStop}
                        disabled={isYouTube}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${isYouTube
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                            }`}
                        title={isYouTube ? "YouTube videos are controlled via iframe controls" : "Stop"}
                    >
                        <Square size={16} fill="currentColor" />
                    </button>
                </div>

                <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />

                {/* History Controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={onUndo} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all" title="Undo">
                        <Undo size={16} />
                    </button>
                    <button onClick={onRedo} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all" title="Redo">
                        <Redo size={16} />
                    </button>
                </div>

                <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />

                {/* Drawing Tools */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                        onClick={() => setTool('cursor')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'cursor' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Cursor"
                    >
                        <MousePointer2 size={18} />
                    </button>

                    <button
                        onClick={() => setTool('pen')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'pen' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Pen"
                    >
                        <Pen size={18} />
                    </button>

                    {/* Stamp Tool */}
                    <div className="relative z-50" ref={stampPickerRef}>
                         <button
                            onClick={() => {
                                setShowStampPicker(!showStampPicker);
                                setShowColorPicker(false);
                                setShowBrushSize(false);
                                setTool('stamp');
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'stamp' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                            title="Stamps"
                        >
                            {tool === 'stamp' ? <span className="text-lg leading-none">{activeStamp}</span> : <Sticker size={18} />}
                        </button>
                        
                        {showStampPicker && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl grid grid-cols-3 gap-2 shadow-xl w-32 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                {stamps.map((s) => (
                                    <button
                                        key={s}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setActiveStamp(s); 
                                            setTool('stamp');
                                            setShowStampPicker(false);
                                        }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-xl transition-all ${activeStamp === s ? 'bg-white/20' : ''}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setTool('text')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'text' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Text Tool"
                    >
                        <Type size={18} />
                    </button>

                    {/* Shapes */}
                    <button
                        onClick={() => setTool('rectangle')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'rectangle' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Rectangle"
                    >
                        <Square size={18} />
                    </button>
                    <button
                        onClick={() => setTool('circle')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'circle' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Circle"
                    >
                        <Circle size={18} />
                    </button>
                    <button
                        onClick={() => setTool('arrow')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'arrow' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Arrow"
                    >
                        <ArrowRight size={18} />
                    </button>

                    {/* Line Tool */}
                    <button
                        onClick={() => setTool('line')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'line' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Line"
                    >
                        <Minus size={18} />
                    </button>

                    {/* Color Picker Popover */}
                    <div className="relative z-50" ref={colorPickerRef}>
                        <button
                            onClick={() => {
                                setShowColorPicker(!showColorPicker);
                                setShowBrushSize(false);
                                setShowStampPicker(false);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-transparent hover:border-white/10"
                            title="Select Color"
                        >
                            <div className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} />
                        </button>
                        
                        {showColorPicker && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl grid grid-cols-5 gap-2 shadow-xl w-48 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="col-span-5 text-xs text-white/50 mb-1 text-center font-medium">Color Palette</div>
                                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#6b7280'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setColor(c); setShowColorPicker(false); }}
                                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                        title={c}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Brush Size Slider */}
                    <div className="relative z-50" ref={brushSizeRef}>
                        <button
                            onClick={() => {
                                setShowBrushSize(!showBrushSize);
                                setShowColorPicker(false);
                                setShowStampPicker(false);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                            title="Brush Size"
                        >
                            <Maximize2 size={16} />
                        </button>
                        
                        {showBrushSize && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl flex flex-col gap-3 w-40 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-white/70">Stroke Width</label>
                                    <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-1.5 rounded">{brushSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none"
                                    style={{
                                        backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(brushSize / 20) * 100}%, rgba(255,255,255,0.1) ${(brushSize / 20) * 100}%)`
                                    }}
                                />
                                <div className="flex justify-center items-center h-6 mt-1">
                                    <div 
                                        className="rounded-full bg-white transition-all duration-200"
                                        style={{ 
                                            width: brushSize, 
                                            height: brushSize,
                                            backgroundColor: color 
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setTool('eraser')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'eraser' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        title="Eraser"
                    >
                        <Eraser size={18} />
                    </button>

                    <button
                        onClick={onClear}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all active:scale-95"
                        title="Clear Canvas"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />

                {/* Actions: Record, Download */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={onAddBookmark}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-blue-500/20 text-white/70 hover:text-blue-400 transition-all active:scale-95"
                        title="Add Note at current time"
                    >
                        <BookmarkPlus size={18} />
                    </button>

                     <button
                        onClick={() => {
                            // Temporary direct implementation of voice note logic for demo
                            // Ideally this should be passed down
                             if (window.confirm("Start Recording Voice Note? (Max 5s Demo)")) {
                                navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                                    const mediaRecorder = new MediaRecorder(stream);
                                    const audioChunks = [];
                                    mediaRecorder.addEventListener("dataavailable", event => {
                                        audioChunks.push(event.data);
                                    });
                                    mediaRecorder.addEventListener("stop", () => {
                                        const audioBlob = new Blob(audioChunks);
                                        const audioUrl = URL.createObjectURL(audioBlob);
                                        // Trigger add bookmark with audio
                                        // Since we don't have direct access to 'addBookmark' with content here easily without state lift,
                                        // we will dispatch a custom event or callback.
                                        // For now, let's assume onAddBookmark can accept data object or we need a new prop.
                                        // Let's rely on a minimal 'onAddVoiceNote' prop if possible, or hack it via existing flow.
                                        
                                        const event = new CustomEvent('addVoiceNote', { detail: { audioUrl } });
                                        window.dispatchEvent(event);
                                    });
                                    mediaRecorder.start();
                                    setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
                                });
                             }
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-white/70 hover:text-pink-400 transition-all active:scale-95"
                        title="Add Voice Note (5s)"
                    >
                        <Mic size={18} />
                    </button>

                    <button
                        onClick={onToggleSidebar}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${isSidebarOpen ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:text-white'}`}
                        title="Toggle Notes Sidebar"
                    >
                        {isSidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    <button
                        onClick={onDownload}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-95"
                        title="Download Snapshot (Video + Drawing)"
                    >
                        <Download size={18} />
                    </button>

                    {!isRecording ? (
                        <button
                            onClick={onStartRecording}
                            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all shadow-lg shadow-red-500/20 active:scale-95"
                        >
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span>Record</span>
                        </button>
                    ) : (
                        <button
                            onClick={onStopRecording}
                            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-red-400 border border-red-500/30 font-medium transition-all animate-pulse"
                        >
                            <StopCircle size={18} />
                            <span>Stop</span>
                        </button>
                    )}
                </div>

                <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />

                {/* New v1.2 Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* AI Magic Button */}
                    <button
                        onClick={onAiDetect}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-500/40 hover:to-blue-500/40 text-purple-400 border border-purple-500/30 transition-all active:scale-95 shimmer"
                        title="AI Magic - Auto Detect Objects"
                    >
                        <Sparkles size={18} />
                    </button>

                    {/* Save Project */}
                    <button
                        onClick={onSaveProject}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 border border-green-500/30 transition-all active:scale-95"
                        title="Save Project"
                    >
                        <Save size={18} />
                    </button>

                    {/* Toggle Timeline */}
                    <button
                        onClick={onToggleTimeline}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${
                            showTimeline
                                ? 'bg-white/20 text-white border border-white/20'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                        title={showTimeline ? 'Hide Timeline' : 'Show Timeline'}
                    >
                        <Film size={18} />
                    </button>

                    {/* Toggle Layers */}
                    <button
                        onClick={onToggleLayers}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${
                            showLayers
                                ? 'bg-white/20 text-white border border-white/20'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                        title={showLayers ? 'Hide Layers' : 'Show Layers'}
                    >
                        <Layers size={18} />
                    </button>

                    {/* Reset Zoom & View */}
                    <button
                        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))} 
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
                        title="Reset View (Esc)"
                    >
                        <Move size={18} />
                    </button>

                    {/* Settings */}
                    <button
                        onClick={onOpenSettings}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
                        title="Settings"
                    >
                        <Settings size={18} />
                    </button>
                </div>

            </div>

            {/* URL Dialog Modal */}
            {showUrlDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-black/90 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <LinkIcon size={20} />
                                Add Video URL
                            </h2>
                            <button
                                onClick={handleCloseDialog}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Paste video URL..."
                            value={inputValue}
                            onChange={handleUrlChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all mb-4"
                        />

                        <div className="text-xs text-white/50 mb-4 space-y-1">
                            <p>✓ MP4, WebM, Ogg formats are supported</p>
                            <p>✓ CORS-enabled remote videos work</p>
                            <p>• Example: https://www.w3schools.com/html/mov_bbb.webm</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCloseDialog}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUrlSubmit}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
                            >
                                Load
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Toolbar;