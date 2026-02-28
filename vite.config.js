import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 相对路径，适用于GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 生产环境不生成sourcemap
    rollupOptions: {
      output: {
        manualChunks: {
          // 代码分割优化
          'react-vendor': ['react', 'react-dom'],
          'dropzone': ['react-dropzone']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})