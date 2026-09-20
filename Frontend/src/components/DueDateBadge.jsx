import { getDueDateInfo, formatDueDate } from '../utils/dueDate'

function DueDateBadge({ dueDate, showDate = false }) {
  const info = getDueDateInfo(dueDate)

  if (!info) return null

  return (
    <span className={`due-date-badge due-date-${info.type}`}>
      {info.text}
      {showDate && formatDueDate(dueDate)
        ? ` · ${formatDueDate(dueDate)}`
        : ''}
    </span>
  )
}

export default DueDateBadge
