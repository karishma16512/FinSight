export function calculateEmi(principal, annualRate, tenureMonths) {
  if (principal <= 0 || tenureMonths <= 0 || annualRate < 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalRepayment: 0 }
  }

  const monthlyRate = annualRate / 1200
  const monthlyEmi = monthlyRate === 0
    ? principal / tenureMonths
    : principal * monthlyRate * ((1 + monthlyRate) ** tenureMonths)
      / (((1 + monthlyRate) ** tenureMonths) - 1)
  const totalRepayment = monthlyEmi * tenureMonths

  return {
    monthlyEmi,
    totalInterest: totalRepayment - principal,
    totalRepayment,
  }
}

export function calculateEmergencyFund(expenses, monthsToCover, currentSavings, contribution) {
  const targetAmount = expenses * monthsToCover
  const remainingAmount = Math.max(targetAmount - currentSavings, 0)
  return {
    targetAmount,
    remainingAmount,
    progress: targetAmount > 0 ? Math.min((currentSavings / targetAmount) * 100, 100) : 0,
    monthsToTarget: remainingAmount === 0
      ? 0
      : contribution > 0
        ? Math.ceil(remainingAmount / contribution)
        : null,
  }
}

export function projectScenario(scenario) {
  const months = scenario.durationMonths
  const monthlySurplus = scenario.monthlyIncome * (1 + scenario.incomeChange / 100)
    - scenario.monthlyExpenses * (1 + scenario.expenseChange / 100)
  let savings = scenario.currentSavings
  const timeline = [{ period: 'Now', savings }]

  for (let month = 1; month <= months; month += 1) {
    savings += monthlySurplus
    timeline.push({ period: `Month ${month}`, savings })
  }

  return {
    monthlySurplus: scenario.monthlyIncome - scenario.monthlyExpenses,
    projectedSavings: savings,
    scenarioMonthlySurplus: monthlySurplus,
    timeline,
  }
}

export function projectBaseline(scenario) {
  return projectScenario({
    ...scenario,
    incomeChange: 0,
    expenseChange: 0,
  })
}
