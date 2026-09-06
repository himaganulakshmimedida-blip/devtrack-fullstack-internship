function TaskCard({ title, project, priority, status }) {
  return (
    <div className="task-card">
      <div>
        <h3>{title}</h3>
        <p>{project}</p>
      </div>

      <div className="task-info">
        <span className={`priority ${priority.toLowerCase()}`}>
          {priority}
        </span>

        <span
          className={`status ${
            status === 'Done'
              ? 'done'
              : status === 'In Progress'
                ? 'progress-status'
                : 'todo'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}

export default TaskCard