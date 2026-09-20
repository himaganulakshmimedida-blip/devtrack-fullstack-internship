import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const PRODUCTION_API_URL =
  'https://backend-qy8xvmnol-dev-track3.vercel.app/api'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  define:
    command === 'build'
      ? {
          'import.meta.env.VITE_API_URL': JSON.stringify(PRODUCTION_API_URL),
        }
      : {},
}))
