import API_URL from '../config/api'
import { clearAuthSession, getAuthToken } from './auth'

export async function apiFetch(path, options = {}) {
  const { skipUnauthorizedHandler = false, ...fetchOptions } = options

  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  }

  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers,
    })
  } catch (error) {
    throw new Error(
      'Unable to reach the server. If this is the live site, disable Vercel Deployment Protection on the backend project, then redeploy both apps.'
    )
  }

  let data = null
  const contentType = response.headers.get('content-type')

  if (response.status === 401 || response.status === 403) {
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(
        'Backend blocked the request (403). Disable Deployment Protection for the backend Vercel project (Settings → Deployment Protection → Disabled / Standard Protection only for preview if needed), then retry Signup.'
      )
    }
  }

  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else if (!response.ok) {
    throw new Error(
      'Backend unavailable. Confirm the API is public and returning JSON, not a Vercel login page.'
    )
  }

  if (response.status === 401 && !skipUnauthorizedHandler) {
    clearAuthSession()
    window.dispatchEvent(new Event('devtrack-unauthorized'))
    throw new Error(data?.message || 'Session expired. Please log in again.')
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`)
  }

  return data
}
