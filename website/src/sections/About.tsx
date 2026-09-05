import type { CSSProperties } from 'react'
import portrait from '../../assets/Screenshot_20260808_130421_Instagram.jpg'
import sunscreen from '../../assets/71k-vtnxo4lacsl1500_90.webp'
import { Icon } from '../components/Icon'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function About() {
  const { t, language } = usePreferences()
  const { about } = useContent()
  if (about && !about.visible) return null

  return (
    <section className="section about" id="about">
      <div className="container about__grid">
        <div className="about__visual" data-reveal="scale">
          <div className="about__image about__image--main"><img src={about?.mainImage ?? portrait} alt={t.about.imageAlt} loading="lazy" /></div>
          <div className="about__image about__image--small"><img src={about?.secondaryImage ?? sunscreen} alt={t.about.smallImageAlt} loading="lazy" /></div>
          <span className="about__stamp"><Icon name="glow" /> Jalal edit</span>
        </div>
        <div className="about__content" data-reveal="up" style={{ '--reveal-delay': '100ms' } as CSSProperties}>
          <span className="eyebrow">{about?.eyebrow[language] ?? t.about.eyebrow}</span>
          <h2>{about?.title[language] ?? t.about.title}</h2>
          <p>{about?.body[language] ?? t.about.body}</p>
          <blockquote><span>“</span>{about?.quote[language] ?? t.about.quote}</blockquote>
        </div>
      </div>
    </section>
  )
}
