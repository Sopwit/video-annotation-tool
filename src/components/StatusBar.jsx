import React from 'react';
import { Layers, Clock, Zap, HardDrive } from 'lucide-react';
import useStore from '../store/useStore';

const StatusBar = ({ videoName, fps = 30, storageUsed = '12.5 MB' }) => {
  const { layers, currentLayer, tool } = useStore();
  
  const activeLayer = layers.find(l => l.id === currentLayer);
  const visibleLayersCount = layers.filter(l => l.visible).length;

  const stats = [
    {
      icon: Layers,
      label: `${visibleLayersCount}/${layers.length} Layers`,
      tooltip: `Active: ${activeLayer?.name || 'None'}`,
    },
    {
      icon: Clock,
      label: `${fps} FPS`,
      tooltip: 'Frames per second',
    },
    {
      icon: Zap,
      label: tool.charAt(0).toUpperCase() + tool.slice(1),
      tooltip: 'Active tool',
    },
    {
      icon: HardDrive,
      label: storageUsed,
      tooltip: 'Project size',
    },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-6 bg-black/60 backdrop-blur-md border-t border-white/5 px-4 flex items-center justify-between text-xs text-white/60"
      style={{ zIndex: 5 }}
    >
      {/* Left side - Video info */}
      <div className="flex items-center gap-4">
        {videoName && (
          <span className="text-white/80 font-medium truncate max-w-xs">
            {videoName}
          </span>
        )}
      </div>

      {/* Right side - Stats */}
      <div className="flex items-center gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 hover:text-white/90 transition-colors cursor-default"
            title={stat.tooltip}
          >
            <stat.icon className="w-3 h-3" />
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
