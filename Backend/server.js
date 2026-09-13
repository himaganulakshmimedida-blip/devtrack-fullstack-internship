require('dotenv').config()
const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.MONGODB_URI)

let db

async function connectDB() {
  await client.connect()
  db = client.db('devtrack')
  console.log('MongoDB connected successfully')
}
const express = require('express')
const cors = require('cors')

const app = express()

const PORT = 5000

app.use(cors())
app.use(express.json())

// ==================== PROJECT DATA ====================

const projectsCollection = () => db.collection('projects')

async function seedProjects() {
  const count = await projectsCollection().countDocuments()

  if (count === 0) {
    await projectsCollection().insertMany([
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
    ])

    console.log('Default projects added to MongoDB')
  }
}

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await projectsCollection().find({}).toArray()
    res.json(projects)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
    })
  }
})

app.post('/api/projects', async (req, res) => {
  try {
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

    await projectsCollection().insertOne(newProject)

    res.status(201).json(newProject)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create project',
    })
  }
})

app.put('/api/projects/:id', async (req, res) => {
  try {
    const projectId = Number(req.params.id)

    const { name, description, progress, status } = req.body

    const updateData = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (progress !== undefined) updateData.progress = progress
    if (status !== undefined) updateData.status = status

    const result = await projectsCollection().updateOne(
      { id: projectId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    const updatedProject = await projectsCollection().findOne({
      id: projectId,
    })

    res.json(updatedProject)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update project',
    })
  }
})

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projectId = Number(req.params.id)

    const project = await projectsCollection().findOne({
      id: projectId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    await projectsCollection().deleteOne({
      id: projectId,
    })

    res.json({
      message: 'Project deleted successfully',
      project,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete project',
    })
  }
})



// ==================== TASK DATA ====================

// ==================== TASK DATA ====================

const tasksCollection = () => db.collection('tasks')

async function seedTasks() {
  const count = await tasksCollection().countDocuments()

  if (count === 0) {
    await tasksCollection().insertMany([
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
    ])

    console.log('Default tasks added to MongoDB')
  }
}

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await tasksCollection().find({}).toArray()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch tasks',
    })
  }
})

// GET one task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = Number(req.params.id)

    const task = await tasksCollection().findOne({
      id: taskId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch task',
    })
  }
})

// POST create a task
app.post('/api/tasks', async (req, res) => {
  try {
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

    await tasksCollection().insertOne(newTask)

    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create task',
    })
  }
})

// PUT update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = Number(req.params.id)

    const { title, project, priority, status } = req.body

    const updateData = {}

    if (title !== undefined) updateData.title = title
    if (project !== undefined) updateData.project = project
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) updateData.status = status

    const result = await tasksCollection().updateOne(
      { id: taskId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    const updatedTask = await tasksCollection().findOne({
      id: taskId,
    })

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update task',
    })
  }
})

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = Number(req.params.id)

    const task = await tasksCollection().findOne({
      id: taskId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    await tasksCollection().deleteOne({
      id: taskId,
    })

    res.json({
      message: 'Task deleted successfully',
      task,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete task',
    })
  }
})

// ==================== USER DATA ====================

// ==================== USER DATA ====================

const usersCollection = () => db.collection('users')

async function seedUsers() {
  const count = await usersCollection().countDocuments()

  if (count === 0) {
    await usersCollection().insertMany([
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
    ])

    console.log('Default users added to MongoDB')
  }
}

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
app.post('/api/users', async (req, res) => {
  try {
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

    await usersCollection().insertOne(newUser)

    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create user',
    })
  }
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

connectDB()
  .then(async () => {
    await seedProjects()
    await seedTasks()
    await seedUsers()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:5000`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error)
  })