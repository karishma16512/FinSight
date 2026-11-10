import { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onLogin(form)
    } catch (loginError) {
      setError(loginError.message || 'Unable to log in.')
    } finally {
      setSubmitting(false)
    }
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
          {error && <span className="field-error" role="alert">{error}</span>}
          <button className="button button-primary" disabled={submitting} type="submit">{submitting ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="auth-auxiliary">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
