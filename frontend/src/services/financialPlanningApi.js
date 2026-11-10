import apiClient, { getApiErrorMessage } from './apiClient'
import { mapSavingsGoal } from './financeApi'

function request(operation) {
  return operation().catch((error) => {
    throw new Error(getApiErrorMessage(error))
  })
}

export function getSavingsGoals() {
  return request(async () => (await apiClient.get('/savings-goals')).data.map(mapSavingsGoal))
}

export function createSavingsGoal(goal) {
  return request(async () => {
    const response = await apiClient.post('/savings-goals', {
      goalName: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
      category: goal.category,
    })
    return response.data.goal ? mapSavingsGoal(response.data.goal) : mapSavingsGoal(response.data)
  })
}

export function updateSavingsGoal(id, changes) {
  return request(async () => {
    const response = await apiClient.put(`/savings-goals/${id}`, {
      goalName: changes.name,
      targetAmount: changes.targetAmount,
      currentAmount: changes.currentAmount,
      targetDate: changes.targetDate,
      category: changes.category,
    })
    return mapSavingsGoal(response.data.goal)
  })
}

export function deleteSavingsGoal(id) {
  return request(() => apiClient.delete(`/savings-goals/${id}`))
}

export function contributeToSavingsGoal(id, amount) {
  return request(async () => {
    const response = await apiClient.patch(`/savings-goals/${id}/contribute`, { amount })
    return mapSavingsGoal(response.data.goal)
  })
}
