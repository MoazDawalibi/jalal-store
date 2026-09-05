import { Icon } from '../components/Icon'
import { ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/SectionHeading'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'

export function Featured() {
  const { t } = usePreferences()
  const { products } = useContent()
  const selected = products.filter((product) => product.featured).slice(0, 3)

  return (
    <section className="section featured">
      <div className="container">
        <div className="featured__head">
          <SectionHeading eyebrow={t.featured.eyebrow} title={t.featured.title} body={t.featured.body} />
          <a className="button button--text" href="#products">{t.featured.viewAll}<Icon name="arrow" /></a>
        </div>
        <div className="featured__grid">
          {selected.map((product, index) => <ProductCard product={product} editorial key={product.id} revealDelay={index * 90} />)}
        </div>
      </div>
    </section>
  )
}
