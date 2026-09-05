import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../context/PreferencesContext'
import { ApiError, useMockApi } from '../api/client'

export function LoginPage() {
  const { user, loading, login } = useAuth()
  const { theme, t, toggleLanguage, toggleTheme } = usePreferences()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(useMockApi ? 'admin@jalalshops.com' : '')
  const [password, setPassword] = useState(useMockApi ? 'admin123' : '')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  if (user) return <Navigate to="/" replace />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) { setError(t('login.required')); return }
    setError('')
    try {
      await login(email.trim(), password)
      const destination = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(destination, { replace: true })
    } catch (error) {
      setError(error instanceof ApiError && error.status === 401
        ? t('login.invalidCredentials')
        : t('login.unavailable'))
    }
  }

  return (
    <main className="login-page">
      <div className="login-controls"><button className="text-button" onClick={toggleLanguage}>{t('topbar.language')}</button><button className="icon-button" onClick={toggleTheme} aria-label={theme === 'dark' ? t('topbar.light') : t('topbar.dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button></div>
      <section className="login-panel">
        <div className="login-brand"><span>J</span><div><strong>{t('app.store')}</strong><small>{t('app.name')}</small></div></div>
        <div className="login-copy"><span className="eyebrow">{t('login.kicker')}</span><h1>{t('login.title')}</h1><p>{t('login.body')}</p></div>
        <form onSubmit={submit}>
          <label className="field"><span className="field__label">{t('login.email')}</span><input className="control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
          <div className="field"><label className="field__label" htmlFor="admin-password">{t('login.password')}</label><span className="password-control"><input className="control" id="admin-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')} aria-pressed={showPassword}><Icon name={showPassword ? 'eyeOff' : 'eye'} /></button></span></div>
          {error && <p className="form-alert" role="alert"><Icon name="alert" />{error}</p>}
          <button className="button button--primary button--wide" disabled={loading}>{loading ? t('common.loading') : t('login.submit')}<Icon name="arrow" /></button>
        </form>
        {useMockApi && <p className="login-demo">{t('login.demo')}</p>}
      </section>
      <aside className="login-visual"><div className="login-visual__shape"><span>J</span></div><div><small>{t('app.store')}</small><blockquote>{t('login.quote')}</blockquote></div></aside>
    </main>
  )
}
