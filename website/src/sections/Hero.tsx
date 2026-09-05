import mainImage from '../../assets/Screenshot_20260808_125327_Instagram.jpg'
import detailImage from '../../assets/Screenshot_20260808_130421_Instagram.jpg'
import { Icon } from '../components/Icon'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function Hero() {
  const { t, language } = usePreferences()
  const { hero } = useContent()
  if (hero && !hero.visible) return null
  const copy = {
    eyebrow: hero?.eyebrow[language] ?? t.hero.eyebrow,
    titleStart: hero?.titleStart[language] ?? t.hero.titleStart,
    titleAccent: hero?.titleAccent[language] ?? t.hero.titleAccent,
    titleEnd: hero?.titleEnd[language] ?? t.hero.titleEnd,
    body: hero?.body[language] ?? t.hero.body,
    primary: hero?.primaryCta[language] ?? t.hero.primary,
    secondary: hero?.secondaryCta[language] ?? t.hero.secondary,
    note: hero?.note[language] ?? t.hero.note,
    cardLabel: hero?.cardLabel[language] ?? t.hero.cardLabel,
    cardTitle: hero?.cardTitle[language] ?? t.hero.cardTitle,
  }

  return (
    <section className="hero" id="home">
      <div className="hero__ambient" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>
            {copy.titleStart}<br />
            <em>{copy.titleAccent}</em><br />
            {copy.titleEnd}
          </h1>
          <p className="hero__body">{copy.body}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#products">{copy.primary}<Icon name="arrow" /></a>
            <a className="button button--text" href="#contact">{copy.secondary}<Icon name="arrow" /></a>
          </div>
          <div className="hero__note"><span /><p>{copy.note}</p></div>
        </div>
        <div className="hero__visual">
          <div className="hero__image-main">
            <img src={hero?.mainImage ?? mainImage} alt={t.hero.imageAlt} />
          </div>
          <div className="hero__image-detail">
            <img src={hero?.detailImage ?? detailImage} alt="" />
          </div>
          <div className="hero__floating-card">
            <Icon name="glow" />
            <div><span>{copy.cardLabel}</span><strong>{copy.cardTitle}</strong></div>
          </div>
          <span className="hero__monogram" aria-hidden="true">J</span>
        </div>
      </div>
    </section>
  )
}
