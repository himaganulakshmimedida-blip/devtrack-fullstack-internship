import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const frontendRoot = dirname(fileURLToPath(import.meta.url))

function readViteApiUrl(fileName) {
  const filePath = join(frontendRoot, fileName)
  if (!existsSync(filePath)) return ''

  const line = readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .find((row) => row.startsWith('VITE_API_URL='))

  return line ? line.slice('VITE_API_URL='.length).trim() : ''
}

export default defineConfig(({ command }) => {
  const apiUrl =
    command === 'build'
      ? readViteApiUrl('.env.production')
      : readViteApiUrl('.env.development') || readViteApiUrl('.env')

  return {
    plugins: [react()],
    define: apiUrl
      ? {
          'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
        }
      : {},
  }
})
