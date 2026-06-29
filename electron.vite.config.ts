import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve(__dirname, 'electron/main.ts'),
        formats: ['cjs']
      },
      outDir: resolve(__dirname, 'out/main')
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve(__dirname, 'electron/preload.ts'),
        formats: ['cjs']
      },
      outDir: resolve(__dirname, 'out/preload')
    }
  },
  renderer: {
    root: resolve(__dirname, '.'),
    build: {
      outDir: resolve(__dirname, 'out/renderer'),
      rollupOptions: {
        input: resolve(__dirname, 'index.html')
      }
    },
    plugins: [react()]
  }
})
