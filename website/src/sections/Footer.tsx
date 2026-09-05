import type { CSSProperties } from 'react'
import basmaLogo from '../../assets/basma-logo.png'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function Footer() {
  const { language, t } = usePreferences()
  const { categories, contact, settings, socialLinks } = useContent()
  const year = 2026
  const basmaWebsite = 'https://basma-company.vercel.app/'
  const basmaInstagram = 'https://www.instagram.com/build.with.basma?igsi=MXI2NHFpdHJpd21qdw=='
  const storeName = settings?.storeName[language] ?? 'Jalal Shops'
  const whatsappHref = `https://wa.me/${contact?.whatsappNumber ?? '963932383855'}`
  const phoneDisplay = contact?.phoneDisplay ?? '0932 383 855'
  const phoneHref = `tel:${contact?.phoneInternational ?? '+963932383855'}`
  const email = contact?.email ?? 'ammarjalal1974@gmail.com'

  return (
    <footer className="site-footer">
      <div className="container site-footer__lead" data-reveal="up">
        <div><span>{storeName}</span><h2>{settings?.footerTitle[language] ?? t.footer.title}</h2></div>
        <a className="button button--outline" href={whatsappHref} target="_blank" rel="noreferrer"><Icon name="whatsapp" />{t.footer.cta}</a>
      </div>
      <div className="container site-footer__grid" data-reveal="up" style={{ '--reveal-delay': '80ms' } as CSSProperties}>
        <div className="site-footer__brand"><Logo /><p>{settings?.footerDescription[language] ?? t.footer.body}</p></div>
        <div>
          <h2>{t.footer.explore}</h2>
          <ul>
            <li><a href="#about">{t.nav.about}</a></li>
            {categories.map((category) => <li key={category.id}><a href="#products">{category.name[language]}</a></li>)}
          </ul>
        </div>
        <div>
          <h2>{t.footer.contact}</h2>
          <ul>
            <li><a href={phoneHref} dir="ltr">{phoneDisplay}</a></li>
            <li><a href={`mailto:${email}`}>{email}</a></li>
            <li><a href={whatsappHref} target="_blank" rel="noreferrer">{t.contact.whatsappLabel}</a></li>
            {socialLinks.map((link) => <li key={link.id}><a href={link.url} target="_blank" rel="noreferrer">{link.id}</a></li>)}
          </ul>
        </div>
        <a className="site-footer__top" href="#home" aria-label={t.footer.backToTop}><Icon name="arrow" /></a>
      </div>
      <a className="container basma-credit" href={basmaWebsite} target="_blank" rel="noreferrer" aria-label={`${t.footer.basmaTitle} — basma-company.vercel.app`}>
        <div className="basma-credit__logo"><img src={basmaLogo} alt="Basma Company" loading="lazy" /></div>
        <div className="basma-credit__copy">
          <small>{t.footer.basmaEyebrow}</small>
          <strong>{t.footer.basmaTitle}</strong>
          <p>{t.footer.basmaText}</p>
        </div>
        <div className="basma-credit__link" dir="ltr"><span>basma-company.vercel.app</span><Icon name="arrow" /></div>
      </a>
      <div className="container site-footer__bottom">
        <p>© {year} {t.footer.rights} <a className="site-footer__credit" href={basmaWebsite} target="_blank" rel="noreferrer">Basma</a></p>
        <a className="site-footer__instagram" href={basmaInstagram} target="_blank" rel="noreferrer" aria-label="Basma on Instagram"><Icon name="instagram" />@build.with.basma</a>
      </div>
    </footer>
  )
}
