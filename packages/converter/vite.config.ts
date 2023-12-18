import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  root: '.',
  base: './',
  server: { host: 'localhost', port: 8080 },
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/index.ts',
      name: 'SvgAnimateConverter',
      fileName: 'index'
    }
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  plugins: [react(), dts()],
  worker: {
    format: 'es'
  }
})
