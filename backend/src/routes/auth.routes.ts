import { Router } from 'express'
import { prisma } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'
import { clearLoginAttempts, createSession, recordLoginAttempt, revokeSession, verifyPassword } from '../services/auth.service.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/errors.js'
import { parse } from '../utils/parse.js'
import { success } from '../utils/response.js'
import { loginSchema } from '../validators/schemas.js'

export const authRouter = Router()

authRouter.post('/login', asyncHandler(async (request, response) => {
  const credentials = parse(loginSchema, request.body)
  const key = await recordLoginAttempt(credentials.email, request.ip ?? request.socket.remoteAddress ?? 'unknown')
  const admin = await prisma.admin.findUnique({ where: { email: credentials.email } })
  if (!admin || !(await verifyPassword(credentials.password, admin.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password', undefined, 'INVALID_CREDENTIALS')
  }
  await clearLoginAttempts(key)
  await prisma.adminSession.deleteMany({ where: { expiresAt: { lte: new Date() } } })
  const session = await createSession(admin)
  return success(response, {
    token: session.token,
    expiresAt: session.expiresAt,
    user: { id: admin.id, name: admin.name, email: admin.email },
  })
}))

authRouter.post('/logout', requireAuth, asyncHandler(async (request, response) => {
  await revokeSession(request.auth!.sessionId)
  return success(response, { loggedOut: true })
}))

authRouter.get('/me', requireAuth, asyncHandler(async (request, response) => {
  const { adminId: id, name, email } = request.auth!
  return success(response, { id, name, email })
}))
