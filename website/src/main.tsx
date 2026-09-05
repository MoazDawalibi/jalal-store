import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { PreferencesProvider } from './context/PreferencesContext'
import { ContentProvider } from './context/ContentContext'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <ContentProvider><App /></ContentProvider>
    </PreferencesProvider>
  </StrictMode>,
)
