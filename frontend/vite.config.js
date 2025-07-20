import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic'  // 🔧 Esto fuerza el uso del nuevo JSX transform y anula el warning inicial
  }

})
