import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import EmergencyFundProgress from '../components/financial-planning/EmergencyFundProgress'
import { calculateEmergencyFund } from '../utils/financialCalculations'

function EmergencyFund() {
  const [monthlyExpenses, setMonthlyExpenses] = useState('45000')
  const [monthsToCover, setMonthsToCover] = useState('6')
  const [currentSavings, setCurrentSavings] = useState('90000')
  const [monthlyContribution, setMonthlyContribution] = useState('10000')
  const [targetTimeline, setTargetTimeline] = useState('12')

  const expenses = Number(monthlyExpenses)
  const months = Number(monthsToCover)
  const savings = Number(currentSavings)
  const contribution = Number(monthlyContribution)
  const timeline = Number(targetTimeline)
  const valid = [expenses, months, savings, contribution, timeline].every(Number.isFinite)
    && expenses > 0 && months > 0 && Number.isInteger(months)
    && savings >= 0 && contribution >= 0 && timeline > 0 && Number.isInteger(timeline)
  const result = valid
    ? calculateEmergencyFund(expenses, months, savings, contribution)
    : null
  const recommendedContribution = result
    ? result.remainingAmount / timeline
    : 0

  return (
    <div className="page-content planning-page">
      <section className="planning-intro">
        <div>
          <span className="eyebrow"><ShieldCheck size={13} /> PREPARE FOR THE UNEXPECTED</span>
          <h2>A safety net, one month at a time.</h2>
          <p>Build a cash reserve around your essential monthly expenses.</p>
        </div>
      </section>

      <div className="calculator-layout">
        <section className="planning-card calculator-inputs">
          <div className="planning-section-heading"><h2>Your emergency fund plan</h2><p>Set a target that reflects your household and timeline.</p></div>
          <label className="planning-field">
            Monthly essential expenses
            <span className="input-with-prefix"><span>₹</span><input min="1" onChange={(event) => setMonthlyExpenses(event.target.value)} required step="1000" type="number" value={monthlyExpenses} /></span>
          </label>
          <label className="planning-field">
            Emergency fund coverage
            <select onChange={(event) => setMonthsToCover(event.target.value)} value={monthsToCover}>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </label>
          <label className="planning-field">
            Current emergency savings
            <span className="input-with-prefix"><span>₹</span><input min="0" onChange={(event) => setCurrentSavings(event.target.value)} required step="1000" type="number" value={currentSavings} /></span>
          </label>
          <label className="planning-field">
            Monthly contribution
            <span className="input-with-prefix"><span>₹</span><input min="0" onChange={(event) => setMonthlyContribution(event.target.value)} required step="500" type="number" value={monthlyContribution} /></span>
          </label>
          <label className="planning-field">
            Reach the target within (months)
            <input min="1" onChange={(event) => setTargetTimeline(event.target.value)} required step="1" type="number" value={targetTimeline} />
          </label>
          {!valid && <span className="field-error" role="alert">Enter positive expenses and timeframes, and savings and contributions of zero or more.</span>}
          <div className="planning-hint"><ShieldCheck size={15} /><span>Emergency funds are generally kept accessible and separate from long-term investments.</span></div>
        </section>

        {result && (
          <EmergencyFundProgress
            currentSavings={savings}
            monthlyContribution={contribution}
            recommendedContribution={recommendedContribution}
            result={result}
          />
        )}
      </div>
    </div>
  )
}

export default EmergencyFund
