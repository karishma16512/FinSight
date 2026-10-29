import { useState } from 'react'
import { Link } from 'react-router-dom'

function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onRegister({ email: form.email, fullName: form.fullName })
  }

  return (
    <div className="page-content auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">CREATE ACCOUNT</span>
          <h2>Set up your FinSight profile</h2>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="planning-field">
            Full name
            <input name="fullName" onChange={handleChange} required type="text" value={form.fullName} />
          </label>
          <label className="planning-field">
            Email address
            <input name="email" onChange={handleChange} required type="email" value={form.email} />
          </label>
          <label className="planning-field">
            Password
            <input minLength="8" name="password" onChange={handleChange} required type="password" value={form.password} />
          </label>
          <button className="button button-primary" type="submit">Create account</button>
        </form>
        <p className="auth-demo-note">Demo mode: account details are kept only in this browser session. No password is stored or verified.</p>
        <p className="auth-auxiliary">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
