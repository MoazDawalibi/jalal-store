import type { AboutContent, Category, ContactSettings, HeroContent, Highlight, Product, SocialLink, WebsiteSettings } from '../types/content'

const now = '2026-08-10T09:00:00.000Z'

const placeholder = (label: string, first: string, second: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${first}"/><stop offset="1" stop-color="${second}"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><circle cx="620" cy="160" r="190" fill="white" opacity=".16"/><circle cx="130" cy="720" r="260" fill="white" opacity=".1"/><text x="50%" y="52%" text-anchor="middle" fill="white" font-family="Arial" font-size="54" font-weight="700">${label}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const mockCategories: Category[] = [
  { id: 'fragrance', name: { en: 'Fragrance', ar: 'العطور' }, description: { en: 'Scents that linger beautifully.', ar: 'روائح جميلة تبقى في الذاكرة.' }, image: placeholder('FRAGRANCE', '#9c4f58', '#d99589'), active: true, displayOrder: 1, createdAt: now, updatedAt: now },
  { id: 'makeup', name: { en: 'Makeup', ar: 'المكياج' }, description: { en: 'Colour and texture made expressive.', ar: 'ألوان وقوام للتعبير عن أسلوبكِ.' }, image: placeholder('MAKEUP', '#b26b75', '#efb7a9'), active: true, displayOrder: 2, createdAt: now, updatedAt: now },
  { id: 'skincare', name: { en: 'Skincare', ar: 'العناية بالبشرة' }, description: { en: 'Daily care for a fresh glow.', ar: 'عناية يومية لبشرة نضرة ومتألقة.' }, image: placeholder('SKINCARE', '#74988a', '#b8ccba'), active: true, displayOrder: 3, createdAt: now, updatedAt: now },
  { id: 'tools', name: { en: 'Beauty tools', ar: 'أدوات الجمال' }, description: { en: 'The finishing touches to every ritual.', ar: 'اللمسات الأخيرة لكل روتين جمال.' }, image: placeholder('TOOLS', '#706880', '#aaa1ba'), active: true, displayOrder: 4, createdAt: now, updatedAt: now },
]

export const mockProducts: Product[] = [
  {
    id: 'any-klaen-body-mist-collection', name: { en: 'Cherry Crush Body Mist', ar: 'بودي ميست تشيري كراش' }, description: { en: 'A vivid, fruity cherry body mist.', ar: 'بودي ميست برائحة الكرز الفاكهية.' }, categoryId: 'fragrance', brand: 'Any Klaen', image: placeholder('CHERRY MIST', '#811d2d', '#d7606d'),
    variants: [
      { id: 'cherry', value: '#a5222d', image: placeholder('CHERRY', '#811d2d', '#d7606d'), name: { en: 'Cherry Crush', ar: 'تشيري كراش' }, description: { en: 'Bright cherry body mist.', ar: 'رذاذ جسم برائحة الكرز.' } },
      { id: 'peach', value: '#dc8a6b', image: placeholder('PEACH', '#c66f58', '#efb296'), name: { en: 'Peach Cloud', ar: 'بيتش كلاود' }, description: { en: 'Soft peach with a warm finish.', ar: 'خوخ ناعم بلمسة دافئة.' } },
    ], price: null, currency: 'SYP', quantity: null, featured: true, isNew: true, active: true, displayOrder: 1, createdAt: now, updatedAt: now,
  },
  { id: 'any-klaen-highlighter', name: { en: 'Soft Glow Highlighter', ar: 'هايلايتر سوفت جلو' }, description: { en: 'A luminous finish for a soft glow.', ar: 'لمسة مضيئة لإشراقة ناعمة.' }, categoryId: 'makeup', brand: 'Any Klaen', image: placeholder('HIGHLIGHTER', '#dfa99b', '#f4d4c9'), variants: [{ id: 'rose', value: '#efb29f', image: '' }], price: null, currency: 'SYP', quantity: null, featured: true, isNew: true, active: true, displayOrder: 2, createdAt: now, updatedAt: now },
  { id: 'beauty-of-joseon-relief-sun', name: { en: 'Relief Sun SPF50+', ar: 'واقي شمس ريليف صن SPF50+' }, description: { en: 'Rice and probiotics sunscreen with a light finish.', ar: 'واقي شمس بالأرز والبروبيوتيك بقوام خفيف.' }, categoryId: 'skincare', brand: 'Beauty of Joseon', image: placeholder('RELIEF SUN', '#7eaa8d', '#d9e2c9'), variants: [], price: 185000, currency: 'SYP', quantity: 8, featured: true, isNew: false, active: true, displayOrder: 3, createdAt: now, updatedAt: now },
  { id: 'any-klaen-brush-set', name: { en: 'Essential Brush Set', ar: 'مجموعة فراشي أساسية' }, description: { en: 'A versatile brush edit for face and eyes.', ar: 'مجموعة فراشي متنوعة للوجه والعيون.' }, categoryId: 'tools', brand: 'Any Klaen', image: placeholder('BRUSH SET', '#665c78', '#c8a8d0'), variants: [], price: null, currency: 'SYP', quantity: 0, featured: false, isNew: true, active: false, displayOrder: 4, createdAt: now, updatedAt: now },
]

export const mockHero: HeroContent = {
  eyebrow: { en: 'Beauty, selected with intention', ar: 'جمال مختار بعناية' },
  titleStart: { en: 'Your everyday', ar: 'طقوس جمالِك' }, titleAccent: { en: 'beauty ritual,', ar: 'اليومية،' }, titleEnd: { en: 'beautifully curated.', ar: 'بلمسة استثنائية.' },
  body: { en: 'Discover expressive makeup, memorable fragrances, and skincare favourites—all selected for the way you live and glow.', ar: 'اكتشفي مكياجاً يعبّر عنكِ، وعطوراً لا تُنسى، ومنتجات عناية مفضلة—مختارة لترافق تألقك كل يوم.' },
  primaryCta: { en: 'Explore the edit', ar: 'اكتشفي اختياراتنا' }, secondaryCta: { en: 'Visit our store', ar: 'زوري متجرنا' }, note: { en: 'Curated beauty in Damascus', ar: 'وجهتكِ للجمال في دمشق' },
  cardLabel: { en: 'New in the edit', ar: 'وصل حديثاً' }, cardTitle: { en: 'Colour. Scent. Care.', ar: 'لون. عطر. عناية.' }, mainImage: placeholder('JALAL EDIT', '#822b3b', '#d98e85'), detailImage: placeholder('NEW', '#b47778', '#edc2b3'), visible: true,
}

export const mockAbout: AboutContent = {
  eyebrow: { en: 'The Jalal edit', ar: 'اختيارات جلال' }, title: { en: 'Beauty feels better when it feels like you.', ar: 'الجمال أجمل حين يشبهكِ.' }, body: { en: 'Jalal Shops brings makeup, fragrance, skincare, and beauty essentials together in one considered destination.', ar: 'يجمع جلال شوبس المكياج والعطور والعناية بالبشرة وأساسيات الجمال في وجهة واحدة منتقاة بعناية.' }, quote: { en: 'A warm, personal beauty experience—made for discovery.', ar: 'تجربة جمال دافئة وشخصية، صُممت للاكتشاف.' }, mainImage: placeholder('OUR STORY', '#c58a87', '#e9c1b6'), secondaryImage: placeholder('CARE', '#829d8a', '#d0d9c2'), visible: true,
}

export const mockHighlights: Highlight[] = [
  { id: 'variety', icon: 'bag', title: { en: 'Considered variety', ar: 'تنوع مدروس' }, body: { en: 'Makeup, scent, skincare, and beauty tools brought together in one place.', ar: 'مكياج وعطور وعناية وأدوات جمال تجتمع في مكان واحد.' }, active: true, displayOrder: 1 },
  { id: 'discoveries', icon: 'sparkles', title: { en: 'Fresh discoveries', ar: 'اكتشافات متجددة' }, body: { en: 'An evolving edit of products, shades, and formats worth knowing.', ar: 'اختيارات تتطور باستمرار من المنتجات والدرجات الجديرة بالتجربة.' }, active: true, displayOrder: 2 },
  { id: 'communication', icon: 'message', title: { en: 'Easy communication', ar: 'تواصل سهل' }, body: { en: 'Ask about a product directly by phone or WhatsApp before you visit.', ar: 'اسألي عن أي منتج مباشرة عبر الهاتف أو واتساب قبل زيارتكِ.' }, active: true, displayOrder: 3 },
]

export const mockContact: ContactSettings = {
  sectionEyebrow: { en: 'Come say hello', ar: 'أهلاً وسهلاً' }, sectionTitle: { en: 'Find your next favourite in store.', ar: 'مفضلتكِ القادمة بانتظاركِ في المتجر.' }, sectionBody: { en: 'Visit Jalal Shops in Al-Shaalan, Damascus, or contact us directly.', ar: 'زوري جلال شوبس في الشعلان بدمشق، أو تواصلي معنا مباشرة.' }, address: { en: 'Al-Shaalan, the street parallel to Al-Hamra, Damascus', ar: 'الشعلان، الشارع الموازي للحمرا، دمشق' }, phoneDisplay: '0932 383 855', phoneInternational: '+963932383855', whatsappNumber: '963932383855', email: 'ammarjalal1974@gmail.com', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Al-Shaalan+Al-Hamra+Damascus', contactImage: placeholder('VISIT JALAL', '#4e3034', '#c08f83'),
}

export const mockSocial: SocialLink[] = [
  { id: 'instagram', url: '', enabled: false }, { id: 'facebook', url: '', enabled: false }, { id: 'tiktok', url: '', enabled: false },
]

export const mockSettings: WebsiteSettings = {
  storeName: { en: 'Jalal Shops', ar: 'جلال شوبس' }, footerDescription: { en: 'A curated destination for makeup, fragrance, skincare, and beauty essentials in Damascus.', ar: 'وجهة منتقاة للمكياج والعطور والعناية بالبشرة وأساسيات الجمال في دمشق.' }, footerTitle: { en: 'Stay close to what makes you glow.', ar: 'ابقَي قريبة من كل ما يزيدكِ تألقاً.' }, logo: '', favicon: '', seoTitle: { en: 'Jalal Shops — Beauty in Damascus', ar: 'جلال شوبس — الجمال في دمشق' }, metaDescription: { en: 'Explore makeup, fragrance, skincare, and beauty tools at Jalal Shops.', ar: 'اكتشفي المكياج والعطور والعناية بالبشرة وأدوات الجمال لدى جلال شوبس.' },
}
