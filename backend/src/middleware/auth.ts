import type { RequestHandler } from 'express'
import { verifySessionToken } from '../services/auth.service.js'
import { ApiError } from '../utils/errors.js'

export const requireAuth: RequestHandler = (request, _response, next) => {
  const authorization = request.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
  if (!token) { next(new ApiError(401, 'Authentication required', undefined, 'UNAUTHORIZED')); return }
  void verifySessionToken(token).then((auth) => { request.auth = auth; next() }).catch(next)
}
