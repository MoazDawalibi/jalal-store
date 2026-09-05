import { useEffect, useState, type FormEvent } from 'react'
import { contactService } from '../api/content.service'
import { FieldShell, FormSection, Input } from '../components/Field'
import { ImageUpload } from '../components/ImageUpload'
import { LocalizedField } from '../components/LocalizedField'
import { PageHeader } from '../components/PageHeader'
import { LoadingState, SaveNotice } from '../components/States'
import { usePreferences } from '../context/PreferencesContext'
import type { ContactSettings } from '../types/content'

export function ContactPage() {
  const { t } = usePreferences()
  const [value, setValue] = useState<ContactSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { void contactService.get().then(setValue) }, [])
  const save = async (event: FormEvent) => { event.preventDefault(); if (!value) return; setSaving(true); await contactService.update(value); setSaving(false); setSaved(true); window.setTimeout(() => setSaved(false), 2400) }
  if (!value) return <LoadingState />
  return <form onSubmit={save}><PageHeader title={t('contact.title')} body={t('contact.body')} actions={<button className="button button--primary" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button>} /><SaveNotice show={saved} /><div className="content-form-grid"><div><FormSection title={t('contact.section')}><div className="fields-stack"><LocalizedField label={t('contact.eyebrow')} value={value.sectionEyebrow} onChange={(sectionEyebrow) => setValue({ ...value, sectionEyebrow })} /><LocalizedField label={t('contact.heading')} value={value.sectionTitle} onChange={(sectionTitle) => setValue({ ...value, sectionTitle })} /><LocalizedField multiline rows={4} label={t('contact.description')} value={value.sectionBody} onChange={(sectionBody) => setValue({ ...value, sectionBody })} /><LocalizedField multiline label={t('contact.address')} value={value.address} onChange={(address) => setValue({ ...value, address })} /></div></FormSection><FormSection title={t('contact.title')}><div className="fields-grid fields-grid--2"><FieldShell label={t('contact.phoneDisplay')}><Input value={value.phoneDisplay} onChange={(event) => setValue({ ...value, phoneDisplay: event.target.value })} dir="ltr" /></FieldShell><FieldShell label={t('contact.phoneInternational')}><Input value={value.phoneInternational} onChange={(event) => setValue({ ...value, phoneInternational: event.target.value })} dir="ltr" /></FieldShell><FieldShell label={t('contact.whatsapp')}><Input value={value.whatsappNumber} onChange={(event) => setValue({ ...value, whatsappNumber: event.target.value })} dir="ltr" /></FieldShell><FieldShell label={t('contact.email')}><Input type="email" value={value.email} onChange={(event) => setValue({ ...value, email: event.target.value })} dir="ltr" /></FieldShell></div><FieldShell label={t('contact.maps')}><Input type="url" value={value.mapsUrl} onChange={(event) => setValue({ ...value, mapsUrl: event.target.value })} dir="ltr" /></FieldShell></FormSection></div><aside><FormSection title={t('common.image')}><ImageUpload scope="contact" label={t('contact.image')} value={value.contactImage} onChange={(contactImage) => setValue({ ...value, contactImage })} /></FormSection><section className="info-card"><strong>API output</strong><code>tel:{value.phoneInternational}</code><code>wa.me/{value.whatsappNumber}</code><code>mailto:{value.email}</code></section></aside></div></form>
}
