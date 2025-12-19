import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react';
import useStore from '../store/useStore';

const LayerManager = () => {
  const { layers, currentLayer, addLayer, removeLayer, updateLayer, setCurrentLayer } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  
  const handleAddLayer = () => {
    addLayer();
  };
  
  const handleRemoveLayer = (layerId) => {
    if (layers.length > 1) {
      removeLayer(layerId);
    }
  };
  
  const handleToggleVisibility = (layer) => {
    updateLayer(layer.id, { visible: !layer.visible });
  };
  
  const handleToggleLock = (layer) => {
    updateLayer(layer.id, { locked: !layer.locked });
  };
  
  const handleOpacityChange = (layer, opacity) => {
    updateLayer(layer.id, { opacity: parseFloat(opacity) });
  };
  
  const handleStartEdit = (layer) => {
    setEditingId(layer.id);
    setEditName(layer.name);
  };
  
  const handleFinishEdit = (layerId) => {
    if (editName.trim()) {
      updateLayer(layerId, { name: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };
  
  const moveLayer = (fromIndex, toIndex) => {
    // This would require additional store logic
    console.log('Move layer from', fromIndex, 'to', toIndex);
  };
  
  return (
    <div className="w-64 bg-black/40 backdrop-blur-sm border-l border-white/10 p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Layers</h3>
        <button
          onClick={handleAddLayer}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
          title="Add new layer"
        >
          <Plus className="w-4 h-4 text-white/60 group-hover:text-white" />
        </button>
      </div>
      
      {/* Layer List */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {[...layers].reverse().map((layer, index) => {
          const actualIndex = layers.length - 1 - index;
          const isActive = layer.id === currentLayer;
          const isEditing = editingId === layer.id;
          
          return (
            <div
              key={layer.id}
              className={`p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              onClick={() => setCurrentLayer(layer.id)}
            >
              {/* Layer Header */}
              <div className="flex items-center justify-between mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleFinishEdit(layer.id)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit(layer.id)}
                    className="flex-1 bg-white/10 text-white text-sm px-2 py-1 rounded outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 text-sm text-white font-medium cursor-pointer"
                    onDoubleClick={() => handleStartEdit(layer)}
                  >
                    {layer.name}
                  </span>
                )}
                
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(layer);
                    }}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                  >
                    {layer.visible ? (
                      <Eye className="w-3.5 h-3.5 text-white/60" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-white/40" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(layer);
                    }}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                  >
                    {layer.locked ? (
                      <Lock className="w-3.5 h-3.5 text-white/60" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-white/40" />
                    )}
                  </button>
                  
                  {layers.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLayer(layer.id);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      title="Delete layer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Opacity Control */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>Opacity</span>
                  <span>{Math.round(layer.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={layer.opacity}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleOpacityChange(layer, e.target.value);
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              {/* Layer Order Controls */}
              {layers.length > 1 && (
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(actualIndex, actualIndex - 1);
                    }}
                    disabled={actualIndex === layers.length - 1}
                    className="flex-1 p-1 text-xs bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                  >
                    <ChevronUp className="w-3 h-3 mx-auto text-white/60" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(actualIndex, actualIndex + 1);
                    }}
                    disabled={actualIndex === 0}
                    className="flex-1 p-1 text-xs bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                  >
                    <ChevronDown className="w-3 h-3 mx-auto text-white/60" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Info */}
      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
        <div className="flex justify-between">
          <span>Total Layers:</span>
          <span className="text-white/60">{layers.length}</span>
        </div>
        <div className="mt-1 text-[10px] text-white/30">
          Double-click layer name to rename
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default LayerManager;
