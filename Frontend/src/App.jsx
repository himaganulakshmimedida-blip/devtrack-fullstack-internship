import { useEffect, useState } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import ProjectCard from './components/ProjectCard'
import TaskCard from './components/TaskCard'
import Login from './Login'
import Logout from './logout'
import Projects from './projects'
import Tasks from './Tasks'
const API_URL = 'http://localhost:5000'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem('isLoggedIn') === 'true'
)
  const [username, setUsername] = useState(
  localStorage.getItem('username') || ''
)
  const [showLogout, setShowLogout] = useState(false)

  const [currentPage, setCurrentPage] = useState(
    window.location.hash.replace('#', '') || 'dashboard'
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
 const [loading, setLoading] = useState(false)
const [dataLoading, setDataLoading] = useState(true)

const [projects, setProjects] = useState([])
const [tasks, setTasks] = useState([])

const [aiPrompt, setAiPrompt] = useState('')
const [aiResponse, setAiResponse] = useState('')
const [aiTasks, setAiTasks] = useState([])


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
  useEffect(() => {
  setDataLoading(true)

  Promise.all([
    fetch(`${API_URL}/api/projects`).then((response) => response.json()),
    fetch(`${API_URL}/api/tasks`).then((response) => response.json())
  ])
    .then(([projectsData, tasksData]) => {
      setProjects(projectsData)
      setTasks(tasksData)
    })
    .catch((error) => {
      console.error('Failed to fetch data:', error)
    })
    .finally(() => {
      setDataLoading(false)
    })
}, [])
    useEffect(() => {
    fetch(`${API_URL}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Backend connected:', data)
      })
      .catch((error) => {
        console.error('Backend connection failed:', error)
      })
  }, [])

  const handleLogin = (user) => {
  setUsername(user)
  setIsLoggedIn(true)
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('username', user)
  setShowLogout(false)

  window.location.hash = 'dashboard'
}
  const handleLogout = () => {
  setUsername('')
  setIsLoggedIn(false)
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  setShowLogout(true)

  window.location.hash = ''
}
  const handleStatusChange = async (taskId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update task')
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    )
  } catch (error) {
    console.error('Status update failed:', error)
    alert('Failed to update task status')
  }
}

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
            <strong>{projects.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Total Tasks</h3>
           <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <strong>
  {tasks.filter((task) => task.status === 'Done').length}
</strong>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
           <strong>
  {tasks.filter((task) => task.status === 'In Progress').length}
</strong>
          </div>

        </section>
        <section className="ai-section">

  <h2>🤖 AI Task Generator</h2>

  <p>
    Ask AI to generate tasks for your project.
  </p>

  <textarea
    placeholder="Example: Give me 3 high priority tasks for an e-commerce website."
    value={aiPrompt}
    onChange={(e) => setAiPrompt(e.target.value)}
    rows="4"
  />

  <button
    onClick={async () => {
      if (!aiPrompt.trim()) {
        alert('Please enter a prompt.')
        return
      }

      try {
        setLoading(true)
        setAiResponse('')

        const response = await fetch(`${API_URL}/api/ai`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: aiPrompt,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'AI request failed')
        }

        setAiResponse(data.answer)
        setAiTasks(data.answer)
      } catch (error) {
        console.error('AI Error:', error)
        setAiResponse('Unable to generate AI response.')
      } finally {
        setLoading(false)
      }
    }}
  >
    {loading ? 'Generating...' : 'Generate AI Tasks'}
  </button>

 {aiResponse && (
  <div className="ai-response">
    <h3>AI Response</h3>

    <pre>{aiResponse}</pre>

   <button
  onClick={async () => {
    try {
      const matches = [...aiTasks.matchAll(/\d+\.\s*\*\*(.*?)\*\*/g)]

      const taskTitles = matches.map((match) => match[1].trim())

      if (taskTitles.length === 0) {
        alert('Could not find separate AI tasks.')
        return
      }

      const createdTasks = []

      for (const title of taskTitles) {
        const response = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            project: 'AI Generated Project',
            priority: 'High',
            status: 'Todo',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to add task')
        }

        createdTasks.push(data)
      }

      setTasks((prevTasks) => [
        ...prevTasks,
        ...createdTasks,
      ])

      alert(`${createdTasks.length} AI tasks added successfully!`)
    } catch (error) {
      console.error(error)
      alert('Failed to add AI tasks')
    }
  }}
>
  Add to Tasks
</button>
  </div>
)}

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

            {dataLoading ? (
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
  onStatusChange={(newStatus) =>
    handleStatusChange(task.id, newStatus)
  }
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