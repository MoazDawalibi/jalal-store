import type { ReactNode } from 'react'

export function PageHeader({ title, body, actions }: { title: string; body?: string; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div><h1>{title}</h1>{body && <p>{body}</p>}</div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  )
}
