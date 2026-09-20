export function getDueDateInfo(dueDate) {
  if (!dueDate) return null

  const due = new Date(dueDate)
  if (Number.isNaN(due.getTime())) return null

  due.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      text: 'Overdue',
      type: 'overdue',
      days: diffDays,
    }
  }

  if (diffDays === 0) {
    return {
      text: 'Due today',
      type: 'today',
      days: 0,
    }
  }

  if (diffDays === 1) {
    return {
      text: 'Due tomorrow',
      type: 'tomorrow',
      days: 1,
    }
  }

  return {
    text: `Due in ${diffDays} days`,
    type: 'upcoming',
    days: diffDays,
  }
}

export function formatDueDate(dueDate) {
  if (!dueDate) return null
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDueDateDisplay(dueDate) {
  if (!dueDate) return null
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) return null
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function getDueDateCountdown(dueDate) {
  const info = getDueDateInfo(dueDate)
  if (!info) return null
  if (info.type === 'overdue') return 'Overdue'
  if (info.type === 'today') return 'Due today'
  if (info.type === 'tomorrow') return '1 day remaining'
  return `${info.days} days remaining`
}

export function toDateInputValue(dueDate) {
  if (!dueDate) return ''
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function collectUpcomingDeadlines(projects = [], tasks = [], limit = 6) {
  const items = []

  projects.forEach((project) => {
    if (project.dueDate && project.status !== 'Completed') {
      items.push({
        id: `project-${project.id}`,
        name: project.name,
        type: 'Project',
        dueDate: project.dueDate,
        status: project.status,
      })
    }
  })

  tasks.forEach((task) => {
    if (task.dueDate && task.status !== 'Done') {
      items.push({
        id: `task-${task.id}`,
        name: task.title,
        type: 'Task',
        dueDate: task.dueDate,
        status: task.status,
        project: task.project,
      })
    }
  })

  return items
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, limit)
}
