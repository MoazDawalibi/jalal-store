import { useMockApi, apiClient } from './client'

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 180))

const read = <T>(key: string, fallback: T): T => {
  const value = localStorage.getItem(`jalal-mock-${key}`)
  if (!value) return structuredClone(fallback)
  try { return JSON.parse(value) as T } catch { return structuredClone(fallback) }
}

const write = <T>(key: string, value: T) => localStorage.setItem(`jalal-mock-${key}`, JSON.stringify(value))

export function createCrudService<T extends { id: string }>(resource: string, seed: T[]) {
  return {
    async list(): Promise<T[]> {
      if (!useMockApi) return apiClient.get<T[]>(`/${resource}`)
      await wait()
      return read(resource, seed)
    },
    async get(id: string): Promise<T | undefined> {
      if (!useMockApi) return apiClient.get<T>(`/${resource}/${id}`)
      await wait()
      return read(resource, seed).find((item) => item.id === id)
    },
    async create(item: T): Promise<T> {
      if (!useMockApi) return apiClient.post<T>(`/${resource}`, item)
      await wait()
      const items = read(resource, seed)
      write(resource, [...items, item])
      return item
    },
    async update(id: string, item: T): Promise<T> {
      if (!useMockApi) return apiClient.put<T>(`/${resource}/${id}`, item)
      await wait()
      const items = read(resource, seed).map((current) => current.id === id ? item : current)
      write(resource, items)
      return item
    },
    async remove(id: string): Promise<void> {
      if (!useMockApi) return apiClient.delete<void>(`/${resource}/${id}`)
      await wait()
      write(resource, read(resource, seed).filter((item) => item.id !== id))
    },
  }
}

export function createSingletonService<T>(resource: string, seed: T) {
  return {
    async get(): Promise<T> {
      if (!useMockApi) return apiClient.get<T>(`/admin/${resource}`)
      await wait()
      return read(resource, seed)
    },
    async update(value: T): Promise<T> {
      if (!useMockApi) return apiClient.put<T>(`/admin/${resource}`, value)
      await wait()
      write(resource, value)
      return value
    },
  }
}
