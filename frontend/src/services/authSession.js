const sessionEmailKey = 'finsight.session.email'
const sessionNameKey = 'finsight.session.name'

export function getCurrentUser() {
  const email = window.sessionStorage.getItem(sessionEmailKey)
  if (!email) return null

  return {
    email,
    fullName: window.sessionStorage.getItem(sessionNameKey) || email.split('@')[0],
  }
}

export function startSession({ email, fullName }) {
  window.sessionStorage.setItem(sessionEmailKey, email.trim().toLowerCase())
  window.sessionStorage.setItem(sessionNameKey, fullName.trim())
  return getCurrentUser()
}

export function endSession() {
  window.sessionStorage.removeItem(sessionEmailKey)
  window.sessionStorage.removeItem(sessionNameKey)
}
