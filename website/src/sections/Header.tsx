import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function Header() {
  const { t, theme, language, toggleLanguage, toggleTheme } = usePreferences()
  const { contact, settings } = useContent()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  const links = [
    ['#home', t.nav.home],
    ['#about', t.nav.about],
    ['#categories', t.nav.categories],
    ['#products', t.nav.products],
    ['#contact', t.nav.contact],
  ]

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Logo compact />
        <nav className={`site-nav ${open ? 'site-nav--open' : ''}`} aria-label="Primary navigation">
          <div className="site-nav__mobile-head">
            <Logo compact />
            <button className="icon-button" onClick={() => setOpen(false)} aria-label={t.nav.close}>
              <Icon name="close" />
            </button>
          </div>
          <ul>
            {links.map(([href, label]) => (
              <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>
            ))}
          </ul>
          <div className="site-nav__mobile-contact">
            <span>{settings?.storeName[language] ?? 'Jalal Shops'}</span>
            <a href={`tel:${contact?.phoneInternational ?? '+963932383855'}`}>{contact?.phoneDisplay ?? '0932 383 855'}</a>
          </div>
        </nav>
        {open && <button className="nav-backdrop" aria-label={t.nav.close} onClick={() => setOpen(false)} />}
        <div className="site-header__actions">
          <button className="language-button" onClick={toggleLanguage}>{t.controls.language}</button>
          <button className="icon-button" onClick={toggleTheme} aria-label={theme === 'light' ? t.controls.dark : t.controls.light}>
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>
          <button className="icon-button menu-button" onClick={() => setOpen(true)} aria-label={t.nav.menu} aria-expanded={open}>
            <Icon name="menu" />
          </button>
        </div>
      </div>
    </header>
  )
}
