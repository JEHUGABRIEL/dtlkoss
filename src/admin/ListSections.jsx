import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { adminFetch, formatDate } from './helpers'

export function CustomersSection() {
  const [customers, setCustomers] = useState([])
  useEffect(() => { adminFetch('/customers').then(setCustomers) }, [])

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <Users size={20} className="text-white/60" />
        <h2 className="font-display text-xl font-bold text-white">Clients</h2>
        <span className="font-mono text-xs text-white/40">{customers.length} client(s)</span>
      </div>
      <div className="mt-4 space-y-1">
        {customers.length === 0 && (
          <p className="py-8 text-center text-sm text-white/40">Aucun client pour le moment</p>
        )}
        {customers.map((c) => (
          <div key={c.id} className="flex items-center gap-4 rounded-lg border border-white/10 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{c.nom}</p>
              <p className="font-mono text-[11px] text-white/40">{c.telephone} · {c.quartier || '-'}</p>
            </div>
            <span className="font-mono text-xs text-white/40">{c.total_orders} commande(s)</span>
            <span className="font-mono text-[10px] text-white/30">{formatDate(c.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
