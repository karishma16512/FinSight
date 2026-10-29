import axios from 'axios'
import { budgets, expenseCategories, monthlySpending, summary, transactions } from '../data/mockData'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

const useMockData = true
const transactionsStorageKey = 'finsight.transactions'
const budgetsStorageKey = 'finsight.budgets'

function readStoredList(key, fallback) {
  const saved = window.localStorage.getItem(key)
  if (saved === null) {
    const initial = fallback.map((item) => ({ ...item }))
    window.localStorage.setItem(key, JSON.stringify(initial))
    return initial
  }
  const parsed = JSON.parse(saved)
  if (!Array.isArray(parsed)) throw new Error('Saved finance data has an invalid format.')
  return parsed
}

function writeStoredList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
  return value
}

function getStoredTransactions() {
  return readStoredList(transactionsStorageKey, transactions)
}

function getStoredBudgets() {
  return readStoredList(budgetsStorageKey, budgets)
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getCurrentMonth() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function saveTransaction(changes, id) {
  const current = getStoredTransactions()
  const amount = Number(changes.amount)
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a transaction amount greater than zero.')
  if (!changes.description?.trim() || !changes.category?.trim() || !changes.date || !['income', 'expense'].includes(changes.type)) {
    throw new Error('Enter a name, category, date, and transaction type.')
  }
  const transaction = {
    ...changes,
    id: id || createId('txn'),
    description: changes.description.trim(),
    category: changes.category.trim(),
    amount: Math.abs(amount) * (changes.type === 'expense' ? -1 : 1),
    merchant: changes.merchant?.trim() || changes.description.trim(),
    initials: (changes.description || 'TX').slice(0, 2).toUpperCase(),
  }
  const next = id
    ? current.map((item) => item.id === id ? { ...item, ...transaction } : item)
    : [transaction, ...current]
  if (id && !current.some((item) => item.id === id)) throw new Error('This transaction could not be found.')
  return writeStoredList(transactionsStorageKey, next)
}

export function deleteTransaction(id) {
  const current = getStoredTransactions()
  if (!current.some((item) => item.id === id)) throw new Error('This transaction could not be found.')
  return writeStoredList(transactionsStorageKey, current.filter((item) => item.id !== id))
}

export function saveBudget(changes, id) {
  const current = getStoredBudgets()
  const limit = Number(changes.limit)
  if (!changes.category?.trim() || !Number.isFinite(limit) || limit <= 0) {
    throw new Error('Enter a budget category and a limit greater than zero.')
  }
  if (current.some((item) => item.id !== id && item.category.toLowerCase() === changes.category.trim().toLowerCase())) {
    throw new Error('A budget already exists for this category.')
  }
  const budget = { ...changes, category: changes.category.trim(), id: id || createId('budget'), limit }
  const next = id
    ? current.map((item) => item.id === id ? { ...item, ...budget } : item)
    : [...current, budget]
  if (id && !current.some((item) => item.id === id)) throw new Error('This budget could not be found.')
  return writeStoredList(budgetsStorageKey, next)
}

export function deleteBudget(id) {
  const current = getStoredBudgets()
  if (!current.some((item) => item.id === id)) throw new Error('This budget could not be found.')
  return writeStoredList(budgetsStorageKey, current.filter((item) => item.id !== id))
}

function buildOverview() {
  const currentTransactions = getStoredTransactions()
  const currentMonth = getCurrentMonth()
  const monthTransactions = currentTransactions.filter((transaction) => transaction.date.startsWith(currentMonth))
  const currentBudgets = getStoredBudgets().map((budget) => ({
    ...budget,
    spent: monthTransactions
      .filter((transaction) => transaction.type === 'expense' && transaction.category === budget.category)
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
  }))
  const income = currentTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  const expenses = currentTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  const originalNet = summary.income - summary.expenses
  const currentNet = income - expenses
  const monthly = [...monthlySpending]
  if (monthTransactions.length) {
    const monthIndex = monthly.findIndex((month) => month.month === new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${currentMonth}-15T12:00:00`)))
    if (monthIndex >= 0) {
      monthly[monthIndex] = {
        ...monthly[monthIndex],
        income: monthTransactions.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
        expenses: monthTransactions.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
      }
    }
  }
  const categoryTotals = currentTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((totals, transaction) => {
      totals[transaction.category] = (totals[transaction.category] || 0) + Math.abs(transaction.amount)
      return totals
    }, {})
  const categories = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    color: expenseCategories.find((category) => category.name === name)?.color || '#9e8bea',
  }))
  const currentSummary = {
    ...summary,
    income,
    expenses,
    balance: summary.balance + currentNet - originalNet,
    savings: Math.max(income - expenses, 0),
    savingsRate: income > 0 ? Math.max(0, ((income - expenses) / income) * 100) : 0,
  }
  return {
    success: true,
    data: { transactions: currentTransactions, budgets: currentBudgets, expenseCategories: categories, monthlySpending: monthly, summary: currentSummary },
  }
}

export async function getFinanceData() {
  if (useMockData) {
    return buildOverview()
  }

  const response = await apiClient.get('/finance/overview')
  return response.data
}

export async function getTransactions() {
  if (useMockData) {
    return { success: true, data: { transactions: getStoredTransactions() } }
  }

  const response = await apiClient.get('/transactions')
  return response.data
}

export async function getBudgets() {
  if (useMockData) {
    return { success: true, data: { budgets: getStoredBudgets() } }
  }

  const response = await apiClient.get('/budgets')
  return response.data
}
