import axios from 'axios'
import { budgets, expenseCategories, monthlySpending, summary, transactions } from '../data/mockData'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

const useMockData = true

export async function getFinanceData() {
  if (useMockData) {
    return {
      success: true,
      data: { transactions, budgets, expenseCategories, monthlySpending, summary },
    }
  }

  const response = await apiClient.get('/finance/overview')
  return response.data
}

export async function getTransactions() {
  if (useMockData) {
    return { success: true, data: { transactions } }
  }

  const response = await apiClient.get('/transactions')
  return response.data
}

export async function getBudgets() {
  if (useMockData) {
    return { success: true, data: { budgets } }
  }

  const response = await apiClient.get('/budgets')
  return response.data
}
