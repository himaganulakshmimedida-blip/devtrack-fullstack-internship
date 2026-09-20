import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import DueDateBadge from './components/DueDateBadge'
import ProjectDueDate from './components/ProjectDueDate'
import { formatDueDate, toDateInputValue } from './utils/dueDate'
import { apiFetch } from './utils/apiClient'

function Projects({ username, onLogout }) {
 const [projects, setProjects] = useState([])
 const [selectedProject, setSelectedProject] = useState(null)
 const [projectTasks, setProjectTasks] = useState([])
 const [detailsLoading, setDetailsLoading] = useState(false)
 const [editingProject, setEditingProject] = useState(null)
 const [editName, setEditName] = useState('')
 const [editDescription, setEditDescription] = useState('')
 const [editProgress, setEditProgress] = useState(0)
 const [editStatus, setEditStatus] = useState('In Progress')
 const [editDueDate, setEditDueDate] = useState('')
 useEffect(() => {
  apiFetch('/projects')
    .then((data) => {
      setProjects(data)
    })
    .catch((error) => {
      console.error('Error loading projects:', error)
    })
}, [])
  const [showForm, setShowForm] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectDueDate, setProjectDueDate] = useState('')

  const handleCreateProject = async (e) => {
  e.preventDefault()

  if (!projectName.trim() || !projectDescription.trim()) {
    alert('Please enter project name and description.')
    return
  }

  try {
    const newProject = await apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
        dueDate: projectDueDate || null,
      }),
    })

    setProjects((previousProjects) => [
      ...previousProjects,
      newProject,
    ])

    setProjectName('')
    setProjectDescription('')
    setProjectDueDate('')
    setShowForm(false)
  } catch (error) {
    console.error('Error creating project:', error)
    alert('Unable to create project. Please try again.')
  }
}
const handleDeleteProject = async (projectId) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this project?'
  )

  if (!confirmDelete) return

  try {
    await apiFetch(`/projects/${projectId}`, {
      method: 'DELETE',
    })

    setProjects((previousProjects) =>
      previousProjects.filter((project) => project.id !== projectId)
    )
  } catch (error) {
    console.error('Error deleting project:', error)
    alert('Something went wrong')
  }
}

const openProjectDetails = async (projectId) => {
  try {
    setDetailsLoading(true)

    const [projectData, tasksData] = await Promise.all([
      apiFetch(`/projects/${projectId}`),
      apiFetch('/tasks'),
    ])

    const relatedTasks = tasksData.filter(
      (task) =>
        task.projectId === projectId ||
        task.project === projectData.name
    )

    setSelectedProject(projectData)
    setProjectTasks(relatedTasks)
  } catch (error) {
    console.error('Error loading project details:', error)
    alert('Unable to load project details.')
  } finally {
    setDetailsLoading(false)
  }
}

const startEditProject = (project) => {
  setEditingProject(project)
  setEditName(project.name)
  setEditDescription(project.description)
  setEditProgress(project.progress)
  setEditStatus(project.status)
  setEditDueDate(toDateInputValue(project.dueDate))
}

const handleUpdateProject = async (e) => {
  e.preventDefault()

  if (!editName.trim() || !editDescription.trim()) {
    alert('Project name and description are required.')
    return
  }

  try {
    const data = await apiFetch(`/projects/${editingProject.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: editName,
        description: editDescription,
        progress: Number(editProgress),
        status: editStatus,
        dueDate: editDueDate || null,
      }),
    })

    setProjects((previousProjects) =>
      previousProjects.map((project) =>
        project.id === data.id ? data : project
      )
    )

    if (selectedProject?.id === data.id) {
      setSelectedProject(data)
    }

    setEditingProject(null)
  } catch (error) {
    console.error('Error updating project:', error)
    alert('Unable to update project.')
  }
}

  return (
    <div className="app">

      <Navbar
        username={username}
        onLogout={onLogout}
        currentPage="projects"
      />

      <main className="dashboard">

        <div className="page-header-row">

          <div>
            <h1>Projects</h1>

            <p>
              View and manage all your projects.
            </p>
          </div>

          <button
            type="button"
            className="create-project-button"
            onClick={() => setShowForm(true)}
          >
            + Create Project
          </button>

        </div>

        {showForm && (
          <div className="project-form-card">

            <div className="form-header">

              <div>
                <h2>Create New Project</h2>

                <p>
                  Add a new project to your workspace.
                </p>
              </div>

              <button
                type="button"
                className="close-form-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleCreateProject}>

              <label>Project Name</label>

              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <label>Description</label>

              <textarea
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
                rows="4"
              />

              <label>Due Date (optional)</label>

              <input
                type="date"
                value={projectDueDate}
                onChange={(e) => setProjectDueDate(e.target.value)}
              />

              <div className="project-form-actions">

                <button
                  type="button"
                  className="cancel-project-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-project-button"
                >
                  Create Project
                </button>

              </div>

            </form>

          </div>
        )}

        <div className="projects-grid">

          {projects.map((project) => (
            <div
              className="project-page-card"
              key={project.id}
            >

              <div className="project-page-header">

                <div>
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>
                  <ProjectDueDate dueDate={project.dueDate} />
                </div>

                <span
                  className={
                    project.status === 'Completed'
                      ? 'project-status completed'
                      : 'project-status progress-status'
                  }
                >
                  {project.status}
                </span>

              </div>

              <div className="project-page-progress">

                <div className="progress-info">
                  <span>Progress</span>
                  <strong>{project.progress}%</strong>
                </div>

                <div className="progress">

                  <div
                    className="progress-bar"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  ></div>

                </div>

              </div>

              <button
                className="view-project-button"
                onClick={() => openProjectDetails(project.id)}
                disabled={detailsLoading}
              >
                View Project
              </button>

              <div className="card-actions">
                <button
                  type="button"
                  className="btn-edit"
                  onClick={() => startEditProject(project)}
                >
                  ✏ Edit
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  🗑 Delete
                </button>
              </div>

            </div>
          ))}

        </div>

        {editingProject && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>Edit Project</h2>
              <form onSubmit={handleUpdateProject}>
                <label>Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <label>Description</label>
                <textarea
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <label>Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(e.target.value)}
                />

                <label>Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <label>Due Date (optional)</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedProject && (
          <div className="modal-overlay">
            <div className="modal-card project-details-card">
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setSelectedProject(null)
                  setProjectTasks([])
                }}
              >
                ×
              </button>

              <h2>{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>

              <div className="project-details-grid">
                <div>
                  <span>Status</span>
                  <strong>{selectedProject.status}</strong>
                </div>
                <div>
                  <span>Progress</span>
                  <strong>{selectedProject.progress}%</strong>
                </div>
                <div>
                  <span>Related Tasks</span>
                  <strong>{projectTasks.length}</strong>
                </div>
                {selectedProject.dueDate && (
                  <div>
                    <span>Due Date</span>
                    <strong>{formatDueDate(selectedProject.dueDate)}</strong>
                    <DueDateBadge dueDate={selectedProject.dueDate} />
                  </div>
                )}
              </div>

              {projectTasks.length > 0 && (
                <ul className="project-task-list">
                  {projectTasks.map((task) => (
                    <li key={task.id}>
                      {task.title} · {task.status} · {task.priority}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

export default Projects
