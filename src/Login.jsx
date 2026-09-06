import { useState } from 'react'
import './App.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username || !password) {
      alert('Please enter username and password')
      return
    }

    onLogin(username)
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <span></span>
          DevTrack
        </div>

        <h1>Welcome back</h1>

        <p className="login-subtitle">
          Sign in to manage your projects and tasks.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Sign In
          </button>

        </form>

        <p className="login-footer">
          Developer Productivity Platform
        </p>

      </div>
    </div>
  )
}

export default Login