import React from 'react';
import { X, Keyboard } from 'lucide-react';
import useStore from '../store/useStore';

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const { settings } = useStore();

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Tools',
      shortcuts: [
        { key: settings.shortcuts.pen, description: 'Pen tool' },
        { key: settings.shortcuts.eraser, description: 'Eraser tool' },
        { key: settings.shortcuts.cursor, description: 'Cursor/Select mode' },
        { key: settings.shortcuts.text, description: 'Text tool' },
        { key: settings.shortcuts.rectangle, description: 'Rectangle tool' },
        { key: settings.shortcuts.circle, description: 'Circle tool' },
        { key: settings.shortcuts.arrow, description: 'Arrow tool' },
        { key: settings.shortcuts.stamp, description: 'Stamp tool' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { key: 'Cmd/Ctrl + Z', description: 'Undo' },
        { key: 'Cmd/Ctrl + Shift + Z', description: 'Redo' },
        { key: 'Cmd/Ctrl + Y', description: 'Redo (alt)' },
        { key: 'Cmd/Ctrl + S', description: 'Save project' },
        { key: 'Cmd/Ctrl + O', description: 'Open file' },
        { key: 'Cmd/Ctrl + E', description: 'Export' },
        { key: 'Delete/Backspace', description: 'Clear canvas' },
      ],
    },
    {
      title: 'Playback',
      shortcuts: [
        { key: 'Space', description: 'Play/Pause' },
        { key: 'Left Arrow', description: 'Previous frame' },
        { key: 'Right Arrow', description: 'Next frame' },
        { key: 'Shift + Left', description: '-1 second' },
        { key: 'Shift + Right', description: '+1 second' },
        { key: 'Home', description: 'Go to start' },
        { key: 'End', description: 'Go to end' },
      ],
    },
    {
      title: 'View',
      shortcuts: [
        { key: 'Cmd/Ctrl + B', description: 'Toggle bookmarks' },
        { key: 'Cmd/Ctrl + L', description: 'Toggle layers' },
        { key: 'Cmd/Ctrl + T', description: 'Toggle timeline' },
        { key: 'Cmd/Ctrl + ,', description: 'Settings' },
        { key: '?', description: 'This help menu' },
        { key: 'Esc', description: 'Close dialogs' },
      ],
    },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 'var(--z-modal)' }}
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-white/10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-white/60 text-sm">Speed up your workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcutGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-white/80 text-sm">{shortcut.description}</span>
                      <kbd className="px-2 py-1 rounded bg-white/10 text-white/90 text-xs font-mono border border-white/20">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 text-center">
          <p className="text-sm text-white/60">
            Press <kbd className="px-2 py-1 rounded bg-white/10 text-white/80 font-mono">?</kbd> anytime to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
