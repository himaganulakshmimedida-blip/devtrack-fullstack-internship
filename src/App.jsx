import { useEffect, useState } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import ProjectCard from './components/ProjectCard'
import TaskCard from './components/TaskCard'
import Login from './Login'
import Logout from './Logout'
import Projects from './Projects'
import Tasks from './Tasks'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [showLogout, setShowLogout] = useState(false)

  const [currentPage, setCurrentPage] = useState(
    window.location.hash.replace('#', '') || 'dashboard'
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      const page =
        window.location.hash.replace('#', '') || 'dashboard'

      setCurrentPage(page)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleLogin = (user) => {
    setUsername(user)
    setIsLoggedIn(true)
    setShowLogout(false)

    window.location.hash = 'dashboard'
  }

  const handleLogout = () => {
    setUsername('')
    setIsLoggedIn(false)
    setShowLogout(true)

    window.location.hash = ''
  }

  const projects = [
    {
      id: 1,
      name: 'Portfolio Website',
      description: 'Build and deploy a personal portfolio.',
      progress: 75,
    },
    {
      id: 2,
      name: 'E-Commerce Website',
      description: 'Develop an online shopping platform.',
      progress: 45,
    },
  ]

  const tasks = [
    {
      id: 1,
      title: 'Create Login Page',
      project: 'Portfolio Website',
      priority: 'High',
      status: 'Done',
    },
    {
      id: 2,
      title: 'Design Database',
      project: 'E-Commerce Website',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Build Product Page',
      project: 'E-Commerce Website',
      priority: 'Low',
      status: 'Todo',
    },
  ]

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (showLogout) {
    return (
      <Logout
        onLogin={() => {
          setShowLogout(false)
          setIsLoggedIn(false)
        }}
      />
    )
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  if (currentPage === 'projects') {
    return (
      <Projects
        username={username}
        onLogout={handleLogout}
      />
    )
  }

  if (currentPage === 'tasks') {
    return (
      <Tasks
        username={username}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="app">

      <Navbar
        username={username}
        onLogout={handleLogout}
        currentPage="dashboard"
      />

      <main className="dashboard">

        <div className="welcome">
          <h1>Developer Productivity Dashboard</h1>
          <p>
            Manage your projects and tasks in one place.
          </p>
        </div>

        <section className="stats">

          <div className="stat-card">
            <h3>Total Projects</h3>
            <strong>4</strong>
          </div>

          <div className="stat-card">
            <h3>Total Tasks</h3>
            <strong>20</strong>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <strong>12</strong>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <strong>5</strong>
          </div>

        </section>

        <section className="projects">

          <h2>My Projects</h2>

          <div className="project-list">

            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                description={project.description}
                progress={project.progress}
              />
            ))}

          </div>

        </section>

        <section className="tasks">

          <h2>My Tasks</h2>

          <div className="task-controls">

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

          </div>

          <div className="task-list">

            {loading ? (
              <div className="loading-state">
                <p>Loading tasks...</p>
              </div>
            ) : (
              <>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    project={task.project}
                    priority={task.priority}
                    status={task.status}
                  />
                ))}

                {filteredTasks.length === 0 && (
                  <div className="empty-state">
                    <h3>No tasks found</h3>
                    <p>
                      Try changing your search or status filter.
                    </p>
                  </div>
                )}
              </>
            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default App