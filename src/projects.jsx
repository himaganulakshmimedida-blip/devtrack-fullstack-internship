import { useState } from 'react'
import Navbar from './components/Navbar'

function Projects({ username, onLogout }) {
  const [projects, setProjects] = useState([
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

  const [showForm, setShowForm] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const handleCreateProject = (e) => {
    e.preventDefault()

    if (!projectName.trim() || !projectDescription.trim()) {
      alert('Please enter project name and description.')
      return
    }

    const newProject = {
      id: Date.now(),
      name: projectName,
      description: projectDescription,
      progress: 0,
      status: 'In Progress',
    }

    setProjects((previousProjects) => [
      ...previousProjects,
      newProject,
    ])

    setProjectName('')
    setProjectDescription('')
    setShowForm(false)
  }

  return (
    <div className="app">

      <Navbar
        username={username}
        onLogout={onLogout}
        currentPage="projects"
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
              Projects
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                color: '#64748b',
                fontSize: '15px',
              }}
            >
              View and manage all your projects.
            </p>
          </div>

          {/* CREATE PROJECT BUTTON */}

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
            + Create Project
          </button>

        </div>

        {/* CREATE PROJECT FORM */}

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
                  Create New Project
                </h2>

                <p
                  style={{
                    margin: '6px 0 0',
                    color: '#64748b',
                  }}
                >
                  Add a new project to your workspace.
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

            <form onSubmit={handleCreateProject}>

              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Project Name
              </label>

              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px',
                  marginBottom: '18px',
                  border: '1px solid #dbe3ee',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
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
                Description
              </label>

              <textarea
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
                rows="4"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px',
                  marginBottom: '18px',
                  border: '1px solid #dbe3ee',
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />

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
                  Create Project
                </button>

              </div>

            </form>

          </div>
        )}

        {/* PROJECT CARDS */}

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

              <button className="view-project-button">
                View Project
              </button>

            </div>
          ))}

        </div>

      </main>

    </div>
  )
}

export default Projects