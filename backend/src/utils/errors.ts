import type { ZodError } from 'zod'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string>,
    public code?: string,
  ) {
    super(message)
  }
}

export const validationError = (error: ZodError) => {
  const errors: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'request'
    if (!errors[path]) errors[path] = issue.message
  }
  return new ApiError(422, 'Validation failed', errors, 'VALIDATION_ERROR')
}

export const isPrismaError = (error: unknown): error is { code: string; meta?: unknown } => {
  return Boolean(error && typeof error === 'object' && 'code' in error && typeof (error as { code?: unknown }).code === 'string')
}
