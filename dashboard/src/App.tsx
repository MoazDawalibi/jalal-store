import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AdminLayout } from './layouts/AdminLayout'
import { useAuth } from './context/AuthContext'
import { AboutPage } from './pages/AboutPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ContactPage } from './pages/ContactPage'
import { HeroPage } from './pages/HeroPage'
import { HighlightsPage } from './pages/HighlightsPage'
import { LoginPage } from './pages/LoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { ProductsPage } from './pages/ProductsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SocialPage } from './pages/SocialPage'

function ProtectedLayout() {
  const { user } = useAuth()
  const location = useLocation()
  return user ? <AdminLayout /> : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedLayout />}>
      <Route index element={<OverviewPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/new" element={<ProductFormPage />} />
      <Route path="products/:id/edit" element={<ProductFormPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="hero" element={<HeroPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="statistics" element={<HighlightsPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="social-media" element={<SocialPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
