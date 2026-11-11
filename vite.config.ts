import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'

const packageJson: { version: string } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
)

export default defineConfig({
  plugins: [react()],

  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },

  server: {
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
})