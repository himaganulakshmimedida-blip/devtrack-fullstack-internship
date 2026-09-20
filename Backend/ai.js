const OLLAMA_URL =
  process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b'

async function generateAI(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error('Ollama request failed')
  }

  const data = await response.json()

  return data.response
}

function parseTasksFromText(text) {
  if (!text || typeof text !== 'string') {
    return []
  }

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        return normalizeGeneratedTasks(parsed)
      }
    } catch {
      // fall through to line parsing
    }
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const tasks = []

  for (const line of lines) {
    const numbered = line.match(/^\d+[\).\s-]+(.+)$/)
    const bullet = line.match(/^[-*]\s+(.+)$/)
    const title = (numbered?.[1] || bullet?.[1] || line).replace(
      /^\*\*|\*\*$/g,
      ''
    )

    if (title.length > 2) {
      tasks.push({
        title,
        priority: 'Medium',
        status: 'Todo',
        project: '',
      })
    }
  }

  return normalizeGeneratedTasks(tasks)
}

function normalizeGeneratedTasks(tasks) {
  const validPriority = ['Low', 'Medium', 'High']
  const validStatus = ['Todo', 'In Progress', 'Done']

  return tasks
    .map((task) => ({
      title: String(task.title || '').trim(),
      priority: validPriority.includes(task.priority)
        ? task.priority
        : 'Medium',
      status: validStatus.includes(task.status) ? task.status : 'Todo',
      project: String(task.project || '').trim(),
    }))
    .filter((task) => task.title)
}

async function generateStructuredTasks(userPrompt, projectContext) {
  const contextLine = projectContext
    ? `Project context: "${projectContext}". Use this project name for each task unless the user specifies otherwise.`
    : 'If no project is specified, use "General" as the project name.'

  const instruction = `${contextLine}

User request: ${userPrompt}

Respond with ONLY a valid JSON array. Each item must be an object with:
- title (string)
- priority ("Low", "Medium", or "High")
- status ("Todo", "In Progress", or "Done")
- project (string)

Example:
[{"title":"Set up auth","priority":"High","status":"Todo","project":"DevTrack"}]`

  const raw = await generateAI(instruction)
  const tasks = parseTasksFromText(raw)

  if (tasks.length === 0) {
    return {
      tasks: [],
      raw,
    }
  }

  return {
    tasks: tasks.map((task) => ({
      ...task,
      project: task.project || projectContext || 'General',
    })),
    raw,
  }
}

module.exports = {
  generateAI,
  generateStructuredTasks,
  parseTasksFromText,
}