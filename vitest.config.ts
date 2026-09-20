import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import stylex from '@stylexjs/unplugin'
import {fileURLToPath, URL} from 'node:url'

export default defineConfig({
  plugins: [stylex.vite({useCSSLayers: false, runtimeInjection: true}), react()],
  resolve: {alias: {'@': fileURLToPath(new URL('.', import.meta.url))}},
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    setupFiles: ['./tests/setup.ts'],
    server: {deps: {inline: [/@astryxdesign/, /@stylexjs/]}},
  },
})
