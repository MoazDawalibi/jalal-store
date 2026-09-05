interface VariantRecord {
  id: string; value: string; imageUrl: string; nameEn: string | null; nameAr: string | null;
  descriptionEn: string | null; descriptionAr: string | null; displayOrder: number
}

interface ProductRecord {
  id: string; nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; categoryId: string;
  brand: string; imageUrl: string; price: unknown; currency: string; quantity: number | null; featured: boolean;
  isNew: boolean; active: boolean; displayOrder: number; createdAt: Date; updatedAt: Date; variants: VariantRecord[]
}

interface CategoryRecord {
  id: string; nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; imageUrl: string;
  active: boolean; displayOrder: number; createdAt: Date; updatedAt: Date
}

export const serializeProduct = (product: ProductRecord, admin = false) => ({
  id: product.id,
  name: { en: product.nameEn, ar: product.nameAr },
  description: { en: product.descriptionEn, ar: product.descriptionAr },
  categoryId: product.categoryId,
  brand: product.brand,
  image: product.imageUrl,
  variants: product.variants.sort((a, b) => a.displayOrder - b.displayOrder).map((variant) => ({
    id: variant.id, value: variant.value, image: variant.imageUrl,
    ...(variant.nameEn && variant.nameAr ? { name: { en: variant.nameEn, ar: variant.nameAr } } : {}),
    ...(variant.descriptionEn !== null && variant.descriptionAr !== null ? { description: { en: variant.descriptionEn, ar: variant.descriptionAr } } : {}),
  })),
  price: product.price === null ? null : Number(product.price),
  currency: product.currency,
  quantity: product.quantity,
  featured: product.featured,
  isNew: product.isNew,
  ...(admin ? { active: product.active, displayOrder: product.displayOrder, createdAt: product.createdAt, updatedAt: product.updatedAt } : {}),
})

export const serializeCategory = (category: CategoryRecord, admin = false) => ({
  id: category.id,
  name: { en: category.nameEn, ar: category.nameAr },
  description: { en: category.descriptionEn, ar: category.descriptionAr },
  image: category.imageUrl,
  ...(admin ? { active: category.active, displayOrder: category.displayOrder, createdAt: category.createdAt, updatedAt: category.updatedAt } : {}),
})

export const serializeHero = (value: {
  eyebrowEn: string; eyebrowAr: string; titleStartEn: string; titleStartAr: string; titleAccentEn: string; titleAccentAr: string;
  titleEndEn: string; titleEndAr: string; bodyEn: string; bodyAr: string; primaryCtaEn: string; primaryCtaAr: string;
  secondaryCtaEn: string; secondaryCtaAr: string; noteEn: string; noteAr: string; cardLabelEn: string; cardLabelAr: string;
  cardTitleEn: string; cardTitleAr: string; mainImageUrl: string; detailImageUrl: string; visible: boolean
}) => ({
  eyebrow: { en: value.eyebrowEn, ar: value.eyebrowAr }, titleStart: { en: value.titleStartEn, ar: value.titleStartAr },
  titleAccent: { en: value.titleAccentEn, ar: value.titleAccentAr }, titleEnd: { en: value.titleEndEn, ar: value.titleEndAr },
  body: { en: value.bodyEn, ar: value.bodyAr }, primaryCta: { en: value.primaryCtaEn, ar: value.primaryCtaAr },
  secondaryCta: { en: value.secondaryCtaEn, ar: value.secondaryCtaAr }, note: { en: value.noteEn, ar: value.noteAr },
  cardLabel: { en: value.cardLabelEn, ar: value.cardLabelAr }, cardTitle: { en: value.cardTitleEn, ar: value.cardTitleAr },
  mainImage: value.mainImageUrl, detailImage: value.detailImageUrl, visible: value.visible,
})

export const serializeAbout = (value: {
  eyebrowEn: string; eyebrowAr: string; titleEn: string; titleAr: string; bodyEn: string; bodyAr: string;
  quoteEn: string; quoteAr: string; mainImageUrl: string; secondaryImageUrl: string; visible: boolean
}) => ({
  eyebrow: { en: value.eyebrowEn, ar: value.eyebrowAr }, title: { en: value.titleEn, ar: value.titleAr },
  body: { en: value.bodyEn, ar: value.bodyAr }, quote: { en: value.quoteEn, ar: value.quoteAr },
  mainImage: value.mainImageUrl, secondaryImage: value.secondaryImageUrl, visible: value.visible,
})

export const serializeHighlight = (value: {
  id: string; icon: string; titleEn: string; titleAr: string; bodyEn: string; bodyAr: string; active: boolean; displayOrder: number
}, admin = false) => ({
  id: value.id, icon: value.icon, title: { en: value.titleEn, ar: value.titleAr }, body: { en: value.bodyEn, ar: value.bodyAr },
  ...(admin ? { active: value.active, displayOrder: value.displayOrder } : {}),
})

export const serializeContact = (value: {
  sectionEyebrowEn: string; sectionEyebrowAr: string; sectionTitleEn: string; sectionTitleAr: string;
  sectionBodyEn: string; sectionBodyAr: string; addressEn: string; addressAr: string; phoneDisplay: string;
  phoneInternational: string; whatsappNumber: string; email: string; mapsUrl: string; contactImageUrl: string
}) => ({
  sectionEyebrow: { en: value.sectionEyebrowEn, ar: value.sectionEyebrowAr }, sectionTitle: { en: value.sectionTitleEn, ar: value.sectionTitleAr },
  sectionBody: { en: value.sectionBodyEn, ar: value.sectionBodyAr }, address: { en: value.addressEn, ar: value.addressAr },
  phoneDisplay: value.phoneDisplay, phoneInternational: value.phoneInternational, whatsappNumber: value.whatsappNumber,
  email: value.email, mapsUrl: value.mapsUrl, contactImage: value.contactImageUrl,
})

export const serializeSettings = (value: {
  storeNameEn: string; storeNameAr: string; footerTitleEn: string; footerTitleAr: string;
  footerDescriptionEn: string; footerDescriptionAr: string; logoUrl: string; faviconUrl: string;
  seoTitleEn: string; seoTitleAr: string; metaDescriptionEn: string; metaDescriptionAr: string
}) => ({
  storeName: { en: value.storeNameEn, ar: value.storeNameAr }, footerTitle: { en: value.footerTitleEn, ar: value.footerTitleAr },
  footerDescription: { en: value.footerDescriptionEn, ar: value.footerDescriptionAr }, logo: value.logoUrl, favicon: value.faviconUrl,
  seoTitle: { en: value.seoTitleEn, ar: value.seoTitleAr }, metaDescription: { en: value.metaDescriptionEn, ar: value.metaDescriptionAr },
})
