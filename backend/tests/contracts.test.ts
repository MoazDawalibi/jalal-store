import { describe, expect, it } from 'vitest'
import { categorySchema, contactSchema, productSchema } from '../src/validators/schemas.js'
import { hasValidImageSignature } from '../src/services/storage.service.js'

const localized = { en: 'English', ar: 'العربية' }
const image = 'https://example.com/image.webp'

describe('frontend contracts', () => {
  it('accepts the complete dashboard product shape including nullable commerce fields', () => {
    const result = productSchema.safeParse({
      id: 'test-product', name: localized, description: localized, categoryId: 'makeup', brand: 'Jalal', image,
      variants: [{ id: '11111111-1111-4111-8111-111111111111', value: '#ffffff', image, name: localized, description: localized }],
      price: null, currency: 'SYP', quantity: null, featured: true, isNew: true, active: true, displayOrder: 1,
      createdAt: '2026-08-10T00:00:00.000Z', updatedAt: '2026-08-10T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })

  it('accepts category metadata emitted by the dashboard', () => {
    expect(categorySchema.safeParse({ id: 'makeup', name: localized, description: localized, image, active: true, displayOrder: 1, createdAt: '2026-08-10T00:00:00.000Z', updatedAt: '2026-08-10T00:00:00.000Z' }).success).toBe(true)
  })

  it('keeps international phone and WhatsApp formats separate', () => {
    expect(contactSchema.safeParse({ sectionEyebrow: localized, sectionTitle: localized, sectionBody: localized, address: localized, phoneDisplay: '0932 383 855', phoneInternational: '+963932383855', whatsappNumber: '963932383855', email: 'store@example.com', mapsUrl: '', contactImage: image }).success).toBe(true)
  })

  it('does not trust an uploaded MIME label without matching image bytes', () => {
    const fake = { mimetype: 'image/png', buffer: Buffer.from('not an image') } as Express.Multer.File
    const png = { mimetype: 'image/png', buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) } as Express.Multer.File
    expect(hasValidImageSignature(fake)).toBe(false)
    expect(hasValidImageSignature(png)).toBe(true)
  })
})
