function ProjectCard({ name, description, progress }) {
  return (
    <div className="project-card">
      <h3>{name}</h3>

      <p>{description}</p>

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