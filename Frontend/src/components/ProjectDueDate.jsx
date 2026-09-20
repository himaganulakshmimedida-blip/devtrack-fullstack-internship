import {
  formatDueDateDisplay,
  getDueDateCountdown,
  getDueDateInfo,
} from '../utils/dueDate'

function CalendarIcon() {
  return (
    <svg
      className="project-due-icon"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5 1.5v2M11 1.5v2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ProjectDueDate({ dueDate }) {
  const formattedDate = formatDueDateDisplay(dueDate)
  const countdown = getDueDateCountdown(dueDate)
  const info = getDueDateInfo(dueDate)

  if (!dueDate || !formattedDate) {
    return (
      <div className="project-due-date project-due-empty">
        <CalendarIcon />
        <div className="project-due-text">
          <span className="project-due-label">No due date</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`project-due-date project-due-${info?.type || 'upcoming'}`}
    >
      <CalendarIcon />
      <div className="project-due-text">
        <span className="project-due-label">Due: {formattedDate}</span>
        <span className="project-due-countdown">{countdown}</span>
      </div>
    </div>
  )
}

export default ProjectDueDate
