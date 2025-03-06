import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@mantine/core'],
  },
  plugins: [react()],
  server:{
    host:true
  }
})
