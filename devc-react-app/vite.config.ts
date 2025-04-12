import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     // ✅ Correct location
    port: 5173,     // Optional but makes intent clear
  },
})
