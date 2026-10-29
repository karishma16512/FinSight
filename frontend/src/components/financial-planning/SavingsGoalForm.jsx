import { useState } from 'react'

function SavingsGoalForm({ goal, onCancel, onSubmit }) {
  const [name, setName] = useState(goal?.name || '')
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || '')
  const [currentAmount, setCurrentAmount] = useState(goal?.currentAmount || 0)
  const [targetDate, setTargetDate] = useState(goal?.targetDate || '')
  const [category, setCategory] = useState(goal?.category || '')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      targetDate,
      category: category.trim() || 'Personal',
    })
  }

  return (
    <form className="planning-form" onSubmit={handleSubmit}>
      <label>
        Goal name
        <input autoFocus maxLength="60" onChange={(event) => setName(event.target.value)} required value={name} />
      </label>
      <div className="planning-form-row">
        <label>
          Target amount
          <input min="1" onChange={(event) => setTargetAmount(event.target.value)} required step="1" type="number" value={targetAmount} />
        </label>
        <label>
          Current savings
          <input min="0" onChange={(event) => setCurrentAmount(event.target.value)} required step="1" type="number" value={currentAmount} />
        </label>
      </div>
      <div className="planning-form-row">
        <label>
          Target date
          <input onChange={(event) => setTargetDate(event.target.value)} required type="date" value={targetDate} />
        </label>
        <label>
          Category
          <input maxLength="30" onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Travel" value={category} />
        </label>
      </div>
      {Number(currentAmount) > Number(targetAmount) && (
        <span className="field-error" role="alert">Current savings cannot exceed the target amount.</span>
      )}
      <div className="planning-form-actions">
        <button className="button button-secondary" onClick={onCancel} type="button">Cancel</button>
        <button className="button button-primary" disabled={Number(currentAmount) > Number(targetAmount)} type="submit">
          {goal ? 'Save changes' : 'Create goal'}
        </button>
      </div>
    </form>
  )
}

export default SavingsGoalForm
