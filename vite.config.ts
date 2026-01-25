import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['tests/e2e/**', 'node_modules/**']
  }
})
