import React, { useState } from 'react';
import { Trash2, Clock, Play, Search, Edit2, Check, X, Download, FileText, Image as ImageIcon } from 'lucide-react';

const Sidebar = ({ isOpen, bookmarks, onJump, onDelete, onEdit, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const formatTime = (seconds) => {
        const date = new Date(seconds * 1000);
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        return `${mm}:${ss}`;
    };

    const filteredBookmarks = bookmarks.filter(b => 
        b.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startEditing = (bm) => {
        setEditingId(bm.id);
        setEditValue(bm.text);
    };

    const saveEdit = () => {
        if (editingId) {
            onEdit(editingId, editValue);
            setEditingId(null);
        }
    };

    const handleExport = () => {
        const data = JSON.stringify(bookmarks, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `notes-export-${Date.now()}.json`;
        link.href = url;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="w-80 h-full bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-2xl z-50">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Clock size={18} className="text-blue-500" />
                        Video Notes
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">{bookmarks.length}</span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={handleExport}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            title="Export Notes (JSON)"
                        >
                            <Download size={16} />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-white/30 text-sm px-6">
                        <FileText size={32} className="mb-3 opacity-20" />
                        <p>No notes yet.</p>
                        <p className="mt-1 text-xs">Click the bookmark icon in the toolbar to add a note.</p>
                    </div>
                ) : filteredBookmarks.length === 0 ? (
                    <div className="text-center text-white/30 mt-10 text-sm">
                        <p>No matches found.</p>
                    </div>
                ) : (
                    filteredBookmarks.map((bm) => (
                        <div key={bm.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-all">
                            
                            {/* Thumbnail Image (if exists) */}
                            {bm.thumbnail && (
                                <div 
                                    className="relative h-24 bg-black/50 cursor-pointer overflow-hidden"
                                    onClick={() => onJump(bm.time)}
                                >
                                    <img src={bm.thumbnail} alt="Snapshot" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <Play size={24} className="text-white drop-shadow-lg" fill="currentColor" />
                                    </div>
                                    <span className="absolute bottom-1 right-1 text-[10px] font-mono text-white bg-black/70 px-1.5 rounded">
                                        {formatTime(bm.time)}
                                    </span>
                                </div>
                            )}

                            <div className="p-3">
                                {/* Header: Time (if no thumbnail) and Actions */}
                                {!bm.thumbnail && (
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-500/20" onClick={() => onJump(bm.time)}>
                                            {formatTime(bm.time)}
                                        </span>
                                    </div>
                                )}

                                {/* Content */}
                                {editingId === bm.id ? (
                                    <div className="space-y-2">
                                        <textarea 
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                            rows={3}
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingId(null)} className="p-1 text-white/50 hover:text-white">
                                                <X size={14} />
                                            </button>
                                            <button onClick={saveEdit} className="p-1 text-green-400 hover:text-green-300">
                                                <Check size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <p className="text-sm text-white/80 break-words whitespace-pre-wrap">{bm.text}</p>
                                        
                                        {/* Action Buttons (Hover only) */}
                                        <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(bm)}
                                                className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(bm.id)}
                                                className="p-1.5 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;