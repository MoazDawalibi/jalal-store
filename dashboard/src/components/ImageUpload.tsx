import { useRef, useState } from 'react'
import { usePreferences } from '../context/PreferencesContext'
import { apiClient, useMockApi } from '../api/client'
import { Icon } from './Icon'

interface ImageUploadProps { value: string; onChange: (value: string) => void; label: string; compact?: boolean; scope?: 'products' | 'categories' | 'hero' | 'about' | 'contact' | 'logo' | 'favicon' | 'variants' }

export function ImageUpload({ value, onChange, label, compact, scope = 'products' }: ImageUploadProps) {
  const { t } = usePreferences()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const selectFile = async (file?: File) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError(t('form.invalidType')); return }
    if (file.size > 4 * 1024 * 1024) { setError(t('form.tooLarge')); return }
    setError('')
    if (useMockApi) {
      const reader = new FileReader()
      reader.onload = () => onChange(String(reader.result ?? ''))
      reader.readAsDataURL(file)
      return
    }
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('scope', scope)
      const uploaded = await apiClient.upload<{ url: string }>('/admin/uploads', form)
      onChange(uploaded.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`image-upload ${compact ? 'image-upload--compact' : ''}`}>
      <span className="field__label">{label}</span>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={uploading} onChange={(event) => void selectFile(event.target.files?.[0])} />
      {value ? (
        <div className="image-upload__preview">
          <img src={value} alt="" />
          <div className="image-upload__actions">
            <button className="button button--secondary button--small" type="button" disabled={uploading} onClick={() => inputRef.current?.click()}><Icon name="upload" />{uploading ? t('common.saving') : t('form.replace')}</button>
            <button className="button button--danger-ghost button--small" type="button" onClick={() => onChange('')}><Icon name="trash" />{t('form.remove')}</button>
          </div>
        </div>
      ) : (
        <button className="image-upload__empty" type="button" onClick={() => inputRef.current?.click()}><span><Icon name="image" /></span><strong>{t('form.upload')}</strong><small>{t('form.imageHelp')}</small></button>
      )}
      {error && <small className="field__error">{error}</small>}
    </div>
  )
}
