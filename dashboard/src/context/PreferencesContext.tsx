import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations, type TranslationKey } from '../i18n/translations'
import type { Language, Theme } from '../types/content'

interface PreferencesValue {
  language: Language
  theme: Theme
  t: (key: TranslationKey) => string
  toggleLanguage: () => void
  toggleTheme: () => void
}

const PreferencesContext = createContext<PreferencesValue | null>(null)

const initialLanguage = (): Language => localStorage.getItem('jalal-admin-language') === 'ar' ? 'ar' : 'en'
const initialTheme = (): Theme => {
  const saved = localStorage.getItem('jalal-admin-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('jalal-admin-language', language)
    localStorage.setItem('jalal-admin-theme', theme)
  }, [language, theme])

  const value = useMemo<PreferencesValue>(() => ({
    language,
    theme,
    t: (key) => translations[language][key] ?? key,
    toggleLanguage: () => setLanguage((current) => current === 'en' ? 'ar' : 'en'),
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
  }), [language, theme])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider')
  return context
}
