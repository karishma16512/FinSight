import { useMemo, useState } from 'react'
import { Plus, Target } from 'lucide-react'
import SavingsGoalCard from '../components/financial-planning/SavingsGoalCard'
import SavingsGoalForm from '../components/financial-planning/SavingsGoalForm'
import {
  contributeToSavingsGoal, createSavingsGoal, deleteSavingsGoal, getSavingsGoals, updateSavingsGoal,
} from '../services/financialPlanningApi'
import { formatCurrency } from '../utils/formatters'

function SavingsGoals() {
  const [initialState] = useState(() => {
    try {
      return { goals: getSavingsGoals(), error: '' }
    } catch (loadError) {
      return { goals: [], error: loadError.message || 'Unable to load savings goals.' }
    }
  })
  const [goals, setGoals] = useState(initialState.goals)
  const [error, setError] = useState(initialState.error)
  const [formGoal, setFormGoal] = useState(undefined)
  const [contributionGoal, setContributionGoal] = useState(null)
  const [contributionAmount, setContributionAmount] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const totals = useMemo(() => goals.reduce((summary, goal) => ({
    current: summary.current + goal.currentAmount,
    target: summary.target + goal.targetAmount,
  }), { current: 0, target: 0 }), [goals])
  const overallProgress = totals.target > 0 ? Math.min((totals.current / totals.target) * 100, 100) : 0

  function saveGoal(goal) {
    try {
      const nextGoals = formGoal
        ? updateSavingsGoal(formGoal.id, goal)
        : createSavingsGoal(goal)
      setGoals(nextGoals)
      setFormGoal(undefined)
      setError('')
      setSuccessMessage(formGoal ? 'Your savings goal was updated.' : 'Your savings goal was created.')
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this savings goal.')
    }
  }

  function removeGoal(goal) {
    if (!window.confirm(`Delete "${goal.name}"? This cannot be undone.`)) return
    try {
      setGoals(deleteSavingsGoal(goal.id))
      setError('')
      setSuccessMessage(`${goal.name} was deleted.`)
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this savings goal.')
    }
  }

  function addContribution(event) {
    event.preventDefault()
    const amount = Number(contributionAmount)
    if (!contributionGoal || !Number.isFinite(amount) || amount <= 0) return

    try {
      setGoals(contributeToSavingsGoal(contributionGoal.id, amount))
      setContributionGoal(null)
      setContributionAmount('')
      setError('')
      setSuccessMessage('Your contribution was added to the goal.')
    } catch (contributionError) {
      setError(contributionError.message || 'Unable to add this contribution.')
    }
  }

  return (
    <div className="page-content planning-page">
      <section className="planning-intro">
        <div>
          <span className="eyebrow"><Target size={13} /> BUILD TOWARD WHAT MATTERS</span>
          <h2>Small steps, big milestones.</h2>
          <p>Set a target, track your progress, and make your plans happen.</p>
        </div>
        <button className="button button-primary" onClick={() => { setFormGoal(null); setSuccessMessage('') }} type="button">
          <Plus size={17} /> New savings goal
        </button>
      </section>

      {error && <div className="notice-error" role="alert">{error}</div>}
      {successMessage && <div className="planning-success" role="status">{successMessage}</div>}

      {formGoal !== undefined && (
        <div className="planning-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setFormGoal(undefined)
        }}>
          <section aria-labelledby="goal-form-heading" aria-modal="true" className="planning-modal" role="dialog">
            <div className="planning-section-heading"><h2 id="goal-form-heading">{formGoal ? 'Edit savings goal' : 'Create a savings goal'}</h2><p>Choose an amount and target date that work for you.</p></div>
            <SavingsGoalForm goal={formGoal} onCancel={() => setFormGoal(undefined)} onSubmit={saveGoal} />
          </section>
        </div>
      )}

      {contributionGoal && (
        <div className="planning-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setContributionGoal(null)
        }}>
          <section aria-labelledby="contribution-heading" aria-modal="true" className="planning-modal" role="dialog">
            <div className="planning-section-heading"><h2 id="contribution-heading">Add to {contributionGoal.name}</h2><p>Contributions are capped at the remaining target amount.</p></div>
            <form className="planning-form" onSubmit={addContribution}>
              <label>
                Contribution amount
                <input autoFocus min="1" onChange={(event) => setContributionAmount(event.target.value)} required step="1" type="number" value={contributionAmount} />
              </label>
              <div className="planning-form-actions">
                <button className="button button-secondary" onClick={() => setContributionGoal(null)} type="button">Cancel</button>
                <button className="button button-primary" type="submit">Add contribution</button>
              </div>
            </form>
          </section>
        </div>
      )}

      <>
        <section className="planning-summary-grid" aria-label="Savings goals summary">
          <article className="planning-card planning-summary-card">
            <span className="planning-category">TOTAL SAVED</span><strong>{formatCurrency(totals.current)}</strong>
            <span>Across {goals.length} {goals.length === 1 ? 'goal' : 'goals'}</span>
          </article>
          <article className="planning-card planning-summary-card">
            <span className="planning-category">TOTAL TARGET</span><strong>{formatCurrency(totals.target)}</strong>
            <span>Amount you’re working toward</span>
          </article>
          <article className="planning-card planning-summary-card">
            <span className="planning-category">OVERALL PROGRESS</span><strong>{Math.round(overallProgress)}%</strong>
            <div aria-label={`${Math.round(overallProgress)}% overall progress`} aria-valuemax="100" aria-valuemin="0" aria-valuenow={Math.round(overallProgress)} className="planning-progress" role="progressbar">
              <span style={{ width: `${overallProgress}%` }} />
            </div>
            <span>{formatCurrency(Math.max(totals.target - totals.current, 0))} remaining</span>
          </article>
        </section>

        {goals.length === 0 ? (
          <section className="planning-card planning-empty">
            <span className="planning-icon planning-icon-violet"><Target size={22} /></span>
            <h2>No savings goals yet</h2><p>Create your first goal and start tracking your progress.</p>
            <button className="button button-primary" onClick={() => setFormGoal(null)} type="button"><Plus size={16} /> Create a goal</button>
          </section>
        ) : (
          <section aria-label="Your savings goals" className="savings-goals-grid">
            {goals.map((goal) => (
              <SavingsGoalCard
                goal={goal}
                key={goal.id}
                onAddMoney={setContributionGoal}
                onDelete={removeGoal}
                onEdit={(selectedGoal) => setFormGoal(selectedGoal)}
              />
            ))}
          </section>
        )}
      </>
    </div>
  )
}

export default SavingsGoals
