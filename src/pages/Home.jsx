import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Gauge, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PRODUCTS, PARTS, formatFCFA } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import PartCard from '../components/PartCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import WhyUs from '../components/WhyUs.jsx'
import TricycleSpotlight from '../components/TricycleSpotlight.jsx'
import TestimonialSlider from '../components/TestimonialSlider.jsx'
import NewsletterCTA from '../components/NewsletterCTA.jsx'

const featured = PRODUCTS.filter((p) => p.featured)
const newArrivals = PRODUCTS.filter((p) => p.isNew)
const featuredParts = PARTS.filter((p) => p.featured)

export default function Home() {
  const { t } = useTranslation()

  const HERO_SLIDES = [
    {
      image: '/images/727045805_122140251459130915_2699256639646837259_n.jpg',
      title: t('home.heroTitle1'),
      titleAccent: t('home.heroAccent1'),
      subtitle: t('hero.subtitle'),
      description: t('hero.promoDesc'),
      cta: { text: t('hero.promoCta'), to: '/boutique/sy-125-box' },
    },
    {
      image: '/images/587109544_122101358055130915_3739994168999014838_n.jpg',
      title: t('hero.gammeTitle'),
      titleAccent: t('hero.gammeAccent'),
      subtitle: t('hero.gammeSubtitle'),
      description: t('hero.gammeDesc'),
      cta: { text: t('hero.gammeCta'), to: '/boutique' },
    },
    {
      image: '/images/725436257_122139971583130915_3394384699987127088_n.jpg',
      title: t('hero.piecesTitle'),
      titleAccent: t('hero.piecesAccent'),
      subtitle: t('hero.piecesSubtitle'),
      description: t('hero.piecesDesc'),
      cta: { text: t('hero.piecesCta'), to: '/quincaillerie' },
    },
  ]

  const [newSlide, setNewSlide] = useState(0)
  const newTimerRef = useRef(null)
  const newLen = newArrivals.length

  // Auto-play new arrivals
  useEffect(() => {
    if (newLen <= 1) return
    newTimerRef.current = setInterval(() => {
      setNewSlide((c) => (c + 1) % newLen)
    }, 4000)
    return () => clearInterval(newTimerRef.current)
  }, [newLen])

  return (
    <div>
      {/* HERO — Carrousel de la gamme vedette */}
      <HeroSlider slides={HERO_SLIDES} interval={5000} fullHeight />


      {/* NOUVEAUTÉS — Derniers arrivages */}
      {newLen > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-12 lg:px-8">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vt-red/10">
                <Sparkles size={20} className="text-vt-red" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">
                  {t('home.newArrivals')}
                </p>
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {t('home.newArrivalsTitle')}
                </h2>
              </div>
            </div>
            <Link
              to="/boutique"
              className="hidden items-center gap-1.5 text-sm font-medium text-vt-red hover:underline sm:flex"
            >
              {t('home.seeAll')} <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative mt-8">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${newSlide * 100}%)` }}
              >
                {newArrivals.map((product) => (
                  <div key={product.id} className="flex w-full shrink-0 gap-6">
                    <Link
                      to={`/boutique/${product.slug}`}
                      className="group relative flex w-full items-center overflow-hidden rounded-xl bg-gradient-to-br from-vt-red-tint to-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
                    >
                      {/* Badge Nouveau */}
                      {product.isNew && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-vt-red px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                          {t('home.new')}
                        </span>
                      )}

                      {/* Image */}
                      <div className="relative z-10 w-32 shrink-0 sm:w-40">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      </div>

                      {/* Infos */}
                      <div className="relative z-10 ml-4 flex-1 sm:ml-6">
                        <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-steel">{product.tagline}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="font-display text-lg font-bold text-vt-red">
                            {formatFCFA(product.price)}
                          </span>
                          {product.specs?.vitesseMax && (
                            <span className="flex items-center gap-1 text-xs text-steel">
                              <Gauge size={13} />
                              {product.specs.vitesseMax} km/h
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-steel">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            {product.stock} {t('home.inStock')}
                          </span>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-vt-red opacity-0 transition-opacity group-hover:opacity-100">
                          {t('home.discover')} <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {newLen > 1 && (
              <div className="mt-5 flex items-center justify-center gap-1.5">
                {newArrivals.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`${t('home.goToProduct')} ${i + 1}`}
                    onClick={() => setNewSlide(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === newSlide
                        ? 'h-2 w-6 bg-vt-red'
                        : 'h-2 w-2 bg-ink/20 hover:bg-ink/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* GAMME EN VEDETTE */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">{t('home.featuredTitle')}</h2>
          <Link to="/boutique" className="hidden items-center gap-1.5 font-medium text-vt-red hover:underline sm:flex">
            {t('home.seeAll')} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* WHY US */}
      <WhyUs />

      {/* TRICYCLE SPOTLIGHT */}
      <TricycleSpotlight />

      {/* QUINCAILLERIE EN VEDETTE */}
      {featuredParts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">
                {t('home.hardwareLabel')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                {t('home.hardwareTitle')}
                <br />
                <span className="text-vt-red">{t('home.hardwareAccent')}</span>
              </h2>
            </div>
            <Link
              to="/quincaillerie"
              className="hidden items-center gap-1.5 font-medium text-vt-red hover:underline sm:flex"
            >
              {t('home.seeAll')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredParts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIAUX CLIENTS — CARROUSEL */}
      <TestimonialSlider />

      {/* NEWSLETTER CTA */}
      <NewsletterCTA />
    </div>
  )
}
