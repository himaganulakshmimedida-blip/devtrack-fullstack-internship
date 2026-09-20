function TaskCard({
  title,
  project,
  priority,
  status,
  assignedTo,
  dueDate,
  onStatusChange,
}) {
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : null

  return (
    <div className="task-card">
      <div>
        <h3>{title}</h3>
        <p>{project}</p>
        {(assignedTo || formattedDueDate) && (
          <p className="task-meta">
            {assignedTo ? `Assigned to: ${assignedTo}` : ''}
            {assignedTo && formattedDueDate ? ' · ' : ''}
            {formattedDueDate ? `Due: ${formattedDueDate}` : ''}
          </p>
        )}
      </div>

      <div className="task-info">
        <span className={`priority ${priority.toLowerCase()}`}>
          {priority}
        </span>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>
  )
}

export default TaskCard
