const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false' || !API_BASE_URL

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }

interface ApiEnvelope<T> {
  success: true
  data: T
  meta?: Record<string, unknown>
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('jalal-admin-token')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 401) window.dispatchEvent(new Event('jalal:unauthorized'))
  if (!response.ok) {
    const details = await response.json().catch(() => null)
    if (response.status !== 401) window.dispatchEvent(new CustomEvent('jalal:api-error', { detail: details?.message ?? 'Request failed' }))
    throw new ApiError(response.status, details?.message ?? 'Request failed', details)
  }
  if (response.status === 204) return undefined as T
  const payload = await response.json() as ApiEnvelope<T> | T
  return typeof payload === 'object' && payload !== null && 'success' in payload && 'data' in payload
    ? payload.data
    : payload as T
}

async function upload<T>(path: string, form: FormData): Promise<T> {
  const token = localStorage.getItem('jalal-admin-token')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  if (response.status === 401) window.dispatchEvent(new Event('jalal:unauthorized'))
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status !== 401) window.dispatchEvent(new CustomEvent('jalal:api-error', { detail: payload?.message ?? 'Upload failed' }))
    throw new ApiError(response.status, payload?.message ?? 'Upload failed', payload)
  }
  return (payload?.data ?? payload) as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string, body?: unknown) => request<T>(path, { method: 'DELETE', body }),
  upload,
}
