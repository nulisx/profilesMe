import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import {backendUrl} from './src/backendUrl'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 5000
    },
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/auth': {
        target: backendUrl,
        changeOrigin: true
      }
    }
  },
  appType: 'spa'
})