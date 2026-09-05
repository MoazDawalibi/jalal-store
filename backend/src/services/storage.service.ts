import { randomUUID } from 'node:crypto'
import { del, put } from '@vercel/blob'
import { env } from '../config/env.js'
import { ApiError } from '../utils/errors.js'

const mimeExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export interface StoredImage { url: string; pathname: string; contentType: string; size: number }
export interface ImageStorage { upload(file: Express.Multer.File, scope: string): Promise<StoredImage>; remove(url: string): Promise<void> }

export const hasValidImageSignature = (file: Express.Multer.File) => {
  const bytes = file.buffer
  if (file.mimetype === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (file.mimetype === 'image/png') return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (file.mimetype === 'image/webp') return bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  return false
}

class VercelBlobImageStorage implements ImageStorage {
  async upload(file: Express.Multer.File, scope: string): Promise<StoredImage> {
    const extension = mimeExtensions[file.mimetype]
    if (!extension) throw new ApiError(422, 'Unsupported image type', { file: 'Use JPG, PNG, or WebP.' })
    const month = new Date().toISOString().slice(0, 7)
    const pathname = `jalal/${scope}/${month}/${randomUUID()}.${extension}`
    const blob = await put(pathname, file.buffer, {
      access: 'public', token: env.blobToken, contentType: file.mimetype, addRandomSuffix: false,
      cacheControlMaxAge: 31_536_000,
    })
    return { url: blob.url, pathname: blob.pathname, contentType: file.mimetype, size: file.size }
  }

  async remove(url: string) {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith('.blob.vercel-storage.com')) throw new ApiError(422, 'Only managed uploads can be deleted')
    await del(url, { token: env.blobToken })
  }
}

export const imageStorage: ImageStorage = new VercelBlobImageStorage()

export const allowedImageMimeTypes = new Set(Object.keys(mimeExtensions))
export const uploadImage = (file: Express.Multer.File, scope: string) => imageStorage.upload(file, scope).then((image) => image.url)
export const deleteImage = (url: string) => imageStorage.remove(url)
