import { mockProducts } from '../mocks/data'
import { createCrudService } from './storage'

export const productsService = createCrudService('admin/products', mockProducts)
