/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { categories as fallbackCategories, products as fallbackProducts } from '../data/catalog'
import { usePreferences } from './PreferencesContext'
import type {
  AboutContent,
  Category,
  ContactSettings,
  HeroContent,
  Highlight,
  Product,
  SocialLink,
  WebsiteSettings,
} from '../types/content'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

interface ApiProduct {
  id: string
  name: Product['name']
  description: Product['description']
  categoryId: string
  brand: string
  image: string
  variants: NonNullable<Product['colors']>
  price: number | null
  currency: string
  quantity: number | null
  featured: boolean
  isNew: boolean
}

interface ContentValue {
  products: Product[]
  categories: Category[]
  hero: HeroContent | null
  about: AboutContent | null
  highlights: Highlight[] | null
  contact: ContactSettings | null
  socialLinks: SocialLink[]
  settings: WebsiteSettings | null
}

const initial: ContentValue = {
  products: fallbackProducts,
  categories: fallbackCategories,
  hero: null,
  about: null,
  highlights: null,
  contact: null,
  socialLinks: [],
  settings: null,
}

const ContentContext = createContext<ContentValue>(initial)

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Content request failed (${response.status})`)
  const payload = await response.json() as { data?: T } | T
  return typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data as T : payload as T
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const { language } = usePreferences()
  const [content, setContent] = useState<ContentValue>(initial)

  useEffect(() => {
    if (!API_BASE_URL) return
    let active = true
    const resources = [
      get<ApiProduct[]>('/products?limit=100'),
      get<Category[]>('/categories'),
      get<HeroContent>('/content/hero'),
      get<AboutContent>('/content/about'),
      get<Highlight[]>('/statistics'),
      get<ContactSettings>('/contact'),
      get<SocialLink[]>('/social-links'),
      get<WebsiteSettings>('/settings/public'),
    ] as const

    void Promise.allSettled(resources).then((results) => {
      if (!active) return
      setContent((current) => ({
        products: results[0].status === 'fulfilled' ? results[0].value.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.categoryId,
          brand: product.brand,
          image: product.image,
          colors: product.variants,
          price: product.price,
          currency: product.currency,
          quantity: product.quantity,
          featured: product.featured,
          isNew: product.isNew,
        })) : current.products,
        categories: results[1].status === 'fulfilled' ? results[1].value : current.categories,
        hero: results[2].status === 'fulfilled' ? results[2].value : current.hero,
        about: results[3].status === 'fulfilled' ? results[3].value : current.about,
        highlights: results[4].status === 'fulfilled' ? results[4].value : current.highlights,
        contact: results[5].status === 'fulfilled' ? results[5].value : current.contact,
        socialLinks: results[6].status === 'fulfilled' ? results[6].value : current.socialLinks,
        settings: results[7].status === 'fulfilled' ? results[7].value : current.settings,
      }))
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!content.settings) return
    document.title = content.settings.seoTitle[language]
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.append(description)
    }
    description.content = content.settings.metaDescription[language]
    if (content.settings.favicon) {
      let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (!favicon) {
        favicon = document.createElement('link')
        favicon.rel = 'icon'
        document.head.append(favicon)
      }
      favicon.href = content.settings.favicon
    }
  }, [content.settings, language])

  const value = useMemo(() => content, [content])
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)
