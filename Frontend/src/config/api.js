const LOCAL_API_URL = 'http://localhost:5000/api'
const PRODUCTION_API_URL =
  'https://backend-qy8xvmnol-dev-track3.vercel.app/api'

const API_URL =
  import.meta.env.DEV === true ? LOCAL_API_URL : PRODUCTION_API_URL

export default API_URL
export { API_URL, PRODUCTION_API_URL, LOCAL_API_URL }
