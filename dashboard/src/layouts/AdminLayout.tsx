import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../context/PreferencesContext'
import { Icon, type IconName } from '../components/Icon'
import type { TranslationKey } from '../i18n/translations'

const navigation: { to: string; label: TranslationKey; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'nav.overview', icon: 'overview', end: true }, { to: '/products', label: 'nav.products', icon: 'products' }, { to: '/categories', label: 'nav.categories', icon: 'categories' },
  { to: '/hero', label: 'nav.hero', icon: 'hero' }, { to: '/about', label: 'nav.about', icon: 'about' }, { to: '/statistics', label: 'nav.highlights', icon: 'highlights' }, { to: '/contact', label: 'nav.contact', icon: 'contact' }, { to: '/social-media', label: 'nav.social', icon: 'social' }, { to: '/settings', label: 'nav.settings', icon: 'settings' },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState('')
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { theme, t, toggleLanguage, toggleTheme } = usePreferences()
  const current = navigation.find((item) => item.to === '/' ? pathname === '/' : pathname.startsWith(item.to))

  useEffect(() => {
    let timeout = 0
    const showError = (event: Event) => {
      window.clearTimeout(timeout)
      setApiError((event as CustomEvent<string>).detail || t('common.error'))
      timeout = window.setTimeout(() => setApiError(''), 5000)
    }
    window.addEventListener('jalal:api-error', showError)
    return () => { window.removeEventListener('jalal:api-error', showError); window.clearTimeout(timeout) }
  }, [t])

  return (
    <div className="admin-shell">
      {apiError && <div className="api-error-toast" role="alert"><Icon name="alert" /><span>{apiError}</span><button className="icon-button" onClick={() => setApiError('')} aria-label={t('common.close')}><Icon name="close" /></button></div>}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand"><span>J</span><div><strong>{t('app.store')}</strong><small>{t('app.name')}</small></div><button className="icon-button sidebar__close" onClick={() => setOpen(false)} aria-label={t('common.close')}><Icon name="close" /></button></div>
        <nav className="sidebar__nav" aria-label="Admin navigation">
          {navigation.map((item) => <NavLink to={item.to} end={item.end} key={item.to} onClick={() => setOpen(false)}><Icon name={item.icon} /><span>{t(item.label)}</span></NavLink>)}
        </nav>
        <div className="sidebar__profile"><span className="avatar">{user?.name.charAt(0) ?? 'A'}</span><div><strong>{user?.name}</strong><small>{user?.email}</small></div></div>
      </aside>
      {open && <button className="sidebar-backdrop" aria-label={t('common.close')} onClick={() => setOpen(false)} />}
      <div className="admin-main">
        <header className="topbar">
          <div className="topbar__title"><button className="icon-button topbar__menu" onClick={() => setOpen(true)} aria-label={t('topbar.openMenu')}><Icon name="menu" /></button><div><small>{t('app.name')}</small><strong>{current ? t(current.label) : t('app.name')}</strong></div></div>
          <div className="topbar__actions">
            <button className="text-button language-toggle" onClick={toggleLanguage}>{t('topbar.language')}</button>
            <button className="icon-button" onClick={toggleTheme} aria-label={theme === 'dark' ? t('topbar.light') : t('topbar.dark')} title={theme === 'dark' ? t('topbar.light') : t('topbar.dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
            <span className="topbar__divider" />
            <button className="text-button logout-button" onClick={logout} aria-label={t('topbar.logout')}><Icon name="logout" /><span>{t('topbar.logout')}</span></button>
          </div>
        </header>
        <main className="page"><Outlet /></main>
      </div>
    </div>
  )
}
