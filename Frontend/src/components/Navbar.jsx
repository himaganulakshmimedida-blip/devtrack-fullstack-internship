function Navbar({ username, onLogout, currentPage }) {
  const navigate = (page) => {
    window.location.hash = page
  }

  return (
    <header className="navbar">

      <h2>DevTrack</h2>

      <nav>

        <button
          className={currentPage === 'dashboard' ? 'nav-active' : ''}
          onClick={() => navigate('dashboard')}
        >
          Dashboard
        </button>

        <button
          className={currentPage === 'projects' ? 'nav-active' : ''}
          onClick={() => navigate('projects')}
        >
          Projects
        </button>

        <button
          className={currentPage === 'tasks' ? 'nav-active' : ''}
          onClick={() => navigate('tasks')}
        >
          Tasks
        </button>

      </nav>

      <div className="profile">

        <span>
          {username
            ? username.charAt(0).toUpperCase()
            : 'U'}
        </span>

        <p>{username}</p>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </header>
  )
}

export default Navbar