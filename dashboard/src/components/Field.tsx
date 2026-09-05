import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface FieldShellProps { label: string; hint?: string; error?: string; required?: boolean; children: ReactNode }

export function FieldShell({ label, hint, error, required, children }: FieldShellProps) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label">{label}{required && <b aria-hidden="true">*</b>}</span>
      {children}
      {error ? <small className="field__error">{error}</small> : hint ? <small className="field__hint">{hint}</small> : null}
    </label>
  )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => <input className="control" ref={ref} {...props} />)
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => <textarea className="control control--textarea" ref={ref} {...props} />)
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => <select className="control" ref={ref} {...props} />)

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="form-section"><div className="form-section__head"><h2>{title}</h2>{description && <p>{description}</p>}</div><div className="form-section__body">{children}</div></section>
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string }) {
  return (
    <label className="toggle-row">
      <span><strong>{label}</strong>{description && <small>{description}</small>}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true"><b /></i>
    </label>
  )
}
