import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import SimulationResults from '../components/financial-planning/SimulationResults'
import { simulatorDefaults } from '../data/financialPlanningMockData'
import { projectBaseline, projectScenario } from '../utils/financialCalculations'

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
  const valid = Object.values(scenario).every(Number.isFinite)
    && scenario.monthlyIncome > 0
    && scenario.monthlyExpenses >= 0
    && scenario.currentSavings >= 0
    && scenario.incomeChange >= -100 && scenario.incomeChange <= 1000
    && scenario.expenseChange >= -100 && scenario.expenseChange <= 1000
    && scenario.durationMonths >= 1 && scenario.durationMonths <= 600 && Number.isInteger(scenario.durationMonths)

  const projected = useMemo(() => simulatedScenario ? projectScenario(simulatedScenario) : null, [simulatedScenario])
  const baseline = useMemo(() => simulatedScenario ? projectBaseline(simulatedScenario) : null, [simulatedScenario])

  function updateScenario(key, value) {
    setScenario((current) => ({ ...current, [key]: value === '' ? '' : Number(value) }))
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

      <form className="planning-card simulator-inputs" onSubmit={(event) => {
        event.preventDefault()
        if (valid) setSimulatedScenario({ ...scenario })
      }}>
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
        <button className="button button-primary" disabled={!valid} type="submit">Simulate</button>
      </form>

      {projected && baseline && (
        <SimulationResults
          baseline={baseline}
          currentSurplus={simulatedScenario.monthlyIncome - simulatedScenario.monthlyExpenses}
          modified={projected}
        />
      )}
    </div>
  )
}

export default WhatIfSimulator
