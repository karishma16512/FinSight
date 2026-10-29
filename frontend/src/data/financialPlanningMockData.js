export const initialSavingsGoals = [
  {
    id: 'goal-emergency',
    name: 'Emergency cushion',
    targetAmount: 300000,
    currentAmount: 125000,
    targetDate: '2027-06-30',
    category: 'Safety net',
  },
  {
    id: 'goal-travel',
    name: 'Japan trip',
    targetAmount: 180000,
    currentAmount: 72000,
    targetDate: '2027-03-31',
    category: 'Travel',
  },
  {
    id: 'goal-home',
    name: 'First home deposit',
    targetAmount: 1200000,
    currentAmount: 340000,
    targetDate: '2029-12-31',
    category: 'Home',
  },
]

export const simulatorDefaults = {
  monthlyIncome: 92000,
  monthlyExpenses: 62000,
  incomeChange: 5,
  expenseChange: 3,
  durationMonths: 12,
  currentSavings: 125000,
}
