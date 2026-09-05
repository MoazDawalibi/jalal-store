import type { CSSProperties } from 'react'
import contactImage from '../../assets/contact-boutique-v2.webp'
import { Icon } from '../components/Icon'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function Contact() {
  const { t, language } = usePreferences()
  const { contact } = useContent()
  const mapsHref = contact?.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=Al-Shaalan+Al-Hamra+Damascus'
  const phoneDisplay = contact?.phoneDisplay ?? '0932 383 855'
  const phoneHref = `tel:${contact?.phoneInternational ?? '+963932383855'}`
  const email = contact?.email ?? 'ammarjalal1974@gmail.com'
  const whatsappHref = `https://wa.me/${contact?.whatsappNumber ?? '963932383855'}`

  return (
    <section className="section contact" id="contact">
      <div className="container contact__card">
        <div className="contact__content" data-reveal="up">
          <span className="eyebrow">{contact?.sectionEyebrow[language] ?? t.contact.eyebrow}</span>
          <h2>{contact?.sectionTitle[language] ?? t.contact.title}</h2>
          <p className="contact__intro">{contact?.sectionBody[language] ?? t.contact.body}</p>
          <div className="contact__details">
            <a href={mapsHref} target="_blank" rel="noreferrer">
              <span><Icon name="location" /></span>
              <div><small>{t.contact.addressLabel}</small><strong>{contact?.address[language] ?? t.contact.address}</strong></div>
            </a>
            <a href={phoneHref}>
              <span><Icon name="phone" /></span>
              <div><small>{t.contact.phoneLabel}</small><strong dir="ltr">{phoneDisplay}</strong></div>
            </a>
            <a href={`mailto:${email}`}>
              <span><Icon name="email" /></span>
              <div><small>{t.contact.emailLabel}</small><strong>{email}</strong></div>
            </a>
          </div>
          <div className="contact__actions">
            <a className="button button--primary" href={whatsappHref} target="_blank" rel="noreferrer"><Icon name="whatsapp" />{t.contact.message}</a>
            <a className="button button--text" href={mapsHref} target="_blank" rel="noreferrer">{t.contact.directions}<Icon name="arrow" /></a>
          </div>
        </div>
        <div className="contact__visual" data-reveal="scale" style={{ '--reveal-delay': '120ms' } as CSSProperties}>
          <img src={contact?.contactImage ?? contactImage} alt="A welcoming premium beauty boutique interior" loading="lazy" />
          <span aria-hidden="true">JALAL</span>
        </div>
      </div>
    </section>
  )
}
