import apiClient, { getApiErrorMessage } from './apiClient'
import { expenseCategories } from '../data/mockData'

function request(operation) {
  return operation().catch((error) => {
    throw new Error(getApiErrorMessage(error))
  })
}

function mapTransaction(transaction) {
  const date = new Date(transaction.date)
  return {
    id: transaction._id,
    description: transaction.title,
    category: transaction.category,
    date: Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10),
    amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
    type: transaction.type,
    initials: transaction.title.slice(0, 2).toUpperCase(),
    merchant: transaction.title,
    notes: transaction.description || '',
  }
}

function mapBudget(budget, index = 0) {
  const icons = {
    Rent: 'home',
    Groceries: 'shopping-cart',
    Transport: 'car',
    Electricity: 'zap',
    Education: 'education',
    Healthcare: 'healthcare',
    Shopping: 'shopping',
    Entertainment: 'entertainment',
  }
  const colors = ['violet', 'blue', 'green', 'pink', 'cyan', 'orange']
  return {
    id: budget._id,
    category: budget.category,
    limit: budget.limitAmount,
    spent: budget.spentAmount,
    icon: icons[budget.category] || 'shopping-cart',
    color: colors[index % colors.length],
  }
}

function mapSavingsGoal(goal) {
  return {
    id: goal._id,
    name: goal.goalName,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    targetDate: new Date(goal.targetDate).toISOString().slice(0, 10),
    category: goal.category || 'Personal',
  }
}

export async function getFinanceData() {
  return request(async () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const analyticsYears = month < 6 ? [year - 1, year] : [year]
    const [transactionResponse, budgetResponse, monthlyResponses] = await Promise.all([
      apiClient.get('/transactions'),
      apiClient.get('/budgets', { params: { month, year } }),
      Promise.all(analyticsYears.map((analyticsYear) => apiClient.get('/analytics/monthly', { params: { year: analyticsYear } }))),
    ])
    const transactions = transactionResponse.data.map(mapTransaction)
    const budgets = budgetResponse.data.map(mapBudget)
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
    const categoryTotals = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((totals, transaction) => {
        totals[transaction.category] = (totals[transaction.category] || 0) + Math.abs(transaction.amount)
        return totals
      }, {})
    const recentMonths = monthlyResponses
      .flatMap((response, index) => response.data.data.map((item) => ({
        ...item,
        year: analyticsYears[index],
      })))
      .filter((item) => item.year < year || item.month <= month)
      .slice(-6)
      .map((item) => ({
        month: new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(item.year, item.month - 1, 1)),
        income: item.income,
        expenses: item.expenses,
      }))

    return {
      success: true,
      data: {
        transactions,
        budgets,
        monthlySpending: recentMonths,
        expenseCategories: Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value,
          color: expenseCategories.find((category) => category.name === name)?.color || '#9e8bea',
        })),
        summary: {
          income,
          expenses,
          balance: income - expenses,
          savings: Math.max(income - expenses, 0),
          savingsRate: income > 0 ? Math.max(0, ((income - expenses) / income) * 100) : 0,
          incomeChange: 0,
          expenseChange: 0,
          balanceChange: 0,
        },
      },
    }
  })
}

export function getTransactions() {
  return request(async () => ({
    success: true,
    data: { transactions: (await apiClient.get('/transactions')).data.map(mapTransaction) },
  }))
}

export function getBudgets() {
  return request(async () => ({
    success: true,
    data: { budgets: (await apiClient.get('/budgets')).data.map(mapBudget) },
  }))
}

export function saveTransaction(changes, id) {
  const amount = Number(changes.amount)
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a transaction amount greater than zero.')
  if (!changes.description?.trim() || !changes.category?.trim() || !changes.date || !['income', 'expense'].includes(changes.type)) {
    throw new Error('Enter a name, category, date, and transaction type.')
  }
  const payload = {
    title: changes.description.trim(),
    amount: Math.abs(amount),
    type: changes.type,
    category: changes.category.trim(),
    date: changes.date,
    description: changes.notes?.trim() || '',
  }
  return request(() => id
    ? apiClient.put(`/transactions/${id}`, payload)
    : apiClient.post('/transactions', payload))
}

export function deleteTransaction(id) {
  return request(() => apiClient.delete(`/transactions/${id}`))
}

export function saveBudget(changes, id) {
  const limitAmount = Number(changes.limit)
  if (!changes.category?.trim() || !Number.isFinite(limitAmount) || limitAmount <= 0) {
    throw new Error('Enter a budget category and a limit greater than zero.')
  }
  const now = new Date()
  const payload = {
    category: changes.category.trim(),
    limitAmount,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }
  return request(() => id
    ? apiClient.put(`/budgets/${id}`, payload)
    : apiClient.post('/budgets', payload))
}

export function deleteBudget(id) {
  return request(() => apiClient.delete(`/budgets/${id}`))
}

export function calculateEmi(values) {
  return request(() => apiClient.post('/emi', values))
}

export function calculateEmergencyFund(values) {
  return request(() => apiClient.post('/emergency-fund', values))
}

export function simulateScenario(values) {
  return request(() => apiClient.post('/simulator', values))
}

export { mapSavingsGoal }
