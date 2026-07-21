import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ArrowUp,
  ChevronRight,
  ShieldCheck,
  Truck,
  Store,
  Wrench,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const NAV_LINKS = [
  { to: '/boutique', labelKey: 'footer.navShop' },
  { to: '/quincaillerie', labelKey: 'footer.navHardware' },
  { to: '/a-propos', labelKey: 'footer.navAbout' },
]

const SOCIAL_LINKS = [
  { href: 'https://facebook.com/vitracorca', label: 'Facebook', icon: 'facebook' },
  { href: 'https://instagram.com/vitracorca', label: 'Instagram', icon: 'instagram' },
  { href: 'https://wa.me/23675883756', label: 'WhatsApp', icon: 'whatsapp' },
]

const SERVICES_KEYS = [
  { icon: Truck, labelKey: 'footer.serviceDelivery', descKey: 'footer.serviceDeliveryDesc' },
  { icon: Store, labelKey: 'footer.serviceShowroom', descKey: 'footer.serviceShowroomDesc' },
  { icon: ShieldCheck, labelKey: 'footer.serviceWholesale', descKey: 'footer.serviceWholesaleDesc' },
  { icon: Wrench, labelKey: 'footer.serviceSav', descKey: 'footer.serviceSavDesc' },
]

/** Icône SVG minimaliste pour chaque réseau social */
function SocialIcon({ icon, className = '' }) {
  const cls = `w-5 h-5 ${className}`
  switch (icon) {
    case 'facebook':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3.02 3.02 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3.02 3.02 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.5V8.5l6.2 3.5-6.2 3.5z" />
        </svg>
      )
    default:
      return null
  }
}

export default function Footer() {
  const { t } = useTranslation()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      {/* Motif décoratif subtil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.5) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(224,32,31,0.3) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {/* Grille principale */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── COLONNE : Marque ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-display text-3xl tracking-tight">
              VITRACO<span className="text-vt-red">.</span>
            </span>              <p className="mt-3 max-w-xs text-sm leading-relaxed text-steel-light/70">
                {t('footer.description')}
              </p>

            {/* Réseaux sociaux */}
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel-light/50">
                {t('footer.followUs')}
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all hover:border-vt-red hover:bg-vt-red hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-vt-red/25"
                  >
                    <SocialIcon icon={s.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLONNE : Navigation ── */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.15em] text-steel-light/50">
              {t('footer.navTitle')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    <ChevronRight size={12} className="shrink-0 text-vt-red opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLONNE : Contact ── */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.15em] text-steel-light/50">
              {t('footer.contactTitle')}
            </h3>
            <ul className="mt-4 space-y-3.5 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-vt-red" />
                <span>
                  {t('footer.address')}
                  <br />
                  {t('footer.city')}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-vt-red" />
                <a href="tel:+23672902076" className="transition-colors hover:text-white">
                  +236 72 90 20 76
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-vt-red" />
                <a href="mailto:vitracorca@yahoo.com" className="transition-colors hover:text-white">
                  vitracorca@yahoo.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={16} className="shrink-0 text-vt-red" />
                <span>{t('footer.hours')}</span>
              </li>
            </ul>

            {/* WhatsApp direct */}
            <a
              href="https://wa.me/23675883756"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-2 rounded-full bg-green-600/15 px-4 py-2 text-sm font-medium text-green-400 transition-all hover:bg-green-600/25 hover:scale-[1.02] w-fit"
            >
              <SocialIcon icon="whatsapp" className="w-4 h-4" />
              {t('footer.whatsapp')}
            </a>
          </div>

          {/* ── COLONNE : Services ── */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.15em] text-steel-light/50">
              {t('footer.servicesTitle')}
            </h3>
            <ul className="mt-4 space-y-3.5">
              {SERVICES_KEYS.map((svc) => {
                const Icon = svc.icon
                return (
                  <li key={svc.labelKey} className="flex items-start gap-2.5">
                    <Icon size={16} className="mt-0.5 shrink-0 text-vt-red" />
                    <div>
                      <p className="text-sm font-medium text-white">{t(svc.labelKey)}</p>
                      <p className="text-xs text-white/50">{t(svc.descKey)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Séparateur links légaux + back-to-top */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-white/40">
            <span>© {new Date().getFullYear()} Vitraco RCA</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>{t('footer.rights')}</span>
            <span className="hidden sm:inline">&middot;</span>
            <a href="/a-propos" className="transition-colors hover:text-white/70">{t('footer.legal')}</a>
            <span className="hidden sm:inline">&middot;</span>
            <a href="/a-propos" className="transition-colors hover:text-white/70">{t('footer.privacy')}</a>
          </div>
          <button
            onClick={scrollToTop}
            aria-label={t('footer.backToTop')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all hover:border-vt-red hover:bg-vt-red hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-vt-red/25"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}
