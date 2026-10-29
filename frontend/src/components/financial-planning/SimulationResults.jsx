import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { formatCurrency } from '../../utils/formatters'

function SimulationResults({ baseline, currentSurplus, modified }) {
  const chartData = modified.timeline.map((point, index) => ({
    period: point.period,
    simulated: point.savings,
    baseline: baseline.timeline[index]?.savings ?? 0,
  }))

  return (
    <>
      <section className="simulation-summary-grid" aria-label="Scenario comparison">
        <article className="planning-card simulation-stat">
          <span className="planning-category">CURRENT MONTHLY SURPLUS</span>
          <strong>{formatCurrency(currentSurplus)}</strong>
          <span>Income less expenses today</span>
        </article>
        <article className="planning-card simulation-stat">
          <span className="planning-category">CURRENT SAVINGS</span>
          <strong>{formatCurrency(baseline.projectedSavings)}</strong>
          <span>Future savings if income and expenses stay unchanged</span>
        </article>
        <article className="planning-card simulation-stat">
          <span className="planning-category">PROJECTED SAVINGS</span>
          <strong>{formatCurrency(modified.projectedSavings)}</strong>
          <span>Future savings after the selected income and expense changes</span>
        </article>
        <article className="planning-card simulation-stat simulation-stat-highlight">
          <span className="planning-category">MONTHLY SCENARIO SURPLUS</span>
          <strong>{formatCurrency(modified.scenarioMonthlySurplus)}</strong>
          <span>Adjusted income less adjusted expenses</span>
        </article>
      </section>

      <section className="planning-card simulation-chart-card">
        <div className="planning-section-heading">
          <div><span className="eyebrow">SAVINGS PROJECTION</span><h2>Current plan vs. what-if scenario</h2></div>
          <p>Projected savings over time</p>
        </div>
        <div aria-label="Chart comparing baseline savings with projected scenario savings over time" className="simulation-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 16, right: 12, left: 4, bottom: 2 }}>
              <CartesianGrid stroke="#eef0f5" strokeDasharray="4 5" vertical={false} />
              <XAxis dataKey="period" interval="preserveStartEnd" axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a9', fontSize: 10 }} tickFormatter={(value) => formatCurrency(value, { compact: true })} width={66} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line dataKey="baseline" name="Current plan" stroke="#a9a0d4" strokeWidth={2} dot={false} />
              <Line dataKey="simulated" name="What-if scenario" stroke="#7058db" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="assumptions-note">Assumptions: the selected percentage changes are applied once to monthly income and expenses, then the adjusted monthly surplus is held constant for the selected duration. The baseline uses unchanged income and expenses. Taxes, fees, inflation, and investment returns are not included.</p>
      </section>
    </>
  )
}

export default SimulationResults
