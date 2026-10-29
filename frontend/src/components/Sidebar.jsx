import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3, Calculator, CircleHelp, FileText, LayoutDashboard, LogOut, PiggyBank, ShieldCheck,
  SlidersHorizontal, UserCircle2, WalletCards,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', to: '/transactions', icon: WalletCards },
  { label: 'Budgets', to: '/budgets', icon: BarChart3 },
  { label: 'Financial Planning', to: '/savings-goals', icon: PiggyBank, group: true },
  { label: 'Savings goals', to: '/savings-goals', icon: PiggyBank, nested: true },
  { label: 'EMI calculator', to: '/emi-calculator', icon: Calculator, nested: true },
  { label: 'Emergency fund', to: '/emergency-fund', icon: ShieldCheck, nested: true },
  { label: 'What-if simulator', to: '/what-if-simulator', icon: SlidersHorizontal, nested: true },
  { label: 'Reports & analytics', to: '/reports', icon: FileText },
  { label: 'Profile', to: '/profile', icon: UserCircle2 },
]

function Sidebar({ isOpen, onNavigate, onLogout, user, budgetsCount }) {
  const navigate = useNavigate()
  const displayName = user?.fullName || 'Account'
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <NavLink className="brand" to="/dashboard" aria-label="FinSight home" onClick={onNavigate}>
        <span className="brand-mark"><BarChart3 size={21} strokeWidth={2.5} /></span>
        <span>finsight<span className="brand-period">.</span></span>
      </NavLink>

      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, to, icon: Icon, nested, group }) => (
          <NavLink
            className={({ isActive }) => `nav-link ${nested ? 'nav-link-nested' : ''} ${isActive ? 'nav-link-active' : ''}`}
            key={`${label}-${to}`}
            onClick={onNavigate}
            to={to}
          >
            {!nested && <Icon size={19} strokeWidth={1.9} />}
            <span className={group ? 'nav-group-label' : ''}>{label}</span>
            {!nested && label === 'Budgets' && budgetsCount > 0 && <span className="nav-count">{budgetsCount}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon"><BarChart3 size={17} /></div>
          <strong>Make your money work</strong>
          <p>Get a clearer picture of your financial future.</p>
          <button onClick={() => { navigate('/reports'); onNavigate?.() }} type="button">Explore insights <span aria-hidden="true">→</span></button>
        </div>
        <a className="sidebar-utility" href="mailto:support@finsight.app">
          <CircleHelp size={18} /><span>Help & support</span>
        </a>
        <NavLink className="sidebar-utility logout-button" to="/login" onClick={() => { onLogout(); onNavigate() }}>
          <LogOut size={18} /><span>Logout</span>
        </NavLink>
        <div className="sidebar-profile">
          <div className="avatar avatar-sidebar">{initials}</div>
          <div><strong>{displayName}</strong><span>{user?.email || 'Personal account'}</span></div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
