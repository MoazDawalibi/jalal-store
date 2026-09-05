import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoriesService } from '../api/categories.service'
import { productsService } from '../api/products.service'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { EmptyState, LoadingState } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { usePreferences } from '../context/PreferencesContext'
import type { Category, Product } from '../types/content'

type StatusFilter = 'all' | 'active' | 'inactive' | 'featured'

export function ProductsPage() {
  const { language, t } = usePreferences()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [deleting, setDeleting] = useState<Product | null>(null)

  const load = useCallback(async () => {
    const [nextProducts, nextCategories] = await Promise.all([productsService.list(), categoriesService.list()])
    setProducts(nextProducts.sort((a, b) => a.displayOrder - b.displayOrder)); setCategories(nextCategories); setLoading(false)
  }, [])
  useEffect(() => { void load() }, [load])

  const filtered = useMemo(() => products.filter((product) => {
    const query = search.toLowerCase().trim()
    const matchesSearch = !query || product.name.en.toLowerCase().includes(query) || product.name.ar.includes(search) || product.brand.toLowerCase().includes(query)
    const matchesCategory = category === 'all' || product.categoryId === category
    const matchesStatus = status === 'all' || (status === 'active' && product.active) || (status === 'inactive' && !product.active) || (status === 'featured' && product.featured)
    return matchesSearch && matchesCategory && matchesStatus
  }), [category, products, search, status])

  const updateFlag = async (product: Product, field: 'active' | 'featured') => {
    const updated = { ...product, [field]: !product[field], updatedAt: new Date().toISOString() }
    setProducts((current) => current.map((item) => item.id === product.id ? updated : item))
    await productsService.update(product.id, updated)
  }

  const remove = async () => {
    if (!deleting) return
    await productsService.remove(deleting.id)
    setProducts((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null)
  }

  return (
    <>
      <PageHeader title={t('products.title')} body={t('products.body')} actions={<Link className="button button--primary" to="/products/new"><Icon name="plus" />{t('products.add')}</Link>} />
      <section className="panel list-panel">
        <div className="filters-bar">
          <label className="search-control"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('products.search')} /></label>
          <select className="control filter-select" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">{t('common.all')} · {t('products.category')}</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name[language]}</option>)}</select>
          <select className="control filter-select" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}><option value="all">{t('common.all')} · {t('common.status')}</option><option value="active">{t('common.active')}</option><option value="inactive">{t('common.inactive')}</option><option value="featured">{t('common.featured')}</option></select>
          <span className="result-count">{filtered.length} / {products.length}</span>
        </div>
        {loading ? <LoadingState /> : filtered.length === 0 ? <EmptyState action={<Link className="button button--primary" to="/products/new">{t('products.add')}</Link>} /> : (
          <div className="table-scroll"><table className="data-table product-table"><thead><tr><th>{t('common.name')}</th><th>{t('products.category')}</th><th>{t('products.price')}</th><th>{t('products.availability')}</th><th>{t('common.status')}</th><th>{t('common.actions')}</th></tr></thead><tbody>
            {filtered.map((product) => {
              const categoryName = categories.find((item) => item.id === product.categoryId)?.name[language]
              return <tr key={product.id}><td><div className="product-cell"><img src={product.image} alt="" /><div><strong>{product.name[language]}</strong><span>{product.brand}</span><span className="mobile-only">{categoryName}</span></div></div></td><td>{categoryName}</td><td><strong className="table-value">{product.price === null ? t('products.noPrice') : `${product.price.toLocaleString()} ${product.currency}`}</strong></td><td>{product.quantity === null ? t('products.contactStore') : product.quantity}</td><td><div className="badge-stack"><button onClick={() => updateFlag(product, 'active')}><StatusBadge tone={product.active ? 'success' : 'muted'}>{product.active ? t('common.active') : t('common.inactive')}</StatusBadge></button>{product.featured && <button onClick={() => updateFlag(product, 'featured')}><StatusBadge tone="accent">{t('common.featured')}</StatusBadge></button>}</div></td><td><div className="row-actions"><Link className="icon-button" to={`/products/${product.id}/edit`} title={t('common.edit')}><Icon name="edit" /></Link><button className="icon-button icon-button--danger" onClick={() => setDeleting(product)} title={t('common.delete')}><Icon name="trash" /></button></div></td></tr>
            })}
          </tbody></table></div>
        )}
      </section>
      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title={t('common.confirmDelete')} body={deleting?.name[language] ?? ''} size="small" footer={<><button className="button button--secondary" onClick={() => setDeleting(null)}>{t('common.cancel')}</button><button className="button button--danger" onClick={remove}>{t('common.delete')}</button></>}><p>{t('common.confirmDeleteBody')}</p></Modal>
    </>
  )
}
