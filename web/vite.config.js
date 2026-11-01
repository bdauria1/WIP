import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const pocketbase = { target: 'http://127.0.0.1:8090', changeOrigin: true }

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api/': pocketbase,
      '/_/': pocketbase,
    },
  },
})
