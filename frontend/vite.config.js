import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React app
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend runs on port 3000
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Proxy API requests to backend
        changeOrigin: true
      }
    }
  }
})


