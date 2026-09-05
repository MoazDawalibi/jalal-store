import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations, type Translation } from '../i18n/translations'
import type { Language, Theme } from '../types/content'

interface PreferencesContextValue {
  language: Language
  theme: Theme
  t: Translation
  toggleLanguage: () => void
  toggleTheme: () => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('jalal-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('jalal-language')
  return saved === 'ar' ? 'ar' : 'en'
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('jalal-language', language)
    localStorage.setItem('jalal-theme', theme)
  }, [language, theme])

  const value = useMemo<PreferencesContextValue>(() => ({
    language,
    theme,
    t: translations[language],
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
