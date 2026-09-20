const DEFAULT_API_URL = 'http://localhost:5000/api'

function normalizeBaseUrl(url) {
  return url.replace(/\/$/, '')
}

export const API_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
)

export const API_ROOT_URL =
  API_URL.replace(/\/api$/, '') || 'http://localhost:5000'
