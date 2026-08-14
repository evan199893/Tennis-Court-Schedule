import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isVercel = process.env.VERCEL === '1'

export default defineConfig({
  base: isVercel ? '/' : '/Tennis-Court-Schedule/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
