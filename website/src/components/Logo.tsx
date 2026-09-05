import logo from '../../assets/jalal-logo-transparent.png'
import { useContent } from '../context/ContentContext'
import { usePreferences } from '../context/PreferencesContext'

export function Logo({ compact = false }: { compact?: boolean }) {
  const { settings } = useContent()
  const { language } = usePreferences()
  return (
    <a className={`logo ${compact ? 'logo--compact' : ''}`} href="#home" aria-label={`${settings?.storeName[language] ?? 'Jalal Shops'} — home`}>
      <img src={settings?.logo || logo} alt={settings?.storeName[language] ?? 'Jalal Shops'} />
    </a>
  )
}
