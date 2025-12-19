import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Video State
      videoUrl: '',
      isPlaying: false,
      duration: 0,
      progress: 0,
      isYouTube: false,
      
      // Tool State
      tool: 'pen',
      color: '#ef4444',
      brushSize: 2,
      activeStamp: '✅',
      
      // Canvas State
      currentLayer: 0,
      layers: [
        { id: 0, name: 'Layer 1', visible: true, opacity: 1, locked: false }
      ],
      
      // Bookmarks
      bookmarks: [],
      
      // UI State
      isSidebarOpen: false,
      theme: 'dark',
      showTimeline: false,
      showMinimap: false,
      
      // Recording State
      isRecording: false,
      
      // Settings
      settings: {
        autoSave: true,
        autoSaveInterval: 60000, // 1 minute
        shortcuts: {
          pen: 'p',
          eraser: 'e',
          cursor: 'c',
          text: 't',
          rectangle: 'r',
          circle: 'o',
          arrow: 'a',
          stamp: 's',
          undo: 'mod+z',
          redo: 'mod+shift+z',
        },
        showTooltips: true,
        showGrid: false,
        snapToGrid: false,
      },
      
      // Recent Files
      recentFiles: [],
      
      // Actions
      setVideoUrl: (url) => set({ videoUrl: url, isYouTube: /youtube|youtu\.be/.test(url) }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setDuration: (duration) => set({ duration }),
      setProgress: (progress) => set({ progress }),
      
      setTool: (tool) => set({ tool }),
      setColor: (color) => set({ color }),
      setBrushSize: (size) => set({ brushSize: size }),
      setActiveStamp: (stamp) => set({ activeStamp: stamp }),
      
      // Layer Management
      addLayer: () => set((state) => {
        const newId = Math.max(...state.layers.map(l => l.id), 0) + 1;
        return {
          layers: [...state.layers, {
            id: newId,
            name: `Layer ${newId + 1}`,
            visible: true,
            opacity: 1,
            locked: false
          }],
          currentLayer: newId
        };
      }),
      
      removeLayer: (layerId) => set((state) => ({
        layers: state.layers.filter(l => l.id !== layerId),
        currentLayer: state.layers[0]?.id || 0
      })),
      
      updateLayer: (layerId, updates) => set((state) => ({
        layers: state.layers.map(l => l.id === layerId ? { ...l, ...updates } : l)
      })),
      
      setCurrentLayer: (layerId) => set({ currentLayer: layerId }),
      
      // Bookmark Management
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [...state.bookmarks, bookmark].sort((a, b) => a.time - b.time)
      })),
      
      updateBookmark: (id, updates) => set((state) => ({
        bookmarks: state.bookmarks.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      
      deleteBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== id)
      })),
      
      // UI Actions
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setTheme: (theme) => set({ theme }),
      toggleTimeline: () => set((state) => ({ showTimeline: !state.showTimeline })),
      toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
      
      // Recording Actions
      setIsRecording: (recording) => set({ isRecording: recording }),
      
      // Settings Actions
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      updateShortcut: (action, key) => set((state) => ({
        settings: {
          ...state.settings,
          shortcuts: { ...state.settings.shortcuts, [action]: key }
        }
      })),
      
      // Recent Files
      addRecentFile: (file) => set((state) => {
        const exists = state.recentFiles.find(f => f.path === file.path);
        if (exists) {
          return {
            recentFiles: [
              { ...file, lastOpened: Date.now() },
              ...state.recentFiles.filter(f => f.path !== file.path)
            ].slice(0, 10)
          };
        }
        return {
          recentFiles: [
            { ...file, lastOpened: Date.now() },
            ...state.recentFiles
          ].slice(0, 10)
        };
      }),
      
      clearRecentFiles: () => set({ recentFiles: [] }),
      
      // Reset
      reset: () => set({
        videoUrl: '',
        isPlaying: false,
        duration: 0,
        progress: 0,
        tool: 'pen',
        bookmarks: [],
        currentLayer: 0,
        layers: [
          { id: 0, name: 'Layer 1', visible: true, opacity: 1, locked: false }
        ],
      }),
    }),
    {
      name: 'video-annotation-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
        recentFiles: state.recentFiles,
      }),
    }
  )
);

export default useStore;
