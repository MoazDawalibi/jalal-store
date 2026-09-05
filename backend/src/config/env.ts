const cleanOrigin = (value?: string) => value?.trim().replace(/\/$/, '') || undefined

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/jalal_store',
  authTokenHours: Math.max(1, Math.min(168, Number(process.env.AUTH_TOKEN_HOURS ?? 12))),
  websiteUrl: cleanOrigin(process.env.WEBSITE_URL),
  dashboardUrl: cleanOrigin(process.env.DASHBOARD_URL),
  get authSecret() {
    const secret = process.env.AUTH_SECRET
    if (!secret || secret.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters')
    return secret
  },
  get blobToken() {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not configured')
    return token
  },
}

export const allowedOrigins = new Set([
  env.websiteUrl,
  env.dashboardUrl,
  ...(env.nodeEnv === 'production' ? [] : [
    'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5180',
    'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5180',
  ]),
].filter((origin): origin is string => Boolean(origin)))
