import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { highlightsService } from '../api/content.service'
import { FieldShell, Input, Select, Textarea, Toggle } from '../components/Field'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { LoadingState } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { usePreferences } from '../context/PreferencesContext'
import type { Highlight } from '../types/content'

const emptyHighlight = (): Highlight => ({ id: crypto.randomUUID(), icon: 'sparkles', title: { en: '', ar: '' }, body: { en: '', ar: '' }, active: true, displayOrder: 1 })

export function HighlightsPage() {
  const { language, t } = usePreferences()
  const [items, setItems] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Highlight | null>(null)
  const [deleting, setDeleting] = useState<Highlight | null>(null)
  const load = useCallback(async () => { setItems((await highlightsService.list()).sort((a, b) => a.displayOrder - b.displayOrder)); setLoading(false) }, [])
  useEffect(() => { void load() }, [load])
  const save = async (event: FormEvent) => { event.preventDefault(); if (!editing) return; const exists = items.some((item) => item.id === editing.id); if (exists) await highlightsService.update(editing.id, editing); else await highlightsService.create(editing); setEditing(null); await load() }
  const remove = async () => { if (!deleting) return; await highlightsService.remove(deleting.id); setDeleting(null); await load() }
  const iconMap = { bag: 'products', sparkles: 'highlights', message: 'contact' } as const

  return <><PageHeader title={t('highlights.title')} body={t('highlights.body')} actions={<button className="button button--primary" onClick={() => setEditing(emptyHighlight())}><Icon name="plus" />{t('highlights.add')}</button>} />{loading ? <LoadingState /> : <div className="highlights-list">{items.map((item, index) => <article className="highlight-row" key={item.id}><span className="highlight-row__number">0{index + 1}</span><span className="highlight-row__icon"><Icon name={iconMap[item.icon]} /></span><div><h2>{item.title[language]}</h2><p>{item.body[language]}</p></div><StatusBadge tone={item.active ? 'success' : 'muted'}>{item.active ? t('common.active') : t('common.inactive')}</StatusBadge><div className="row-actions"><button className="icon-button" onClick={() => setEditing(structuredClone(item))}><Icon name="edit" /></button><button className="icon-button icon-button--danger" onClick={() => setDeleting(item)}><Icon name="trash" /></button></div></article>)}</div>}
    <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={items.some((item) => item.id === editing?.id) ? t('common.edit') : t('highlights.add')} size="large" footer={<><button className="button button--secondary" onClick={() => setEditing(null)}>{t('common.cancel')}</button><button className="button button--primary" onClick={() => document.getElementById('highlight-submit')?.click()}>{t('common.save')}</button></>}>{editing && <form onSubmit={save}><button id="highlight-submit" hidden /><div className="fields-grid fields-grid--2"><FieldShell label={t('highlight.titleEn')}><Input value={editing.title.en} onChange={(event) => setEditing({ ...editing, title: { ...editing.title, en: event.target.value } })} /></FieldShell><FieldShell label={t('highlight.titleAr')}><Input value={editing.title.ar} onChange={(event) => setEditing({ ...editing, title: { ...editing.title, ar: event.target.value } })} dir="rtl" /></FieldShell><FieldShell label={t('highlight.bodyEn')}><Textarea rows={4} value={editing.body.en} onChange={(event) => setEditing({ ...editing, body: { ...editing.body, en: event.target.value } })} /></FieldShell><FieldShell label={t('highlight.bodyAr')}><Textarea rows={4} value={editing.body.ar} onChange={(event) => setEditing({ ...editing, body: { ...editing.body, ar: event.target.value } })} dir="rtl" /></FieldShell><FieldShell label={t('highlight.icon')}><Select value={editing.icon} onChange={(event) => setEditing({ ...editing, icon: event.target.value as Highlight['icon'] })}><option value="bag">Bag</option><option value="sparkles">Sparkles</option><option value="message">Message</option></Select></FieldShell><FieldShell label={t('common.order')}><Input type="number" value={editing.displayOrder} onChange={(event) => setEditing({ ...editing, displayOrder: Number(event.target.value) })} /></FieldShell></div><Toggle checked={editing.active} onChange={(active) => setEditing({ ...editing, active })} label={t('common.active')} /></form>}</Modal>
    <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title={t('common.confirmDelete')} size="small" footer={<><button className="button button--secondary" onClick={() => setDeleting(null)}>{t('common.cancel')}</button><button className="button button--danger" onClick={remove}>{t('common.delete')}</button></>}><p>{t('common.confirmDeleteBody')}</p></Modal>
  </>
}
