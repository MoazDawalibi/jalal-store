import type { ZodType } from 'zod'
import { validationError } from './errors.js'
import { ApiError } from './errors.js'

export const parse = <T>(schema: ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value)
  if (!result.success) throw validationError(result.error)
  return result.data
}

export const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

export const routeParam = (value: string | string[] | undefined, name = 'id') => {
  if (typeof value !== 'string' || !value) throw new ApiError(400, `Invalid ${name}`, { [name]: `${name} is required` }, 'INVALID_ROUTE_PARAMETER')
  return value
}
