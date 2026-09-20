import { useEffect, useState } from 'react'

import './App.css'



import Navbar from './components/Navbar'

import ProjectCard from './components/ProjectCard'

import TaskCard from './components/TaskCard'

import DueDateBadge from './components/DueDateBadge'

import Login from './Login'

import Projects from './projects'

import Tasks from './Tasks'

import AIAssistant from './AIAssistant'

import { collectUpcomingDeadlines } from './utils/dueDate'

import { apiFetch } from './utils/apiClient'
import {
  clearAuthSession,
  hasAuthSession,
  setAuthSession,
} from './utils/auth'



function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(hasAuthSession())

  const [username, setUsername] = useState(

  localStorage.getItem('username') || ''

)

  const [authChecking, setAuthChecking] = useState(hasAuthSession())



  const [currentPage, setCurrentPage] = useState(

    window.location.hash.replace('#', '') || 'dashboard'

  )



  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] = useState('All')

const [dataLoading, setDataLoading] = useState(true)



const [projects, setProjects] = useState([])

const [tasks, setTasks] = useState([])



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

    if (!isLoggedIn) {

      window.location.hash = ''

      setCurrentPage('dashboard')

    }

  }, [isLoggedIn])

  useEffect(() => {
    const handleUnauthorized = () => {
      setUsername('')
      setIsLoggedIn(false)
      setProjects([])
      setTasks([])
    }

    window.addEventListener('devtrack-unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('devtrack-unauthorized', handleUnauthorized)
    }
  }, [])

  useEffect(() => {
    if (!hasAuthSession()) {
      setAuthChecking(false)
      return
    }

    setAuthChecking(true)

    apiFetch('/auth/me')
      .then((user) => {
        setUsername(user.name)
        setIsLoggedIn(true)
      })
      .catch(() => {
        clearAuthSession()
        setUsername('')
        setIsLoggedIn(false)
      })
      .finally(() => {
        setAuthChecking(false)
      })
  }, [])

  useEffect(() => {

  if (!isLoggedIn) {
    setProjects([])
    setTasks([])
    return
  }

  setDataLoading(true)



  Promise.all([

    apiFetch('/projects'),

    apiFetch('/tasks'),

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

}, [isLoggedIn])



  const handleLogin = (user) => {

  setAuthSession(user, user.token)

  setUsername(user.name)

  setIsLoggedIn(true)

  window.location.hash = 'dashboard'

}

  const handleLogout = () => {

  clearAuthSession()

  setUsername('')

  setIsLoggedIn(false)

  setProjects([])

  setTasks([])

  window.location.hash = ''

  setCurrentPage('dashboard')

}

  const handleStatusChange = async (taskId, newStatus) => {

  try {

    const data = await apiFetch(`/tasks/${taskId}`, {

      method: 'PUT',

      body: JSON.stringify({

        status: newStatus,

      }),

    })



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



  const recentActivity = [...tasks]

    .sort((a, b) => {

      const aTime = new Date(a.updatedAt || 0).getTime() || a.id

      const bTime = new Date(b.updatedAt || 0).getTime() || b.id

      return bTime - aTime

    })

    .slice(0, 5)



  const upcomingDeadlines = collectUpcomingDeadlines(projects, tasks, 6)



  if (authChecking) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p>Checking your session...</p>
        </div>
      </div>
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



  if (currentPage === 'ai-assistant') {

    return (

      <AIAssistant

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



        <section

          className="ai-assistant-card ai-fade-in"

          onClick={() => {

            window.location.hash = 'ai-assistant'

          }}

          onKeyDown={(event) => {

            if (event.key === 'Enter' || event.key === ' ') {

              window.location.hash = 'ai-assistant'

            }

          }}

          role="button"

          tabIndex={0}

        >

          <div className="ai-assistant-card-icon">✦</div>

          <div className="ai-assistant-card-content">

            <h2>AI Assistant</h2>

            <p>

              Generate structured tasks with Ollama-powered suggestions.

              Open the full assistant to preview and add tasks.

            </p>

          </div>

          <span className="ai-assistant-card-link">Open →</span>

        </section>



        <section className="deadlines-section">

          <h2>Upcoming Deadlines</h2>

          <p>Nearest project and task due dates at a glance.</p>



          {upcomingDeadlines.length > 0 ? (

            <ul className="deadlines-list">

              {upcomingDeadlines.map((item) => (

                <li key={item.id} className="deadline-item">

                  <div className="deadline-item-main">

                    <strong>{item.name}</strong>

                    <span className="deadline-item-type">{item.type}</span>

                  </div>

                  <div className="deadline-item-meta">

                    {item.project && (

                      <span>{item.project} · </span>

                    )}

                    <DueDateBadge dueDate={item.dueDate} />

                  </div>

                </li>

              ))}

            </ul>

          ) : (

            <div className="empty-state deadlines-empty">

              <p>No upcoming deadlines. Add due dates to projects or tasks.</p>

            </div>

          )}

        </section>



        <section className="activity-section">

          <h2>Recent Activity</h2>

          <p>Latest updates across your tasks.</p>



          {recentActivity.length > 0 ? (

            <ul className="activity-list">

              {recentActivity.map((task) => (

                <li key={task.id} className="activity-item">

                  <strong>{task.title}</strong>

                  <span>

                    {task.project} · {task.status}

                    {task.assignedTo ? ` · ${task.assignedTo}` : ''}

                  </span>

                </li>

              ))}

            </ul>

          ) : (

            <div className="empty-state">

              <p>No recent activity yet.</p>

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

                dueDate={project.dueDate}

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

  assignedTo={task.assignedTo}

  dueDate={task.dueDate}

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


