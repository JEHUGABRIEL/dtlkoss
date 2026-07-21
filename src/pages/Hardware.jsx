import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { PARTS, PART_CATEGORIES } from '../data/products.js'
import PartCard from '../components/PartCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import { placeholderImg } from '../lib/placeholders.js'

export default function Hardware() {
  const { t } = useTranslation()

  const HARDWARE_SLIDES = [
    {
      image: PARTS[0]?.image || placeholderImg('plaquettes-frein'),
      title: t('hardware.hero1Title'),
      titleAccent: t('hardware.hero1Accent'),
      subtitle: t('hardware.hero1Subtitle'),
      description: t('hardware.hero1Desc'),
      cta: { text: t('hardware.hero1Cta'), to: '/quincaillerie' },
    },
    {
      image: PARTS[3]?.image || placeholderImg('essieu-tricycle'),
      title: t('hardware.hero2Title'),
      titleAccent: t('hardware.hero2Accent'),
      subtitle: t('hardware.hero2Subtitle'),
      description: t('hardware.hero2Desc'),
      cta: { text: t('hardware.hero2Cta'), to: '/quincaillerie' },
    },
    {
      image: PARTS[4]?.image || placeholderImg('batterie-universelle'),
      title: t('hardware.hero3Title'),
      titleAccent: t('hardware.hero3Accent'),
      subtitle: t('hardware.hero3Subtitle'),
      description: t('hardware.hero3Desc'),
      cta: { text: t('hardware.hero3Cta'), to: '/quincaillerie' },
    },
  ]

  const [searchParams, setSearchParams] = useSearchParams()
  const urlCategory = searchParams.get('cat') || 'all'
  const [category, setCategory] = useState(urlCategory)
  const [query, setQuery] = useState('')

  // Sync category state with URL param
  useEffect(() => {
    if (category !== urlCategory) {
      setCategory(urlCategory)
    }
  }, [urlCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryChange = (catId) => {
    setCategory(catId)
    setSearchParams(catId === 'all' ? {} : { cat: catId })
  }

  const filtered = useMemo(() => {
    return PARTS.filter((part) => {
      const matchesCategory = category === 'all' || part.category === category
      const matchesQuery =
        query.trim() === '' ||
        part.name.toLowerCase().includes(query.toLowerCase()) ||
        part.compatibleModels.some((m) => m.toLowerCase().includes(query.toLowerCase()))
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div>
      <HeroSlider slides={HARDWARE_SLIDES} interval={5000} />

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">{t('hardware.label')}</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
            {t('hardware.title')}
          </h1>
          <p className="mt-3 text-steel">
            {t('hardware.desc')}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-line bg-paper-raised px-4 py-2.5">
            <Search size={18} className="text-steel" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('hardware.searchPlaceholder')}
              className="w-full bg-transparent text-sm outline-none placeholder:text-steel"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
              category === 'all' ? 'bg-vt-red text-white' : 'bg-line text-ink hover:bg-steel-light/40'
            }`}
>
            {t('hardware.allParts')}
          </button>
          {PART_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
                category === cat.id ? 'bg-vt-red text-white' : 'bg-line text-ink hover:bg-steel-light/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-steel">{t('hardware.empty')}</p>
        )}
      </div>
    </div>
  )
}
