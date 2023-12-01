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
      name: 'SvgAnimate',
      fileName: 'index'
    }
  },
  plugins: [react(), dts()]
})
