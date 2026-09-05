import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { categoriesService } from '../api/categories.service'
import { productsService } from '../api/products.service'
import { FieldShell, FormSection, Input, Select, Textarea, Toggle } from '../components/Field'
import { Icon } from '../components/Icon'
import { ImageUpload } from '../components/ImageUpload'
import { PageHeader } from '../components/PageHeader'
import { LoadingState } from '../components/States'
import { usePreferences } from '../context/PreferencesContext'
import type { Category, Product, ProductVariant } from '../types/content'

const emptyProduct = (): Product => ({ id: '', name: { en: '', ar: '' }, description: { en: '', ar: '' }, categoryId: '', brand: '', image: '', variants: [], price: null, currency: 'SYP', quantity: null, featured: false, isNew: false, active: true, displayOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function ProductFormPage() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const { t } = usePreferences()
  const [product, setProduct] = useState<Product>(emptyProduct)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([categoriesService.list(), id ? productsService.get(id) : Promise.resolve(undefined)]).then(([nextCategories, existing]) => {
      if (!active) return
      setCategories(nextCategories.filter((item) => item.active)); if (existing) setProduct(existing); setLoading(false)
    })
    return () => { active = false }
  }, [id])

  const setLocalized = (field: 'name' | 'description', language: 'en' | 'ar', value: string) => setProduct((current) => ({ ...current, [field]: { ...current[field], [language]: value } }))
  const setVariant = (index: number, changes: Partial<ProductVariant>) => setProduct((current) => ({ ...current, variants: current.variants.map((variant, position) => position === index ? { ...variant, ...changes } : variant) }))
  const setVariantLocalized = (index: number, field: 'name' | 'description', language: 'en' | 'ar', value: string) => {
    const current = product.variants[index][field] ?? { en: '', ar: '' }
    setVariant(index, { [field]: { ...current, [language]: value } })
  }
  const addVariant = () => setProduct((current) => ({ ...current, variants: [...current.variants, { id: crypto.randomUUID(), value: '#d9a29a', image: '', name: { en: '', ar: '' }, description: { en: '', ar: '' } }] }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!product.name.en.trim() || !product.name.ar.trim() || !product.brand.trim() || !product.categoryId || !product.image) { setError(t('product.validation')); return }
    setSaving(true); setError('')
    const nextId = editing ? product.id : slugify(product.name.en) || crypto.randomUUID()
    const payload = { ...product, id: nextId, variants: product.variants.map((variant) => ({ ...variant, image: variant.image || product.image })), updatedAt: new Date().toISOString() }
    if (editing) await productsService.update(nextId, payload); else await productsService.create(payload)
    setSaving(false); navigate('/products')
  }

  if (loading) return <LoadingState />
  return (
    <form onSubmit={submit}>
      <PageHeader title={editing ? t('product.editTitle') : t('product.newTitle')} body={t('product.formBody')} actions={<><Link className="button button--secondary" to="/products">{t('common.cancel')}</Link><button className="button button--primary" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button></>} />
      {error && <p className="form-alert form-alert--page"><Icon name="alert" />{error}</p>}
      <div className="form-layout">
        <div className="form-layout__main">
          <FormSection title={t('product.details')}>
            <div className="fields-grid fields-grid--2"><FieldShell label={t('product.nameEn')} required><Input value={product.name.en} onChange={(event) => setLocalized('name', 'en', event.target.value)} dir="ltr" /></FieldShell><FieldShell label={t('product.nameAr')} required><Input value={product.name.ar} onChange={(event) => setLocalized('name', 'ar', event.target.value)} dir="rtl" /></FieldShell></div>
            <div className="fields-grid fields-grid--2"><FieldShell label={t('product.descriptionEn')}><Textarea rows={4} value={product.description.en} onChange={(event) => setLocalized('description', 'en', event.target.value)} dir="ltr" /></FieldShell><FieldShell label={t('product.descriptionAr')}><Textarea rows={4} value={product.description.ar} onChange={(event) => setLocalized('description', 'ar', event.target.value)} dir="rtl" /></FieldShell></div>
            <div className="fields-grid fields-grid--2"><FieldShell label={t('product.brand')} required><Input value={product.brand} onChange={(event) => setProduct({ ...product, brand: event.target.value })} /></FieldShell><FieldShell label={t('product.category')} required><Select value={product.categoryId} onChange={(event) => setProduct({ ...product, categoryId: event.target.value })}><option value="">—</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name.en} · {category.name.ar}</option>)}</Select></FieldShell></div>
            <div className="fields-grid fields-grid--4"><FieldShell label={t('product.price')} hint={t('product.askPrice')}><Input type="number" min="0" value={product.price ?? ''} onChange={(event) => setProduct({ ...product, price: event.target.value === '' ? null : Number(event.target.value) })} /></FieldShell><FieldShell label={t('product.currency')}><Select value={product.currency} onChange={(event) => setProduct({ ...product, currency: event.target.value })}><option>SYP</option><option>USD</option></Select></FieldShell><FieldShell label={t('product.quantity')} hint={t('product.askAvailability')}><Input type="number" min="0" value={product.quantity ?? ''} onChange={(event) => setProduct({ ...product, quantity: event.target.value === '' ? null : Number(event.target.value) })} /></FieldShell><FieldShell label={t('common.order')}><Input type="number" min="0" value={product.displayOrder} onChange={(event) => setProduct({ ...product, displayOrder: Number(event.target.value) })} /></FieldShell></div>
          </FormSection>
          <FormSection title={t('product.variants')} description={t('product.variantHelp')}>
            <div className="variant-list">
              {product.variants.map((variant, index) => <article className="variant-card" key={variant.id}><header><strong>{t('product.variants')} #{index + 1}</strong><button className="icon-button icon-button--danger" type="button" onClick={() => setProduct({ ...product, variants: product.variants.filter((_, position) => position !== index) })}><Icon name="trash" /></button></header><div className="variant-card__grid"><FieldShell label={t('product.colour')}><div className="colour-control"><input type="color" value={variant.value} onChange={(event) => setVariant(index, { value: event.target.value })} /><Input value={variant.value} onChange={(event) => setVariant(index, { value: event.target.value })} /></div></FieldShell><FieldShell label={t('product.variantNameEn')}><Input value={variant.name?.en ?? ''} onChange={(event) => setVariantLocalized(index, 'name', 'en', event.target.value)} /></FieldShell><FieldShell label={t('product.variantNameAr')}><Input value={variant.name?.ar ?? ''} onChange={(event) => setVariantLocalized(index, 'name', 'ar', event.target.value)} dir="rtl" /></FieldShell><ImageUpload scope="variants" compact label={t('common.image')} value={variant.image} onChange={(image) => setVariant(index, { image })} /></div></article>)}
              <button className="add-row-button" type="button" onClick={addVariant}><Icon name="plus" />{t('product.addVariant')}</button>
            </div>
          </FormSection>
        </div>
        <aside className="form-layout__side"><FormSection title={t('common.image')}><ImageUpload scope="products" label={t('common.image')} value={product.image} onChange={(image) => setProduct({ ...product, image })} /></FormSection><FormSection title={t('product.flags')}><div className="toggle-stack"><Toggle checked={product.active} onChange={(active) => setProduct({ ...product, active })} label={t('product.active')} /><Toggle checked={product.featured} onChange={(featured) => setProduct({ ...product, featured })} label={t('product.featured')} /><Toggle checked={product.isNew} onChange={(isNew) => setProduct({ ...product, isNew })} label={t('product.isNew')} /></div></FormSection></aside>
      </div>
      <div className="mobile-form-actions"><Link className="button button--secondary" to="/products">{t('common.cancel')}</Link><button className="button button--primary" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button></div>
    </form>
  )
}
