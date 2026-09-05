import multer from 'multer'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import { env } from '../config/env.js'
import { ApiError, isPrismaError } from '../utils/errors.js'

export const notFound: RequestHandler = (request, _response, next) => {
  next(new ApiError(404, `Route not found: ${request.method} ${request.path}`, undefined, 'NOT_FOUND'))
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  let apiError: ApiError
  if (error instanceof ApiError) apiError = error
  else if (error instanceof multer.MulterError) {
    apiError = new ApiError(error.code === 'LIMIT_FILE_SIZE' ? 413 : 422, error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 4 MB or smaller' : 'Invalid upload', { file: error.message }, 'UPLOAD_ERROR')
  } else if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    apiError = new ApiError(400, 'Request body contains invalid JSON', undefined, 'INVALID_JSON')
  } else if (isPrismaError(error)) {
    if (error.code === 'P2002') apiError = new ApiError(409, 'A record with this identifier already exists', undefined, 'CONFLICT')
    else if (error.code === 'P2003') apiError = new ApiError(409, 'This record is still referenced by other content', undefined, 'RELATION_CONFLICT')
    else if (error.code === 'P2025') apiError = new ApiError(404, 'Record not found', undefined, 'NOT_FOUND')
    else apiError = new ApiError(500, 'Database operation failed', undefined, 'DATABASE_ERROR')
  } else {
    apiError = new ApiError(500, 'An unexpected server error occurred', undefined, 'INTERNAL_ERROR')
  }

  if (apiError.status >= 500) {
    console.error('[api-error]', env.nodeEnv === 'production' ? { message: apiError.message, code: apiError.code } : error)
  }

  response.status(apiError.status).json({
    success: false,
    message: apiError.message,
    ...(apiError.code ? { code: apiError.code } : {}),
    ...(apiError.errors ? { errors: apiError.errors } : {}),
  })
}
