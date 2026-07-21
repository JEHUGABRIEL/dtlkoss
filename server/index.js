import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { sql } from './db.js'
import adminRouter from './admin.js'

const app = express()
app.use(cors())
app.use(express.json())

function generateReference() {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `VT-${Date.now().toString().slice(-6)}-${rand}`
}

// Routes admin
app.use('/api/admin', adminRouter)

// --- Produits ---
app.get('/api/products', async (req, res) => {
  try {
    const rows = await sql`select * from products order by featured desc, name asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors du chargement du catalogue' })
  }
})

app.get('/api/products/:slug', async (req, res) => {
  try {
    const rows = await sql`select * from products where slug = ${req.params.slug} limit 1`
    if (rows.length === 0) return res.status(404).json({ error: 'Produit introuvable' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// --- Pièces détachées ---
app.get('/api/parts', async (req, res) => {
  try {
    const rows = await sql`select * from parts order by name asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors du chargement des pièces' })
  }
})

// --- Événements ---
app.get('/api/events', async (req, res) => {
  try {
    const rows = await sql`select * from events order by event_date asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors du chargement des événements' })
  }
})

// --- Commandes (pas de paiement en ligne : statut initial "en_attente") ---
app.post('/api/orders', async (req, res) => {
  const { customer, fulfillment, items, total } = req.body

  if (!customer?.nom || !customer?.telephone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Informations de commande incomplètes' })
  }

  try {
    const [createdCustomer] = await sql`
      insert into customers (nom, telephone, quartier)
      values (${customer.nom}, ${customer.telephone}, ${customer.quartier || null})
      returning id
    `

    const reference = generateReference()

    const [order] = await sql`
      insert into orders (reference, customer_id, fulfillment, notes, total)
      values (${reference}, ${createdCustomer.id}, ${fulfillment}, ${customer.notes || null}, ${total})
      returning id, reference
    `

    for (const item of items) {
      await sql`
        insert into order_items (order_id, item_id, item_name, price, qty)
        values (${order.id}, ${item.id}, ${item.name}, ${item.price}, ${item.qty})
      `
    }

    res.status(201).json({ reference: order.reference })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la commande" })
  }
})

// --- Assistant en ligne ---
// Stub prêt à brancher un vrai modèle (ex. Claude API) : la clé API reste
// côté serveur, jamais exposée au frontend. Cette route reçoit l'historique
// complet de la conversation depuis src/components/ChatBot.jsx.
app.post('/api/chatbot', async (req, res) => {
  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages manquants' })
  }

  // Exemple d'intégration (à activer une fois ANTHROPIC_API_KEY renseignée en .env) :
  //
  // const response = await fetch('https://api.anthropic.com/v1/messages', {
  //   method: 'POST',
  //   headers: {
  //     'x-api-key': process.env.ANTHROPIC_API_KEY,
  //     'anthropic-version': '2023-06-01',
  //     'content-type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'claude-sonnet-4-6',
  //     max_tokens: 300,
  //     system: "Tu es l'assistant du site Vitraco RCA. Réponds uniquement sur les motos, tricycles, pièces détachées, prix et livraison.",
  //     messages,
  //   }),
  // })
  // const data = await response.json()
  // return res.json({ reply: data.content?.[0]?.text })

  res.status(501).json({ error: "Assistant IA non configuré côté serveur — la FAQ locale prend le relais côté client." })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`[server] API Vitraco RCA démarrée sur http://localhost:${PORT}`)
})
