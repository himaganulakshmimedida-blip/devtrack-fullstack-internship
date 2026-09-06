function Logout({ onLogin }) {
  return (
    <div className="logout-page">

      <div className="logout-card">

        <div className="logout-icon">
          ✓
        </div>

        <h1>Logged out successfully</h1>

        <p>
          You have been safely logged out of DevTrack.
        </p>

        <button onClick={onLogin}>
          Back to Login
        </button>

        <span className="logout-brand">
          DevTrack
        </span>

      </div>

    </div>
  )
}

export default Logout