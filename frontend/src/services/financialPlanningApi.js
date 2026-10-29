import { initialSavingsGoals } from '../data/financialPlanningMockData'

const goalsStorageKey = 'finsight.savingsGoals'

function readGoals() {
  const savedGoals = window.localStorage.getItem(goalsStorageKey)
  if (savedGoals === null) {
    const goals = initialSavingsGoals.map((goal) => ({ ...goal }))
    window.localStorage.setItem(goalsStorageKey, JSON.stringify(goals))
    return goals
  }

  const goals = JSON.parse(savedGoals)
  if (!Array.isArray(goals)) {
    throw new Error('Saved savings goals have an invalid format.')
  }
  return goals
}

function writeGoals(goals) {
  window.localStorage.setItem(goalsStorageKey, JSON.stringify(goals))
  return goals
}

export function getSavingsGoals() {
  return readGoals()
}

export function createSavingsGoal(goal) {
  const newGoal = { ...goal, id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
  return writeGoals([...readGoals(), newGoal])
}

export function updateSavingsGoal(id, changes) {
  const goals = readGoals()
  if (!goals.some((goal) => goal.id === id)) {
    throw new Error('This savings goal could not be found.')
  }
  return writeGoals(goals.map((goal) => (goal.id === id ? { ...goal, ...changes } : goal)))
}

export function deleteSavingsGoal(id) {
  const goals = readGoals()
  return writeGoals(goals.filter((goal) => goal.id !== id))
}

export function contributeToSavingsGoal(id, amount) {
  const goals = readGoals()
  const goal = goals.find((item) => item.id === id)
  if (!goal) {
    throw new Error('This savings goal could not be found.')
  }
  return writeGoals(goals.map((item) => (
    item.id === id
      ? { ...item, currentAmount: Math.min(item.currentAmount + amount, item.targetAmount) }
      : item
  )))
}
