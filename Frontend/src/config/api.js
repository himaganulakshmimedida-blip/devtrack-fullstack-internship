const API_URL = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export default API_URL
export { API_URL }
