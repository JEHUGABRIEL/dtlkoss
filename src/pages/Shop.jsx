import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES, PRODUCTS } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import { placeholderImg } from '../lib/placeholders.js'

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))

export default function Shop() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const subcategory = searchParams.get('cat')
  const activeCategory = subcategory || 'all'

  const SHOP_SLIDES = [
    {
      image: PRODUCTS.find((p) => p.category === 'motos')?.images[0] || placeholderImg('motos'),
      title: t('shop.heroMotosTitle'),
      titleAccent: t('shop.heroMotosAccent'),
      subtitle: t('shop.heroMotosSubtitle'),
      description: t('shop.heroMotosDesc'),
      cta: { text: t('shop.heroMotosCta'), to: '/boutique' },
    },
    {
      image: PRODUCTS.find((p) => p.category === 'tricycles')?.images[0] || placeholderImg('tricycles'),
      title: t('shop.heroTricyclesTitle'),
      titleAccent: t('shop.heroTricyclesAccent'),
      subtitle: t('shop.heroTricyclesSubtitle'),
      description: t('shop.heroTricyclesDesc'),
      cta: { text: t('shop.heroTricyclesCta'), to: '/boutique' },
    },
  ]

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS
    return PRODUCTS.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))

  return (
    <div>
      <HeroSlider slides={SHOP_SLIDES} interval={5000} />

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">
            {subcategory ? (CATEGORY_LABELS[subcategory] || t('shop.products')) : t('shop.products')}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
            {subcategory
              ? (CATEGORY_LABELS[subcategory] || t('shop.products'))
              : t('shop.titleAll')
            }
          </h1>
          <p className="mt-3 text-steel">
            {subcategory
              ? t('shop.descCategory', { category: CATEGORY_LABELS[subcategory]?.toLowerCase() || t('shop.products').toLowerCase() })
              : t('shop.descAll')
            }
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/boutique"
            className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
              activeCategory === 'all' ? 'bg-vt-red text-white' : 'bg-line text-ink hover:bg-steel-light/40'
            }`}
          >
            {t('shop.allCategories')}
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/boutique?cat=${cat.id}`}
              className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
                activeCategory === cat.id ? 'bg-vt-red text-white' : 'bg-line text-ink hover:bg-steel-light/40'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-steel">{t('shop.empty')}</p>
        )}
      </div>
    </div>
  )
}
