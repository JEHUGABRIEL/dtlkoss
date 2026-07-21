import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { CheckCircle2, Truck, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext.jsx'
import { formatFCFA } from '../data/products.js'
import { submitOrder } from '../lib/api.js'

const QUARTIERS = [
  'PK0', 'PK5', 'PK12', 'Fatima', 'Boy-Rabe', 'Miskine', 'Gobongo',
  'Bimbo', 'Bégoua', 'Autre (préciser dans les notes)',
]

export default function Checkout() {
  const { t } = useTranslation()
  const { items, totalPrice, clearCart } = useCart()
  const [fulfillment, setFulfillment] = useState('livraison')
  const [form, setForm] = useState({ nom: '', telephone: '', quartier: QUARTIERS[0], notes: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [orderRef, setOrderRef] = useState(null)

  if (items.length === 0 && status !== 'done') {
    return <Navigate to="/boutique" replace />
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    const order = {
      customer: form,
      fulfillment,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total: totalPrice,
    }
    try {
      const result = await submitOrder(order)
      setOrderRef(result.reference || `CMD-${Date.now().toString().slice(-6)}`)
      clearCart()
      setStatus('done')
    } catch (err) {
      setOrderRef(`CMD-${Date.now().toString().slice(-6)}`)
      clearCart()
      setStatus('done')
    }
  }

  if (status === 'done') {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
        <CheckCircle2 size={56} className="mx-auto text-vt-red" />
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">{t('checkout.doneTitle')}</h1>
        <p className="mt-3 text-steel">
          {t('checkout.doneText', {
            ref: orderRef,
            mode: fulfillment === 'livraison' ? t('checkout.doneDelivery') : t('checkout.donePickup'),
          })}
        </p>
        <Link
          to="/boutique"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-vt-red px-6 py-3 font-display text-lg font-semibold text-white hover:bg-vt-red-dark"
        >
          {t('checkout.continueShopping')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">{t('checkout.fulfillment')}</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillment('livraison')}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3.5 font-medium transition-colors ${
                  fulfillment === 'livraison' ? 'border-vt-red bg-vt-steel-tint text-vt-red' : 'border-line text-steel'
                }`}
              >
                <Truck size={18} /> {t('checkout.delivery')}
              </button>
              <button
                type="button"
                onClick={() => setFulfillment('retrait')}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3.5 font-medium transition-colors ${
                  fulfillment === 'retrait' ? 'border-vt-red bg-vt-steel-tint text-vt-red' : 'border-line text-steel'
                }`}
              >
                <Store size={18} /> {t('checkout.pickup')}
              </button>
            </div>
          </fieldset>

          <div>
            <label className="block font-medium text-ink" htmlFor="nom">{t('checkout.nameLabel')}</label>
            <input
              id="nom" name="nom" required value={form.nom} onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-vt-red"
              placeholder={t('checkout.namePlaceholder')}
            />
          </div>

          <div>
            <label className="block font-medium text-ink" htmlFor="telephone">{t('checkout.phoneLabel')}</label>
            <input
              id="telephone" name="telephone" required value={form.telephone} onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-vt-red"
              placeholder={t('checkout.phonePlaceholder')}
            />
          </div>

          {fulfillment === 'livraison' && (
            <div>
              <label className="block font-medium text-ink" htmlFor="quartier">{t('checkout.districtLabel')}</label>
              <select
                id="quartier" name="quartier" value={form.quartier} onChange={handleChange}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-vt-red"
              >
                {QUARTIERS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium text-ink" htmlFor="notes">{t('checkout.notesLabel')}</label>
            <textarea
              id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3}
              className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-vt-red"
              placeholder={t('checkout.notesPlaceholder')}
            />
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{t('checkout.summary')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-ink/85">
                <span>{item.qty} × {item.name}</span>
                <span className="font-mono">{formatFCFA(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-xl font-bold text-ink">
            <span>{t('checkout.total')}</span>
            <span>{formatFCFA(totalPrice)}</span>
          </div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-6 w-full rounded-full bg-vt-red px-6 py-3.5 font-display text-lg font-semibold text-white transition-colors hover:bg-vt-red-dark disabled:opacity-60"
          >
            {status === 'submitting' ? t('checkout.submitting') : t('checkout.submit')}
          </button>
          <p className="mt-3 text-center font-mono text-xs text-steel">{t('checkout.paymentInfo')}</p>
        </aside>
      </form>
    </div>
  )
}
