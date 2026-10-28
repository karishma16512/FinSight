import { ArrowDownRight, ArrowUpRight, CalendarDays, ChevronDown, Plus, Wallet, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import StatCard from '../components/StatCard'
import TransactionTable from '../components/TransactionTable'
import { formatCurrency } from '../utils/formatters'

function SpendingTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="chart-tooltip">
      <strong>{label} 2026</strong>
      {payload.map((item) => (
        <div className="tooltip-row" key={item.dataKey}>
          <span><i style={{ backgroundColor: item.color }} />{item.name}</span>
          <b>{formatCurrency(item.value)}</b>
        </div>
      ))}
    </div>
  )
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return <div className="chart-tooltip"><strong>{name}</strong><div className="tooltip-row"><span>Spent</span><b>{formatCurrency(value)}</b></div></div>
}

function Dashboard({ data }) {
  const { summary, monthlySpending, expenseCategories, transactions } = data
  const latestTransactions = [...transactions]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 5)
  const categoryTotal = expenseCategories.reduce((total, category) => total + category.value, 0)

  return (
    <div className="page-content dashboard-page">
      <div className="welcome-strip">
        <div>
          <div className="eyebrow"><span className="status-dot" /> YOUR FINANCES AT A GLANCE</div>
          <h2>Good afternoon, Jordan <span aria-hidden="true">✦</span></h2>
          <p>You’re doing great — your spending is down this month.</p>
        </div>
        <Link className="button button-primary" to="/transactions"><Plus size={17} /> View transactions</Link>
      </div>

      <section className="stats-grid" aria-label="Monthly financial summary">
        <StatCard label="Available balance" value={formatCurrency(summary.balance)} change={summary.balanceChange} note="vs. last month" icon={Wallet} tone="violet" />
        <StatCard label="Total income" value={formatCurrency(summary.income)} change={summary.incomeChange} note="vs. last month" icon={ArrowDownRight} tone="green" />
        <StatCard label="Total expenses" value={formatCurrency(summary.expenses)} change={summary.expenseChange} note="vs. last month" icon={ArrowUpRight} tone="blue" />
        <article className="stat-card savings-card">
          <div className="stat-icon stat-icon-orange"><WalletCards size={19} /></div>
          <div className="stat-label">Savings rate</div>
          <div className="stat-value">{summary.savingsRate}<span className="value-suffix">%</span></div>
          <div className="savings-track"><span style={{ width: `${summary.savingsRate}%` }} /></div>
          <div className="savings-caption">of your income saved this month</div>
        </article>
      </section>

      <section className="charts-grid">
        <article className="panel spending-panel">
          <div className="panel-heading">
            <div><h3>Income vs. expenses</h3><p>Your monthly cash flow over time</p></div>
            <button type="button" className="select-button"><CalendarDays size={15} /> Last 6 months <ChevronDown size={14} /></button>
          </div>
          <div className="chart-legend">
            <span><i className="legend-dot legend-income" /> Income</span>
            <span><i className="legend-dot legend-expenses" /> Expenses</span>
          </div>
          <div className="spending-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpending} margin={{ top: 10, right: 6, left: -12, bottom: 0 }} barGap={7}>
                <CartesianGrid vertical={false} stroke="#eef0f5" strokeDasharray="4 5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, { compact: true })} />
                <Tooltip content={<SpendingTooltip />} cursor={{ fill: '#f5f6fa' }} />
                <Bar dataKey="income" name="Income" fill="#7057df" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="expenses" name="Expenses" fill="#b9aff3" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel category-panel">
          <div className="panel-heading">
            <div><h3>Spending breakdown</h3><p>Where your money went</p></div>
            <button type="button" className="select-button">This month <ChevronDown size={14} /></button>
          </div>
          <div className="category-chart-wrap">
            <div className="category-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseCategories} dataKey="value" nameKey="name" innerRadius={66} outerRadius={88} paddingAngle={3} stroke="none">
                    {expenseCategories.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CategoryTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-label"><strong>{formatCurrency(categoryTotal)}</strong><span>Total spent</span></div>
            </div>
            <div className="category-legend">
              {expenseCategories.map((category) => (
                <div className="category-legend-row" key={category.name}>
                  <span><i style={{ backgroundColor: category.color }} />{category.name}</span>
                  <strong>{formatCurrency(category.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="panel recent-panel">
        <div className="panel-heading recent-heading">
          <div><h3>Recent transactions</h3><p>Your latest money movements</p></div>
          <Link className="text-link" to="/transactions">View all transactions <span aria-hidden="true">→</span></Link>
        </div>
        <TransactionTable transactions={latestTransactions} compact />
      </section>
    </div>
  )
}

export default Dashboard
