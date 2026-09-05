import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService, type AdminUser } from '../api/auth.service'

interface AuthValue {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => authService.getSession()?.user ?? null)
  const [loading, setLoading] = useState(false)

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  useEffect(() => {
    window.addEventListener('jalal:unauthorized', logout)
    return () => window.removeEventListener('jalal:unauthorized', logout)
  }, [logout])

  const value = useMemo<AuthValue>(() => ({
    user,
    loading,
    login: async (email, password) => {
      setLoading(true)
      try { setUser((await authService.login(email, password)).user) }
      finally { setLoading(false) }
    },
    logout,
  }), [loading, logout, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
