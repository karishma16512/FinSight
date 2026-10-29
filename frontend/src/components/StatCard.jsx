import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

function StatCard({ label, value, change, note, icon: Icon, tone }) {
  const isPositive = (change ?? 0) >= 0
  const isFavorable = label === 'Total expenses' ? !isPositive : isPositive

  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}><Icon size={19} strokeWidth={2} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {(change !== undefined || note) && (
        <div className="stat-foot">
          {change !== undefined && <span className={`stat-change ${isFavorable ? 'change-positive' : 'change-negative'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </span>}
          {note && <span>{note}</span>}
        </div>
      )}
    </article>
  )
}

export default StatCard
