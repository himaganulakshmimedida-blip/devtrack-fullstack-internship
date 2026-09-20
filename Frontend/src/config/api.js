const LOCAL_API_URL = 'http://localhost:5000/api'
const PRODUCTION_API_URL =
  'https://backend-qy8xvmnol-dev-track3.vercel.app/api'

function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/$/, '')
}

const API_URL = normalizeBaseUrl(
  import.meta.env.PROD
    ? PRODUCTION_API_URL
    : import.meta.env.VITE_API_URL || LOCAL_API_URL
)

export default API_URL
export { API_URL }
