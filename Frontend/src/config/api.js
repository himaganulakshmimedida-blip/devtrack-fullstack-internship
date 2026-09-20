const LOCAL_API_URL = 'http://localhost:5000/api'
const PRODUCTION_API_URL =
  'https://backend-qy8xvmnol-dev-track3.vercel.app/api'

function normalizeBaseUrl(url) {
  return url.replace(/\/$/, '')
}

export const API_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? PRODUCTION_API_URL : LOCAL_API_URL)
)

export const API_ROOT_URL =
  API_URL.replace(/\/api$/, '') ||
  (import.meta.env.PROD
    ? 'https://backend-qy8xvmnol-dev-track3.vercel.app'
    : 'http://localhost:5000')
