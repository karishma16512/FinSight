import { Calculator, Info } from 'lucide-react'
import { useState } from 'react'
import EMIResultCard from '../components/financial-planning/EMIResultCard'
import { calculateEmi } from '../utils/financialCalculations'

function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState('2500000')
  const [annualRate, setAnnualRate] = useState('8.5')
  const [tenure, setTenure] = useState('20')
  const [tenureUnit, setTenureUnit] = useState('years')
  const [submitted, setSubmitted] = useState(false)

  const principal = Number(loanAmount)
  const rate = Number(annualRate)
  const tenureMonths = Number(tenure) * (tenureUnit === 'years' ? 12 : 1)
  const valid = loanAmount !== '' && annualRate !== '' && tenure !== ''
    && Number.isFinite(principal) && principal > 0
    && Number.isFinite(rate) && rate >= 0
    && Number.isFinite(tenureMonths) && Number.isInteger(tenureMonths) && tenureMonths > 0
  const results = valid ? calculateEmi(principal, rate, tenureMonths) : null

  return (
    <div className="page-content planning-page">
      <section className="planning-intro">
        <div>
          <span className="eyebrow"><Calculator size={13} /> PLAN BEFORE YOU BORROW</span>
          <h2>Know your monthly commitment.</h2>
          <p>Estimate your EMI and understand the total cost of your loan.</p>
        </div>
      </section>

      <div className="calculator-layout">
        <form className="planning-card calculator-inputs" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
          <div className="planning-section-heading"><h2>Loan details</h2><p>Adjust values to explore different repayment plans.</p></div>
          <label className="planning-field">
            Loan amount
            <span className="input-with-prefix"><span>₹</span><input aria-label="Loan amount in rupees" min="1" onChange={(event) => setLoanAmount(event.target.value)} required step="1000" type="number" value={loanAmount} /></span>
          </label>
          <label className="planning-field">
            Annual interest rate
            <span className="input-with-suffix"><input aria-label="Annual interest rate" min="0" onChange={(event) => setAnnualRate(event.target.value)} required step="0.1" type="number" value={annualRate} /><span>%</span></span>
          </label>
          <div className="planning-form-row">
            <label className="planning-field">
              Loan tenure
              <input aria-label="Loan tenure" min="1" onChange={(event) => setTenure(event.target.value)} required step="1" type="number" value={tenure} />
            </label>
            <label className="planning-field">
              Tenure unit
              <select aria-label="Tenure unit" onChange={(event) => setTenureUnit(event.target.value)} value={tenureUnit}>
                <option value="months">Months</option><option value="years">Years</option>
              </select>
            </label>
          </div>
          {!valid && <span className="field-error" role="alert">Enter a positive loan amount and tenure, and a non-negative interest rate.</span>}
          <div className="planning-hint"><Info size={15} /><span>Estimates use a fixed rate and equal monthly payments. Actual lender terms may vary.</span></div>
          <button className="button button-primary" disabled={!valid} type="submit">Calculate EMI</button>
        </form>

        {submitted && results && <EMIResultCard principal={principal} results={results} />}
      </div>
    </div>
  )
}

export default EMICalculator
