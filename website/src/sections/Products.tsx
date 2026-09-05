import { useEffect, useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/SectionHeading'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'
import type { CategoryId } from '../types/content'

type Filter = 'all' | CategoryId
const pageSize = 8

export function Products() {
  const { language, t } = usePreferences()
  const { categories, products } = useContent()
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const onCategory = (event: Event) => {
      const category = (event as CustomEvent<string>).detail as CategoryId
      setFilter(category)
      setPage(1)
      requestAnimationFrame(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }))
    }
    window.addEventListener('jalal:category', onCategory)
    return () => window.removeEventListener('jalal:category', onCategory)
  }, [])

  const filtered = useMemo(() => filter === 'all' ? products : products.filter((item) => item.category === filter), [filter, products])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  const selectFilter = (next: Filter) => {
    setFilter(next)
    setPage(1)
  }

  const goToPage = (nextPage: number) => {
    setPage(nextPage)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section products" id="products">
      <div className="container">
        <SectionHeading eyebrow={t.products.eyebrow} title={t.products.title} body={t.products.body} align="center" />
        <div className="product-filters" data-reveal="up" role="group" aria-label={t.products.eyebrow}>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => selectFilter('all')}>{t.products.all}</button>
          {categories.map((category) => (
            <button className={filter === category.id ? 'active' : ''} key={category.id} onClick={() => selectFilter(category.id)}>{category.name[language]}</button>
          ))}
        </div>
        {visible.length ? (
          <div className="product-grid">{visible.map((product, index) => <ProductCard product={product} key={product.id} revealDelay={(index % 4) * 65} />)}</div>
        ) : <p className="products__empty">{t.products.empty}</p>}
        {pageCount > 1 && (
          <nav className="pagination" data-reveal="up" aria-label={t.products.page}>
            <button onClick={() => goToPage(page - 1)} disabled={page === 1}>{t.products.previous}</button>
            <span className="pagination__pages">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button className={number === page ? 'active' : ''} onClick={() => goToPage(number)} aria-current={number === page ? 'page' : undefined} key={number}>{number}</button>
              ))}
            </span>
            <button onClick={() => goToPage(page + 1)} disabled={page === pageCount}>{t.products.next}</button>
          </nav>
        )}
      </div>
    </section>
  )
}
