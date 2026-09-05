import { createHash, randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { jwtVerify, SignJWT } from 'jose'
import { prisma } from '../config/database.js'
import { env } from '../config/env.js'
import { ApiError } from '../utils/errors.js'

const secret = () => new TextEncoder().encode(env.authSecret)
const attemptWindowMs = 15 * 60 * 1_000
const maximumAttempts = 5

export const hashPassword = (password: string) => bcrypt.hash(password, 12)

export const verifyPassword = (password: string, passwordHash: string) => bcrypt.compare(password, passwordHash)

const attemptKey = (email: string, ip: string) => createHash('sha256').update(`${email}:${ip}`).digest('hex')

export async function recordLoginAttempt(email: string, ip: string) {
  const key = attemptKey(email, ip)
  const now = new Date()
  const current = await prisma.loginAttempt.findUnique({ where: { key } })
  if (current && current.expiresAt > now && current.attempts >= maximumAttempts) {
    throw new ApiError(429, 'Too many login attempts. Try again in 15 minutes.', undefined, 'RATE_LIMITED')
  }
  const expiresAt = new Date(now.getTime() + attemptWindowMs)
  if (!current || current.expiresAt <= now) {
    await prisma.loginAttempt.upsert({ where: { key }, create: { key, attempts: 1, windowStart: now, expiresAt }, update: { attempts: 1, windowStart: now, expiresAt } })
  } else {
    await prisma.loginAttempt.update({ where: { key }, data: { attempts: { increment: 1 } } })
  }
  return key
}

export const clearLoginAttempts = (key: string) => prisma.loginAttempt.deleteMany({ where: { key } })

export async function createSession(admin: { id: string; email: string; name: string }) {
  const sessionId = randomUUID()
  const expiresAt = new Date(Date.now() + env.authTokenHours * 60 * 60 * 1_000)
  await prisma.adminSession.create({ data: { id: sessionId, adminId: admin.id, expiresAt } })
  const token = await new SignJWT({ sid: sessionId, email: admin.email, name: admin.name })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1_000))
    .sign(secret())
  return { token, expiresAt }
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
    if (!payload.sub || typeof payload.sid !== 'string') throw new Error('Invalid token claims')
    const session = await prisma.adminSession.findFirst({
      where: { id: payload.sid, adminId: payload.sub, expiresAt: { gt: new Date() } },
      include: { admin: true },
    })
    if (!session) throw new Error('Session expired')
    return { adminId: session.adminId, sessionId: session.id, email: session.admin.email, name: session.admin.name }
  } catch {
    throw new ApiError(401, 'Authentication required', undefined, 'UNAUTHORIZED')
  }
}

export const revokeSession = (sessionId: string) => prisma.adminSession.deleteMany({ where: { id: sessionId } })
