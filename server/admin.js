import { Router } from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import { sql } from './db.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

const router = Router()

// ─── Helper : vérifier le token admin ───────────────────────────────
const expectedToken = process.env.ADMIN_PASSWORD
  ? crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest('hex')
  : null

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !expectedToken || token !== expectedToken) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  next()
}

// ─── Fallback mémoire quand pas de base de données ───────────────────
let memoryStore = {
  orders: [],
  orderItems: {},
  customers: [],
  nextId: 1,
}

// ─── Login ──────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD non configuré sur le serveur' })
  }

  if (!password || password !== expected) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  const token = crypto.createHash('sha256').update(password).digest('hex')
  res.json({ token, message: 'Connexion réussie' })
})

// ─── Commande via SQL ou mémoire ────────────────────────────────────
async function query(sqlQuery, params = []) {
  // Si DATABASE_URL est présent, utiliser Neon
  if (process.env.DATABASE_URL) {
    const result = await sqlQuery
    return result
  }
  // Fallback mémoire
  return null
}

function generateReference() {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `VT-${Date.now().toString().slice(-6)}-${rand}`
}

// ─── Commandes ──────────────────────────────────────────────────────
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const { status } = req.query
      const rows = status
        ? await sql`select o.*, c.nom, c.telephone, c.quartier
                     from orders o join customers c on o.customer_id = c.id
                     where o.status = ${status}
                     order by o.created_at desc`
        : await sql`select o.*, c.nom, c.telephone, c.quartier
                     from orders o join customers c on o.customer_id = c.id
                     order by o.created_at desc`
      return res.json(rows)
    }
    // Fallback mémoire
    let orders = [...memoryStore.orders]
    if (req.query.status) {
      orders = orders.filter((o) => o.status === req.query.status)
    }
    res.json(orders.map((o) => ({
      ...o,
      nom: memoryStore.customers.find((c) => c.id === o.customer_id)?.nom || '—',
      telephone: memoryStore.customers.find((c) => c.id === o.customer_id)?.telephone || '—',
      quartier: memoryStore.customers.find((c) => c.id === o.customer_id)?.quartier || '',
    })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement commandes' })
  }
})

router.get('/orders/:id/items', requireAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`select * from order_items where order_id = ${req.params.id}`
      return res.json(rows)
    }
    res.json(memoryStore.orderItems[req.params.id] || [])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement articles' })
  }
})

router.put('/orders/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body
  const valid = ['en_attente', 'confirmee', 'livree', 'annulee']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' })
  }
  try {
    if (process.env.DATABASE_URL) {
      await sql`update orders set status = ${status} where id = ${req.params.id}`
    } else {
      const idx = memoryStore.orders.findIndex((o) => o.id === Number(req.params.id))
      if (idx !== -1) memoryStore.orders[idx].status = status
    }
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur mise à jour statut' })
  }
})

// ─── Produits (CRUD) ────────────────────────────────────────────────
router.get('/products', requireAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`select * from products order by featured desc, name asc`
      return res.json(rows)
    }
    const { PRODUCTS } = await import('../src/data/products.js')
    res.json(PRODUCTS)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement produits' })
  }
})

router.post('/products', requireAdmin, async (req, res) => {
  const { id, slug, category, name, tagline, price, stock, featured, description, images, specs } = req.body
  if (!id || !slug || !name || !price) {
    return res.status(400).json({ error: 'Champs requis manquants (id, slug, name, price)' })
  }
  try {
    if (process.env.DATABASE_URL) {
      await sql`
        insert into products (id, slug, category, name, tagline, price, currency, stock, featured, description, images, specs)
        values (${id}, ${slug}, ${category || null}, ${name}, ${tagline || null}, ${price}, 'FCFA', ${stock || 0}, ${!!featured}, ${description || null}, ${images || []}, ${specs ? JSON.stringify(specs) : '{}'})
        on conflict (id) do update set
          slug = excluded.slug, category = excluded.category, name = excluded.name,
          tagline = excluded.tagline, price = excluded.price, stock = excluded.stock,
          featured = excluded.featured, description = excluded.description,
          images = excluded.images, specs = excluded.specs
      `
    }
    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur sauvegarde produit' })
  }
})

router.delete('/products/:id', requireAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      await sql`delete from products where id = ${req.params.id}`
    }
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur suppression produit' })
  }
})

// ─── Pièces détachées (CRUD) ────────────────────────────────────────
router.get('/parts', requireAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`select * from parts order by name asc`
      return res.json(rows)
    }
    const { PARTS } = await import('../src/data/products.js')
    res.json(PARTS)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement pièces' })
  }
})

router.post('/parts', requireAdmin, async (req, res) => {
  const { id, slug, name, compatibleModels, category, price, stock, image } = req.body
  if (!id || !slug || !name || !price) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }
  try {
    if (process.env.DATABASE_URL) {
      await sql`
        insert into parts (id, slug, name, compatible_models, category, price, currency, stock, image)
        values (${id}, ${slug}, ${name}, ${compatibleModels || []}, ${category || null}, ${price}, 'FCFA', ${stock || 0}, ${image || null})
        on conflict (id) do update set
          slug = excluded.slug, name = excluded.name,
          compatible_models = excluded.compatible_models, category = excluded.category,
          price = excluded.price, stock = excluded.stock, image = excluded.image
      `
    }
    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur sauvegarde pièce' })
  }
})

router.delete('/parts/:id', requireAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      await sql`delete from parts where id = ${req.params.id}`
    }
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur suppression pièce' })
  }
})

// ─── Clients ────────────────────────────────────────────────────────
router.get('/customers', requireAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        select c.*, count(o.id) as total_orders
        from customers c
        left join orders o on o.customer_id = c.id
        group by c.id
        order by c.created_at desc
      `
      return res.json(rows)
    }
    res.json(memoryStore.customers.map((c) => ({ ...c, total_orders: 0 })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement clients' })
  }
})

// ─── Stats ──────────────────────────────────────────────────────────
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    let orders, products, parts, customers, revenue

    if (process.env.DATABASE_URL) {
      const [orderStats] = await sql`
        select count(*)::int as total, count(*) filter (where status = 'en_attente')::int as pending from orders
      `
      const [productCount] = await sql`select count(*)::int as total from products`
      const [partsCount] = await sql`select count(*)::int as total from parts`
      const [customerCount] = await sql`select count(*)::int as total from customers`
      const [rev] = await sql`
        select coalesce(sum(total), 0)::int as total from orders where status in ('confirmee', 'livree')
      `
      orders = orderStats
      products = productCount
      parts = partsCount
      customers = customerCount
      revenue = rev.total
    } else {
      const { PRODUCTS, PARTS } = await import('../src/data/products.js')
      orders = { total: memoryStore.orders.length, pending: memoryStore.orders.filter((o) => o.status === 'en_attente').length }
      products = { total: PRODUCTS.length }
      parts = { total: PARTS.length }
      customers = { total: memoryStore.customers.length }
      revenue = memoryStore.orders
        .filter((o) => ['confirmee', 'livree'].includes(o.status))
        .reduce((s, o) => s + (o.total || 0), 0)
    }

    res.json({ orders, products, parts, raffleEntries: 0, customers, revenue })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement statistiques' })
  }
})

// ─── Upload d'image (fallback URL directe si pas de Cloudinary) ────
router.post('/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' })
  }
  try {
    // Tentative Cloudinary si configuré
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const { v2: cloudinary } = await import('cloudinary')
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      const b64 = req.file.buffer.toString('base64')
      const dataUri = `data:${req.file.mimetype};base64,${b64}`
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'vitraco-bangui',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      })
      return res.json({ url: result.secure_url })
    }

    // Fallback : retourner une URL placeholder
    res.json({ url: `https://picsum.photos/seed/${Date.now()}/400/400`, note: 'Cloudinary non configuré — image placeholder utilisée' })
  } catch (err) {
    console.error('[upload] Erreur:', err)
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" })
  }
})

export default router
