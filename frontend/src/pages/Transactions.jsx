import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react'
import TransactionTable from '../components/TransactionTable'
import { formatCurrency } from '../utils/formatters'

const filters = [
  { label: 'All transactions', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expenses', value: 'expense' },
]

function Transactions({ transactions, summary }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const visibleTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...transactions]
      .filter((transaction) => filter === 'all' || transaction.type === filter)
      .filter((transaction) => !query || [
        transaction.description,
        transaction.merchant,
        transaction.category,
        transaction.date,
      ].some((value) => value.toLowerCase().includes(query)))
      .sort((first, second) => second.date.localeCompare(first.date))
  }, [filter, search, transactions])

  const incomeCount = transactions.filter((transaction) => transaction.type === 'income').length
  const expenseCount = transactions.length - incomeCount

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
          <div><span>Transactions this month</span><strong>{transactions.length}<small> transactions</small></strong></div>
        </div>
      </section>

      <section className="panel transactions-panel">
        <div className="panel-heading transactions-heading">
          <div><h3>All transactions</h3><p>Search and filter your transaction history</p></div>
          <span className="result-count">{visibleTransactions.length} results</span>
        </div>
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
        <TransactionTable transactions={visibleTransactions} />
        <div className="table-footer">Showing <strong>{visibleTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions</div>
      </section>
    </div>
  )
}

export default Transactions
