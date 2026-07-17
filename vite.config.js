import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        translate: path.resolve(__dirname, 'translate-youtube-transcript.html'),
        download: path.resolve(__dirname, 'download-youtube-subtitles.html'),
        playlist: path.resolve(__dirname, 'youtube-playlist-transcript.html'),
        pricing: path.resolve(__dirname, 'pricing.html'),
      },
    },
  },
})
