import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoriesService } from '../api/categories.service'
import { productsService } from '../api/products.service'
import { Icon, type IconName } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { LoadingState } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { usePreferences } from '../context/PreferencesContext'
import type { Category, Product } from '../types/content'

export function OverviewPage() {
  const { language, t } = usePreferences()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([productsService.list(), categoriesService.list()]).then(([nextProducts, nextCategories]) => {
      if (active) { setProducts(nextProducts); setCategories(nextCategories); setLoading(false) }
    })
    return () => { active = false }
  }, [])

  if (loading) return <LoadingState />
  const cards: { label: string; value: number; icon: IconName; tone: string }[] = [
    { label: t('overview.totalProducts'), value: products.length, icon: 'products', tone: 'rose' },
    { label: t('overview.activeProducts'), value: products.filter((item) => item.active).length, icon: 'eye', tone: 'green' },
    { label: t('overview.featuredProducts'), value: products.filter((item) => item.featured).length, icon: 'star', tone: 'amber' },
    { label: t('overview.categories'), value: categories.length, icon: 'categories', tone: 'violet' },
  ]
  const recent = [...products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4)

  return (
    <>
      <PageHeader title={t('overview.title')} body={t('overview.body')} actions={<Link className="button button--primary" to="/products/new"><Icon name="plus" />{t('products.add')}</Link>} />
      <div className="metrics-grid">
        {cards.map((card) => <article className="metric-card" key={card.label}><span className={`metric-card__icon metric-card__icon--${card.tone}`}><Icon name={card.icon} /></span><div><strong>{card.value}</strong><p>{card.label}</p></div></article>)}
      </div>
      <div className="overview-grid">
        <section className="panel">
          <header className="panel__head"><div><h2>{t('overview.recent')}</h2><p>{t('products.body')}</p></div><Link className="inline-link" to="/products">{t('nav.products')}<Icon name="arrow" /></Link></header>
          <div className="recent-list">
            {recent.map((product) => <Link to={`/products/${product.id}/edit`} className="recent-item" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name[language]}</strong><span>{product.brand} · {categories.find((category) => category.id === product.categoryId)?.name[language]}</span></div><StatusBadge tone={product.active ? 'success' : 'muted'}>{product.active ? t('common.active') : t('common.inactive')}</StatusBadge><Icon name="chevron" /></Link>)}
          </div>
        </section>
        <aside className="panel category-summary">
          <header className="panel__head"><div><h2>{t('overview.categoryMix')}</h2><p>{t('overview.totalProducts')}: {products.length}</p></div></header>
          <div className="category-bars">
            {categories.map((category) => {
              const count = products.filter((product) => product.categoryId === category.id).length
              const percent = products.length ? Math.max(5, Math.round((count / products.length) * 100)) : 0
              return <div key={category.id}><span><strong>{category.name[language]}</strong><small>{count}</small></span><i><b style={{ width: `${percent}%` }} /></i></div>
            })}
          </div>
          <div className="quick-actions"><h3>{t('overview.quickActions')}</h3><Link to="/products/new"><span><Icon name="plus" /></span>{t('overview.addProduct')}<Icon name="chevron" /></Link><Link to="/hero"><span><Icon name="hero" /></span>{t('overview.editHero')}<Icon name="chevron" /></Link></div>
        </aside>
      </div>
    </>
  )
}
