import { useState } from 'react'
import './App.css'
import {
  getPasswordValidation,
  isPasswordValid,
} from './utils/passwordValidation'

const API_URL = 'http://localhost:5000'

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Please enter email and password.')
        return
      }
    } else {
      if (!name.trim() || !email.trim() || !password) {
        setError('Please fill in all signup fields.')
        return
      }

      if (!isPasswordValid(password)) {
        setError('Please meet all password requirements below.')
        return
      }
    }

    try {
      setLoading(true)

      const endpoint =
        mode === 'login' ? '/api/auth/login' : '/api/auth/signup'

      const body =
        mode === 'login'
          ? { email, password }
          : { name, email, password }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      onLogin(data)
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordRules = getPasswordValidation(password)
  const signupPasswordValid = isPasswordValid(password)
  const isSignupDisabled =
    loading || (mode === 'signup' && !signupPasswordValid)

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <span></span>
          DevTrack
        </div>

        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>

        <p className="login-subtitle">
          {mode === 'login'
            ? 'Sign in to manage your projects and tasks.'
            : 'Sign up to start tracking your work in DevTrack.'}
        </p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          {mode === 'signup' && (
            <>
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === 'signup' && (
            <div className="password-requirements">
              <p className="password-requirements-title">
                Password must include:
              </p>
              <ul className="password-requirements-list">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.id}
                    className={
                      rule.satisfied
                        ? 'password-rule satisfied'
                        : 'password-rule unsatisfied'
                    }
                  >
                    <span className="password-rule-icon" aria-hidden="true">
                      {rule.satisfied ? '✓' : '○'}
                    </span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" disabled={isSignupDisabled}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign In'
                : 'Sign Up'}
          </button>

        </form>

        <p className="login-footer">
          {mode === 'login' ? (
            <>
              New to DevTrack?{' '}
              <button
                type="button"
                className="login-link-button"
                onClick={() => {
                  setMode('signup')
                  setError('')
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="login-link-button"
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
              >
                Sign in
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  )
}

export default Login
