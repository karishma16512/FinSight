import { AlertTriangle, ArrowRight, BookOpen, CarFront, Clapperboard, HeartPulse, Home, Pencil, Plus, ShoppingBag, ShoppingCart, Trash2, Zap } from 'lucide-react'
import { useState } from 'react'
import { deleteBudget, saveBudget } from '../services/financeApi'
import { formatCurrency } from '../utils/formatters'

const budgetIcons = {
  home: Home,
  'shopping-cart': ShoppingCart,
  car: CarFront,
  zap: Zap,
  education: BookOpen,
  healthcare: HeartPulse,
  shopping: ShoppingBag,
  entertainment: Clapperboard,
}

function Budgets({ budgets, onDataChange }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ category: '', limit: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [alertDismissed, setAlertDismissed] = useState(false)
  const [monthLabel] = useState(() => new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date()))
  const totalLimit = budgets.reduce((total, budget) => total + budget.limit, 0)
  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0)
  const overspentBudgets = budgets.filter((budget) => budget.spent > budget.limit)
  const remaining = totalLimit - totalSpent
  const percentageUsed = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0

  function openForm(budget = null) {
    setEditing(budget)
    setForm(budget ? { category: budget.category, limit: String(budget.limit) } : { category: '', limit: '' })
    setFormOpen(true)
    setError('')
  }

  function handleSave(event) {
    event.preventDefault()
    try {
      saveBudget({
        ...editing,
        ...form,
        icon: editing?.icon || 'shopping-cart',
        color: editing?.color || 'violet',
      }, editing?.id)
      onDataChange()
      setFormOpen(false)
      setSuccess(editing ? 'Budget updated.' : 'Budget created.')
      setError('')
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this budget.')
    }
  }

  function handleDelete(budget) {
    if (!window.confirm(`Delete the ${budget.category} budget?`)) return
    try {
      deleteBudget(budget.id)
      onDataChange()
      setSuccess(`${budget.category} budget deleted.`)
      setError('')
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this budget.')
    }
  }

  return (
    <div className="page-content">
      <div className="budgets-toolbar">
        <div className="month-selector"><span className="month-dot" /> {monthLabel}</div>
        <button className="button button-primary" onClick={() => openForm()} type="button"><Plus size={17} /> Create a budget</button>
      </div>

      {error && !formOpen && <div className="notice-error" role="alert">{error}</div>}
      {success && <div className="planning-success" role="status">{success}</div>}
      <section className="budget-summary-grid">
        <article className="budget-summary-card budget-total-card">
          <div className="budget-summary-label">Total monthly budget</div>
          <strong>{formatCurrency(totalLimit)}</strong>
          <div className="summary-progress"><span style={{ width: `${Math.min(percentageUsed, 100)}%` }} /></div>
          <div className="summary-meta"><span>{formatCurrency(totalSpent)} spent</span><span>{percentageUsed}% used</span></div>
        </article>
        <article className="budget-summary-card">
          <span className="budget-summary-icon remaining-icon"><ArrowRight size={18} /></span>
          <div className="budget-summary-label">Left to spend</div>
          <strong>{formatCurrency(remaining)}</strong>
          <span className="summary-caption">across {budgets.length} budget categories</span>
        </article>
        <article className="budget-summary-card">
          <span className={`budget-summary-icon ${overspentBudgets.length ? 'overspent-icon' : 'on-track-icon'}`}>
            {overspentBudgets.length ? <AlertTriangle size={18} /> : <ArrowRight size={18} />}
          </span>
          <div className="budget-summary-label">Needs attention</div>
          <strong>{overspentBudgets.length} <small>{overspentBudgets.length === 1 ? 'category' : 'categories'}</small></strong>
          <span className="summary-caption">{overspentBudgets.length ? 'Over the monthly limit' : 'All budgets are on track'}</span>
        </article>
      </section>

      {overspentBudgets.length > 0 && !alertDismissed && (
        <div className="overspend-alert" role="status">
          <span className="alert-icon"><AlertTriangle size={18} /></span>
          <div><strong>You’ve gone over budget in {overspentBudgets.length} {overspentBudgets.length === 1 ? 'category' : 'categories'}.</strong><p>{overspentBudgets.map((budget) => `${budget.category} by ${formatCurrency(budget.spent - budget.limit)}`).join(' · ')}. Consider adjusting your spending plan.</p></div>
          <button onClick={() => setAlertDismissed(true)} type="button" aria-label="Dismiss overspending alert">×</button>
        </div>
      )}

      <section className="budget-section">
        <div className="budget-section-heading">
          <div><h3>Monthly budgets</h3><p>Track your spending against the limits you set</p></div>
          <span className="result-count">{budgets.length} categories</span>
        </div>
        <div className="budget-grid">
          {budgets.map((budget) => {
            const Icon = budgetIcons[budget.icon] || ShoppingCart
            const overBudget = budget.spent > budget.limit
            const percentage = Math.round((budget.spent / budget.limit) * 100)
            const remainingAmount = budget.limit - budget.spent

            return (
              <article className={`budget-card ${overBudget ? 'budget-card-over' : ''}`} key={budget.id}>
                <div className="budget-card-top">
                  <span className={`budget-category-icon category-${budget.color}`}><Icon size={19} /></span>
                  {overBudget && <span className="overspent-badge"><AlertTriangle size={12} /> Over budget</span>}
                  <div className="budget-actions">
                    <button className="row-action" onClick={() => openForm(budget)} type="button" aria-label={`Edit ${budget.category} budget`}><Pencil size={14} /></button>
                    <button className="row-action" onClick={() => handleDelete(budget)} type="button" aria-label={`Delete ${budget.category} budget`}><Trash2 size={14} /></button>
                  </div>
                </div>
                <h4>{budget.category}</h4>
                <div className="budget-spending"><strong>{formatCurrency(budget.spent)}</strong><span>of {formatCurrency(budget.limit)}</span></div>
                <div className={`budget-progress progress-${budget.color} ${overBudget ? 'progress-over' : ''}`}>
                  <span style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
                <div className={`budget-remaining ${overBudget ? 'remaining-over' : ''}`}>
                  <span>{overBudget ? `${formatCurrency(Math.abs(remainingAmount))} over limit` : `${formatCurrency(remainingAmount)} remaining`}</span>
                  <strong>{percentage}%</strong>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      {formOpen && (
        <div className="planning-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setFormOpen(false)
        }}>
          <section aria-labelledby="budget-form-heading" aria-modal="true" className="planning-modal" role="dialog">
            <div className="planning-section-heading"><h2 id="budget-form-heading">{editing ? 'Edit budget' : 'Create a monthly budget'}</h2><p>Set a monthly spending limit for a category.</p></div>
            <form className="planning-form" onSubmit={handleSave}>
              <label>Category<input autoFocus maxLength="40" onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required value={form.category} /></label>
              <label>Monthly limit<input min="0.01" onChange={(event) => setForm((current) => ({ ...current, limit: event.target.value }))} required step="0.01" type="number" value={form.limit} /></label>
              {error && <span className="field-error" role="alert">{error}</span>}
              <div className="planning-form-actions">
                <button className="button button-secondary" onClick={() => setFormOpen(false)} type="button">Cancel</button>
                <button className="button button-primary" type="submit">{editing ? 'Save changes' : 'Create budget'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Budgets
