import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import SimulationResults from '../components/financial-planning/SimulationResults'
import { simulatorDefaults } from '../data/financialPlanningMockData'
import { projectBaseline } from '../utils/financialCalculations'
import { simulateScenario } from '../services/financeApi'

const scenarioFields = [
  { key: 'monthlyIncome', label: 'Monthly income', prefix: '₹', step: '1000' },
  { key: 'monthlyExpenses', label: 'Monthly expenses', prefix: '₹', step: '1000' },
  { key: 'incomeChange', label: 'Income change', suffix: '%', step: '0.5' },
  { key: 'expenseChange', label: 'Expense change', suffix: '%', step: '0.5' },
  { key: 'durationMonths', label: 'Projection duration', suffix: 'months', step: '1' },
  { key: 'currentSavings', label: 'Current savings', prefix: '₹', step: '1000' },
]

function WhatIfSimulator() {
  const [scenario, setScenario] = useState(() => ({ ...simulatorDefaults }))
  const [simulatedScenario, setSimulatedScenario] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const valid = Object.values(scenario).every(Number.isFinite)
    && scenario.monthlyIncome > 0
    && scenario.monthlyExpenses >= 0
    && scenario.currentSavings >= 0
    && scenario.incomeChange >= -100 && scenario.incomeChange <= 1000
    && scenario.expenseChange >= -100 && scenario.expenseChange <= 1000
    && scenario.durationMonths >= 1 && scenario.durationMonths <= 600 && Number.isInteger(scenario.durationMonths)

  const projected = simulatedScenario?.projected || null
  const baseline = useMemo(() => simulatedScenario ? projectBaseline(simulatedScenario.inputs) : null, [simulatedScenario])

  function updateScenario(key, value) {
    setScenario((current) => ({ ...current, [key]: value === '' ? '' : Number(value) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!valid) return
    setError('')
    setSubmitting(true)
    try {
      const response = await simulateScenario({
        monthlyIncome: scenario.monthlyIncome,
        monthlyExpenses: scenario.monthlyExpenses,
        incomeChange: scenario.incomeChange,
        expenseChange: scenario.expenseChange,
        months: scenario.durationMonths,
        currentSavings: scenario.currentSavings,
      })
      const { data } = response
      setSimulatedScenario({
        inputs: { ...scenario },
        projected: {
          projectedSavings: data.projectedTotalSavings,
          scenarioMonthlySurplus: data.projectedMonthlySavings,
          timeline: [
            { period: 'Now', savings: scenario.currentSavings },
            ...data.projectionData.map((point) => ({
              period: `Month ${point.month}`,
              savings: point.totalSavings,
            })),
          ],
        },
      })
    } catch (requestError) {
      setError(requestError.message || 'Unable to simulate this scenario.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-content planning-page">
      <section className="planning-intro">
        <div>
          <span className="eyebrow"><SlidersHorizontal size={13} /> EXPLORE DIFFERENT FUTURES</span>
          <h2>What could your money do?</h2>
          <p>Change your assumptions and see how your finances may grow over time.</p>
        </div>
      </section>

      <form className="planning-card simulator-inputs" onSubmit={handleSubmit}>
        <div className="planning-section-heading"><h2>Adjust your scenario</h2><p>Compare your current plan with these what-if assumptions.</p></div>
        <div className="simulator-fields">
          {scenarioFields.map(({ key, label, prefix, suffix, step }) => (
            <label className="planning-field" key={key}>
              {label}
              <span className={`${prefix ? 'input-with-prefix' : ''} ${suffix ? 'input-with-suffix' : ''}`.trim()}>
                {prefix && <span>{prefix}</span>}
                <input
                  aria-label={label}
                  max={key === 'durationMonths' ? '600' : key.includes('Change') ? '1000' : undefined}
                  min={key === 'monthlyIncome' || key === 'durationMonths' ? '1' : key === 'incomeChange' || key === 'expenseChange' ? '-100' : '0'}
                  onChange={(event) => updateScenario(key, event.target.value)}
                  required
                  step={step}
                  type="number"
                  value={scenario[key]}
                />
                {suffix && <span>{suffix}</span>}
              </span>
            </label>
          ))}
        </div>
        {!valid && <span className="field-error" role="alert">Enter a positive income, non-negative expenses and savings, changes between -100% and 1000%, and a duration between 1 and 600 months.</span>}
        {error && <span className="field-error" role="alert">{error}</span>}
        <button className="button button-primary" disabled={!valid || submitting} type="submit">{submitting ? 'Simulating…' : 'Simulate'}</button>
      </form>

      {projected && baseline && (
        <SimulationResults
          baseline={baseline}
          currentSurplus={simulatedScenario.inputs.monthlyIncome - simulatedScenario.inputs.monthlyExpenses}
          modified={projected}
        />
      )}
    </div>
  )
}

export default WhatIfSimulator
