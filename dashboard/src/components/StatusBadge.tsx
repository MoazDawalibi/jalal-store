export function StatusBadge({ tone, children }: { tone: 'success' | 'muted' | 'accent' | 'warning'; children: React.ReactNode }) {
  return <span className={`status-badge status-badge--${tone}`}><i />{children}</span>
}
