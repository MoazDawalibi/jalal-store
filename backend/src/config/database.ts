import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import { env } from './env.js'

const globalDatabase = globalThis as unknown as { jalalPrisma?: PrismaClient }

export const prisma = globalDatabase.jalalPrisma ?? new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.databaseUrl,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
  }),
})

if (env.nodeEnv !== 'production') globalDatabase.jalalPrisma = prisma
