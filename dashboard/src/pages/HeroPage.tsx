import { useEffect, useState, type FormEvent } from 'react'
import { heroService } from '../api/content.service'
import { FormSection, Toggle } from '../components/Field'
import { ImageUpload } from '../components/ImageUpload'
import { LocalizedField } from '../components/LocalizedField'
import { PageHeader } from '../components/PageHeader'
import { LoadingState, SaveNotice } from '../components/States'
import { usePreferences } from '../context/PreferencesContext'
import type { HeroContent } from '../types/content'

export function HeroPage() {
  const { t } = usePreferences()
  const [value, setValue] = useState<HeroContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { void heroService.get().then(setValue) }, [])
  const save = async (event: FormEvent) => { event.preventDefault(); if (!value) return; setSaving(true); await heroService.update(value); setSaving(false); setSaved(true); window.setTimeout(() => setSaved(false), 2400) }
  if (!value) return <LoadingState />
  return <form onSubmit={save}><PageHeader title={t('hero.title')} body={t('hero.body')} actions={<button className="button button--primary" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button>} /><SaveNotice show={saved} /><div className="content-form-grid"><div>
    <FormSection title={t('hero.title')}><div className="fields-stack"><LocalizedField label={t('hero.eyebrow')} value={value.eyebrow} onChange={(eyebrow) => setValue({ ...value, eyebrow })} /><LocalizedField label={t('hero.titleStart')} value={value.titleStart} onChange={(titleStart) => setValue({ ...value, titleStart })} required /><LocalizedField label={t('hero.titleAccent')} value={value.titleAccent} onChange={(titleAccent) => setValue({ ...value, titleAccent })} required /><LocalizedField label={t('hero.titleEnd')} value={value.titleEnd} onChange={(titleEnd) => setValue({ ...value, titleEnd })} required /><LocalizedField multiline rows={4} label={t('hero.description')} value={value.body} onChange={(body) => setValue({ ...value, body })} /></div></FormSection>
    <FormSection title="Calls to action"><div className="fields-stack"><LocalizedField label={t('hero.primary')} value={value.primaryCta} onChange={(primaryCta) => setValue({ ...value, primaryCta })} /><LocalizedField label={t('hero.secondary')} value={value.secondaryCta} onChange={(secondaryCta) => setValue({ ...value, secondaryCta })} /><LocalizedField label={t('hero.note')} value={value.note} onChange={(note) => setValue({ ...value, note })} /><LocalizedField label={t('hero.cardLabel')} value={value.cardLabel} onChange={(cardLabel) => setValue({ ...value, cardLabel })} /><LocalizedField label={t('hero.cardTitle')} value={value.cardTitle} onChange={(cardTitle) => setValue({ ...value, cardTitle })} /></div></FormSection>
  </div><aside><FormSection title={t('common.image')}><div className="fields-stack"><ImageUpload scope="hero" label={t('hero.mainImage')} value={value.mainImage} onChange={(mainImage) => setValue({ ...value, mainImage })} /><ImageUpload scope="hero" compact label={t('hero.detailImage')} value={value.detailImage} onChange={(detailImage) => setValue({ ...value, detailImage })} /></div></FormSection><FormSection title={t('common.status')}><Toggle checked={value.visible} onChange={(visible) => setValue({ ...value, visible })} label={t('hero.visible')} /></FormSection></aside></div></form>
}
