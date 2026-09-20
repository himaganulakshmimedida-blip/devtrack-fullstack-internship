const AUTH_TOKEN_KEY = 'authToken'

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthSession(user, token) {
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('authToken', token)
  localStorage.setItem('username', user.name || '')
  localStorage.setItem('userId', String(user.id))
  localStorage.setItem('userEmail', user.email || '')
}

export function clearAuthSession() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('authToken')
  localStorage.removeItem('username')
  localStorage.removeItem('userId')
  localStorage.removeItem('userEmail')
}

export function hasAuthSession() {
  return (
    localStorage.getItem('isLoggedIn') === 'true' && !!getAuthToken()
  )
}
