import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    
    rollupOptions: {
      input: './index.html', // Ensure this path is correct
    },
  },
})
