import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { categoriesService } from '../api/categories.service'
import { productsService } from '../api/products.service'
import { FieldShell, Input, Textarea, Toggle } from '../components/Field'
import { Icon } from '../components/Icon'
import { ImageUpload } from '../components/ImageUpload'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { LoadingState } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { usePreferences } from '../context/PreferencesContext'
import type { Category, Product } from '../types/content'

const emptyCategory = (): Category => ({ id: '', name: { en: '', ar: '' }, description: { en: '', ar: '' }, image: '', active: true, displayOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function CategoriesPage() {
  const { language, t } = usePreferences()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const [nextCategories, nextProducts] = await Promise.all([categoriesService.list(), productsService.list()])
    setCategories(nextCategories.sort((a, b) => a.displayOrder - b.displayOrder)); setProducts(nextProducts); setLoading(false)
  }, [])
  useEffect(() => { void load() }, [load])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing || !editing.name.en.trim() || !editing.name.ar.trim() || !editing.image) { setError(t('product.validation')); return }
    const exists = categories.some((item) => item.id === editing.id)
    const id = editing.id || slugify(editing.name.en)
    const payload = { ...editing, id, updatedAt: new Date().toISOString() }
    if (exists) await categoriesService.update(id, payload); else await categoriesService.create(payload)
    setEditing(null); setError(''); await load()
  }

  const remove = async () => {
    if (!deleting) return
    if (products.some((product) => product.categoryId === deleting.id)) { setError(t('category.protected')); return }
    await categoriesService.remove(deleting.id); setDeleting(null); await load()
  }

  const setLocalized = (field: 'name' | 'description', locale: 'en' | 'ar', value: string) => editing && setEditing({ ...editing, [field]: { ...editing[field], [locale]: value } })

  return (
    <>
      <PageHeader title={t('categories.title')} body={t('categories.body')} actions={<button className="button button--primary" onClick={() => setEditing(emptyCategory())}><Icon name="plus" />{t('categories.add')}</button>} />
      {loading ? <LoadingState /> : <div className="category-admin-grid">{categories.map((category) => {
        const count = products.filter((product) => product.categoryId === category.id).length
        return <article className="category-admin-card" key={category.id}><div className="category-admin-card__image"><img src={category.image} alt="" /><span>0{category.displayOrder}</span></div><div className="category-admin-card__body"><div><h2>{category.name[language]}</h2><p>{category.description[language]}</p></div><dl><div><dt>{t('categories.products')}</dt><dd>{count}</dd></div><div><dt>{t('common.status')}</dt><dd><StatusBadge tone={category.active ? 'success' : 'muted'}>{category.active ? t('common.active') : t('common.inactive')}</StatusBadge></dd></div></dl><footer><button className="button button--secondary button--small" onClick={() => setEditing(structuredClone(category))}><Icon name="edit" />{t('common.edit')}</button><button className="icon-button icon-button--danger" onClick={() => { setError(''); setDeleting(category) }}><Icon name="trash" /></button></footer></div></article>
      })}</div>}

      <Modal open={Boolean(editing)} onClose={() => { setEditing(null); setError('') }} title={editing && categories.some((item) => item.id === editing.id) ? t('common.edit') : t('categories.add')} size="large" footer={<><button className="button button--secondary" onClick={() => setEditing(null)}>{t('common.cancel')}</button><button className="button button--primary" onClick={() => document.getElementById('category-form-submit')?.click()}>{t('common.save')}</button></>}>
        {editing && <form id="category-form" onSubmit={save}><button id="category-form-submit" type="submit" hidden />{error && <p className="form-alert"><Icon name="alert" />{error}</p>}<div className="modal-form-grid"><div className="fields-stack"><div className="fields-grid fields-grid--2"><FieldShell label={t('category.nameEn')} required><Input value={editing.name.en} onChange={(event) => setLocalized('name', 'en', event.target.value)} /></FieldShell><FieldShell label={t('category.nameAr')} required><Input value={editing.name.ar} onChange={(event) => setLocalized('name', 'ar', event.target.value)} dir="rtl" /></FieldShell></div><div className="fields-grid fields-grid--2"><FieldShell label={t('category.descriptionEn')}><Textarea rows={4} value={editing.description.en} onChange={(event) => setLocalized('description', 'en', event.target.value)} /></FieldShell><FieldShell label={t('category.descriptionAr')}><Textarea rows={4} value={editing.description.ar} onChange={(event) => setLocalized('description', 'ar', event.target.value)} dir="rtl" /></FieldShell></div><div className="fields-grid fields-grid--2"><FieldShell label={t('category.id')} hint={t('category.idHelp')}><Input value={editing.id} disabled={categories.some((item) => item.id === editing.id)} onChange={(event) => setEditing({ ...editing, id: slugify(event.target.value) })} /></FieldShell><FieldShell label={t('common.order')}><Input type="number" min="0" value={editing.displayOrder} onChange={(event) => setEditing({ ...editing, displayOrder: Number(event.target.value) })} /></FieldShell></div><Toggle checked={editing.active} onChange={(active) => setEditing({ ...editing, active })} label={t('common.active')} /></div><ImageUpload scope="categories" label={t('common.image')} value={editing.image} onChange={(image) => setEditing({ ...editing, image })} /></div></form>}
      </Modal>

      <Modal open={Boolean(deleting)} onClose={() => { setDeleting(null); setError('') }} title={t('common.confirmDelete')} body={deleting?.name[language]} size="small" footer={<><button className="button button--secondary" onClick={() => setDeleting(null)}>{t('common.cancel')}</button><button className="button button--danger" onClick={remove}>{t('common.delete')}</button></>}><p>{products.some((product) => product.categoryId === deleting?.id) ? t('category.protected') : t('common.confirmDeleteBody')}</p>{error && <p className="form-alert"><Icon name="alert" />{error}</p>}</Modal>
    </>
  )
}
