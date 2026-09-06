const express = require('express')
const cors = require('cors')

const app = express()

const PORT = 5000

app.use(cors())
app.use(express.json())

// ==================== PROJECT DATA ====================

let projects = [
  {
    id: 1,
    name: 'Portfolio Website',
    description: 'Build and deploy a personal portfolio.',
    progress: 75,
    status: 'In Progress',
  },
  {
    id: 2,
    name: 'E-Commerce Website',
    description: 'Develop an online shopping platform.',
    progress: 45,
    status: 'In Progress',
  },
  {
    id: 3,
    name: 'Task Management App',
    description: 'Create a productivity and task management system.',
    progress: 100,
    status: 'Completed',
  },
]

// ==================== HOME ROUTE ====================

app.get('/', (req, res) => {
  res.json({
    message: 'DevTrack Backend API is running successfully',
  })
})

// ==================== PROJECT APIs ====================

// GET all projects
app.get('/api/projects', (req, res) => {
  res.json(projects)
})

// GET one project
app.get('/api/projects/:id', (req, res) => {
  const projectId = Number(req.params.id)

  const project = projects.find(
    (project) => project.id === projectId
  )

  if (!project) {
    return res.status(404).json({
      message: 'Project not found',
    })
  }

  res.json(project)
})

// POST create a project
app.post('/api/projects', (req, res) => {
  const { name, description } = req.body

  if (!name || !description) {
    return res.status(400).json({
      message: 'Project name and description are required',
    })
  }

  const newProject = {
    id: Date.now(),
    name,
    description,
    progress: 0,
    status: 'In Progress',
  }

  projects.push(newProject)

  res.status(201).json(newProject)
})

// PUT update a project
app.put('/api/projects/:id', (req, res) => {
  const projectId = Number(req.params.id)

  const project = projects.find(
    (project) => project.id === projectId
  )

  if (!project) {
    return res.status(404).json({
      message: 'Project not found',
    })
  }

  const { name, description, progress, status } = req.body

  if (name !== undefined) {
    project.name = name
  }

  if (description !== undefined) {
    project.description = description
  }

  if (progress !== undefined) {
    project.progress = progress
  }

  if (status !== undefined) {
    project.status = status
  }

  res.json(project)
})

// DELETE a project
app.delete('/api/projects/:id', (req, res) => {
  const projectId = Number(req.params.id)

  const projectIndex = projects.findIndex(
    (project) => project.id === projectId
  )

  if (projectIndex === -1) {
    return res.status(404).json({
      message: 'Project not found',
    })
  }

  const deletedProject = projects.splice(projectIndex, 1)

  res.json({
    message: 'Project deleted successfully',
    project: deletedProject[0],
  })
})

// ==================== TASK DATA ====================

let tasks = [
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
  {
    id: 4,
    title: 'Create Dashboard UI',
    project: 'Task Management App',
    priority: 'High',
    status: 'In Progress',
  },
]

// ==================== TASK APIs ====================

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks)
})

// GET one task
app.get('/api/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id)

  const task = tasks.find(
    (task) => task.id === taskId
  )

  if (!task) {
    return res.status(404).json({
      message: 'Task not found',
    })
  }

  res.json(task)
})

// POST create a task
app.post('/api/tasks', (req, res) => {
  const { title, project, priority, status } = req.body

  if (!title || !project) {
    return res.status(400).json({
      message: 'Task title and project are required',
    })
  }

  const newTask = {
    id: Date.now(),
    title,
    project,
    priority: priority || 'Medium',
    status: status || 'Todo',
  }

  tasks.push(newTask)

  res.status(201).json(newTask)
})

// PUT update a task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id)

  const task = tasks.find(
    (task) => task.id === taskId
  )

  if (!task) {
    return res.status(404).json({
      message: 'Task not found',
    })
  }

  const { title, project, priority, status } = req.body

  if (title !== undefined) {
    task.title = title
  }

  if (project !== undefined) {
    task.project = project
  }

  if (priority !== undefined) {
    task.priority = priority
  }

  if (status !== undefined) {
    task.status = status
  }

  res.json(task)
})

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id)

  const taskIndex = tasks.findIndex(
    (task) => task.id === taskId
  )

  if (taskIndex === -1) {
    return res.status(404).json({
      message: 'Task not found',
    })
  }

  const deletedTask = tasks.splice(taskIndex, 1)

  res.json({
    message: 'Task deleted successfully',
    task: deletedTask[0],
  })
})

// ==================== USER DATA ====================

let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Project Manager',
  },
]

// ==================== USER APIs ====================

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users)
})

// GET one user
app.get('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id)

  const user = users.find(
    (user) => user.id === userId
  )

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  res.json(user)
})

// POST create a user
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body

  if (!name || !email) {
    return res.status(400).json({
      message: 'User name and email are required',
    })
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    role: role || 'Developer',
  }

  users.push(newUser)

  res.status(201).json(newUser)
})

// PUT update a user
app.put('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id)

  const user = users.find(
    (user) => user.id === userId
  )

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  const { name, email, role } = req.body

  if (name !== undefined) {
    user.name = name
  }

  if (email !== undefined) {
    user.email = email
  }

  if (role !== undefined) {
    user.role = role
  }

  res.json(user)
})

// DELETE a user
app.delete('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id)

  const userIndex = users.findIndex(
    (user) => user.id === userId
  )

  if (userIndex === -1) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  const deletedUser = users.splice(userIndex, 1)

  res.json({
    message: 'User deleted successfully',
    user: deletedUser[0],
  })
})

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})