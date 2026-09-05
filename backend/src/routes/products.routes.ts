import { Router } from 'express'
import type { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'
import { productData, variantData } from '../services/mappers.js'
import { serializeProduct } from '../services/serializers.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/errors.js'
import { parse, routeParam, slugify } from '../utils/parse.js'
import { noContent, success } from '../utils/response.js'
import { catalogQuerySchema, productSchema } from '../validators/schemas.js'

const productInclude = { variants: { orderBy: { displayOrder: 'asc' } } } as const

const productWhere = (query: ReturnType<typeof catalogQuerySchema.parse>, isAdmin: boolean): Prisma.ProductWhereInput => ({
  ...(!isAdmin ? { active: true } : query.active !== undefined ? { active: query.active } : {}),
  ...(query.category ? { categoryId: query.category } : {}),
  ...(query.featured !== undefined ? { featured: query.featured } : {}),
  ...(query.search ? { OR: [
    { nameEn: { contains: query.search, mode: 'insensitive' } },
    { nameAr: { contains: query.search } },
    { brand: { contains: query.search, mode: 'insensitive' } },
  ] } : {}),
})

export const publicProductsRouter = Router()

publicProductsRouter.get('/', asyncHandler(async (request, response) => {
  const query = parse(catalogQuerySchema, request.query)
  const where = productWhere(query, false)
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, include: productInclude, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }], skip: (query.page - 1) * query.limit, take: query.limit }),
    prisma.product.count({ where }),
  ])
  return success(response, items.map((item) => serializeProduct(item)), 200, { page: query.page, limit: query.limit, total, pageCount: Math.max(1, Math.ceil(total / query.limit)) })
}))

publicProductsRouter.get('/:id', asyncHandler(async (request, response) => {
  const item = await prisma.product.findFirst({ where: { id: routeParam(request.params.id), active: true }, include: productInclude })
  if (!item) throw new ApiError(404, 'Product not found', undefined, 'NOT_FOUND')
  return success(response, serializeProduct(item))
}))

export const adminProductsRouter = Router()
adminProductsRouter.use(requireAuth)

adminProductsRouter.get('/', asyncHandler(async (request, response) => {
  const query = parse(catalogQuerySchema, { ...request.query, limit: request.query.limit ?? 100 })
  const where = productWhere(query, true)
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, include: productInclude, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }], skip: (query.page - 1) * query.limit, take: query.limit }),
    prisma.product.count({ where }),
  ])
  return success(response, items.map((item) => serializeProduct(item, true)), 200, { page: query.page, limit: query.limit, total, pageCount: Math.max(1, Math.ceil(total / query.limit)) })
}))

adminProductsRouter.get('/:id', asyncHandler(async (request, response) => {
  const item = await prisma.product.findUnique({ where: { id: routeParam(request.params.id) }, include: productInclude })
  if (!item) throw new ApiError(404, 'Product not found', undefined, 'NOT_FOUND')
  return success(response, serializeProduct(item, true))
}))

adminProductsRouter.post('/', asyncHandler(async (request, response) => {
  const value = parse(productSchema, request.body)
  const productId = value.id ?? slugify(value.name.en)
  if (!productId) throw new ApiError(422, 'Validation failed', { id: 'A valid product identifier is required' })
  const item = await prisma.product.create({
    data: { id: productId, ...productData(value), variants: { create: value.variants.map(variantData) } },
    include: productInclude,
  })
  return success(response, serializeProduct(item, true), 201)
}))

adminProductsRouter.put('/:id', asyncHandler(async (request, response) => {
  const value = parse(productSchema, request.body)
  const id = routeParam(request.params.id)
  const item = await prisma.$transaction(async (database) => {
    await database.productVariant.deleteMany({ where: { productId: id } })
    return database.product.update({
      where: { id },
      data: { ...productData(value), variants: { create: value.variants.map(variantData) } },
      include: productInclude,
    })
  })
  return success(response, serializeProduct(item, true))
}))

adminProductsRouter.patch('/:id', asyncHandler(async (request, response) => {
  const fields = parse(productSchema.pick({ active: true, featured: true, isNew: true }).partial().refine((value) => Object.keys(value).length > 0), request.body)
  const item = await prisma.product.update({ where: { id: routeParam(request.params.id) }, data: fields, include: productInclude })
  return success(response, serializeProduct(item, true))
}))

adminProductsRouter.delete('/:id', asyncHandler(async (request, response) => {
  await prisma.product.delete({ where: { id: routeParam(request.params.id) } })
  return noContent(response)
}))
