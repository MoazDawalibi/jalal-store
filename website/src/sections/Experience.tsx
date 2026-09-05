import type { CSSProperties } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function Experience() {
  const { t, language } = usePreferences()
  const { highlights } = useContent()
  const icons: Record<string, IconName> = { bag: 'bag', sparkles: 'glow', message: 'whatsapp' }
  const items = highlights?.map((item) => ({ ...item, titleText: item.title[language], bodyText: item.body[language] }))

  return (
    <section className="section experience">
      <div className="container experience__grid">
        <div className="experience__intro" data-reveal="up">
          <span className="eyebrow">{t.experience.eyebrow}</span>
          <h2>{t.experience.title}</h2>
        </div>
        <div className="experience__items">
          {(items ?? t.experience.items.map((item, index) => ({ id: String(index), icon: ['bag', 'sparkles', 'message'][index], titleText: item.title, bodyText: item.body }))).map((item, index) => (
            <article key={item.id} data-reveal="up" style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties}>
              <span className="experience__icon"><Icon name={icons[item.icon] ?? 'glow'} /></span>
              <div><h3>{item.titleText}</h3><p>{item.bodyText}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
