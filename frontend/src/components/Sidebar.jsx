import { NavLink } from 'react-router-dom'
import { BarChart3, CircleHelp, LayoutDashboard, LogOut, WalletCards } from 'lucide-react'

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', to: '/transactions', icon: WalletCards },
  { label: 'Budgets', to: '/budgets', icon: BarChart3 },
]

function Sidebar({ isOpen, onNavigate }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <NavLink className="brand" to="/dashboard" aria-label="FinSight home" onClick={onNavigate}>
        <span className="brand-mark"><BarChart3 size={21} strokeWidth={2.5} /></span>
        <span>finsight<span className="brand-period">.</span></span>
      </NavLink>

      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} key={to} onClick={onNavigate} to={to}>
            <Icon size={19} strokeWidth={1.9} />
            <span>{label}</span>
            {label === 'Budgets' && <span className="nav-count">8</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon"><BarChart3 size={17} /></div>
          <strong>Make your money work</strong>
          <p>Get a clearer picture of your financial future.</p>
          <button type="button">Explore insights <span aria-hidden="true">→</span></button>
        </div>
        <a className="sidebar-utility" href="mailto:support@finsight.app">
          <CircleHelp size={18} /><span>Help & support</span>
        </a>
        <button className="sidebar-utility logout-button" type="button">
          <LogOut size={18} /><span>Sign out</span>
        </button>
        <div className="sidebar-profile">
          <div className="avatar avatar-sidebar">JD</div>
          <div><strong>Jordan Davis</strong><span>Personal account</span></div>
          <span className="profile-dots">···</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
