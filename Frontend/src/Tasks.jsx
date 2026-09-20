import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import TaskCard from './components/TaskCard'
import { toDateInputValue } from './utils/dueDate'
const API_URL = 'http://localhost:5000/api'
function Tasks({ username, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  useEffect(() => {
  Promise.all([
    fetch(`${API_URL}/tasks`),
    fetch(`${API_URL}/projects`),
    fetch(`${API_URL}/users`),
  ])
    .then(async ([tasksResponse, projectsResponse, usersResponse]) => {
      const tasksData = await tasksResponse.json()
      const projectsData = await projectsResponse.json()
      const usersData = await usersResponse.json()

      setTasks(tasksData)
      setProjects(projectsData)
      setUsers(usersData)
    })
    .catch((error) => {
      console.error('Error loading tasks:', error)
    })
}, [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const filteredTasks = tasks.filter((task) => {
  const matchesSearch =
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.project.toLowerCase().includes(search.toLowerCase())

  const matchesStatus =
    statusFilter === 'All' || task.status === statusFilter

  return matchesSearch && matchesStatus
})

  const [showForm, setShowForm] = useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskProject, setTaskProject] = useState('')
  const [taskPriority, setTaskPriority] = useState('Medium')
  const [taskStatus, setTaskStatus] = useState('Todo')
  const [taskAssigneeUserId, setTaskAssigneeUserId] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')

  useEffect(() => {
    if (!taskProject && projects.length > 0) {
      setTaskProject(projects[0].name)
    }
  }, [projects, taskProject])

  const resetTaskForm = () => {
    setTaskTitle('')
    setTaskProject(projects[0]?.name || '')
    setTaskPriority('Medium')
    setTaskStatus('Todo')
    setTaskAssigneeUserId('')
    setTaskDueDate('')
  }

  const closeTaskForm = () => {
    setShowForm(false)
    setEditingTask(null)
    resetTaskForm()
  }

  const openCreateForm = () => {
    setEditingTask(null)
    resetTaskForm()
    setShowForm(true)
  }

  const handleCreateTask = async (e) => {
  e.preventDefault()

  if (!taskTitle.trim()) {
    alert('Please enter a task title.')
    return
  }

  try {
    const selectedProject = projects.find(
      (project) => project.name === taskProject
    )
    const selectedUser = users.find(
      (user) => String(user.id) === String(taskAssigneeUserId)
    )

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
        projectId: selectedProject?.id,
        assigneeUserId: selectedUser?.id,
        assignedTo: selectedUser?.name,
        dueDate: taskDueDate || null,
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

    closeTaskForm()
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Unable to create task. Please try again.')
  }
}
const handleStatusChange = async (taskId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update task')
    }

    const updatedTask = await response.json()

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? updatedTask : task
      )
    )
  } catch (error) {
    console.error('Error updating task:', error)
    alert('Failed to update task')
  }
}
const handleDeleteTask = async (taskId) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this task?'
  )

  if (!confirmDelete) return

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      alert('Failed to delete task')
      return
    }

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    )
  } catch (error) {
    console.error('Error deleting task:', error)
    alert('Something went wrong')
  }
}

const startEditTask = (task) => {
  setShowForm(false)
  setEditingTask(task)
  setTaskTitle(task.title)
  setTaskProject(task.project)
  setTaskPriority(task.priority)
  setTaskStatus(task.status)
  setTaskAssigneeUserId(task.assigneeUserId ? String(task.assigneeUserId) : '')
  setTaskDueDate(toDateInputValue(task.dueDate))
}

const handleUpdateTask = async (e) => {
  e.preventDefault()

  if (!editingTask || !taskTitle.trim()) {
    alert('Please enter a task title.')
    return
  }

  try {
    const selectedProject = projects.find(
      (project) => project.name === taskProject
    )
    const selectedUser = users.find(
      (user) => String(user.id) === String(taskAssigneeUserId)
    )

    const response = await fetch(`${API_URL}/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: taskTitle,
        project: taskProject,
        priority: taskPriority,
        status: taskStatus,
        projectId: selectedProject?.id || null,
        assigneeUserId: selectedUser?.id || null,
        assignedTo: selectedUser?.name || null,
        dueDate: taskDueDate || null,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update task')
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === editingTask.id ? data : task
      )
    )

    closeTaskForm()
  } catch (error) {
    console.error('Error updating task:', error)
    alert('Unable to update task.')
  }
}

  const renderTaskForm = () => (
    <>
      <div className="form-header">
        <div>
          <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <p>
            {editingTask
              ? 'Update task details and assignment.'
              : 'Add a new task to your project.'}
          </p>
        </div>
        <button
          type="button"
          className="close-form-button"
          onClick={closeTaskForm}
        >
          ×
        </button>
      </div>

      <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
        <label className="form-label">Task Title</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <label className="form-label">Project</label>
        <select
          className="form-select"
          value={taskProject}
          onChange={(e) => setTaskProject(e.target.value)}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.name}>
              {project.name}
            </option>
          ))}
        </select>

        <label className="form-label">Assign To</label>
        <select
          className="form-select"
          value={taskAssigneeUserId}
          onChange={(e) => setTaskAssigneeUserId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        <label className="form-label">Due Date</label>
        <input
          type="date"
          className="form-input"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />

        <label className="form-label">Priority</label>
        <select
          className="form-select"
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={closeTaskForm}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editingTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </>
  )

  return (
    <div className="app">

      <Navbar
        username={username}
        onLogout={onLogout}
        currentPage="tasks"
      />

      <main className="dashboard">

        <div className="page-header-row">

          <div>
            <h1>Tasks</h1>

            <p>
              Track and manage your development tasks.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={openCreateForm}
          >
            + Create Task
          </button>

        </div>

        {showForm && !editingTask && (
          <div className="form-card">{renderTaskForm()}</div>
        )}

        {editingTask && (
          <div className="modal-overlay">
            <div className="modal-card form-card">{renderTaskForm()}</div>
          </div>
        )}

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

  {filteredTasks.length > 0 ? (
    filteredTasks.map((task) => (
      <div key={task.id} className="task-item-wrapper">

     <TaskCard
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

        <div className="card-actions">
          <button
            type="button"
            className="btn-edit"
            onClick={() => startEditTask(task)}
          >
            ✏ Edit
          </button>

          <button
            type="button"
            className="btn-delete"
            onClick={() => handleDeleteTask(task.id)}
          >
            🗑 Delete
          </button>
        </div>

      </div>
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
