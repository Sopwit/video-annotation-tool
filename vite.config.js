import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tensorflow-models/coco-ssd')) return 'coco-ssd';
            if (id.includes('@tensorflow/tfjs-core')) return 'tfjs-core';
            if (id.includes('@tensorflow/tfjs-converter')) return 'tfjs-converter';
            if (id.includes('@tensorflow/tfjs-backend-webgl')) return 'tfjs-webgl';
            if (id.includes('@tensorflow/tfjs-backend-cpu')) return 'tfjs-cpu';
            if (id.includes('@tensorflow/tfjs-layers') || id.includes('@tensorflow/tfjs-data')) return 'tfjs-extra';
            if (id.includes('react-player')) return 'player';
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
})
