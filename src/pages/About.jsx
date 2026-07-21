import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Clock, Wrench, ShieldCheck, Truck } from 'lucide-react'
import VitracoMap from '../components/VitracoMap.jsx'

const POINT_KEYS = [
  { icon: ShieldCheck, titleKey: 'about.point1Title', textKey: 'about.point1Text' },
  { icon: Wrench, titleKey: 'about.point2Title', textKey: 'about.point2Text' },
  { icon: Truck, titleKey: 'about.point3Title', textKey: 'about.point3Text' },
]

export default function About() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero section simple */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/boutique/718631763_122138651619130915_3644161706849083478_n.jpg"
            alt=""
            className="h-full w-full object-cover opacity-40"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/60" />
        </div>
        <div className="relative mx-auto max-w-5xl px-5 py-20 lg:px-8 lg:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">{t('about.label')}</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
            {t('about.title')} <span className="text-vt-red">{t('about.accent')}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            {t('about.desc')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
        {/* Points clés */}
        <div className="grid gap-5 sm:grid-cols-3">
          {POINT_KEYS.map(({ icon: Icon, titleKey, textKey }) => (
            <div key={titleKey} className="rounded-xl border border-line bg-paper-raised p-6">
              <Icon size={22} className="text-vt-red" />
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{t(titleKey)}</h3>
              <p className="mt-1 text-sm text-steel">{t(textKey)}</p>
            </div>
          ))}
        </div>

        {/* Contact & showroom avec carte */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-xl border border-line bg-paper-raised p-8">
            <h2 className="font-display text-2xl font-bold text-ink">{t('about.contactTitle')}</h2>
            <ul className="mt-4 space-y-3 text-ink/85">
              <li className="flex items-center gap-2.5">
                <MapPin size={18} className="text-vt-red shrink-0" /> {t('footer.address')}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="text-vt-red shrink-0" /> +236 72 90 20 76
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={18} className="text-vt-red shrink-0" /> {t('footer.hours')}
              </li>
            </ul>
          </div>

          {/* Carte Leaflet */}
          <div className="group relative overflow-hidden rounded-xl border border-line shadow-sm transition-shadow hover:shadow-lg">
            <div className="aspect-[4/3] w-full lg:aspect-auto lg:h-full">
              <VitracoMap />
            </div>
            {/* Lien ouvrir dans Google Maps */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=4.36462,18.57102"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-0 left-0 right-0 z-[1000] flex items-center justify-center gap-2 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-4 pt-10 text-sm font-medium text-white opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <MapPin size={16} className="text-vt-red" />
              {t('about.openMaps')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
