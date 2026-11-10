import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem('finsight.session.token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getApiErrorMessage(error) {
  return error.response?.data?.message || error.message || 'The request could not be completed.'
}

export default apiClient
