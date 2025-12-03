import React, { useState } from 'react';
import { Play, Pause, Square, Pen, Eraser, Video, StopCircle, Trash2, Link as LinkIcon, Palette, X, Maximize2, MousePointer2 } from 'lucide-react';

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
    isYouTube
}) => {
    const [showUrlDialog, setShowUrlDialog] = useState(false);
    const [inputValue, setInputValue] = useState(videoUrl);
    const [showBrushSize, setShowBrushSize] = useState(false);

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

    return (
        <>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-4 shadow-2xl z-50 transition-all hover:bg-black/70">

                {/* URL Input Button */}
                <button
                    onClick={handleOpenDialog}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-white/70 hover:text-white"
                    title="Video URL Ekle"
                >
                    <LinkIcon size={18} />
                </button>

                <div className="w-px h-8 bg-white/10 mx-1" />

                {/* Playback Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPlayPause}
                        disabled={isYouTube}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${isYouTube
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-white/10 text-white'
                            }`}
                        title={isYouTube ? "YouTube videoları iframe kontrolleriyle oynatılır" : (isPlaying ? "Pause" : "Play")}
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
                        title={isYouTube ? "YouTube videoları iframe kontrolleriyle kontrol edilir" : "Stop"}
                    >
                        <Square size={16} fill="currentColor" />
                    </button>
                </div>

                <div className="w-px h-8 bg-white/10 mx-1" />

                {/* Drawing Tools */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTool('cursor')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'cursor' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                        title="Etkileşim (Video Kontrolü)"
                    >
                        <MousePointer2 size={18} />
                    </button>
                    <button
                        onClick={() => setTool('pen')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'pen' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                        title="Kalem"
                    >
                        <Pen size={18} />
                    </button>

                    {/* Color Picker Popover */}
                    <div className="group relative">
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                            title="Renk Seç"
                        >
                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl grid grid-cols-5 gap-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0">
                            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#6b7280'].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Brush Size Slider */}
                    <div className="group relative">
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                            title="Kalem Kalınlığı"
                        >
                            <Maximize2 size={16} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 flex flex-col gap-2 w-32">
                            <label className="text-xs text-white/50">Kalınlık: {brushSize}px</label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={brushSize}
                                onChange={(e) => setBrushSize(Number(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(brushSize / 20) * 100}%, transparent ${(brushSize / 20) * 100}%)`
                                }}
                            />
                        </div>
                    </div>                    <button
                        onClick={() => setTool('eraser')}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${tool === 'eraser' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
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

                <div className="w-px h-8 bg-white/10 mx-1" />

                {/* Recording Controls */}
                <div>
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

            </div>

            {/* URL Dialog Modal */}
            {showUrlDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-black/90 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <LinkIcon size={20} />
                                Video URL Ekle
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
                            placeholder="Video URL'sini yapıştır..."
                            value={inputValue}
                            onChange={handleUrlChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all mb-4"
                        />

                        <div className="text-xs text-white/50 mb-4 space-y-1">
                            <p>✓ MP4, WebM, Ogg formatları desteklenir</p>
                            <p>✓ CORS-enabled uzak videolar çalışır</p>
                            <p>• Örnek: https://www.w3schools.com/html/mov_bbb.webm</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCloseDialog}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleUrlSubmit}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
                            >
                                Yükle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Toolbar;
