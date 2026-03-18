import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Keyboard, Palette, Zap, HardDrive } from 'lucide-react';
import useStore from '../store/useStore';
import { clearAllStorage, exportAllData, getStorageEstimate, formatBytes } from '../utils/storageUtils';
import { getAllProjects } from '../services/database';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { settings, theme, updateSettings, setTheme, updateShortcut, addToast } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [storageStats, setStorageStats] = useState(null);
  const [storageLoading, setStorageLoading] = useState(false);
  
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const fetchStorageData = async () => {
      setStorageLoading(true);
      try {
        const [estimate, projects] = await Promise.all([
          getStorageEstimate(),
          getAllProjects(),
        ]);
        if (!active) return;
        setStorageStats(estimate);
        setProjectCount(projects.length);
      } catch (error) {
        console.error('Failed to load storage stats:', error);
      } finally {
        if (active) setStorageLoading(false);
      }
    };

    fetchStorageData();
    return () => {
      active = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  const handleShortcutEdit = (action, event) => {
    event.preventDefault();
    const key = event.key.toLowerCase();
    const ignoredKeys = ['control', 'shift', 'alt', 'meta', 'escape', 'enter', 'tab'];
    if (ignoredKeys.includes(key)) {
      if (key === 'escape') setEditingShortcut(null);
      return;
    }
    const modifiers = [];
    
    if (event.ctrlKey || event.metaKey) modifiers.push('mod');
    if (event.shiftKey) modifiers.push('shift');
    if (event.altKey) modifiers.push('alt');
    
    const shortcut = modifiers.length > 0 
      ? `${modifiers.join('+')}+${key}`
      : key;
    
    updateShortcut(action, shortcut);
    setEditingShortcut(null);
  };
  
  const tabs = [
    { id: 'general', name: 'General', icon: Zap },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'shortcuts', name: 'Shortcuts', icon: Keyboard },
    { id: 'storage', name: 'Storage', icon: HardDrive },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        {/* Tabs + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-white/10 p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                  
                  {/* Auto-save */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Auto-save</div>
                        <div className="text-sm text-white/40">Automatically save your work</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.autoSave}
                          onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-full h-full bg-white/10 rounded-full peer-checked:bg-blue-500 transition-colors cursor-pointer"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>
                    
                    {settings.autoSave && (
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Auto-save interval (seconds)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="600"
                          value={settings.autoSaveInterval / 1000}
                          onChange={(e) => updateSettings({ autoSaveInterval: parseInt(e.target.value) * 1000 })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Show Tooltips */}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <div className="text-white font-medium">Show Tooltips</div>
                      <div className="text-sm text-white/40">Display helpful tooltips</div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={settings.showTooltips}
                        onChange={(e) => updateSettings({ showTooltips: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-white/10 rounded-full peer-checked:bg-blue-500 transition-colors cursor-pointer"></div>
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                  
                  {/* Show Grid */}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <div className="text-white font-medium">Show Grid</div>
                      <div className="text-sm text-white/40">Display alignment grid</div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={settings.showGrid}
                        onChange={(e) => updateSettings({ showGrid: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-white/10 rounded-full peer-checked:bg-blue-500 transition-colors cursor-pointer"></div>
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                  
                  {/* Snap to Grid */}
                  {settings.showGrid && (
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <div className="text-white font-medium">Snap to Grid</div>
                        <div className="text-sm text-white/40">Snap annotations to grid</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.snapToGrid}
                          onChange={(e) => updateSettings({ snapToGrid: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-full h-full bg-white/10 rounded-full peer-checked:bg-blue-500 transition-colors cursor-pointer"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
                
                <div>
                  <label className="block text-sm text-white/60 mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-black rounded mb-2"></div>
                      <div className="text-white text-sm font-medium">Dark</div>
                    </button>
                    
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-br from-gray-200 to-white rounded mb-2"></div>
                      <div className="text-white text-sm font-medium">Light (Coming Soon)</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Shortcuts Tab */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
                
                <div className="space-y-2">
                  {Object.entries(settings.shortcuts).map(([action, shortcut]) => (
                    <div key={action} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white capitalize">{action.replace(/([A-Z])/g, ' $1')}</span>
                      {editingShortcut === action ? (
                        <input
                          type="text"
                          value="Press a key..."
                          onKeyDown={(e) => handleShortcutEdit(action, e)}
                          onBlur={() => setEditingShortcut(null)}
                          autoFocus
                          className="px-3 py-1 bg-white/10 border border-blue-500 rounded text-white text-sm outline-none"
                        />
                      ) : (
                        <button
                          onClick={() => setEditingShortcut(action)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/80 text-sm font-mono transition-colors"
                        >
                          {shortcut}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    Click on a shortcut to edit it. Press Escape to cancel.
                  </p>
                </div>
              </div>
            )}
            
            {/* Storage Tab */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Storage & Data</h3>
                
                <div className="p-4 bg-white/5 rounded-lg space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Projects Saved</span>
                    <span className="text-white font-mono">{storageLoading ? '...' : projectCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Storage Used</span>
                    <span className="text-white font-mono">
                      {storageLoading ? '...' : (storageStats ? formatBytes(storageStats.usage) : 'Unknown')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Storage Quota</span>
                    <span className="text-white font-mono">
                      {storageLoading ? '...' : (storageStats ? formatBytes(storageStats.quota) : 'Unknown')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={async () => {
                      const ok = await exportAllData();
                      addToast({
                        type: ok ? 'success' : 'error',
                        message: ok ? 'Data exported successfully' : 'Failed to export data',
                      });
                    }}
                    className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 font-medium transition-colors"
                  >
                    Export All Data
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm('This will clear all local app data. Continue?')) return;
                      const ok = await clearAllStorage();
                      addToast({
                        type: ok ? 'success' : 'error',
                        message: ok ? 'All local data cleared' : 'Failed to clear local data',
                      });
                      if (ok) {
                        setProjectCount(0);
                        setStorageStats(await getStorageEstimate());
                      }
                    }}
                    className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 font-medium transition-colors"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={() => {
              // Reset to defaults
              if (confirm('Reset all settings to default?')) {
                updateSettings({
                  autoSave: true,
                  autoSaveInterval: 60000,
                  showTooltips: true,
                  showGrid: false,
                  snapToGrid: false,
                });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
