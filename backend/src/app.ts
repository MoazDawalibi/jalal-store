import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { allowedOrigins } from './config/env.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { authRouter } from './routes/auth.routes.js'
import { adminCategoriesRouter, publicCategoriesRouter } from './routes/categories.routes.js'
import { adminContentRouter, publicContentRouter } from './routes/content.routes.js'
import { adminProductsRouter, publicProductsRouter } from './routes/products.routes.js'
import { uploadsRouter } from './routes/uploads.routes.js'
import { ApiError } from './utils/errors.js'
import { success } from './utils/response.js'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  credentials: false,
  maxAge: 86_400,
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) callback(null, true)
    else callback(new ApiError(403, 'Origin is not allowed', undefined, 'CORS_FORBIDDEN'))
  },
}))
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_request, response) => success(response, { status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/products', publicProductsRouter)
app.use('/api/categories', publicCategoriesRouter)
app.use('/api', publicContentRouter)
app.use('/api/admin/products', adminProductsRouter)
app.use('/api/admin/categories', adminCategoriesRouter)
app.use('/api/admin', adminContentRouter)
app.use('/api/admin/uploads', uploadsRouter)
app.use(notFound)
app.use(errorHandler)

export default app
