import { Router } from 'express'
import { prisma } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'
import {
  aboutData,
  contactData,
  heroData,
  highlightData,
  settingsData,
} from '../services/mappers.js'
import {
  serializeAbout,
  serializeContact,
  serializeHero,
  serializeHighlight,
  serializeSettings,
} from '../services/serializers.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/errors.js'
import { parse, routeParam } from '../utils/parse.js'
import { noContent, success } from '../utils/response.js'
import {
  aboutSchema,
  contactSchema,
  heroSchema,
  highlightSchema,
  settingsSchema,
  socialLinksSchema,
} from '../validators/schemas.js'

export const publicContentRouter = Router()
export const adminContentRouter = Router()

const required = <T>(value: T | null, label: string): T => {
  if (!value) throw new ApiError(404, `${label} has not been configured`, undefined, 'CONTENT_NOT_CONFIGURED')
  return value
}

publicContentRouter.get('/content/hero', asyncHandler(async (_request, response) => {
  const value = required(await prisma.heroContent.findUnique({ where: { id: 'default' } }), 'Hero content')
  success(response, serializeHero(value))
}))

publicContentRouter.get('/content/about', asyncHandler(async (_request, response) => {
  const value = required(await prisma.aboutContent.findUnique({ where: { id: 'default' } }), 'About content')
  success(response, serializeAbout(value))
}))

publicContentRouter.get('/statistics', asyncHandler(async (_request, response) => {
  const values = await prisma.highlight.findMany({ where: { active: true }, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] })
  success(response, values.map((value) => serializeHighlight(value)))
}))

publicContentRouter.get('/contact', asyncHandler(async (_request, response) => {
  const value = required(await prisma.contactSettings.findUnique({ where: { id: 'default' } }), 'Contact settings')
  success(response, serializeContact(value))
}))

publicContentRouter.get('/social-links', asyncHandler(async (_request, response) => {
  const values = await prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { displayOrder: 'asc' } })
  success(response, values.map(({ id, url, enabled }) => ({ id, url, enabled })))
}))

publicContentRouter.get('/settings/public', asyncHandler(async (_request, response) => {
  const value = required(await prisma.siteSettings.findUnique({ where: { id: 'default' } }), 'Site settings')
  success(response, serializeSettings(value))
}))

adminContentRouter.use(requireAuth)

adminContentRouter.get('/content/hero', asyncHandler(async (_request, response) => {
  const value = required(await prisma.heroContent.findUnique({ where: { id: 'default' } }), 'Hero content')
  success(response, serializeHero(value))
}))

adminContentRouter.put('/content/hero', asyncHandler(async (request, response) => {
  const input = parse(heroSchema, request.body)
  const value = await prisma.heroContent.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...heroData(input) },
    update: heroData(input),
  })
  success(response, serializeHero(value))
}))

adminContentRouter.get('/content/about', asyncHandler(async (_request, response) => {
  const value = required(await prisma.aboutContent.findUnique({ where: { id: 'default' } }), 'About content')
  success(response, serializeAbout(value))
}))

adminContentRouter.put('/content/about', asyncHandler(async (request, response) => {
  const input = parse(aboutSchema, request.body)
  const value = await prisma.aboutContent.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...aboutData(input) },
    update: aboutData(input),
  })
  success(response, serializeAbout(value))
}))

adminContentRouter.get('/statistics', asyncHandler(async (_request, response) => {
  const values = await prisma.highlight.findMany({ orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] })
  success(response, values.map((value) => serializeHighlight(value, true)))
}))

adminContentRouter.get('/statistics/:id', asyncHandler(async (request, response) => {
  const value = await prisma.highlight.findUnique({ where: { id: routeParam(request.params.id) } })
  success(response, serializeHighlight(required(value, 'Highlight'), true))
}))

adminContentRouter.post('/statistics', asyncHandler(async (request, response) => {
  const input = parse(highlightSchema, request.body)
  const value = await prisma.highlight.create({ data: highlightData(input) })
  success(response, serializeHighlight(value, true), 201)
}))

adminContentRouter.put('/statistics/:id', asyncHandler(async (request, response) => {
  const input = parse(highlightSchema, request.body)
  const value = await prisma.highlight.update({ where: { id: routeParam(request.params.id) }, data: highlightData(input) })
  success(response, serializeHighlight(value, true))
}))

adminContentRouter.delete('/statistics/:id', asyncHandler(async (request, response) => {
  await prisma.highlight.delete({ where: { id: routeParam(request.params.id) } })
  noContent(response)
}))

adminContentRouter.get('/contact', asyncHandler(async (_request, response) => {
  const value = required(await prisma.contactSettings.findUnique({ where: { id: 'default' } }), 'Contact settings')
  success(response, serializeContact(value))
}))

adminContentRouter.put('/contact', asyncHandler(async (request, response) => {
  const input = parse(contactSchema, request.body)
  const value = await prisma.contactSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...contactData(input) },
    update: contactData(input),
  })
  success(response, serializeContact(value))
}))

adminContentRouter.get('/social-links', asyncHandler(async (_request, response) => {
  const values = await prisma.socialLink.findMany({ orderBy: { displayOrder: 'asc' } })
  success(response, values.map(({ id, url, enabled }) => ({ id, url, enabled })))
}))

adminContentRouter.put('/social-links', asyncHandler(async (request, response) => {
  const input = parse(socialLinksSchema, request.body)
  await prisma.$transaction(input.map((link, displayOrder) => prisma.socialLink.upsert({
    where: { id: link.id },
    create: { ...link, displayOrder },
    update: { url: link.url, enabled: link.enabled, displayOrder },
  })))
  const values = await prisma.socialLink.findMany({ orderBy: { displayOrder: 'asc' } })
  success(response, values.map(({ id, url, enabled }) => ({ id, url, enabled })))
}))

adminContentRouter.get('/settings', asyncHandler(async (_request, response) => {
  const value = required(await prisma.siteSettings.findUnique({ where: { id: 'default' } }), 'Site settings')
  success(response, serializeSettings(value))
}))

adminContentRouter.put('/settings', asyncHandler(async (request, response) => {
  const input = parse(settingsSchema, request.body)
  const value = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...settingsData(input) },
    update: settingsData(input),
  })
  success(response, serializeSettings(value))
}))
