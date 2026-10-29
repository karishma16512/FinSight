import { BarChart3 } from 'lucide-react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../utils/formatters'

const palette = ['#7158e2', '#4f8cf7', '#39a883', '#e9955c', '#df7893', '#5cc2c0', '#8d79f4', '#f3c267']

function ReportsAnalytics({ transactions = [], budgets = [] }) {
  const analytics = useMemo(() => {
    const monthly = new Map()
    const categoryTotals = new Map()
    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach((transaction) => {
      const amount = Math.abs(transaction.amount)
      const date = new Date(`${transaction.date}T12:00:00`)
      const monthKey = transaction.date.slice(0, 7)
      const label = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
      const bucket = monthly.get(monthKey) || { month: label, monthKey, income: 0, expenses: 0 }

      if (transaction.type === 'income') {
        bucket.income += amount
        totalIncome += amount
      } else {
        bucket.expenses += amount
        totalExpenses += amount
        categoryTotals.set(transaction.category, (categoryTotals.get(transaction.category) || 0) + amount)
      }
      monthly.set(label, bucket)
    })

    const monthlyData = Array.from(monthly.values())
      .map((month) => ({ ...month, savings: month.income - month.expenses }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    const categoryData = Array.from(categoryTotals.entries()).map(([name, value], index) => ({
      name,
      value,
      color: palette[index % palette.length],
    })).sort((left, right) => right.value - left.value)

    const budgetUsage = budgets.map((budget) => ({
      name: budget.category,
      used: budget.spent,
      limit: budget.limit,
      percent: Math.min((budget.spent / budget.limit) * 100, 100),
    }))

    return {
      monthlyData,
      categoryData,
      budgetUsage,
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      averageExpense: monthlyData.length ? totalExpenses / monthlyData.length : 0,
    }
  }, [transactions, budgets])

  return (
    <div className="page-content reports-page">
      <section className="planning-intro">
        <div>
          <span className="eyebrow"><BarChart3 size={13} /> REPORTS & ANALYTICS</span>
          <h2>Your financial pulse.</h2>
          <p>Track your cash flow, spending mix, and progress toward your goals.</p>
        </div>
      </section>

      <section className="planning-summary-grid reports-summary-grid" aria-label="Reports overview">
        <article className="planning-card planning-summary-card">
          <span className="planning-category">TOTAL INCOME</span>
          <strong>{formatCurrency(analytics.totalIncome)}</strong>
          <span>Across current transactions</span>
        </article>
        <article className="planning-card planning-summary-card">
          <span className="planning-category">TOTAL EXPENSES</span>
          <strong>{formatCurrency(analytics.totalExpenses)}</strong>
          <span>Current outflow</span>
        </article>
        <article className="planning-card planning-summary-card">
          <span className="planning-category">NET SAVINGS</span>
          <strong>{formatCurrency(analytics.netSavings)}</strong>
          <span>Income after expenses</span>
        </article>
      </section>

      <section className="charts-grid">
        <article className="panel spending-panel">
          <div className="panel-heading">
            <div>
              <h3>Monthly income vs. expenses</h3>
              <p>Cash flow by month</p>
            </div>
          </div>
          <div className="chart-legend">
            <span><i className="legend-dot legend-income" /> Income</span>
            <span><i className="legend-dot legend-expenses" /> Expenses</span>
          </div>
          <div className="spending-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#eef0f5" strokeDasharray="4 5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, { compact: true })} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="income" fill="#7057df" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="expenses" fill="#b9aff3" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel category-panel">
          <div className="panel-heading">
            <div>
              <h3>Category spending</h3>
              <p>Where your money is going</p>
            </div>
          </div>
          <div className="category-chart-wrap">
            <div className="category-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={82} paddingAngle={3} stroke="none">
                    {analytics.categoryData.map((entry) => <Cell fill={entry.color} key={entry.name} />)}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-label"><strong>{formatCurrency(analytics.totalExpenses)}</strong><span>Spent</span></div>
            </div>
            <div className="category-legend">
              {analytics.categoryData.map((entry) => (
                <div className="category-legend-row" key={entry.name}>
                  <span><i style={{ backgroundColor: entry.color }} />{entry.name}</span>
                  <strong>{formatCurrency(entry.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading recent-heading">
          <div>
            <h3>Savings trend</h3>
            <p>Monthly net cash flow</p>
          </div>
        </div>
        <div className="simulation-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7158e2" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#7158e2" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef0f5" strokeDasharray="4 5" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, { compact: true })} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area dataKey="savings" fill="url(#savingsGradient)" stroke="#7158e2" strokeWidth={2} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel budgets-panel">
        <div className="panel-heading recent-heading">
          <div>
            <h3>Budget utilization</h3>
            <p>How much of each budget is used</p>
          </div>
        </div>
        <div className="budget-analytics">
          {analytics.budgetUsage.map((budget) => (
            <div className="budget-analytics-item" key={budget.name}>
              <div className="budget-analytics-header">
                <span>{budget.name}</span>
                <strong>{Math.round(budget.percent)}%</strong>
              </div>
              <div className="budget-analytics-bar">
                <span style={{ width: `${budget.percent}%` }} />
              </div>
              <div className="budget-analytics-meta">
                <small>{formatCurrency(budget.used)} used</small>
                <small>{formatCurrency(budget.limit)} limit</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ReportsAnalytics
