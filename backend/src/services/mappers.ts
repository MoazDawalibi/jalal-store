import type { z } from 'zod'
import type { aboutSchema, categorySchema, contactSchema, heroSchema, highlightSchema, productSchema, settingsSchema } from '../validators/schemas.js'

export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type HeroInput = z.infer<typeof heroSchema>
export type AboutInput = z.infer<typeof aboutSchema>
export type HighlightInput = z.infer<typeof highlightSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type SettingsInput = z.infer<typeof settingsSchema>

export const productData = (value: ProductInput) => ({
  nameEn: value.name.en, nameAr: value.name.ar, descriptionEn: value.description.en, descriptionAr: value.description.ar,
  categoryId: value.categoryId, brand: value.brand, imageUrl: value.image, price: value.price, currency: value.currency,
  quantity: value.quantity, featured: value.featured, isNew: value.isNew, active: value.active, displayOrder: value.displayOrder,
})

export const variantData = (value: ProductInput['variants'][number], displayOrder: number) => ({
  ...(value.id ? { id: value.id } : {}), value: value.value, imageUrl: value.image,
  nameEn: value.name?.en ?? null, nameAr: value.name?.ar ?? null,
  descriptionEn: value.description?.en ?? null, descriptionAr: value.description?.ar ?? null, displayOrder,
})

export const categoryData = (value: CategoryInput) => ({
  nameEn: value.name.en, nameAr: value.name.ar, descriptionEn: value.description.en, descriptionAr: value.description.ar,
  imageUrl: value.image, active: value.active, displayOrder: value.displayOrder,
})

export const heroData = (value: HeroInput) => ({
  eyebrowEn: value.eyebrow.en, eyebrowAr: value.eyebrow.ar, titleStartEn: value.titleStart.en, titleStartAr: value.titleStart.ar,
  titleAccentEn: value.titleAccent.en, titleAccentAr: value.titleAccent.ar, titleEndEn: value.titleEnd.en, titleEndAr: value.titleEnd.ar,
  bodyEn: value.body.en, bodyAr: value.body.ar, primaryCtaEn: value.primaryCta.en, primaryCtaAr: value.primaryCta.ar,
  secondaryCtaEn: value.secondaryCta.en, secondaryCtaAr: value.secondaryCta.ar, noteEn: value.note.en, noteAr: value.note.ar,
  cardLabelEn: value.cardLabel.en, cardLabelAr: value.cardLabel.ar, cardTitleEn: value.cardTitle.en, cardTitleAr: value.cardTitle.ar,
  mainImageUrl: value.mainImage, detailImageUrl: value.detailImage, visible: value.visible,
})

export const aboutData = (value: AboutInput) => ({
  eyebrowEn: value.eyebrow.en, eyebrowAr: value.eyebrow.ar, titleEn: value.title.en, titleAr: value.title.ar,
  bodyEn: value.body.en, bodyAr: value.body.ar, quoteEn: value.quote.en, quoteAr: value.quote.ar,
  mainImageUrl: value.mainImage, secondaryImageUrl: value.secondaryImage, visible: value.visible,
})

export const highlightData = (value: HighlightInput) => ({
  icon: value.icon, titleEn: value.title.en, titleAr: value.title.ar, bodyEn: value.body.en, bodyAr: value.body.ar,
  active: value.active, displayOrder: value.displayOrder,
})

export const contactData = (value: ContactInput) => ({
  sectionEyebrowEn: value.sectionEyebrow.en, sectionEyebrowAr: value.sectionEyebrow.ar,
  sectionTitleEn: value.sectionTitle.en, sectionTitleAr: value.sectionTitle.ar,
  sectionBodyEn: value.sectionBody.en, sectionBodyAr: value.sectionBody.ar, addressEn: value.address.en, addressAr: value.address.ar,
  phoneDisplay: value.phoneDisplay, phoneInternational: value.phoneInternational, whatsappNumber: value.whatsappNumber,
  email: value.email, mapsUrl: value.mapsUrl, contactImageUrl: value.contactImage,
})

export const settingsData = (value: SettingsInput) => ({
  storeNameEn: value.storeName.en, storeNameAr: value.storeName.ar, footerTitleEn: value.footerTitle.en, footerTitleAr: value.footerTitle.ar,
  footerDescriptionEn: value.footerDescription.en, footerDescriptionAr: value.footerDescription.ar,
  logoUrl: value.logo, faviconUrl: value.favicon, seoTitleEn: value.seoTitle.en, seoTitleAr: value.seoTitle.ar,
  metaDescriptionEn: value.metaDescription.en, metaDescriptionAr: value.metaDescription.ar,
})
