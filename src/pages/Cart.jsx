import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext.jsx'
import { formatFCFA } from '../data/products.js'

export default function Cart() {
  const { t } = useTranslation()
  const { items, removeItem, updateQty, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <h1 className="font-display text-3xl font-bold text-ink">{t('cart.emptyTitle')}</h1>
        <p className="mt-3 text-steel">{t('cart.emptyDesc')}</p>
        <Link
          to="/boutique"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-vt-red px-6 py-3 font-display text-lg font-semibold text-white hover:bg-vt-red-dark"
        >
          {t('cart.goToShop')}
          <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink">{t('cart.title')}</h1>

      <div className="mt-8 divide-y divide-line rounded-xl border border-line bg-paper-raised">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-vt-steel-tint">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-ink">{item.name}</h3>
              <p className="font-mono text-sm text-steel">{formatFCFA(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:bg-line"
                aria-label={t('cart.decreaseQty')}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-mono text-sm">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:bg-line"
                aria-label={t('cart.increaseQty')}
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="w-28 text-right font-display font-semibold text-ink">
              {formatFCFA(item.price * item.qty)}
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="rounded-full p-2 text-steel hover:bg-vt-red-tint hover:text-vt-red"
              aria-label={t('cart.remove')}
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-steel">{t('cart.total')}</span>
          <span className="font-display text-3xl font-bold text-ink">{formatFCFA(totalPrice)}</span>
        </div>
        <Link
          to="/commande"
          className="flex items-center gap-2 rounded-full bg-vt-red px-8 py-3.5 font-display text-lg font-semibold text-white hover:bg-vt-red-dark"
        >
          {t('cart.checkout')}
          <ArrowRight size={18} />
        </Link>
        <p className="font-mono text-xs text-steel">{t('cart.paymentInfo')}</p>
      </div>
    </div>
  )
}
