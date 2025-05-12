import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // адрес вашего серверного приложения
        changeOrigin: true, // замена origin хедера при необходимости
      },
    },
  },
})