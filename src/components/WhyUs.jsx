import { ShieldCheck, Wrench, Truck, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const REASONS = [
  { icon: ShieldCheck, titleKey: 'whyUs.robustesseTitle', textKey: 'whyUs.robustesseText' },
  { icon: Wallet, titleKey: 'whyUs.grosTitle', textKey: 'whyUs.grosText' },
  { icon: Wrench, titleKey: 'whyUs.piecesTitle', textKey: 'whyUs.piecesText' },
  { icon: Truck, titleKey: 'whyUs.livraisonTitle', textKey: 'whyUs.livraisonText' },
]

export default function WhyUs() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">{t('whyUs.label')}</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          {t('whyUs.title')}
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map(({ icon: Icon, titleKey, textKey }) => (
          <div key={titleKey} className="rounded-xl border border-line bg-paper-raised p-6 transition-shadow hover:shadow-lg hover:shadow-ink/5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-vt-red-tint">
              <Icon size={20} className="text-vt-red" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{t(titleKey)}</h3>
            <p className="mt-1.5 text-sm text-steel">{t(textKey)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
