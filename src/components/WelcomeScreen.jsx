import React, { useState } from 'react';
import { Video, Upload, FolderOpen, Sparkles, ArrowRight } from 'lucide-react';

const WelcomeScreen = ({ onLoadVideo, onOpenRecent }) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      onLoadVideo(url);
    }
  };

  const recentProjects = [
    { id: 1, name: 'Tutorial Recording', date: '2 hours ago', thumbnail: null },
    { id: 2, name: 'Product Demo', date: 'Yesterday', thumbnail: null },
    { id: 3, name: 'Team Meeting', date: '2 days ago', thumbnail: null },
  ];

  const templates = [
    { id: 1, name: 'Education', icon: '📚', description: 'Perfect for lessons & tutorials' },
    { id: 2, name: 'Sports Analysis', icon: '⚽', description: 'Track player movements' },
    { id: 3, name: 'Product Review', icon: '📦', description: 'Highlight features' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/30">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Video Annotation Tool
          </h1>
          <p className="text-white/60 text-lg">
            Professional video markup for education, sports, and content creation
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            className="group relative h-64 rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <input
              id="file-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  onLoadVideo(url);
                }
              }}
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Open Local Video
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Drag & drop a video file here or click to browse
              </p>
              <div className="flex gap-2 text-xs text-white/40">
                <span>MP4</span>
                <span>•</span>
                <span>WebM</span>
                <span>•</span>
                <span>MOV</span>
                <span>•</span>
                <span>AVI</span>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
          </div>

          {/* URL Input */}
          <div
            className="group relative h-64 rounded-2xl border-2 border-white/10 bg-white/5 transition-all duration-300 overflow-hidden"
          >
            {showUrlInput ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-md z-10 animate-in fade-in zoom-in duration-300">
                  <h3 className="text-xl font-semibold text-white mb-4">Enter Video URL</h3>
                  <input
                    type="text"
                    placeholder="https://youtube.com/..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 mb-4"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && urlInput.trim()) {
                        onLoadVideo(urlInput.trim());
                      }
                      if (e.key === 'Escape') {
                        setShowUrlInput(false);
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUrlInput(false);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (urlInput.trim()) onLoadVideo(urlInput.trim());
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium shadow-lg shadow-purple-500/20 transition-colors"
                    >
                      Load
                    </button>
                  </div>
               </div>
            ) : (
              <div 
                onClick={() => setShowUrlInput(true)}
                className="absolute inset-0 cursor-pointer hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Video className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Load from URL
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    Paste a video URL from YouTube or direct link
                  </p>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60">
                    https://youtube.com/watch?v=...
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="mb-12 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Recent Projects
              </h2>
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onOpenRecent(project)}
                  className="group text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all"
                >
                  <div className="aspect-video rounded-lg bg-white/5 mb-3 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white/40" />
                  </div>
                  <h3 className="font-medium text-white mb-1 truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-white/40">{project.date}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Templates */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">
              Quick Start Templates
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                className="group text-left p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="font-semibold text-white mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-white/60">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Tips */}
        <div className="mt-12 text-center text-sm text-white/40">
          <p>
            Press <kbd className="px-2 py-1 rounded bg-white/10 text-white/60 font-mono">Cmd/Ctrl + O</kbd> to open a file
            {' • '}
            Press <kbd className="px-2 py-1 rounded bg-white/10 text-white/60 font-mono">?</kbd> for keyboard shortcuts
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
