import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getFinanceData } from './services/financeApi'
import { endSession, getCurrentUser, startSession } from './services/authSession'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import SavingsGoals from './pages/SavingsGoals'
import EMICalculator from './pages/EMICalculator'
import EmergencyFund from './pages/EmergencyFund'
import WhatIfSimulator from './pages/WhatIfSimulator'
import ReportsAnalytics from './pages/ReportsAnalytics'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'
import './financialPlanning.css'

function FinanceLayout({ user, onLogout }) {
  const [financeData, setFinanceData] = useState(null)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function refreshFinanceData() {
    return getFinanceData()
      .then((response) => {
        if (!response.success) throw new Error(response.message)
        setFinanceData(response.data)
        setError('')
      })
      .catch((requestError) => {
        setError(requestError.message || 'Unable to load your finance data.')
      })
  }

  useEffect(() => {
    let active = true

    getFinanceData()
      .then((response) => {
        if (!response.success) throw new Error(response.message)
        if (active) setFinanceData(response.data)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load your finance data.')
      })

    return () => {
      active = false
    }
  }, [])

  const financePageFallback = error
    ? <div className="notice notice-error" role="alert">{error}</div>
    : <div className="loading-state" role="status">Preparing your financial overview…</div>

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          aria-label="Close navigation menu"
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar
        budgetsCount={financeData?.budgets.length || 0}
        isOpen={sidebarOpen}
        onLogout={onLogout}
        onNavigate={() => setSidebarOpen(false)}
        user={user}
      />
      <div className="main-column">
        <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={financeData ? <Dashboard data={financeData} user={user} /> : financePageFallback} />
            <Route path="/transactions" element={financeData ? <Transactions onDataChange={refreshFinanceData} transactions={financeData.transactions} summary={financeData.summary} /> : financePageFallback} />
            <Route path="/budgets" element={financeData ? <Budgets budgets={financeData.budgets} onDataChange={refreshFinanceData} /> : financePageFallback} />
            <Route path="/savings-goals" element={<SavingsGoals />} />
            <Route path="/emi-calculator" element={<EMICalculator />} />
            <Route path="/emergency-fund" element={<EmergencyFund />} />
            <Route path="/what-if-simulator" element={<WhatIfSimulator />} />
            <Route path="/reports" element={financeData ? <ReportsAnalytics transactions={financeData.transactions} budgets={financeData.budgets} summary={financeData.summary} /> : financePageFallback} />
            <Route path="/profile" element={<ProfilePage onLogout={onLogout} user={user} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function FinanceApp() {
  const [user, setUser] = useState(getCurrentUser)

  function handleAuthenticate(profile) {
    setUser(startSession(profile))
  }

  function handleLogout() {
    endSession()
    setUser(null)
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleAuthenticate} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={handleAuthenticate} />}
      />
      <Route path="/*" element={user ? <FinanceLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
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
