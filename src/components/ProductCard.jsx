import { Link } from 'react-router-dom'
import { Gauge, ShoppingCart } from 'lucide-react'
import { formatFCFA } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper-raised transition-shadow hover:shadow-lg hover:shadow-ink/5">
      <Link to={`/boutique/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-vt-graphite-tint">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <Link to={`/boutique/${product.slug}`}>
            <h3 className="font-display text-xl font-semibold leading-tight text-ink group-hover:text-vt-red">
              {product.name}
            </h3>
          </Link>
          <p className="mt-0.5 text-sm text-steel">{product.tagline}</p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-steel">
          <Gauge size={14} />
          {product.specs.vitesseMax ? `${product.specs.vitesseMax} km/h · ` : ''}{product.specs.cylindree}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-ink">
            {product.priceBarre && (
              <span className="mr-1.5 text-sm font-medium text-steel line-through">
                {formatFCFA(product.priceBarre)}
              </span>
            )}
            {formatFCFA(product.price)}
          </span>
          <button
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              currency: product.currency,
              image: product.images[0],
              kind: 'product',
            })}
            className="flex items-center gap-1.5 rounded-full bg-vt-red px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-vt-red-dark"
          >
            <ShoppingCart size={15} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
