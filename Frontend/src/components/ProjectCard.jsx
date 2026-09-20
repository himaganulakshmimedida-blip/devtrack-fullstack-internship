import ProjectDueDate from './ProjectDueDate'

function ProjectCard({ name, description, progress, dueDate }) {
  return (
    <div className="project-card">
      <h3>{name}</h3>

      <p>{description}</p>

      <ProjectDueDate dueDate={dueDate} />

      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <span>{progress}% completed</span>
    </div>
  )
}

export default ProjectCard
