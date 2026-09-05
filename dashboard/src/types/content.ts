export type Language = 'en' | 'ar'
export type Theme = 'light' | 'dark'
export type LocalizedText = Record<Language, string>

export interface ProductVariant {
  id: string
  value: string
  image: string
  name?: LocalizedText
  description?: LocalizedText
}

export interface Product {
  id: string
  name: LocalizedText
  description: LocalizedText
  categoryId: string
  brand: string
  image: string
  variants: ProductVariant[]
  price: number | null
  currency: string
  quantity: number | null
  featured: boolean
  isNew: boolean
  active: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: LocalizedText
  description: LocalizedText
  image: string
  active: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface HeroContent {
  eyebrow: LocalizedText
  titleStart: LocalizedText
  titleAccent: LocalizedText
  titleEnd: LocalizedText
  body: LocalizedText
  primaryCta: LocalizedText
  secondaryCta: LocalizedText
  note: LocalizedText
  cardLabel: LocalizedText
  cardTitle: LocalizedText
  mainImage: string
  detailImage: string
  visible: boolean
}

export interface AboutContent {
  eyebrow: LocalizedText
  title: LocalizedText
  body: LocalizedText
  quote: LocalizedText
  mainImage: string
  secondaryImage: string
  visible: boolean
}

export type HighlightIcon = 'bag' | 'sparkles' | 'message'

export interface Highlight {
  id: string
  icon: HighlightIcon
  title: LocalizedText
  body: LocalizedText
  active: boolean
  displayOrder: number
}

export interface ContactSettings {
  sectionEyebrow: LocalizedText
  sectionTitle: LocalizedText
  sectionBody: LocalizedText
  address: LocalizedText
  phoneDisplay: string
  phoneInternational: string
  whatsappNumber: string
  email: string
  mapsUrl: string
  contactImage: string
}

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok'

export interface SocialLink {
  id: SocialPlatform
  url: string
  enabled: boolean
}

export interface WebsiteSettings {
  storeName: LocalizedText
  footerDescription: LocalizedText
  footerTitle: LocalizedText
  logo: string
  favicon: string
  seoTitle: LocalizedText
  metaDescription: LocalizedText
}

export interface ContentMap {
  hero: HeroContent
  about: AboutContent
  highlights: Highlight[]
  contact: ContactSettings
  social: SocialLink[]
  settings: WebsiteSettings
}

export interface ApiValidationError {
  field: string
  message: string
}

export interface ApiListResponse<T> {
  data: T[]
  total: number
}
