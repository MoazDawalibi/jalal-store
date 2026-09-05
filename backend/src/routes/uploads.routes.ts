import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/auth.js'
import { deleteImage, hasValidImageSignature, uploadImage } from '../services/storage.service.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/errors.js'
import { parse } from '../utils/parse.js'
import { noContent, success } from '../utils/response.js'
import { deleteUploadSchema, uploadScopeSchema } from '../validators/schemas.js'

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (acceptedTypes.has(file.mimetype)) callback(null, true)
    else callback(new ApiError(422, 'Only JPEG, PNG, and WebP images are supported', { file: 'Unsupported image type' }, 'INVALID_IMAGE_TYPE'))
  },
})

export const uploadsRouter = Router()
uploadsRouter.use(requireAuth)

uploadsRouter.post('/', upload.single('file'), asyncHandler(async (request, response) => {
  if (!request.file) throw new ApiError(422, 'Choose an image to upload', { file: 'Image is required' }, 'VALIDATION_ERROR')
  if (!hasValidImageSignature(request.file)) throw new ApiError(422, 'File content does not match its image type', { file: 'Choose a valid JPEG, PNG, or WebP image' }, 'INVALID_IMAGE_CONTENT')
  const scope = uploadScopeSchema.safeParse(request.body.scope)
  if (!scope.success) throw new ApiError(422, 'Invalid upload scope', { scope: 'Choose a supported content area' }, 'VALIDATION_ERROR')
  const url = await uploadImage(request.file, scope.data)
  success(response, { url }, 201)
}))

uploadsRouter.delete('/', asyncHandler(async (request, response) => {
  const input = parse(deleteUploadSchema, request.body)
  await deleteImage(input.url)
  noContent(response)
}))
