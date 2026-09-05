import { mockCategories } from '../mocks/data'
import { createCrudService } from './storage'

export const categoriesService = createCrudService('admin/categories', mockCategories)
