import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This allows you to use '@' as a shortcut for the 'src' folder
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // This redirects frontend requests starting with /api to your Django server
      '/api': {
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})