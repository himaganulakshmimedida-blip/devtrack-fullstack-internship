import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'

const API_URL = 'http://localhost:5000'

function AIAssistant({ username, onLogout }) {
  const [projects, setProjects] = useState([])
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState([])
  const [selectedTaskIndexes, setSelectedTaskIndexes] = useState([])
  const [aiProjectContext, setAiProjectContext] = useState('')
  const [aiError, setAiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [addingTasks, setAddingTasks] = useState(false)
  const [addSuccess, setAddSuccess] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Failed to load projects:', error))
  }, [])

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a prompt before generating tasks.')
      return
    }

    try {
      setLoading(true)
      setAiError('')
      setAiResponse('')
      setAiGeneratedTasks([])
      setSelectedTaskIndexes([])
      setAddSuccess('')

      const response = await fetch(`${API_URL}/api/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          projectContext: aiProjectContext,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'AI request failed')
      }

      setAiResponse(data.answer || '')
      const tasks = Array.isArray(data.tasks) ? data.tasks : []
      setAiGeneratedTasks(tasks)
      setSelectedTaskIndexes(tasks.map((_, index) => index))
    } catch (error) {
      console.error('AI Error:', error)
      setAiError(error.message || 'Unable to generate AI response.')
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskSelection = (index) => {
    setSelectedTaskIndexes((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    )
  }

  const toggleSelectAll = () => {
    if (selectedTaskIndexes.length === aiGeneratedTasks.length) {
      setSelectedTaskIndexes([])
    } else {
      setSelectedTaskIndexes(aiGeneratedTasks.map((_, index) => index))
    }
  }

  const handleAddSelectedTasks = async () => {
    const tasksToAdd = aiGeneratedTasks.filter((_, index) =>
      selectedTaskIndexes.includes(index)
    )

    if (tasksToAdd.length === 0) {
      setAiError('Select at least one task to add.')
      return
    }

    try {
      setAddingTasks(true)
      setAiError('')
      setAddSuccess('')

      const createdTasks = []

      for (const generatedTask of tasksToAdd) {
        const response = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: generatedTask.title,
            project: generatedTask.project || aiProjectContext || 'General',
            priority: generatedTask.priority || 'Medium',
            status: generatedTask.status || 'Todo',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to add task')
        }

        createdTasks.push(data)
      }

      setAddSuccess(`${createdTasks.length} task(s) added successfully!`)
    } catch (error) {
      console.error(error)
      setAiError(error.message || 'Failed to add AI tasks')
    } finally {
      setAddingTasks(false)
    }
  }

  return (
    <div className="app">
      <Navbar
        username={username}
        onLogout={onLogout}
        currentPage="ai-assistant"
      />

      <main className="dashboard ai-assistant-page">
        <div className="page-header-row">
          <div>
            <h1>AI Assistant</h1>
            <p>
              Generate structured tasks powered by Ollama. Review suggestions,
              then add selected items to your task list.
            </p>
          </div>
        </div>

        <section className="ai-page-panel ai-fade-in">
          <div className="ai-page-header">
            <div className="ai-page-icon">✦</div>
            <div>
              <h2>AI Task Generator</h2>
              <p>
                Describe what you need and AI will suggest tasks with priority
                and status recommendations.
              </p>
            </div>
          </div>

          <label className="ai-label">Project context (optional)</label>
          <select
            value={aiProjectContext}
            onChange={(e) => setAiProjectContext(e.target.value)}
          >
            <option value="">No specific project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>

          <label className="ai-label">Your prompt</label>
          <textarea
            className="ai-prompt-input"
            placeholder="Example: Create onboarding tasks for a new e-commerce checkout flow."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            rows="5"
          />

          {aiError && <p className="ai-error">{aiError}</p>}
          {addSuccess && <p className="ai-success">{addSuccess}</p>}

          <button
            className="btn-primary"
            disabled={loading}
            onClick={handleGenerate}
          >
            {loading ? 'Generating...' : 'Generate AI Tasks'}
          </button>

          {loading && (
            <div className="ai-loading-state">
              <div className="ai-loading-spinner" />
              <p>AI is crafting task suggestions...</p>
            </div>
          )}

          {!loading && aiGeneratedTasks.length === 0 && !aiResponse && (
            <div className="ai-empty-state">
              <div className="ai-empty-icon">◇</div>
              <h3>Ready when you are</h3>
              <p>
                Enter a prompt above to receive AI-generated task suggestions
                with priority and status labels.
              </p>
            </div>
          )}

          {aiGeneratedTasks.length > 0 && (
            <div className="ai-response ai-fade-in">
              <div className="ai-response-header">
                <h3>Suggested Tasks</h3>
                <button
                  type="button"
                  className="ai-select-all"
                  onClick={toggleSelectAll}
                >
                  {selectedTaskIndexes.length === aiGeneratedTasks.length
                    ? 'Deselect all'
                    : 'Select all'}
                </button>
              </div>

              <ul className="ai-task-list ai-task-list-selectable">
                {aiGeneratedTasks.map((task, index) => (
                  <li
                    key={`${task.title}-${index}`}
                    className={
                      selectedTaskIndexes.includes(index)
                        ? 'ai-task-selected'
                        : ''
                    }
                  >
                    <label className="ai-task-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedTaskIndexes.includes(index)}
                        onChange={() => toggleTaskSelection(index)}
                      />
                      <div>
                        <strong>{task.title}</strong>
                        <span className="ai-task-meta">
                          {task.project || aiProjectContext || 'General'}
                        </span>
                        <div className="ai-task-tags">
                          <span className="ai-tag ai-tag-priority">
                            {task.priority || 'Medium'}
                          </span>
                          <span className="ai-tag ai-tag-status">
                            {task.status || 'Todo'}
                          </span>
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>

              <button
                className="btn-primary"
                disabled={
                  addingTasks || selectedTaskIndexes.length === 0
                }
                onClick={handleAddSelectedTasks}
              >
                {addingTasks
                  ? 'Adding...'
                  : `Add Selected to Tasks (${selectedTaskIndexes.length})`}
              </button>
            </div>
          )}

          {aiGeneratedTasks.length === 0 && aiResponse && !loading && (
            <div className="ai-response ai-fade-in">
              <h3>AI Response</h3>
              <pre>{aiResponse}</pre>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default AIAssistant
