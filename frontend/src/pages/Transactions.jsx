import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Plus, Search, SlidersHorizontal } from 'lucide-react'
import TransactionTable from '../components/TransactionTable'
import { deleteTransaction, saveTransaction } from '../services/financeApi'
import { formatCurrency } from '../utils/formatters'

const filters = [
  { label: 'All transactions', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expenses', value: 'expense' },
]

function getLocalDate() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const defaultForm = {
  description: '',
  amount: '',
  type: 'expense',
  category: '',
  date: getLocalDate(),
  notes: '',
}

function Transactions({ transactions, summary, onDataChange }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const visibleTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...transactions]
      .filter((transaction) => filter === 'all' || transaction.type === filter)
      .filter((transaction) => category === 'all' || transaction.category === category)
      .filter((transaction) => !startDate || transaction.date >= startDate)
      .filter((transaction) => !endDate || transaction.date <= endDate)
      .filter((transaction) => !query || [
        transaction.description,
        transaction.merchant,
        transaction.category,
        transaction.date,
      ].some((value) => value.toLowerCase().includes(query)))
      .sort((first, second) => second.date.localeCompare(first.date))
  }, [category, endDate, filter, search, startDate, transactions])

  const incomeCount = transactions.filter((transaction) => transaction.type === 'income').length
  const expenseCount = transactions.length - incomeCount
  const categories = [...new Set(transactions.map((transaction) => transaction.category))].sort()

  function openForm(transaction = null) {
    setEditing(transaction)
    setFormOpen(true)
    setForm(transaction ? {
      description: transaction.description,
      amount: String(Math.abs(transaction.amount)),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      notes: transaction.notes || '',
    } : { ...defaultForm, date: getLocalDate() })
    setError('')
    setSuccess('')
  }

  function handleSave(event) {
    event.preventDefault()
    try {
      saveTransaction(form, editing?.id)
      onDataChange()
      setFormOpen(false)
      setError('')
      setSuccess(editing ? 'Transaction updated.' : 'Transaction added.')
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this transaction.')
    }
  }

  function handleDelete(transaction) {
    if (!window.confirm(`Delete "${transaction.description}"? This cannot be undone.`)) return
    try {
      deleteTransaction(transaction.id)
      onDataChange()
      setError('')
      setSuccess('Transaction deleted.')
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this transaction.')
    }
  }

  return (
    <div className="page-content">
      <section className="transaction-overview">
        <div className="overview-item">
          <span className="overview-icon overview-income"><ArrowDownLeft size={18} /></span>
          <div><span>Total income</span><strong>{formatCurrency(summary.income)}</strong></div>
        </div>
        <div className="overview-divider" />
        <div className="overview-item">
          <span className="overview-icon overview-expense"><ArrowUpRight size={18} /></span>
          <div><span>Total expenses</span><strong>{formatCurrency(summary.expenses)}</strong></div>
        </div>
        <div className="overview-divider" />
        <div className="overview-item overview-count">
          <div><span>Transaction history</span><strong>{transactions.length}<small> transactions</small></strong></div>
        </div>
      </section>

      <section className="panel transactions-panel">
        <div className="panel-heading transactions-heading">
          <div><h3>All transactions</h3><p>Search and filter your transaction history</p></div>
          <button className="button button-primary" onClick={() => openForm()} type="button"><Plus size={16} /> Add transaction</button>
        </div>
        {error && <div className="notice-error" role="alert">{error}</div>}
        {success && <div className="planning-success" role="status">{success}</div>}
        <div className="transaction-toolbar">
          <label className="transaction-search">
            <Search size={17} />
            <input
              aria-label="Search transactions"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, category, or date..."
              value={search}
            />
            {search && <button aria-label="Clear search" onClick={() => setSearch('')} type="button">×</button>}
          </label>
          <div className="filter-group" role="group" aria-label="Filter transactions">
            <SlidersHorizontal className="filter-icon" size={16} />
            {filters.map((item) => (
              <button
                aria-pressed={filter === item.value}
                className={`filter-button ${filter === item.value ? 'filter-active' : ''}`}
                key={item.value}
                onClick={() => setFilter(item.value)}
                type="button"
              >
                {item.label}
                {item.value === 'income' && <span>{incomeCount}</span>}
                {item.value === 'expense' && <span>{expenseCount}</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="transaction-filter-details">
          <label>Category
            <select onChange={(event) => setCategory(event.target.value)} value={category}>
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>From <input aria-label="Start date" onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} /></label>
          <label>To <input aria-label="End date" onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} /></label>
          {(category !== 'all' || startDate || endDate) && <button className="text-button" onClick={() => { setCategory('all'); setStartDate(''); setEndDate('') }} type="button">Clear filters</button>}
        </div>
        <TransactionTable onDelete={handleDelete} onEdit={openForm} transactions={visibleTransactions} />
        <div className="table-footer">Showing <strong>{visibleTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions</div>
      </section>

      {formOpen && (
        <div className="planning-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setFormOpen(false)
        }}>
          <section aria-labelledby="transaction-form-heading" aria-modal="true" className="planning-modal" role="dialog">
            <div className="planning-section-heading"><h2 id="transaction-form-heading">{editing ? 'Edit transaction' : 'Add transaction'}</h2><p>Record an income or expense in your transaction history.</p></div>
            <form className="planning-form" onSubmit={handleSave}>
              <label>Transaction name<input autoFocus maxLength="80" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required value={form.description} /></label>
              <div className="planning-form-row">
                <label>Type<select onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} value={form.type}><option value="expense">Expense</option><option value="income">Income</option></select></label>
                <label>Amount<input min="0.01" onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} required step="0.01" type="number" value={form.amount} /></label>
              </div>
              <div className="planning-form-row">
                <label>Category<input maxLength="40" onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder={form.type === 'income' ? 'e.g. Salary' : 'e.g. Groceries'} required value={form.category} /></label>
                <label>Date<input onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} required type="date" value={form.date} /></label>
              </div>
              <label>Description<input maxLength="160" onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Optional details" value={form.notes} /></label>
              {error && <span className="field-error" role="alert">{error}</span>}
              <div className="planning-form-actions">
                <button className="button button-secondary" onClick={() => setFormOpen(false)} type="button">Cancel</button>
                <button className="button button-primary" type="submit">{editing ? 'Save changes' : 'Add transaction'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Transactions
