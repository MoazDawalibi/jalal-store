import type { LocalizedText } from '../types/content'
import { FieldShell, Input, Textarea } from './Field'

export function LocalizedField({ label, value, onChange, multiline = false, rows = 3, required = false }: { label: string; value: LocalizedText; onChange: (value: LocalizedText) => void; multiline?: boolean; rows?: number; required?: boolean }) {
  return <div className="fields-grid fields-grid--2">
    <FieldShell label={`${label} · EN`} required={required}>{multiline ? <Textarea rows={rows} value={value.en} onChange={(event) => onChange({ ...value, en: event.target.value })} dir="ltr" /> : <Input value={value.en} onChange={(event) => onChange({ ...value, en: event.target.value })} dir="ltr" />}</FieldShell>
    <FieldShell label={`${label} · AR`} required={required}>{multiline ? <Textarea rows={rows} value={value.ar} onChange={(event) => onChange({ ...value, ar: event.target.value })} dir="rtl" /> : <Input value={value.ar} onChange={(event) => onChange({ ...value, ar: event.target.value })} dir="rtl" />}</FieldShell>
  </div>
}
