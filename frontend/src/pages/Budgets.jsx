import { AlertTriangle, ArrowRight, BookOpen, CarFront, ChevronDown, Clapperboard, HeartPulse, Home, Plus, ShoppingBag, ShoppingCart, Zap } from 'lucide-react'
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

function Budgets({ budgets }) {
  const totalLimit = budgets.reduce((total, budget) => total + budget.limit, 0)
  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0)
  const overspentBudgets = budgets.filter((budget) => budget.spent > budget.limit)
  const remaining = totalLimit - totalSpent

  return (
    <div className="page-content">
      <div className="budgets-toolbar">
        <div className="month-selector"><span className="month-dot" /> October 2026 <ChevronDown size={16} /></div>
        <button className="button button-primary" type="button"><Plus size={17} /> Create a budget</button>
      </div>

      <section className="budget-summary-grid">
        <article className="budget-summary-card budget-total-card">
          <div className="budget-summary-label">Total monthly budget</div>
          <strong>{formatCurrency(totalLimit)}</strong>
          <div className="summary-progress"><span style={{ width: `${Math.min((totalSpent / totalLimit) * 100, 100)}%` }} /></div>
          <div className="summary-meta"><span>{formatCurrency(totalSpent)} spent</span><span>{Math.round((totalSpent / totalLimit) * 100)}% used</span></div>
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

      {overspentBudgets.length > 0 && (
        <div className="overspend-alert" role="status">
          <span className="alert-icon"><AlertTriangle size={18} /></span>
          <div><strong>You’ve gone over budget in {overspentBudgets.length} {overspentBudgets.length === 1 ? 'category' : 'categories'}.</strong><p>{overspentBudgets.map((budget) => `${budget.category} by ${formatCurrency(budget.spent - budget.limit)}`).join(' · ')}. Consider adjusting your spending plan.</p></div>
          <button type="button" aria-label="Dismiss overspending alert">×</button>
        </div>
      )}

      <section className="budget-section">
        <div className="budget-section-heading">
          <div><h3>Monthly budgets</h3><p>Track your spending against the limits you set</p></div>
          <button type="button" className="select-button">All categories <ChevronDown size={14} /></button>
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
                  {!overBudget && <button className="row-action" type="button" aria-label={`More options for ${budget.category}`}><span>···</span></button>}
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
    </div>
  )
}

export default Budgets
