import { z } from 'zod'

const text = (max = 500) => z.string().trim().min(1).max(max)
const optionalText = (max = 2_000) => z.string().trim().max(max).default('')
const id = z.string().trim().min(2).max(120).regex(/^[a-z0-9][a-z0-9-]*$/, 'Use lowercase letters, numbers, and hyphens')
const imageUrl = z.string().trim().max(4_096).refine((value) => {
  try { const url = new URL(value); return url.protocol === 'https:' || (process.env.NODE_ENV !== 'production' && url.protocol === 'http:') } catch { return false }
}, 'A valid image URL is required')
const optionalUrl = z.string().trim().max(4_096).refine((value) => {
  if (!value) return true
  try { const url = new URL(value); return url.protocol === 'https:' || (process.env.NODE_ENV !== 'production' && url.protocol === 'http:') } catch { return false }
}, 'Enter a valid URL')

export const localizedSchema = z.object({ en: text(4_000), ar: text(4_000) }).strict()
export const optionalLocalizedSchema = z.object({ en: optionalText(4_000), ar: optionalText(4_000) }).strict()

export const loginSchema = z.object({ email: z.email().max(320).transform((value) => value.toLowerCase()), password: z.string().min(8).max(200) }).strict()

export const productVariantSchema = z.object({
  id: z.uuid().optional(),
  value: z.string().trim().min(1).max(32),
  image: imageUrl,
  name: localizedSchema.optional(),
  description: optionalLocalizedSchema.optional(),
}).strict()

export const productSchema = z.object({
  id: id.optional(),
  name: localizedSchema,
  description: optionalLocalizedSchema,
  categoryId: id,
  brand: text(160),
  image: imageUrl,
  variants: z.array(productVariantSchema).max(30).default([]),
  price: z.number().nonnegative().max(999_999_999_999).nullable(),
  currency: z.string().trim().min(2).max(8).regex(/^[A-Z]+$/),
  quantity: z.number().int().nonnegative().max(10_000_000).nullable(),
  featured: z.boolean(),
  isNew: z.boolean(),
  active: z.boolean(),
  displayOrder: z.number().int().min(0).max(1_000_000),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
}).strict()

export const categorySchema = z.object({
  id,
  name: localizedSchema,
  description: optionalLocalizedSchema,
  image: imageUrl,
  active: z.boolean(),
  displayOrder: z.number().int().min(0).max(1_000_000),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
}).strict()

export const heroSchema = z.object({
  eyebrow: localizedSchema, titleStart: localizedSchema, titleAccent: localizedSchema, titleEnd: localizedSchema,
  body: localizedSchema, primaryCta: localizedSchema, secondaryCta: localizedSchema, note: localizedSchema,
  cardLabel: localizedSchema, cardTitle: localizedSchema, mainImage: imageUrl, detailImage: imageUrl, visible: z.boolean(),
}).strict()

export const aboutSchema = z.object({
  eyebrow: localizedSchema, title: localizedSchema, body: localizedSchema, quote: localizedSchema,
  mainImage: imageUrl, secondaryImage: imageUrl, visible: z.boolean(),
}).strict()

export const highlightSchema = z.object({
  id: z.uuid().optional(), icon: z.enum(['bag', 'sparkles', 'message']), title: localizedSchema, body: localizedSchema,
  active: z.boolean(), displayOrder: z.number().int().min(0).max(1_000_000),
}).strict()

export const contactSchema = z.object({
  sectionEyebrow: localizedSchema, sectionTitle: localizedSchema, sectionBody: localizedSchema, address: localizedSchema,
  phoneDisplay: text(60), phoneInternational: z.string().trim().regex(/^\+[1-9]\d{7,14}$/),
  whatsappNumber: z.string().trim().regex(/^[1-9]\d{7,14}$/), email: z.email().max(320), mapsUrl: optionalUrl, contactImage: imageUrl,
}).strict()

export const socialLinkSchema = z.object({ id: z.enum(['instagram', 'facebook', 'tiktok']), url: optionalUrl, enabled: z.boolean() }).strict()
export const socialLinksSchema = z.array(socialLinkSchema).max(3)

export const settingsSchema = z.object({
  storeName: localizedSchema, footerDescription: localizedSchema, footerTitle: localizedSchema,
  logo: z.union([imageUrl, z.literal('')]), favicon: z.union([imageUrl, z.literal('')]),
  seoTitle: localizedSchema, metaDescription: localizedSchema,
}).strict()

const queryBoolean = z.enum(['true', 'false']).transform((value) => value === 'true')
export const catalogQuerySchema = z.object({
  category: id.optional(), featured: queryBoolean.optional(), active: queryBoolean.optional(), search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().min(1).max(100_000).default(1), limit: z.coerce.number().int().min(1).max(100).default(24),
}).passthrough()

export const uploadScopeSchema = z.enum(['products', 'categories', 'hero', 'about', 'contact', 'logo', 'favicon', 'variants'])
export const deleteUploadSchema = z.object({ url: z.url().max(4_096) }).strict()
