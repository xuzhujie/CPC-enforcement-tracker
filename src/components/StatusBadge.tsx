type BadgeTone = 'risk' | 'success' | 'neutral' | 'amber' | 'ink'

type StatusBadgeProps = {
  label: string
  tone?: BadgeTone
  dot?: boolean
}

export function StatusBadge({ label, tone = 'neutral', dot = true }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${tone}`}>
      {dot && <span className="status-badge__dot" aria-hidden="true" />}
      <span>{label}</span>
    </span>
  )
}
