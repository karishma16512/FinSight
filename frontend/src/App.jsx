import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getFinanceData } from './services/financeApi'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import './App.css'

function FinanceApp() {
  const [financeData, setFinanceData] = useState(null)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    let active = true

    getFinanceData()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message)
        }
        if (active) setFinanceData(response.data)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load your finance data.')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          aria-label="Close navigation menu"
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="main-column">
        <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="main-content">
          {error ? (
            <div className="notice notice-error" role="alert">{error}</div>
          ) : !financeData ? (
            <div className="loading-state" role="status">Preparing your financial overview…</div>
          ) : (
            <Routes>
              <Route path="/dashboard" element={<Dashboard data={financeData} />} />
              <Route path="/transactions" element={<Transactions transactions={financeData.transactions} summary={financeData.summary} />} />
              <Route path="/budgets" element={<Budgets budgets={financeData.budgets} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <FinanceApp />
    </BrowserRouter>
  )
}

export default App
