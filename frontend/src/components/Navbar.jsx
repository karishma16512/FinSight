import { ChevronDown, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const pageDetails = {
  '/login': { title: 'Login', subtitle: 'Access your personal financial workspace.' },
  '/register': { title: 'Register', subtitle: 'Create your FinSight account.' },
  '/dashboard': { title: 'Dashboard', subtitle: 'Here’s what’s happening with your money.' },
  '/transactions': { title: 'Transactions', subtitle: 'A clear view of your income and spending.' },
  '/budgets': { title: 'Budgets', subtitle: 'Stay on top of your monthly spending goals.' },
  '/savings-goals': { title: 'Savings goals', subtitle: 'Make steady progress toward what matters to you.' },
  '/emi-calculator': { title: 'EMI calculator', subtitle: 'Estimate loan payments before making a commitment.' },
  '/emergency-fund': { title: 'Emergency fund', subtitle: 'Create a financial cushion for the unexpected.' },
  '/what-if-simulator': { title: 'What-if simulator', subtitle: 'Explore how today’s choices can shape your future.' },
  '/reports': { title: 'Reports & analytics', subtitle: 'Understand trends and identify opportunities.' },
  '/profile': { title: 'Profile', subtitle: 'Manage your account and preferences.' },
}

function Navbar({ onMenuClick, user }) {
  const { pathname } = useLocation()
  const page = pageDetails[pathname] || pageDetails['/dashboard']
  const displayName = user?.fullName || 'Account'
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  return (
    <header className="topbar">
      <button className="mobile-menu icon-button" type="button" aria-label="Open navigation menu" onClick={onMenuClick}>
        <Menu size={21} />
      </button>
      <div className="page-heading">
        <h1>{page.title}</h1>
        <p>{page.subtitle}</p>
      </div>
      <div className="topbar-actions">
        <Link to="/profile" className="account-button">
          <span className="avatar">{initials}</span>
          <span className="account-name">{displayName}</span>
          <ChevronDown size={15} />
        </Link>
      </div>
    </header>
  )
}

export default Navbar
