import { apiClient, useMockApi } from './client'

export interface AdminUser { id: string; name: string; email: string }
export interface AuthSession { token: string; user: AdminUser }

const sessionKey = 'jalal-admin-session'

export const authService = {
  getSession(): AuthSession | null {
    const stored = localStorage.getItem(sessionKey)
    if (!stored) return null
    try { return JSON.parse(stored) as AuthSession } catch { return null }
  },
  async login(email: string, password: string): Promise<AuthSession> {
    const session = useMockApi
      ? { token: 'mock-admin-token', user: { id: 'admin-1', name: 'Store Admin', email } }
      : await apiClient.post<AuthSession>('/auth/login', { email, password })
    localStorage.setItem(sessionKey, JSON.stringify(session))
    localStorage.setItem('jalal-admin-token', session.token)
    return session
  },
  logout() {
    if (!useMockApi && localStorage.getItem('jalal-admin-token')) void apiClient.post('/auth/logout', {}).catch(() => undefined)
    localStorage.removeItem(sessionKey)
    localStorage.removeItem('jalal-admin-token')
  },
}
