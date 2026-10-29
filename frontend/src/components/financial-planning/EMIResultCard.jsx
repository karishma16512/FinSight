import { formatCurrency } from '../../utils/formatters'

function EMIResultCard({ principal, results }) {
  const interestShare = results.totalRepayment > 0
    ? (results.totalInterest / results.totalRepayment) * 100
    : 0

  return (
    <section aria-label="EMI calculation results" className="planning-card emi-results">
      <div className="planning-section-heading">
        <span className="eyebrow">YOUR REPAYMENT PLAN</span>
        <h2>{formatCurrency(results.monthlyEmi)}<small> / month</small></h2>
        <p>Estimated monthly installment</p>
      </div>
      <div className="emi-breakdown">
        <div><span>Loan principal</span><strong>{formatCurrency(principal)}</strong></div>
        <div><span>Total interest</span><strong>{formatCurrency(results.totalInterest)}</strong></div>
        <div><span>Total repayment</span><strong>{formatCurrency(results.totalRepayment)}</strong></div>
      </div>
      <div aria-label={`${Math.round(100 - interestShare)}% principal and ${Math.round(interestShare)}% interest`} className="emi-breakdown-bar">
        <span style={{ width: `${100 - interestShare}%` }} />
      </div>
      <div className="emi-legend">
        <span><i className="legend-dot legend-principal" /> Principal <strong>{formatCurrency(principal)}</strong></span>
        <span><i className="legend-dot legend-interest" /> Interest <strong>{formatCurrency(results.totalInterest)}</strong></span>
      </div>
    </section>
  )
}

export default EMIResultCard
