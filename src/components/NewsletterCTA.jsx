import { useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NewsletterCTA() {
  const { t } = useTranslation()
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!phone.trim()) return
    setSent(true)
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid gap-8 rounded-2xl bg-vt-red-tint p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-vt-red">{t('newsletter.label')}</p>
          <h3 className="mt-3 font-display text-3xl font-bold text-ink">
            {t('newsletter.title')}
          </h3>
          <p className="mt-3 max-w-xl text-steel">
            {t('newsletter.desc')}
          </p>
        </div>

        {sent ? (
          <p className="flex items-center gap-2 font-display text-lg font-semibold text-vt-red">
            {t('newsletter.thankYou')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-line bg-paper-raised px-4 py-2.5">
              <Phone size={16} className="text-steel" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="w-full bg-transparent text-sm outline-none placeholder:text-steel"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 whitespace-nowrap rounded-full bg-vt-red px-5 py-2.5 font-display text-base font-semibold text-white transition-all hover:bg-vt-red-dark hover:scale-[1.02] hover:shadow-lg hover:shadow-vt-red/30"
            >
              <MessageCircle size={16} />
              {t('newsletter.submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
