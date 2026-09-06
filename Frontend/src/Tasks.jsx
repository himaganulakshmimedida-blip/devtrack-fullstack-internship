import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import TaskCard from './components/TaskCard'
const API_URL = 'https://backend-omega-wheat-ny2fuey01d.vercel.app/api'

function Tasks({ username, onLogout }) {
  const [tasks, setTasks] = useState([])
  useEffect(() => {
  fetch(`${API_URL}/tasks`)
    .then((response) => response.json())
    .then((data) => {
      setTasks(data)
    })
    .catch((error) => {
      console.error('Error loading tasks:', error)
    })
}, [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [showForm, setShowForm] = useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskProject, setTaskProject] = useState('Portfolio Website')
  const [taskPriority, setTaskPriority] = useState('Medium')
  const [taskStatus, setTaskStatus] = useState('Todo')

  const handleCreateTask = async (e) => {
  e.preventDefault()

  if (!taskTitle.trim()) {
    alert('Please enter a task title.')
    return
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: taskTitle,
        project: taskProject,
        priority: taskPriority,
        status: taskStatus,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create task')
    }

    const newTask = await response.json()

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ])

    setTaskTitle('')
    setTaskProject('Portfolio Website')
    setTaskPriority('Medium')
    setTaskStatus('Todo')
    setShowForm(false)
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Unable to create task. Please try again.')
  }
}
  return (
    <div className="app">

      <Navbar
        username={username}
        onLogout={onLogout}
        currentPage="tasks"
      />

      <main className="dashboard">

        {/* PAGE HEADING */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            gap: '20px',
          }}
        >

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '34px',
                fontWeight: 800,
              }}
            >
              Tasks
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                color: '#64748b',
                fontSize: '15px',
              }}
            >
              Track and manage your development tasks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            style={{
              display: 'block',
              padding: '13px 20px',
              border: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
            }}
          >
            + Create Task
          </button>

        </div>

        {/* CREATE TASK FORM */}

        {showForm && (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '25px',
              marginBottom: '25px',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >

              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '21px',
                  }}
                >
                  Create New Task
                </h2>

                <p
                  style={{
                    margin: '6px 0 0',
                    color: '#64748b',
                  }}
                >
                  Add a new task to your project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleCreateTask}>

              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Task Title
              </label>

              <input
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px',
                  marginBottom: '18px',
                  border: '1px solid #dbe3ee',
                  borderRadius: '10px',
                  fontSize: '14px',
                }}
              />

              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Project
              </label>

              <select
                value={taskProject}
                onChange={(e) => setTaskProject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px',
                  marginBottom: '18px',
                  border: '1px solid #dbe3ee',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: '#ffffff',
                }}
              >
                <option>Portfolio Website</option>
                <option>E-Commerce Website</option>
                <option>Task Management App</option>
              </select>

              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Priority
              </label>

              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px',
                  marginBottom: '18px',
                  border: '1px solid #dbe3ee',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: '#ffffff',
                }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Status
              </label>

              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px',
                  marginBottom: '20px',
                  border: '1px solid #dbe3ee',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: '#ffffff',
                }}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '11px 18px',
                    border: 'none',
                    borderRadius: '9px',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '11px 18px',
                    border: 'none',
                    borderRadius: '9px',
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Create Task
                </button>

              </div>

            </form>

          </div>
        )}

        {/* SEARCH AND FILTER */}

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

        {/* TASK LIST */}

        <div className="task-list">

          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                project={task.project}
                priority={task.priority}
                status={task.status}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>No tasks found</h3>
              <p>
                Try changing your search or status filter.
              </p>
            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default Tasks