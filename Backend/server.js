require('dotenv').config({ path: './.env' })
const { MongoClient } = require('mongodb')
const { generateAI } = require('./ai')
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
// ==================== AI API ====================

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({
        message: 'Prompt is required',
      })
    }

    const answer = await generateAI(prompt)

    res.json({
      answer,
    })
  } catch (error) {
    console.error('AI Error:', error)

    res.status(500).json({
      message: 'AI request failed',
    })
  }
})

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
  userId: 1,
},
     {
  id: 2,
  name: 'E-Commerce Website',
  description: 'Develop an online shopping platform.',
  progress: 45,
  status: 'In Progress',
  userId: 1,
},
      {
  id: 3,
  name: 'Task Management App',
  description: 'Create a productivity and task management system.',
  progress: 100,
  status: 'Completed',
  userId: 2,
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
    if (isNaN(projectId)) {
  return res.status(400).json({
    message: 'Invalid project ID',
  })
}

    const { name, description, progress, status } = req.body

// Input validation
if (name !== undefined && !name.trim()) {
  return res.status(400).json({
    message: 'Project name cannot be empty',
  })
}

if (description !== undefined && !description.trim()) {
  return res.status(400).json({
    message: 'Project description cannot be empty',
  })
}

if (
  progress !== undefined &&
  (typeof progress !== 'number' || progress < 0 || progress > 100)
) {
  return res.status(400).json({
    message: 'Progress must be a number between 0 and 100',
  })
}

if (
  status !== undefined &&
  !['In Progress', 'Completed'].includes(status)
) {
  return res.status(400).json({
    message: 'Invalid project status',
  })
}

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
  projectId: 1,
  userId: 1,
  priority: 'High',
  status: 'Done',
},
      {
  id: 2,
  title: 'Design Database',
  project: 'E-Commerce Website',
  projectId: 2,
  userId: 1,
  priority: 'Medium',
  status: 'In Progress',
},
      {
  id: 3,
  title: 'Build Product Page',
  project: 'E-Commerce Website',
  projectId: 2,
  userId: 1,
  priority: 'Low',
  status: 'Todo',
},
     {
  id: 4,
  title: 'Create Dashboard UI',
  project: 'Task Management App',
  projectId: 3,
  userId: 2,
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

    // Input validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Task title cannot be empty',
      })
    }

    if (!project || !project.trim()) {
      return res.status(400).json({
        message: 'Task project cannot be empty',
      })
    }

    if (
      priority !== undefined &&
      !['Low', 'Medium', 'High'].includes(priority)
    ) {
      return res.status(400).json({
        message: 'Invalid task priority',
      })
    }

    if (
      status !== undefined &&
      !['Todo', 'In Progress', 'Done'].includes(status)
    ) {
      return res.status(400).json({
        message: 'Invalid task status',
      })
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      project: project.trim(),
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

    if (isNaN(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      })
    }

    const { title, project, priority, status } = req.body

    // Input validation
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        message: 'Task title cannot be empty',
      })
    }

    if (project !== undefined && (!project || !project.trim())) {
      return res.status(400).json({
        message: 'Task project cannot be empty',
      })
    }

    if (
      priority !== undefined &&
      !['Low', 'Medium', 'High'].includes(priority)
    ) {
      return res.status(400).json({
        message: 'Invalid task priority',
      })
    }

    if (
      status !== undefined &&
      !['Todo', 'In Progress', 'Done'].includes(status)
    ) {
      return res.status(400).json({
        message: 'Invalid task status',
      })
    }

    const updateData = {}

    if (title !== undefined) updateData.title = title.trim()
    if (project !== undefined) updateData.project = project.trim()
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) updateData.status = status

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: 'No fields provided for update',
      })
    }

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

    res.status(200).json(updatedTask)
  } catch (error) {
    console.error('Update Task Error:', error)

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

// ==================== DATABASE VALIDATION ====================

async function setupDatabaseValidation() {

  await db.command({
    collMod: 'projects',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'description', 'progress', 'status'],
        properties: {
          name: {
            bsonType: 'string'
          },
          description: {
            bsonType: 'string'
          },
          progress: {
            bsonType: ['int', 'double'],
            minimum: 0,
            maximum: 100
          },
          status: {
            enum: ['In Progress', 'Completed']
          }
        }
      }
    },
    validationLevel: 'strict',
    validationAction: 'error'
  })

  await db.command({
    collMod: 'tasks',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['title', 'project', 'priority', 'status'],
        properties: {
          title: {
            bsonType: 'string'
          },
          project: {
            bsonType: 'string'
          },
          priority: {
            enum: ['Low', 'Medium', 'High']
          },
          status: {
            enum: ['Todo', 'In Progress', 'Done']
          }
        }
      }
    },
    validationLevel: 'strict',
    validationAction: 'error'
  })

  await db.command({
    collMod: 'users',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'email', 'role'],
        properties: {
          name: {
            bsonType: 'string'
          },
          email: {
            bsonType: 'string'
          },
          role: {
            bsonType: 'string'
          }
        }
      }
    },
    validationLevel: 'strict',
    validationAction: 'error'
  })

  console.log('Database validation rules applied successfully')
}
async function updateExistingTaskRelationships() {
  await tasksCollection().updateOne(
    { id: 1 },
    { $set: { projectId: 1, userId: 1 } }
  )

  await tasksCollection().updateOne(
    { id: 2 },
    { $set: { projectId: 2, userId: 1 } }
  )

  await tasksCollection().updateOne(
    { id: 3 },
    { $set: { projectId: 2, userId: 1 } }
  )

  await tasksCollection().updateOne(
    { id: 4 },
    { $set: { projectId: 3, userId: 2 } }
  )

  console.log('Existing task relationships updated')
}

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

// ==================== USER APIs ====================

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await usersCollection().find({}).toArray()
    res.json(users)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users',
    })
  }
})

// GET one user
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id)

    const user = await usersCollection().findOne({
      id: userId,
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user',
    })
  }
})

/// POST create a user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role } = req.body

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'User name cannot be empty',
      })
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: 'User email cannot be empty',
      })
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        message: 'Invalid email format',
      })
    }

    if (
      role !== undefined &&
      !['Developer', 'Project Manager'].includes(role)
    ) {
      return res.status(400).json({
        message: 'Invalid user role',
      })
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role || 'Developer',
    }

    await usersCollection().insertOne(newUser)

    res.status(201).json(newUser)
  } catch (error) {
    console.error('Create User Error:', error)

    res.status(500).json({
      message: 'Failed to create user',
    })
  }
})

// PUT update a user
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id)

    if (isNaN(userId)) {
      return res.status(400).json({
        message: 'Invalid user ID',
      })
    }

    const { name, email, role } = req.body

    // Input validation
    if (name !== undefined && (!name || !name.trim())) {
      return res.status(400).json({
        message: 'User name cannot be empty',
      })
    }

    if (email !== undefined && (!email || !email.trim())) {
      return res.status(400).json({
        message: 'User email cannot be empty',
      })
    }

    if (email !== undefined) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailPattern.test(email.trim())) {
        return res.status(400).json({
          message: 'Invalid email format',
        })
      }
    }

    if (
      role !== undefined &&
      !['Developer', 'Project Manager'].includes(role)
    ) {
      return res.status(400).json({
        message: 'Invalid user role',
      })
    }

    const updateData = {}

    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email.trim()
    if (role !== undefined) updateData.role = role

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: 'No fields provided for update',
      })
    }

    const result = await usersCollection().updateOne(
      { id: userId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const updatedUser = await usersCollection().findOne({
      id: userId,
    })

    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Update User Error:', error)

    res.status(500).json({
      message: 'Failed to update user',
    })
  }
})
// DELETE a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id)

    const user = await usersCollection().findOne({
      id: userId,
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    await usersCollection().deleteOne({
      id: userId,
    })

    res.json({
      message: 'User deleted successfully',
      user,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete user',
    })
  }
})
// ==================== CENTRALIZED ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Server Error:', err)

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  })
})
// ==================== START SERVER ====================

if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    try {
      await connectDB()
await setupDatabaseValidation()
await seedProjects()
await seedTasks()
await updateExistingTaskRelationships()
await seedUsers()
      app(req, res)
    } catch (error) {
      console.error('Server error:', error)

      res.status(500).json({
        message: 'Server error',
      })
    }
  }
} else {
  connectDB()
  .then(async () => {
    await setupDatabaseValidation()
    await seedProjects()
    await seedTasks()
    await updateExistingTaskRelationships()
    await seedUsers()

      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
      })
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error)
    })
}