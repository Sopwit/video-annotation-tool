import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Bookmark } from 'lucide-react';
import useStore from '../store/useStore';

const Timeline = ({ videoRef, onSeek }) => {
  const { duration, progress, bookmarks, isPlaying } = useStore();
  const [hoveredTime, setHoveredTime] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef(null);
  
  const handleTimelineClick = (e) => {
    if (!timelineRef.current || duration === 0) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    
    onSeek(time);
  };
  
  const handleMouseMove = (e) => {
    if (!timelineRef.current || duration === 0) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    setHoveredTime(time);
    
    if (isDragging) {
      onSeek(time);
    }
  };
  
  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;
  
  return (
    <div className="w-full bg-black/80 backdrop-blur-sm border-t border-white/10 p-4">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Time Display */}
        <div className="flex items-center justify-between text-sm text-white/60">
          <span className="font-mono">{formatTime(progress)}</span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
        
        {/* Timeline Bar */}
        <div
          ref={timelineRef}
          className="relative h-16 bg-white/5 rounded-lg cursor-pointer group"
          onClick={handleTimelineClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseLeave={() => setHoveredTime(null)}
        >
          {/* Progress Bar */}
          <div
            className="absolute top-0 left-0 h-full bg-blue-500/30 rounded-lg transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* Bookmarks */}
          {bookmarks.map((bookmark) => {
            const position = duration > 0 ? (bookmark.time / duration) * 100 : 0;
            return (
              <div
                key={bookmark.id}
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 cursor-pointer group/bookmark"
                style={{ left: `${position}%` }}
                title={bookmark.text || bookmark.note}
              >
                <div className="absolute -top-1 -left-1.5 opacity-0 group-hover/bookmark:opacity-100 transition-opacity">
                  <Bookmark className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                
                {/* Bookmark Tooltip */}
                <div className="absolute bottom-full mb-2 -left-16 w-32 opacity-0 group-hover/bookmark:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/90 text-white text-xs p-2 rounded shadow-lg">
                    <div className="font-mono">{formatTime(bookmark.time)}</div>
                    <div className="text-white/60 truncate">{bookmark.text || bookmark.note}</div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50"
            style={{ left: `${progressPercentage}%` }}
          >
            <div className="absolute top-0 -left-2 w-5 h-5 bg-white rounded-full shadow-lg" />
          </div>
          
          {/* Hover Indicator */}
          {hoveredTime !== null && (
            <div className="absolute -top-8 bg-black/90 text-white text-xs px-2 py-1 rounded font-mono pointer-events-none"
              style={{ left: `${(hoveredTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
            >
              {formatTime(hoveredTime)}
            </div>
          )}
          
          {/* Time Markers */}
          <div className="absolute inset-0 flex items-end pb-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const position = (i / 9) * 100;
              const time = (i / 9) * duration;
              return (
                <div
                  key={i}
                  className="absolute bottom-0 h-2 w-px bg-white/20"
                  style={{ left: `${position}%` }}
                >
                  {i % 3 === 0 && (
                    <span className="absolute top-full mt-1 -left-4 text-[10px] text-white/40 font-mono">
                      {formatTime(time)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Frame Navigation (if duration known) */}
        {duration > 0 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onSeek(Math.max(0, progress - 1/30))} // -1 frame at 30fps
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Previous frame"
            >
              <SkipBack className="w-4 h-4 text-white/60" />
            </button>
            
            <button
              onClick={() => onSeek(Math.max(0, progress - 1))}
              className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 text-xs"
              title="Back 1 second"
            >
              -1s
            </button>
            
            <div className="px-3 py-1 bg-white/5 rounded text-xs font-mono text-white/60">
              Frame {Math.floor(progress * 30)} / {Math.floor(duration * 30)}
            </div>
            
            <button
              onClick={() => onSeek(Math.min(duration, progress + 1))}
              className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 text-xs"
              title="Forward 1 second"
            >
              +1s
            </button>
            
            <button
              onClick={() => onSeek(Math.min(duration, progress + 1/30))} // +1 frame at 30fps
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Next frame"
            >
              <SkipForward className="w-4 h-4 text-white/60" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
