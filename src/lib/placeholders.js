/**
 * Générateur d'URL d'images — génère des placeholders visuels via
 * picsum.photos, en attendant les vraies photos produit du client.
 */

const SEEDS = {
  // Motos Sanya
  'sy-125-box': 'motorcycle-commuter-red',
  'sanya-110-42b': 'motorcycle-prestige-black',
  'sanya-150-9f': 'motorcycle-touring',
  'sy200-9f': 'motorcycle-sport-naked',
  'sy110-22': 'scooter-delivery',
  'tricycle-cargo-sanya': 'cargo-three-wheeler',
  motos: 'motorcycle-commuter-red',
  tricycles: 'cargo-three-wheeler',

  // Pièces d'origine
  'kit-chaine-sy125': 'motorcycle-chain-kit',
  'plaquettes-frein-sanya150': 'motorcycle-brake-pads',
  'amortisseur-sanya110': 'motorcycle-shock-absorber',
  'essieu-tricycle-sanya': 'three-wheeler-axle',
  'batterie-universelle-sanya': 'motorcycle-battery',
  'pneu-tricycle-sanya': 'motorcycle-tire',
  'filtre-air-sanya': 'motorcycle-air-filter',
  'bougie-sanya': 'motorcycle-spark-plug',

  marque: 'vitraco-brand-red',
  qualite: 'motorcycle-quality-workshop',
  livraison: 'motorcycle-delivery-service',
  'person-1': 'client-avatar-1',
  'person-2': 'client-avatar-2',
  'person-3': 'client-avatar-3',
  'person-4': 'client-avatar-4',
  'person-5': 'client-avatar-5',
  'person-6': 'client-avatar-6',
}

/**
 * Retourne une URL d'image placeholder via picsum.photos, à remplacer
 * par les vraies photos produit (voir public/images/ pour le dépôt).
 */
export function placeholderImg(slug, w = 800, h = 600) {
  const seed = SEEDS[slug] || slug.replace(/[^a-z0-9-]/g, '-')
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

/**
 * Version carrée.
 */
export function placeholderSquare(slug, size = 400) {
  return placeholderImg(slug, size, size)
}
