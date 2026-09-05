import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { put } from '@vercel/blob'
import { prisma } from '../src/config/database.js'
import { hashPassword } from '../src/services/auth.service.js'

const assetBase = (process.env.SEED_ASSET_BASE_URL ?? '').trim().replace(/\/$/, '')

const files = {
  cherry: 'Screenshot_20260808_125327_Instagram.jpg', pomegranate: 'Screenshot_20260808_125348_Instagram.jpg',
  watermelon: 'Screenshot_20260808_125339_Instagram.jpg', peach: 'Screenshot_20260808_125400_Instagram.jpg',
  lavender: 'Screenshot_20260808_125445_Instagram.jpg', highlighter: 'Screenshot_20260808_130421_Instagram.jpg',
  primer: 'Screenshot_20260808_130455_Instagram.jpg', mascara: 'Screenshot_20260808_130651_Instagram.jpg',
  micellar: 'Screenshot_20260808_130714_Instagram.jpg', brushes: 'Screenshot_20260808_130746_Instagram.jpg',
  pen: 'Screenshot_20260808_131213_Instagram.jpg', gloss: 'Screenshot_20260808_131433_Instagram.jpg',
  sunscreen: 'dc574413-32dc-498a-984d-ba138dbb52d1_size3840x3840_cropCenter.jpg',
  barrier: '3828e225-947d-4fd8-a3d9-77668208a938-1000x1000-U78sS2mVtXM6AD9kc0duZYV5kIF406Kfd4GHTeSN.jpg',
  snail: 'LXN7GUeegUsj0VMaurzGz9WyZBDTOzjn1wmtoCVN.png',
  starville: 'starville-acne-prone-skin-hydrating-gel-200-gm-1.webp',
  about: '71k-vtnxo4lacsl1500_90.webp', contact: 'contact-boutique-v2.webp',
} as const

const filenames = [...new Set(Object.values(files))]
const imageUrls = new Map<string, string>()
if (assetBase) {
  if (!assetBase.startsWith('https://')) throw new Error('SEED_ASSET_BASE_URL must use HTTPS')
  for (const filename of filenames) imageUrls.set(filename, `${assetBase}/${encodeURIComponent(filename)}`)
} else {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('Set BLOB_READ_WRITE_TOKEN to import local website assets, or provide SEED_ASSET_BASE_URL')
  const assetDirectory = new URL('../../website/assets/', import.meta.url)
  for (const filename of filenames) {
    const body = await readFile(fileURLToPath(new URL(filename, assetDirectory)))
    const blob = await put(`jalal/seed/${filename}`, body, { access: 'public', token, addRandomSuffix: false, allowOverwrite: true })
    imageUrls.set(filename, blob.url)
  }
}
const image = (filename: string) => {
  const url = imageUrls.get(filename)
  if (!url) throw new Error(`Missing seeded image URL for ${filename}`)
  return url
}

const categories = [
  ['fragrance', 'Fragrance', 'العطور', 'Scents that linger beautifully.', 'روائح جميلة تبقى في الذاكرة.', files.cherry],
  ['makeup', 'Makeup', 'المكياج', 'Colour and texture made expressive.', 'ألوان وقوام للتعبير عن أسلوبكِ.', files.highlighter],
  ['skincare', 'Skincare', 'العناية بالبشرة', 'Daily care for a fresh, cared-for glow.', 'عناية يومية لبشرة نضرة ومتألقة.', files.sunscreen],
  ['tools', 'Beauty tools', 'أدوات الجمال', 'The finishing touches to every ritual.', 'اللمسات الأخيرة لكل روتين جمال.', files.brushes],
] as const

for (const [id, nameEn, nameAr, descriptionEn, descriptionAr, filename] of categories) {
  const data = { nameEn, nameAr, descriptionEn, descriptionAr, imageUrl: image(filename), active: true, displayOrder: categories.findIndex((item) => item[0] === id) + 1 }
  await prisma.category.upsert({ where: { id }, create: { id, ...data }, update: data })
}

interface SeedVariant { value: string; file?: string; nameEn?: string; nameAr?: string; descriptionEn?: string; descriptionAr?: string }
interface SeedProduct { id: string; nameEn: string; nameAr: string; categoryId: string; file: string; brand: string; descriptionEn: string; descriptionAr: string; featured?: boolean; isNew?: boolean; variants?: SeedVariant[] }

const products: SeedProduct[] = [
  { id: 'any-klaen-body-mist-collection', nameEn: 'Cherry Crush Body Mist', nameAr: 'بودي ميست تشيري كراش', categoryId: 'fragrance', file: files.cherry, brand: 'Any Klaen', descriptionEn: 'A vivid, fruity cherry body mist.', descriptionAr: 'بودي ميست برائحة الكرز الفاكهية.', featured: true, isNew: true, variants: [
    { value: '#a5222d', file: files.cherry, nameEn: 'Cherry Crush Body Mist', nameAr: 'بودي ميست تشيري كراش', descriptionEn: 'A vivid, fruity cherry body mist.', descriptionAr: 'بودي ميست برائحة الكرز الفاكهية.' },
    { value: '#a43931', file: files.pomegranate, nameEn: 'Pomegranate Musk Body Mist', nameAr: 'بودي ميست رمان ومسك', descriptionEn: 'Juicy pomegranate softened with musk.', descriptionAr: 'رائحة الرمان الغنية بلمسة مسك ناعمة.' },
    { value: '#df4e50', file: files.watermelon, nameEn: 'Watermelon Breeze Body Mist', nameAr: 'بودي ميست ووترميلون بريز', descriptionEn: 'A bright, refreshing watermelon scent.', descriptionAr: 'رائحة بطيخ منعشة ومشرقة.' },
    { value: '#dc8a6b', file: files.peach, nameEn: 'Peach Cloud Body Mist', nameAr: 'بودي ميست بيتش كلاود', descriptionEn: 'A soft peach scent with a warm finish.', descriptionAr: 'رائحة خوخ ناعمة بلمسة دافئة.' },
    { value: '#925377', file: files.lavender, nameEn: 'Soft Lavender Body Mist', nameAr: 'بودي ميست سوفت لافندر', descriptionEn: 'Calm lavender in an easy everyday mist.', descriptionAr: 'لافندر هادئ في رذاذ يومي خفيف.' },
  ] },
  { id: 'any-klaen-highlighter', nameEn: 'Soft Glow Highlighter', nameAr: 'هايلايتر سوفت جلو', categoryId: 'makeup', file: files.highlighter, brand: 'Any Klaen', descriptionEn: 'A luminous finish for a soft, fresh glow.', descriptionAr: 'لمسة مضيئة لإشراقة ناعمة وطبيعية.', featured: true, isNew: true, variants: [{ value: '#efb29f' }, { value: '#d78e9c' }] },
  { id: 'any-klaen-face-primer', nameEn: 'Face Primer', nameAr: 'برايمر للوجه', categoryId: 'makeup', file: files.primer, brand: 'Any Klaen', descriptionEn: 'A smooth base for your makeup routine.', descriptionAr: 'قاعدة ناعمة لروتين مكياجكِ.', variants: [{ value: '#eab4bd' }] },
  { id: 'any-klaen-full-volume-mascara', nameEn: 'Full Volume Mascara', nameAr: 'ماسكارا فول فوليوم', categoryId: 'makeup', file: files.mascara, brand: 'Any Klaen', descriptionEn: 'Ultra-black mascara for defined volume.', descriptionAr: 'ماسكارا شديدة السواد لكثافة محددة.', variants: [{ value: '#171415' }] },
  { id: 'sheglam-multi-use-pen', nameEn: '4-in-1 Multi-Use Makeup Pen', nameAr: 'قلم مكياج متعدد الاستخدام 4 في 1', categoryId: 'makeup', file: files.pen, brand: 'SHEGLAM', descriptionEn: 'Four makeup essentials in one compact pen.', descriptionAr: 'أربع أساسيات للمكياج في قلم واحد.', featured: true, variants: [{ value: '#743c2c' }, { value: '#222222' }, { value: '#8a2639' }, { value: '#eee6e1' }] },
  { id: 'sheglam-pink-macaron-gloss', nameEn: 'Pink Macaron Lip Gloss', nameAr: 'ملمع شفاه بينك ماكرون', categoryId: 'makeup', file: files.gloss, brand: 'SHEGLAM', descriptionEn: 'A glossy pink finish in shade 114.', descriptionAr: 'لمعة وردية بدرجة 114.', variants: [{ value: '#e994a6' }] },
  { id: 'beauty-of-joseon-relief-sun', nameEn: 'Relief Sun SPF50+', nameAr: 'واقي شمس ريليف صن SPF50+', categoryId: 'skincare', file: files.sunscreen, brand: 'Beauty of Joseon', descriptionEn: 'Rice and probiotics sunscreen with a light finish.', descriptionAr: 'واقي شمس بالأرز والبروبيوتيك بقوام خفيف.', featured: true },
  { id: 'dr-althea-147-barrier-cream', nameEn: '147 Barrier Cream', nameAr: 'كريم ترميم الحاجز 147', categoryId: 'skincare', file: files.barrier, brand: 'Dr. Althea', descriptionEn: 'A rich barrier-supporting cream for daily care.', descriptionAr: 'كريم غني لدعم حاجز البشرة والعناية اليومية.' },
  { id: 'cosrx-snail-cream', nameEn: 'Advanced Snail 92 Cream', nameAr: 'كريم أدفانسد سنايل 92', categoryId: 'skincare', file: files.snail, brand: 'COSRX', descriptionEn: 'A lightweight all-in-one moisturising cream.', descriptionAr: 'كريم ترطيب خفيف ومتعدد الفوائد.' },
  { id: 'starville-hydrating-gel', nameEn: 'Acne-Prone Skin Hydrating Gel', nameAr: 'جل ترطيب للبشرة المعرضة للحبوب', categoryId: 'skincare', file: files.starville, brand: 'StarVille', descriptionEn: 'Hydrating gel with tea tree oil and ceramides.', descriptionAr: 'جل مرطب بزيت شجرة الشاي والسيراميد.' },
  { id: 'any-klaen-brush-set', nameEn: 'Essential Brush Set', nameAr: 'مجموعة فراشي أساسية', categoryId: 'tools', file: files.brushes, brand: 'Any Klaen', descriptionEn: 'A versatile brush edit for face and eyes.', descriptionAr: 'مجموعة فراشي متنوعة للوجه والعيون.', isNew: true, variants: [{ value: '#e8a7b0' }, { value: '#191919' }] },
  { id: 'any-klaen-micellar-water', nameEn: 'Micellar Cleansing Water', nameAr: 'ماء ميسيلار منظف', categoryId: 'skincare', file: files.micellar, brand: 'Any Klaen', descriptionEn: 'A gentle everyday makeup-cleansing essential.', descriptionAr: 'أساسي لطيف لإزالة المكياج يومياً.', variants: [{ value: '#e6aeb9' }] },
]

for (const [displayOrder, product] of products.entries()) {
  const data = { nameEn: product.nameEn, nameAr: product.nameAr, descriptionEn: product.descriptionEn, descriptionAr: product.descriptionAr, categoryId: product.categoryId, brand: product.brand, imageUrl: image(product.file), price: null, currency: 'SYP', quantity: null, featured: product.featured ?? false, isNew: product.isNew ?? false, active: true, displayOrder: displayOrder + 1 }
  await prisma.$transaction(async (database) => {
    await database.product.upsert({ where: { id: product.id }, create: { id: product.id, ...data }, update: data })
    await database.productVariant.deleteMany({ where: { productId: product.id } })
    if (product.variants?.length) await database.productVariant.createMany({ data: product.variants.map((variant, index) => ({ productId: product.id, value: variant.value, imageUrl: image(variant.file ?? product.file), nameEn: variant.nameEn ?? null, nameAr: variant.nameAr ?? null, descriptionEn: variant.descriptionEn ?? null, descriptionAr: variant.descriptionAr ?? null, displayOrder: index })) })
  })
}

await prisma.heroContent.upsert({ where: { id: 'default' }, create: { id: 'default', eyebrowEn: 'Beauty, selected with intention', eyebrowAr: 'جمال مختار بعناية', titleStartEn: 'Your everyday', titleStartAr: 'طقوس جمالِك', titleAccentEn: 'beauty ritual,', titleAccentAr: 'اليومية،', titleEndEn: 'beautifully curated.', titleEndAr: 'بلمسة استثنائية.', bodyEn: 'Discover expressive makeup, memorable fragrances, and skincare favourites—all selected for the way you live and glow.', bodyAr: 'اكتشفي مكياجاً يعبّر عنكِ، وعطوراً لا تُنسى، ومنتجات عناية مفضلة—مختارة لترافق تألقك كل يوم.', primaryCtaEn: 'Explore the edit', primaryCtaAr: 'اكتشفي اختياراتنا', secondaryCtaEn: 'Visit our store', secondaryCtaAr: 'زوري متجرنا', noteEn: 'Curated beauty in Damascus', noteAr: 'وجهتكِ للجمال في دمشق', cardLabelEn: 'New in the edit', cardLabelAr: 'وصل حديثاً', cardTitleEn: 'Colour. Scent. Care.', cardTitleAr: 'لون. عطر. عناية.', mainImageUrl: image(files.cherry), detailImageUrl: image(files.highlighter), visible: true }, update: {} })
await prisma.aboutContent.upsert({ where: { id: 'default' }, create: { id: 'default', eyebrowEn: 'The Jalal edit', eyebrowAr: 'اختيارات جلال', titleEn: 'Beauty feels better when it feels like you.', titleAr: 'الجمال أجمل حين يشبهكِ.', bodyEn: 'Jalal Shops brings makeup, fragrance, skincare, and beauty essentials together in one considered destination.', bodyAr: 'يجمع جلال شوبس المكياج والعطور والعناية بالبشرة وأساسيات الجمال في وجهة واحدة منتقاة بعناية.', quoteEn: 'A warm, personal beauty experience—made for discovery.', quoteAr: 'تجربة جمال دافئة وشخصية، صُممت للاكتشاف.', mainImageUrl: image(files.highlighter), secondaryImageUrl: image(files.about), visible: true }, update: {} })
await prisma.contactSettings.upsert({ where: { id: 'default' }, create: { id: 'default', sectionEyebrowEn: 'Come say hello', sectionEyebrowAr: 'أهلاً وسهلاً', sectionTitleEn: 'Find your next favourite in store.', sectionTitleAr: 'مفضلتكِ القادمة بانتظاركِ في المتجر.', sectionBodyEn: 'Visit Jalal Shops in Al-Shaalan, Damascus, or contact us directly.', sectionBodyAr: 'زوري جلال شوبس في الشعلان بدمشق، أو تواصلي معنا مباشرة.', addressEn: 'Al-Shaalan, the street parallel to Al-Hamra, Damascus', addressAr: 'الشعلان، الشارع الموازي للحمرا، دمشق', phoneDisplay: '0932 383 855', phoneInternational: '+963932383855', whatsappNumber: '963932383855', email: 'ammarjalal1974@gmail.com', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Al-Shaalan+Al-Hamra+Damascus', contactImageUrl: image(files.contact) }, update: {} })
await prisma.siteSettings.upsert({ where: { id: 'default' }, create: { id: 'default', storeNameEn: 'Jalal Shops', storeNameAr: 'جلال شوبس', footerTitleEn: 'Stay close to what makes you glow.', footerTitleAr: 'ابقَي قريبة من كل ما يزيدكِ تألقاً.', footerDescriptionEn: 'A curated destination for makeup, fragrance, skincare, and beauty essentials in Damascus.', footerDescriptionAr: 'وجهة منتقاة للمكياج والعطور والعناية بالبشرة وأساسيات الجمال في دمشق.', logoUrl: '', faviconUrl: '', seoTitleEn: 'Jalal Shops — Beauty in Damascus', seoTitleAr: 'جلال شوبس — الجمال في دمشق', metaDescriptionEn: 'Explore makeup, fragrance, skincare, and beauty tools at Jalal Shops.', metaDescriptionAr: 'اكتشفي المكياج والعطور والعناية بالبشرة وأدوات الجمال لدى جلال شوبس.' }, update: {} })

const highlights = [
  ['11111111-1111-4111-8111-111111111111', 'bag', 'Considered variety', 'تنوع مدروس', 'Makeup, scent, skincare, and beauty tools brought together in one place.', 'مكياج وعطور وعناية وأدوات جمال تجتمع في مكان واحد.'],
  ['22222222-2222-4222-8222-222222222222', 'sparkles', 'Fresh discoveries', 'اكتشافات متجددة', 'An evolving edit of products, shades, and formats worth knowing.', 'اختيارات تتطور باستمرار من المنتجات والدرجات الجديرة بالتجربة.'],
  ['33333333-3333-4333-8333-333333333333', 'message', 'Easy communication', 'تواصل سهل', 'Ask about a product directly by phone or WhatsApp before you visit.', 'اسألي عن أي منتج مباشرة عبر الهاتف أو واتساب قبل زيارتكِ.'],
] as const
for (const [displayOrder, value] of highlights.entries()) {
  const [id, icon, titleEn, titleAr, bodyEn, bodyAr] = value
  await prisma.highlight.upsert({ where: { id }, create: { id, icon, titleEn, titleAr, bodyEn, bodyAr, active: true, displayOrder }, update: { icon, titleEn, titleAr, bodyEn, bodyAr, active: true, displayOrder } })
}
for (const [displayOrder, id] of ['instagram', 'facebook', 'tiktok'].entries()) await prisma.socialLink.upsert({ where: { id }, create: { id, url: '', enabled: false, displayOrder }, update: {} })

const adminEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
const adminPassword = process.env.ADMIN_PASSWORD ?? ''
if (adminEmail && adminPassword.length >= 12) {
  const passwordHash = await hashPassword(adminPassword)
  await prisma.admin.upsert({ where: { email: adminEmail }, create: { email: adminEmail, name: process.env.ADMIN_NAME ?? 'Store Admin', passwordHash }, update: { passwordHash, name: process.env.ADMIN_NAME ?? 'Store Admin' } })
}

console.log(`Seeded ${categories.length} categories and ${products.length} products.`)
await prisma.$disconnect()
