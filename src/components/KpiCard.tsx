type KpiCardProps = {
  label: string
  value: number | string
  helper: string
  tone?: 'default' | 'accent' | 'success' | 'muted'
}

export function KpiCard({ label, value, helper, tone = 'default' }: KpiCardProps) {
  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">{value}</p>
      <p className="kpi-card__helper">{helper}</p>
    </article>
  )
}
