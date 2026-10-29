import { CalendarDays, LogOut, Mail, MapPin, ShieldCheck, UserCircle2 } from 'lucide-react'

function ProfilePage({ user, onLogout }) {
  const fullName = user?.fullName || 'Account'
  const initials = fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return (
    <div className="page-content profile-page">
      <section className="planning-card profile-summary">
        <div className="profile-avatar-wrap">
          <span className="avatar avatar-large">{initials}</span>
        </div>
        <div className="profile-details">
          <span className="eyebrow"><UserCircle2 size={12} /> PERSONAL PROFILE</span>
          <h2>{fullName}</h2>
          <p>FinSight personal account</p>
        </div>
      </section>

      <section className="planning-summary-grid profile-grid">
        <article className="planning-card planning-summary-card">
          <span className="planning-category">ACCOUNT TYPE</span>
          <strong>Personal</strong>
          <span>Local demo account</span>
        </article>
        <article className="planning-card planning-summary-card">
          <span className="planning-category">MEMBER SINCE</span>
          <strong>Active</strong>
          <span>Session account</span>
        </article>
        <article className="planning-card planning-summary-card">
          <span className="planning-category">SECURITY</span>
          <strong>Demo mode</strong>
          <span>Connect a backend for account security</span>
        </article>
      </section>

      <section className="planning-card profile-info-card">
        <div className="planning-section-heading">
          <h2>Profile details</h2>
          <p>Key account information and preferences.</p>
        </div>
        <div className="profile-info-list">
          <div><Mail size={16} /><div><span>Email</span><strong>{user?.email || 'Not set'}</strong></div></div>
          <div><MapPin size={16} /><div><span>Storage</span><strong>Browser session</strong></div></div>
          <div><CalendarDays size={16} /><div><span>Preferred plan</span><strong>Monthly budgeting</strong></div></div>
          <div><ShieldCheck size={16} /><div><span>Security status</span><strong>Demo-only authentication</strong></div></div>
        </div>
        <button className="button button-secondary profile-logout" onClick={onLogout} type="button"><LogOut size={15} /> Log out</button>
      </section>
    </div>
  )
}

export default ProfilePage
