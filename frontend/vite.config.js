import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
//   base: '/',  // <- Aquí pones '/' si es raíz, '/app/' si no lo es
//      / → sirve la app en la raíz del dominio (ej: https://midominio.com/) (POR DEFECTO)
//      /app/ → sirve la app en un subpath (ej: https://midominio.com/app/)
//      Como en nuestro nginx.conf la app se sirve desde la raíz (/), no hace falta cambiar nada. ✅
  plugins: [react()],
  esbuild: {
    jsx: 'automatic'  // 🔧 Esto fuerza el uso del nuevo JSX transform y anula el warning inicial
  }

})
