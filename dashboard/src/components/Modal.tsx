import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePreferences } from '../context/PreferencesContext'
import { Icon } from './Icon'

interface ModalProps { open: boolean; title: string; body?: string; children?: ReactNode; onClose: () => void; footer?: ReactNode; size?: 'small' | 'medium' | 'large' }

export function Modal({ open, title, body, children, onClose, footer, size = 'medium' }: ModalProps) {
  const { t } = usePreferences()
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', close)
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', close) }
  }, [onClose, open])
  if (!open) return null
  return createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__head"><div><h2 id="modal-title">{title}</h2>{body && <p>{body}</p>}</div><button className="icon-button" onClick={onClose} aria-label={t('common.close')}><Icon name="close" /></button></header>
        {children && <div className="modal__body">{children}</div>}
        {footer && <footer className="modal__footer">{footer}</footer>}
      </section>
    </div>, document.body,
  )
}
