import { useEffect, useState, type FormEvent } from 'react'
import { settingsService } from '../api/content.service'
import { FormSection } from '../components/Field'
import { ImageUpload } from '../components/ImageUpload'
import { LocalizedField } from '../components/LocalizedField'
import { PageHeader } from '../components/PageHeader'
import { LoadingState, SaveNotice } from '../components/States'
import { usePreferences } from '../context/PreferencesContext'
import type { WebsiteSettings } from '../types/content'

export function SettingsPage() {
  const { t } = usePreferences()
  const [value, setValue] = useState<WebsiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { void settingsService.get().then(setValue) }, [])
  const save = async (event: FormEvent) => { event.preventDefault(); if (!value) return; setSaving(true); await settingsService.update(value); setSaving(false); setSaved(true); window.setTimeout(() => setSaved(false), 2400) }
  if (!value) return <LoadingState />
  return <form onSubmit={save}><PageHeader title={t('settings.title')} body={t('settings.body')} actions={<button className="button button--primary" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button>} /><SaveNotice show={saved} /><div className="content-form-grid"><div><FormSection title={t('settings.identity')}><div className="fields-stack"><LocalizedField label={t('settings.storeName')} value={value.storeName} onChange={(storeName) => setValue({ ...value, storeName })} required /><LocalizedField label={t('settings.footerTitle')} value={value.footerTitle} onChange={(footerTitle) => setValue({ ...value, footerTitle })} /><LocalizedField multiline rows={4} label={t('settings.footerDescription')} value={value.footerDescription} onChange={(footerDescription) => setValue({ ...value, footerDescription })} /></div></FormSection><FormSection title={t('settings.seo')}><div className="fields-stack"><LocalizedField label={t('settings.seoTitle')} value={value.seoTitle} onChange={(seoTitle) => setValue({ ...value, seoTitle })} /><LocalizedField multiline rows={4} label={t('settings.metaDescription')} value={value.metaDescription} onChange={(metaDescription) => setValue({ ...value, metaDescription })} /></div></FormSection></div><aside><FormSection title={t('settings.identity')}><div className="fields-stack"><ImageUpload scope="logo" compact label={t('settings.logo')} value={value.logo} onChange={(logo) => setValue({ ...value, logo })} /><ImageUpload scope="favicon" compact label={t('settings.favicon')} value={value.favicon} onChange={(favicon) => setValue({ ...value, favicon })} /></div></FormSection><section className="info-card"><strong>SEO preview</strong><h3>{value.seoTitle.en || value.storeName.en}</h3><p>{value.metaDescription.en}</p></section></aside></div></form>
}
