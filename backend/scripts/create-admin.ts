import 'dotenv/config'
import { prisma } from '../src/config/database.js'
import { hashPassword } from '../src/services/auth.service.js'

const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD ?? ''
const name = (process.env.ADMIN_NAME ?? 'Store Admin').trim()

if (!email || !email.includes('@')) throw new Error('Set a valid ADMIN_EMAIL before creating the admin')
if (password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters')

const passwordHash = await hashPassword(password)
const admin = await prisma.admin.upsert({
  where: { email },
  create: { email, name, passwordHash },
  update: { name, passwordHash },
})

console.log(`Admin ready: ${admin.email}`)
await prisma.$disconnect()
