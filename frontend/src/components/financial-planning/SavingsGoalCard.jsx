import { CalendarDays, Pencil, Plus, Target, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'

function SavingsGoalCard({ goal, onAddMoney, onDelete, onEdit }) {
  const progress = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)

  return (
    <article className="planning-card savings-goal-card">
      <div className="planning-card-top">
        <span className="planning-icon planning-icon-violet"><Target size={19} /></span>
        <div className="planning-card-actions">
          <button aria-label={`Edit ${goal.name}`} className="row-action" onClick={() => onEdit(goal)} type="button"><Pencil size={15} /></button>
          <button aria-label={`Delete ${goal.name}`} className="row-action" onClick={() => onDelete(goal)} type="button"><Trash2 size={15} /></button>
        </div>
      </div>
      <span className="planning-category">{goal.category}</span>
      <h3>{goal.name}</h3>
      <div className="goal-amounts"><strong>{formatCurrency(goal.currentAmount)}</strong><span>of {formatCurrency(goal.targetAmount)}</span></div>
      <div
        aria-label={`${Math.round(progress)}% complete`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={Math.round(progress)}
        className="planning-progress"
        role="progressbar"
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="goal-progress-caption"><span>{Math.round(progress)}% complete</span><strong>{formatCurrency(remaining)} to go</strong></div>
      <div className="goal-footer">
        <span><CalendarDays size={14} /> {formatDate(goal.targetDate)}</span>
        <button className="text-button" disabled={remaining === 0} onClick={() => onAddMoney(goal)} type="button">
          <Plus size={14} /> Add money
        </button>
      </div>
    </article>
  )
}

export default SavingsGoalCard
