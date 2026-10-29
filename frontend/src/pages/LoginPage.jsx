import { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({ email: form.email, fullName: form.email.split('@')[0] })
  }

  return (
    <div className="page-content auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">ACCOUNT ACCESS</span>
          <h2>Welcome back</h2>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="planning-field">
            Email address
            <input name="email" onChange={handleChange} required type="email" value={form.email} />
          </label>
          <label className="planning-field">
            Password
            <input name="password" onChange={handleChange} required type="password" value={form.password} />
          </label>
          <button className="button button-primary" type="submit">Log in</button>
        </form>
        <p className="auth-demo-note">Demo mode: this frontend does not verify credentials. Connect an authentication backend before using real accounts.</p>
        <p className="auth-auxiliary">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
