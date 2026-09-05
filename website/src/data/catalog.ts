import cherryMist from '../../assets/Screenshot_20260808_125327_Instagram.jpg'
import watermelonMist from '../../assets/Screenshot_20260808_125339_Instagram.jpg'
import pomegranateMist from '../../assets/Screenshot_20260808_125348_Instagram.jpg'
import peachMist from '../../assets/Screenshot_20260808_125400_Instagram.jpg'
import lavenderMist from '../../assets/Screenshot_20260808_125445_Instagram.jpg'
import highlighter from '../../assets/Screenshot_20260808_130421_Instagram.jpg'
import primer from '../../assets/Screenshot_20260808_130455_Instagram.jpg'
import mascara from '../../assets/Screenshot_20260808_130651_Instagram.jpg'
import micellar from '../../assets/Screenshot_20260808_130714_Instagram.jpg'
import brushes from '../../assets/Screenshot_20260808_130746_Instagram.jpg'
import makeupPen from '../../assets/Screenshot_20260808_131213_Instagram.jpg'
import lipGloss from '../../assets/Screenshot_20260808_131433_Instagram.jpg'
import sunscreen from '../../assets/dc574413-32dc-498a-984d-ba138dbb52d1_size3840x3840_cropCenter.jpg'
import barrierCream from '../../assets/3828e225-947d-4fd8-a3d9-77668208a938-1000x1000-U78sS2mVtXM6AD9kc0duZYV5kIF406Kfd4GHTeSN.jpg'
import snailCream from '../../assets/LXN7GUeegUsj0VMaurzGz9WyZBDTOzjn1wmtoCVN.png'
import starvilleGel from '../../assets/starville-acne-prone-skin-hydrating-gel-200-gm-1.webp'
import type { Category, Product } from '../types/content'

export const categories: Category[] = [
  {
    id: 'fragrance',
    name: { en: 'Fragrance', ar: 'العطور' },
    description: { en: 'Scents that linger beautifully.', ar: 'روائح جميلة تبقى في الذاكرة.' },
    image: cherryMist,
  },
  {
    id: 'makeup',
    name: { en: 'Makeup', ar: 'المكياج' },
    description: { en: 'Colour and texture made expressive.', ar: 'ألوان وقوام للتعبير عن أسلوبكِ.' },
    image: highlighter,
  },
  {
    id: 'skincare',
    name: { en: 'Skincare', ar: 'العناية بالبشرة' },
    description: { en: 'Daily care for a fresh, cared-for glow.', ar: 'عناية يومية لبشرة نضرة ومتألقة.' },
    image: sunscreen,
  },
  {
    id: 'tools',
    name: { en: 'Beauty tools', ar: 'أدوات الجمال' },
    description: { en: 'The finishing touches to every ritual.', ar: 'اللمسات الأخيرة لكل روتين جمال.' },
    image: brushes,
  },
]

export const products: Product[] = [
  {
    id: 'any-klaen-body-mist-collection',
    name: { en: 'Cherry Crush Body Mist', ar: 'بودي ميست تشيري كراش' },
    category: 'fragrance',
    image: cherryMist,
    brand: 'Any Klaen',
    colors: [
      {
        value: '#a5222d',
        image: cherryMist,
        name: { en: 'Cherry Crush Body Mist', ar: 'بودي ميست تشيري كراش' },
        description: { en: 'A vivid, fruity cherry body mist.', ar: 'بودي ميست برائحة الكرز الفاكهية.' },
      },
      {
        value: '#a43931',
        image: pomegranateMist,
        name: { en: 'Pomegranate Musk Body Mist', ar: 'بودي ميست رمان ومسك' },
        description: { en: 'Juicy pomegranate softened with musk.', ar: 'رائحة الرمان الغنية بلمسة مسك ناعمة.' },
      },
      {
        value: '#df4e50',
        image: watermelonMist,
        name: { en: 'Watermelon Breeze Body Mist', ar: 'بودي ميست ووترميلون بريز' },
        description: { en: 'A bright, refreshing watermelon scent.', ar: 'رائحة بطيخ منعشة ومشرقة.' },
      },
      {
        value: '#dc8a6b',
        image: peachMist,
        name: { en: 'Peach Cloud Body Mist', ar: 'بودي ميست بيتش كلاود' },
        description: { en: 'A soft peach scent with a warm finish.', ar: 'رائحة خوخ ناعمة بلمسة دافئة.' },
      },
      {
        value: '#925377',
        image: lavenderMist,
        name: { en: 'Soft Lavender Body Mist', ar: 'بودي ميست سوفت لافندر' },
        description: { en: 'Calm lavender in an easy everyday mist.', ar: 'لافندر هادئ في رذاذ يومي خفيف.' },
      },
    ],
    price: null,
    quantity: null,
    description: { en: 'A vivid, fruity cherry body mist.', ar: 'بودي ميست برائحة الكرز الفاكهية.' },
    featured: true,
    isNew: true,
  },
  {
    id: 'any-klaen-highlighter',
    name: { en: 'Soft Glow Highlighter', ar: 'هايلايتر سوفت جلو' },
    category: 'makeup',
    image: highlighter,
    brand: 'Any Klaen',
    colors: [
      { value: '#efb29f', image: highlighter },
      { value: '#d78e9c', image: highlighter },
    ],
    price: null,
    quantity: null,
    description: { en: 'A luminous finish for a soft, fresh glow.', ar: 'لمسة مضيئة لإشراقة ناعمة وطبيعية.' },
    featured: true,
    isNew: true,
  },
  {
    id: 'any-klaen-face-primer',
    name: { en: 'Face Primer', ar: 'برايمر للوجه' },
    category: 'makeup',
    image: primer,
    brand: 'Any Klaen',
    colors: [{ value: '#eab4bd', image: primer }],
    price: null,
    quantity: null,
    description: { en: 'A smooth base for your makeup routine.', ar: 'قاعدة ناعمة لروتين مكياجكِ.' },
  },
  {
    id: 'any-klaen-full-volume-mascara',
    name: { en: 'Full Volume Mascara', ar: 'ماسكارا فول فوليوم' },
    category: 'makeup',
    image: mascara,
    brand: 'Any Klaen',
    colors: [{ value: '#171415', image: mascara }],
    price: null,
    quantity: null,
    description: { en: 'Ultra-black mascara for defined volume.', ar: 'ماسكارا شديدة السواد لكثافة محددة.' },
  },
  {
    id: 'sheglam-multi-use-pen',
    name: { en: '4-in-1 Multi-Use Makeup Pen', ar: 'قلم مكياج متعدد الاستخدام 4 في 1' },
    category: 'makeup',
    image: makeupPen,
    brand: 'SHEGLAM',
    colors: [
      { value: '#743c2c', image: makeupPen },
      { value: '#222222', image: makeupPen },
      { value: '#8a2639', image: makeupPen },
      { value: '#eee6e1', image: makeupPen },
    ],
    price: null,
    quantity: null,
    description: { en: 'Four makeup essentials in one compact pen.', ar: 'أربع أساسيات للمكياج في قلم واحد.' },
    featured: true,
  },
  {
    id: 'sheglam-pink-macaron-gloss',
    name: { en: 'Pink Macaron Lip Gloss', ar: 'ملمع شفاه بينك ماكرون' },
    category: 'makeup',
    image: lipGloss,
    brand: 'SHEGLAM',
    colors: [{ value: '#e994a6', image: lipGloss }],
    price: null,
    quantity: null,
    description: { en: 'A glossy pink finish in shade 114.', ar: 'لمعة وردية بدرجة 114.' },
  },
  {
    id: 'beauty-of-joseon-relief-sun',
    name: { en: 'Relief Sun SPF50+', ar: 'واقي شمس ريليف صن SPF50+' },
    category: 'skincare',
    image: sunscreen,
    brand: 'Beauty of Joseon',
    price: null,
    quantity: null,
    description: { en: 'Rice and probiotics sunscreen with a light finish.', ar: 'واقي شمس بالأرز والبروبيوتيك بقوام خفيف.' },
    featured: true,
  },
  {
    id: 'dr-althea-147-barrier-cream',
    name: { en: '147 Barrier Cream', ar: 'كريم ترميم الحاجز 147' },
    category: 'skincare',
    image: barrierCream,
    brand: 'Dr. Althea',
    price: null,
    quantity: null,
    description: { en: 'A rich barrier-supporting cream for daily care.', ar: 'كريم غني لدعم حاجز البشرة والعناية اليومية.' },
  },
  {
    id: 'cosrx-snail-cream',
    name: { en: 'Advanced Snail 92 Cream', ar: 'كريم أدفانسد سنايل 92' },
    category: 'skincare',
    image: snailCream,
    brand: 'COSRX',
    price: null,
    quantity: null,
    description: { en: 'A lightweight all-in-one moisturising cream.', ar: 'كريم ترطيب خفيف ومتعدد الفوائد.' },
  },
  {
    id: 'starville-hydrating-gel',
    name: { en: 'Acne-Prone Skin Hydrating Gel', ar: 'جل ترطيب للبشرة المعرضة للحبوب' },
    category: 'skincare',
    image: starvilleGel,
    brand: 'StarVille',
    price: null,
    quantity: null,
    description: { en: 'Hydrating gel with tea tree oil and ceramides.', ar: 'جل مرطب بزيت شجرة الشاي والسيراميد.' },
  },
  {
    id: 'any-klaen-brush-set',
    name: { en: 'Essential Brush Set', ar: 'مجموعة فراشي أساسية' },
    category: 'tools',
    image: brushes,
    brand: 'Any Klaen',
    colors: [
      { value: '#e8a7b0', image: brushes },
      { value: '#191919', image: brushes },
    ],
    price: null,
    quantity: null,
    description: { en: 'A versatile brush edit for face and eyes.', ar: 'مجموعة فراشي متنوعة للوجه والعيون.' },
    isNew: true,
  },
  {
    id: 'any-klaen-micellar-water',
    name: { en: 'Micellar Cleansing Water', ar: 'ماء ميسيلار منظف' },
    category: 'skincare',
    image: micellar,
    brand: 'Any Klaen',
    colors: [{ value: '#e6aeb9', image: micellar }],
    price: null,
    quantity: null,
    description: { en: 'A gentle everyday makeup-cleansing essential.', ar: 'أساسي لطيف لإزالة المكياج يومياً.' },
  },
]
