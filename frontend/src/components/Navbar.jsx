import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const pageDetails = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Here’s what’s happening with your money.' },
  '/transactions': { title: 'Transactions', subtitle: 'A clear view of your income and spending.' },
  '/budgets': { title: 'Budgets', subtitle: 'Stay on top of your monthly spending goals.' },
}

function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const page = pageDetails[pathname] || pageDetails['/dashboard']

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
        <button type="button" className="search-trigger" aria-label="Search">
          <Search size={17} /><span>Search anything...</span><kbd>⌘ K</kbd>
        </button>
        <button type="button" className="icon-button notification-button" aria-label="Notifications">
          <Bell size={19} /><span className="notification-dot" />
        </button>
        <button type="button" className="account-button">
          <span className="avatar">JD</span>
          <span className="account-name">Jordan Davis</span>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  )
}

export default Navbar
