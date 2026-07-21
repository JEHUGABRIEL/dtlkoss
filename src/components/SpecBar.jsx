// Élément signature Vitraco : une jauge segmentée façon banc de puissance /
// couple moteur — évoque la robustesse mécanique plutôt qu'un compteur de vitesse.

const SEGMENTS = 12

export default function SpecBar({ value, max, unit, label }) {
  const ratio = Math.min(1, Math.max(0, value / max))
  const litSegments = Math.round(ratio * SEGMENTS)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel">{label}</span>
        <span className="font-display text-xl font-bold text-ink">
          {value} <span className="font-mono text-xs font-normal text-steel">{unit}</span>
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className="h-3 flex-1 rounded-sm transition-colors duration-500"
            style={{
              backgroundColor: i < litSegments ? 'var(--color-vt-red)' : 'var(--color-line)',
              transitionDelay: `${i * 35}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
