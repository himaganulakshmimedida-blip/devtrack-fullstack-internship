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
      'Unable to reach the server. Please check your connection and try again.'
    )
  }

  let data = null
  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else if (!response.ok) {
    throw new Error('Backend unavailable. Please try again later.')
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
