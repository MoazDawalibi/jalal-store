import { useEffect, useState, type FormEvent } from 'react'
import { aboutService } from '../api/content.service'
import { FormSection, Toggle } from '../components/Field'
import { ImageUpload } from '../components/ImageUpload'
import { LocalizedField } from '../components/LocalizedField'
import { PageHeader } from '../components/PageHeader'
import { LoadingState, SaveNotice } from '../components/States'
import { usePreferences } from '../context/PreferencesContext'
import type { AboutContent } from '../types/content'

export function AboutPage() {
  const { t } = usePreferences()
  const [value, setValue] = useState<AboutContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { void aboutService.get().then(setValue) }, [])
  const save = async (event: FormEvent) => { event.preventDefault(); if (!value) return; setSaving(true); await aboutService.update(value); setSaving(false); setSaved(true); window.setTimeout(() => setSaved(false), 2400) }
  if (!value) return <LoadingState />
  return <form onSubmit={save}><PageHeader title={t('about.title')} body={t('about.body')} actions={<button className="button button--primary" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button>} /><SaveNotice show={saved} /><div className="content-form-grid"><div><FormSection title={t('about.title')}><div className="fields-stack"><LocalizedField label={t('about.eyebrow')} value={value.eyebrow} onChange={(eyebrow) => setValue({ ...value, eyebrow })} /><LocalizedField label={t('about.heading')} value={value.title} onChange={(title) => setValue({ ...value, title })} required /><LocalizedField multiline rows={6} label={t('about.content')} value={value.body} onChange={(body) => setValue({ ...value, body })} /><LocalizedField multiline label={t('about.quote')} value={value.quote} onChange={(quote) => setValue({ ...value, quote })} /></div></FormSection></div><aside><FormSection title={t('common.image')}><div className="fields-stack"><ImageUpload scope="about" label={t('about.mainImage')} value={value.mainImage} onChange={(mainImage) => setValue({ ...value, mainImage })} /><ImageUpload scope="about" compact label={t('about.secondaryImage')} value={value.secondaryImage} onChange={(secondaryImage) => setValue({ ...value, secondaryImage })} /></div></FormSection><FormSection title={t('common.status')}><Toggle checked={value.visible} onChange={(visible) => setValue({ ...value, visible })} label={t('about.visible')} /></FormSection></aside></div></form>
}
