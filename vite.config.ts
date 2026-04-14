import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@tanstack')) return 'query-vendor'
          if (id.includes('lodash')) return 'lodash-vendor'
          if (id.includes('zod') || id.includes('react-hook-form') || id.includes('@hookform')) return 'form-vendor'
          return 'vendor'
        }
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
})
