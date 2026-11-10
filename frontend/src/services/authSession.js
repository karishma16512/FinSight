import apiClient, { getApiErrorMessage } from './apiClient'

const sessionTokenKey = 'finsight.session.token'
const sessionEmailKey = 'finsight.session.email'
const sessionNameKey = 'finsight.session.name'

function saveSession({ token, user }) {
  if (!token || !user?.email) throw new Error('The server returned an invalid sign-in response.')
  window.sessionStorage.setItem(sessionTokenKey, token)
  window.sessionStorage.setItem(sessionEmailKey, user.email)
  window.sessionStorage.setItem(sessionNameKey, user.name || user.email.split('@')[0])
  return getCurrentUser()
}

export async function login({ email, password }) {
  try {
    const response = await apiClient.post('/auth/login', { email, password })
    return saveSession(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function register({ fullName, email, password }) {
  try {
    const response = await apiClient.post('/auth/register', { name: fullName, email, password })
    return saveSession(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export function getCurrentUser() {
  const token = window.sessionStorage.getItem(sessionTokenKey)
  const email = window.sessionStorage.getItem(sessionEmailKey)
  if (!token || !email) return null

  return {
    email,
    fullName: window.sessionStorage.getItem(sessionNameKey) || email.split('@')[0],
  }
}

export function endSession() {
  window.sessionStorage.removeItem(sessionTokenKey)
  window.sessionStorage.removeItem(sessionEmailKey)
  window.sessionStorage.removeItem(sessionNameKey)
}
