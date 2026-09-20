const LOCAL_API_URL = 'http://localhost:5000/api'
const PRODUCTION_API_URL =
  'https://backend-qy8xvmnol-dev-track3.vercel.app/api'

function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/$/, '')
}

function isUsableApiUrl(url) {
  if (!url) return false

  try {
    const parsed = new URL(String(url).trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }

    const host = parsed.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return true
    }

    return host.includes('.')
  } catch (error) {
    return false
  }
}

const envApiUrl = import.meta.env.VITE_API_URL

const API_URL = normalizeBaseUrl(
  isUsableApiUrl(envApiUrl)
    ? envApiUrl
    : import.meta.env.PROD
      ? PRODUCTION_API_URL
      : LOCAL_API_URL
)

export default API_URL
export { API_URL }
