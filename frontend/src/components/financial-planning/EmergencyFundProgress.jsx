import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

function EmergencyFundProgress({ result, currentSavings, monthlyContribution, recommendedContribution }) {
  const targetReached = result.remainingAmount === 0

  return (
    <section className="planning-card emergency-result">
      <div className="emergency-result-heading">
        <span className="planning-icon planning-icon-green"><ShieldCheck size={20} /></span>
        <div><span className="planning-category">RECOMMENDED SAFETY NET</span><h2>{formatCurrency(result.targetAmount)}</h2></div>
      </div>
      <div className="emergency-progress-label"><span>Your progress</span><strong>{Math.round(result.progress)}%</strong></div>
      <div
        aria-label={`${Math.round(result.progress)}% of emergency fund target`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={Math.round(result.progress)}
        className="planning-progress emergency-progress"
        role="progressbar"
      >
        <span style={{ width: `${result.progress}%` }} />
      </div>
      <div className="emergency-amount-grid">
        <div><span>Saved so far</span><strong>{formatCurrency(currentSavings)}</strong></div>
        <div><span>Still needed</span><strong>{formatCurrency(result.remainingAmount)}</strong></div>
      </div>
      <div className={`planning-insight ${targetReached ? 'insight-success' : ''}`} role="status">
        {targetReached
          ? <><CheckCircle2 size={17} /><span>Your emergency fund target is fully funded.</span></>
          : monthlyContribution > 0
            ? <><ShieldCheck size={17} /><span>At your current pace, you’ll reach your goal in about <strong>{result.monthsToTarget} {result.monthsToTarget === 1 ? 'month' : 'months'}.</strong></span></>
            : <><ShieldCheck size={17} /><span>Add a monthly contribution to estimate your target date.</span></>}
      </div>
      <div className="recommended-contribution">
        <span>To reach your goal in your chosen timeframe</span>
        <strong>{formatCurrency(recommendedContribution)} <small>/ month</small></strong>
      </div>
    </section>
  )
}

export default EmergencyFundProgress
