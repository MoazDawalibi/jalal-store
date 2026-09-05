import { useEffect, useState, type CSSProperties } from 'react'
import { usePreferences } from '../context/PreferencesContext'
import { useContent } from '../context/ContentContext'
import type { Product } from '../types/content'

interface ProductCardProps {
  product: Product
  editorial?: boolean
  revealDelay?: number
}

export function ProductCard({ product, editorial = false, revealDelay = 0 }: ProductCardProps) {
  const { language, t } = usePreferences()
  const { categories, contact } = useContent()
  const [selectedColourIndex, setSelectedColourIndex] = useState(0)
  const category = categories.find((item) => item.id === product.category)
  const selectedColour = product.colors?.[selectedColourIndex]
  const productName = selectedColour?.name?.[language] ?? product.name[language]
  const productDescription = selectedColour?.description?.[language] ?? product.description[language]
  const productImage = selectedColour?.image ?? product.image
  const message = language === 'ar'
    ? `مرحباً، أريد الاستفسار عن منتج ${selectedColour?.name?.ar ?? product.name.ar}`
    : `Hello, I would like to ask about ${selectedColour?.name?.en ?? product.name.en}`
  const whatsappHref = `https://wa.me/${contact?.whatsappNumber ?? '963932383855'}`
  const askLink = `${whatsappHref}?text=${encodeURIComponent(message)}`
  const price = product.price === null
    ? t.products.askPrice
    : `${product.price.toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')} ${product.currency ?? 'SYP'}`
  const availability = product.quantity === null
    ? t.products.askAvailability
    : `${t.products.available} (${product.quantity})`

  useEffect(() => {
    product.colors?.forEach((colour) => {
      const image = new Image()
      image.src = colour.image
    })
  }, [product.colors])

  const selectColour = (index: number) => {
    const nextColour = product.colors?.[index]
    if (!nextColour || index === selectedColourIndex) return

    const nextImage = new Image()
    nextImage.src = nextColour.image
    const activate = () => setSelectedColourIndex(index)
    if (nextImage.complete) activate()
    else {
      nextImage.onload = activate
      nextImage.onerror = activate
    }
  }

  return (
    <article
      className={`product-card ${editorial ? 'product-card--editorial' : ''}`}
      data-reveal="up"
      style={{ '--reveal-delay': `${revealDelay}ms` } as CSSProperties}
    >
      <a className="product-card__image-wrap" href={askLink} target="_blank" rel="noreferrer" aria-label={t.products.askProduct}>
        <img className="product-card__image" src={productImage} alt={productName} loading="lazy" key={`${product.id}-${selectedColourIndex}`} />
        <div className="product-card__badges">
          {product.isNew && <span>{t.products.new}</span>}
          {product.featured && !editorial && <span>{t.products.featured}</span>}
        </div>
      </a>
      <div className="product-card__content">
        <p className="product-card__meta">{product.brand} · {category?.name[language]}</p>
        <h3>{productName}</h3>
        <p className="product-card__description">{productDescription}</p>
        {!editorial && (
          <>
            {product.colors && product.colors.length > 0 && (
              <div className="product-card__colours" role="group" aria-label={t.products.colors}>
                <small>{t.products.colors}</small>
                <span className="product-card__swatches">
                  {product.colors.map((colour, index) => (
                    <button
                      className={index === selectedColourIndex ? 'active' : ''}
                      type="button"
                      aria-label={colour.name?.[language] ?? `${t.products.colors} ${index + 1}`}
                      aria-pressed={index === selectedColourIndex}
                      key={`${colour.value}-${index}`}
                      onClick={() => selectColour(index)}
                      style={{ backgroundColor: colour.value }}
                      title={colour.name?.[language] ?? colour.value}
                    />
                  ))}
                </span>
              </div>
            )}
            <div className="product-card__details">
              <div><small>{t.products.price}</small><strong>{price}</strong></div>
              <div><small>{t.products.quantity}</small><strong>{availability}</strong></div>
            </div>
            <a className="product-card__action" href={askLink} target="_blank" rel="noreferrer">{t.products.askProduct}</a>
          </>
        )}
      </div>
    </article>
  )
}
