import { useEffect, useState, type FormEvent } from 'react'
import { socialService } from '../api/content.service'
import { FieldShell, Input, Toggle } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { LoadingState, SaveNotice } from '../components/States'
import { usePreferences } from '../context/PreferencesContext'
import type { SocialLink } from '../types/content'

export function SocialPage() {
  const { t } = usePreferences()
  const [items, setItems] = useState<SocialLink[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { void socialService.get().then(setItems) }, [])
  const save = async (event: FormEvent) => { event.preventDefault(); if (!items) return; setSaving(true); await socialService.update(items); setSaving(false); setSaved(true); window.setTimeout(() => setSaved(false), 2400) }
  if (!items) return <LoadingState />
  const update = (id: SocialLink['id'], changes: Partial<SocialLink>) => setItems(items.map((item) => item.id === id ? { ...item, ...changes } : item))
  return <form onSubmit={save}><PageHeader title={t('social.title')} body={t('social.body')} actions={<button className="button button--primary" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button>} /><SaveNotice show={saved} /><div className="social-grid">{items.map((item) => <section className="social-card" key={item.id}><header><span className={`social-mark social-mark--${item.id}`}>{item.id.charAt(0).toUpperCase()}</span><div><h2>{item.id.charAt(0).toUpperCase() + item.id.slice(1)}</h2><small>{item.enabled ? t('common.enabled') : t('common.disabled')}</small></div></header><FieldShell label={t('social.url')}><Input type="url" placeholder={`https://${item.id}.com/...`} value={item.url} onChange={(event) => update(item.id, { url: event.target.value })} dir="ltr" /></FieldShell><Toggle checked={item.enabled} onChange={(enabled) => update(item.id, { enabled })} label={t('common.enabled')} /></section>)}</div></form>
}
