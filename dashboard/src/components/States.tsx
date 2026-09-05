import type { ReactNode } from 'react'
import { usePreferences } from '../context/PreferencesContext'
import { Icon } from './Icon'

export function LoadingState() {
  const { t } = usePreferences()
  return <div className="state-panel"><span className="spinner" /><p>{t('common.loading')}</p></div>
}

export function EmptyState({ title, body, action }: { title?: string; body?: string; action?: ReactNode }) {
  const { t } = usePreferences()
  return <div className="state-panel"><span className="state-panel__icon"><Icon name="products" /></span><h3>{title ?? t('common.empty')}</h3>{body && <p>{body}</p>}{action}</div>
}

export function ErrorState({ retry }: { retry?: () => void }) {
  const { t } = usePreferences()
  return <div className="state-panel state-panel--error"><span className="state-panel__icon"><Icon name="alert" /></span><h3>{t('common.error')}</h3>{retry && <button className="button button--secondary" onClick={retry}>Retry</button>}</div>
}

export function SaveNotice({ show }: { show: boolean }) {
  const { t } = usePreferences()
  return <div className={`save-notice ${show ? 'save-notice--show' : ''}`} role="status"><Icon name="check" />{t('common.saved')}</div>
}
