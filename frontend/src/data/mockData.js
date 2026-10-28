export const transactions = [
  { id: 'txn-1', description: 'Monthly salary', category: 'Income', date: '2026-10-25', amount: 92000, type: 'income', initials: 'AC', merchant: 'Acme Technologies' },
  { id: 'txn-2', description: 'Monthly rent', category: 'Rent', date: '2026-10-24', amount: -28000, type: 'expense', initials: 'HM', merchant: 'Haven Heights' },
  { id: 'txn-3', description: 'Weekly groceries', category: 'Groceries', date: '2026-10-23', amount: -2200, type: 'expense', initials: 'FM', merchant: 'FreshMart' },
  { id: 'txn-4', description: 'Freelance project', category: 'Income', date: '2026-10-21', amount: 18500, type: 'income', initials: 'NF', merchant: 'Northstar Design' },
  { id: 'txn-5', description: 'Electricity bill', category: 'Electricity', date: '2026-10-20', amount: -2180, type: 'expense', initials: 'EP', merchant: 'BESCOM' },
  { id: 'txn-6', description: 'Dinner with friends', category: 'Entertainment', date: '2026-10-18', amount: -1350, type: 'expense', initials: 'TB', merchant: 'The Bombay Canteen' },
  { id: 'txn-7', description: 'Online course instalment', category: 'Education', date: '2026-10-17', amount: -5500, type: 'expense', initials: 'LS', merchant: 'LearnSpace India' },
  { id: 'txn-8', description: 'Metro and cab rides', category: 'Transport', date: '2026-10-16', amount: -1200, type: 'expense', initials: 'MC', merchant: 'Namma Metro' },
  { id: 'txn-9', description: 'Household essentials', category: 'Shopping', date: '2026-10-14', amount: -2900, type: 'expense', initials: 'SB', merchant: 'ShopBetter' },
  { id: 'txn-10', description: 'Health insurance premium', category: 'Healthcare', date: '2026-10-12', amount: -3450, type: 'expense', initials: 'HL', merchant: 'Healthline India' },
  { id: 'txn-11', description: 'Weekly groceries', category: 'Groceries', date: '2026-10-10', amount: -1680, type: 'expense', initials: 'FM', merchant: 'FreshMart' },
  { id: 'txn-12', description: 'Savings account interest', category: 'Income', date: '2026-10-08', amount: 1250, type: 'income', initials: 'SB', merchant: 'SBI Savings' },
  { id: 'txn-13', description: 'Cab rides', category: 'Transport', date: '2026-10-07', amount: -850, type: 'expense', initials: 'RC', merchant: 'Rapido Cabs' },
  { id: 'txn-14', description: 'Movie night', category: 'Entertainment', date: '2026-10-06', amount: -3000, type: 'expense', initials: 'CC', merchant: 'CineCity' },
  { id: 'txn-15', description: 'Clothing and shoes', category: 'Shopping', date: '2026-10-05', amount: -5000, type: 'expense', initials: 'FC', merchant: 'FabCity' },
  { id: 'txn-16', description: 'Weekly groceries', category: 'Groceries', date: '2026-10-04', amount: -3540, type: 'expense', initials: 'FM', merchant: 'FreshMart' },
  { id: 'txn-17', description: 'Monthly bus pass', category: 'Transport', date: '2026-10-03', amount: -1600, type: 'expense', initials: 'BM', merchant: 'Bengaluru Metro' },
]

export const budgets = [
  { id: 'rent', category: 'Rent', limit: 30000, spent: 28000, icon: 'home', color: 'violet' },
  { id: 'groceries', category: 'Groceries', limit: 10000, spent: 7420, icon: 'shopping-cart', color: 'blue' },
  { id: 'transport', category: 'Transport', limit: 5000, spent: 3650, icon: 'car', color: 'green' },
  { id: 'electricity', category: 'Electricity', limit: 3000, spent: 2180, icon: 'zap', color: 'pink' },
  { id: 'education', category: 'Education', limit: 7000, spent: 5500, icon: 'education', color: 'cyan' },
  { id: 'healthcare', category: 'Healthcare', limit: 5000, spent: 3450, icon: 'healthcare', color: 'green' },
  { id: 'shopping', category: 'Shopping', limit: 8000, spent: 7900, icon: 'shopping', color: 'blue' },
  { id: 'entertainment', category: 'Entertainment', limit: 3500, spent: 4350, icon: 'entertainment', color: 'orange' },
]

export const monthlySpending = [
  { month: 'May', income: 105000, expenses: 68400 },
  { month: 'Jun', income: 108500, expenses: 72300 },
  { month: 'Jul', income: 107000, expenses: 64200 },
  { month: 'Aug', income: 112000, expenses: 75600 },
  { month: 'Sep', income: 109500, expenses: 68300 },
  { month: 'Oct', income: 111750, expenses: 62450 },
]

export const expenseCategories = [
  { name: 'Rent', value: 28000, color: '#7158e2' },
  { name: 'Groceries', value: 7420, color: '#4f8cf7' },
  { name: 'Transport', value: 3650, color: '#4fc6a2' },
  { name: 'Electricity', value: 2180, color: '#ec7d9c' },
  { name: 'Education', value: 5500, color: '#43b8c5' },
  { name: 'Healthcare', value: 3450, color: '#8acb77' },
  { name: 'Shopping', value: 7900, color: '#9e8bea' },
  { name: 'Entertainment', value: 4350, color: '#f5a657' },
]

export const summary = {
  income: 111750,
  expenses: 62450,
  balance: 284750,
  savingsRate: 44.2,
  incomeChange: 8.6,
  expenseChange: -3.2,
  balanceChange: 6.4,
}
