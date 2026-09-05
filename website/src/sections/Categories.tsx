import type { CSSProperties } from 'react'
import { Icon } from '../components/Icon'
import { SectionHeading } from '../components/SectionHeading'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function Categories() {
  const { language, t } = usePreferences()
  const { categories } = useContent()

  const goToCategory = (category: string) => {
    window.history.replaceState(null, '', '#products')
    window.dispatchEvent(new CustomEvent('jalal:category', { detail: category }))
  }

  return (
    <section className="section categories" id="categories">
      <div className="container">
        <SectionHeading eyebrow={t.categories.eyebrow} title={t.categories.title} body={t.categories.intro} />
        <div className="category-grid">
          {categories.map((category, index) => (
            <button
              className={`category-card category-card--${index + 1}`}
              data-reveal="up"
              key={category.id}
              onClick={() => goToCategory(category.id)}
              style={{ '--reveal-delay': `${index * 75}ms` } as CSSProperties}
            >
              <img src={category.image} alt={category.name[language]} loading="lazy" />
              <span className="category-card__overlay" />
              <span className="category-card__number">0{index + 1}</span>
              <span className="category-card__content">
                <strong>{category.name[language]}</strong>
                <small>{category.description[language]}</small>
                <span>{t.categories.discover} <Icon name="arrow" /></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
