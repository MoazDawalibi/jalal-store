export type Language = 'en' | 'ar'
export type Theme = 'light' | 'dark'
export type LocalizedText = Record<Language, string>

export type CategoryId = string

export interface Category {
  id: CategoryId
  name: LocalizedText
  description: LocalizedText
  image: string
}

export interface ProductColour {
  value: string
  image: string
  name?: LocalizedText
  description?: LocalizedText
}

export interface Product {
  id: string
  name: LocalizedText
  category: CategoryId
  image: string
  brand: string
  description: LocalizedText
  colors?: ProductColour[]
  price: number | null
  currency?: string
  quantity: number | null
  featured?: boolean
  isNew?: boolean
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

export interface Highlight {
  id: string
  icon: 'bag' | 'sparkles' | 'message'
  title: LocalizedText
  body: LocalizedText
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

export interface SocialLink { id: 'instagram' | 'facebook' | 'tiktok'; url: string; enabled: boolean }

export interface WebsiteSettings {
  storeName: LocalizedText
  footerDescription: LocalizedText
  footerTitle: LocalizedText
  logo: string
  favicon: string
  seoTitle: LocalizedText
  metaDescription: LocalizedText
}
