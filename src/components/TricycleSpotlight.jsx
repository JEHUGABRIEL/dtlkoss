import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PRODUCTS, formatFCFA } from '../data/products.js'

const tricycle = PRODUCTS.find((p) => p.slug === 'tricycle-cargo-sanya')

export default function TricycleSpotlight() {
  const { t } = useTranslation()

  if (!tricycle) return null

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src={tricycle.images[0]}
          alt=""
          className="h-full w-full object-cover opacity-20"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 to-ink/60" />
      </div>

      {/* Motif décoratif */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(216,25,32,0.3) 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/[0.04]">
          <img
            src={tricycle.images[0]}
            alt={tricycle.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">{t('tricycle.label')}</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{tricycle.name}</h2>
          <p className="mt-2 text-white/70">{tricycle.tagline}</p>
          <p className="mt-5 font-display text-2xl font-bold text-vt-red">{formatFCFA(tricycle.price)}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{tricycle.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-6 font-mono text-sm">
            {Object.entries(tricycle.specs)
              .filter(([, val]) => val)
              .map(([key, val]) => (
                <div key={key}>
                  <dt className="text-xs uppercase tracking-wide text-white/50">{key}</dt>
                  <dd className="mt-0.5 font-semibold text-white">{val}</dd>
                </div>
              ))}
          </dl>

          <Link
            to={`/boutique/${tricycle.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-vt-red px-6 py-3 font-display text-base font-semibold transition-all hover:bg-vt-red-dark hover:scale-[1.04] hover:shadow-lg hover:shadow-vt-red/30"
          >
            {t('tricycle.cta')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
