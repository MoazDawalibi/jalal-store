import { Router } from 'express'
import { prisma } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'
import { categoryData } from '../services/mappers.js'
import { serializeCategory } from '../services/serializers.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/errors.js'
import { parse, routeParam } from '../utils/parse.js'
import { noContent, success } from '../utils/response.js'
import { categorySchema } from '../validators/schemas.js'

export const publicCategoriesRouter = Router()
publicCategoriesRouter.get('/', asyncHandler(async (_request, response) => {
  const items = await prisma.category.findMany({ where: { active: true }, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] })
  return success(response, items.map((item) => serializeCategory(item)))
}))

export const adminCategoriesRouter = Router()
adminCategoriesRouter.use(requireAuth)

adminCategoriesRouter.get('/', asyncHandler(async (_request, response) => {
  const items = await prisma.category.findMany({ orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] })
  return success(response, items.map((item) => serializeCategory(item, true)))
}))

adminCategoriesRouter.get('/:id', asyncHandler(async (request, response) => {
  const item = await prisma.category.findUnique({ where: { id: routeParam(request.params.id) } })
  if (!item) throw new ApiError(404, 'Category not found', undefined, 'NOT_FOUND')
  return success(response, serializeCategory(item, true))
}))

adminCategoriesRouter.post('/', asyncHandler(async (request, response) => {
  const value = parse(categorySchema, request.body)
  const item = await prisma.category.create({ data: { id: value.id, ...categoryData(value) } })
  return success(response, serializeCategory(item, true), 201)
}))

adminCategoriesRouter.put('/:id', asyncHandler(async (request, response) => {
  const value = parse(categorySchema, request.body)
  const item = await prisma.category.update({ where: { id: routeParam(request.params.id) }, data: categoryData(value) })
  return success(response, serializeCategory(item, true))
}))

adminCategoriesRouter.delete('/:id', asyncHandler(async (request, response) => {
  const id = routeParam(request.params.id)
  const products = await prisma.product.count({ where: { categoryId: id } })
  if (products > 0) throw new ApiError(409, 'Move or delete products in this category first', { category: `Category contains ${products} product${products === 1 ? '' : 's'}.` }, 'CATEGORY_NOT_EMPTY')
  await prisma.category.delete({ where: { id } })
  return noContent(response)
}))
