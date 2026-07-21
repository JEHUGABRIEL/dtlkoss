# Vitraco RCA — Site web

Site vitrine + boutique en ligne + quincaillerie pièces détachées + assistant
en ligne pour Vitraco RCA, import-export de motos et tricycles SANYA à Bangui.

## Stack

- **Frontend** : React 19 + Vite + Tailwind CSS v4, React Router, lucide-react
- **Backend** : Express + Neon (Postgres serverless) via `@neondatabase/serverless`
- Aucun paiement en ligne : le tunnel de commande collecte les infos client et
  crée une commande en base (paiement à la livraison ou au retrait en showroom).

## Nouveautés par rapport au site TVS

- **Slider hero** en page d'accueil (3 diapositives, autoplay + flèches + puces, pause au survol).
- **Assistant en ligne (chatbot)** flottant en bas à droite : répond à partir d'une FAQ locale par
  mots-clés (horaires, prix, livraison, garantie, pièces...). Le backend expose une route
  `POST /api/chatbot` prête à être branchée sur un vrai modèle (ex. Claude API) — voir le
  commentaire dans `server/index.js` pour l'exemple d'intégration. La clé API reste toujours
  côté serveur, jamais dans le frontend.
- **Page d'accueil enrichie** : hero slider, bandeau de statistiques, section "Pourquoi Vitraco",
  mise en avant du Tricycle Cargo SANYA avec ses caractéristiques, témoignages clients,
  et bloc d'inscription WhatsApp.
- **Élément signature visuel** : `SpecBar`, une jauge segmentée façon banc de puissance
  (différente du cadran circulaire du site TVS), pour distinguer l'identité Vitraco.

## ⚠️ À propos des images

Ce chat n'a pas d'outil de génération d'images IA disponible. Les images produit et les
visuels du hero slider pointent vers des chemins (`/products/*.jpg`, `/hero/*.jpg`, etc.)
qui n'existent pas encore : ils s'affichent en absent tant que les fichiers ne sont pas
déposés dans `public/`. Deux options :

1. Générer les visuels avec un outil IA de ton choix (Midjourney, DALL·E, etc.) et les déposer
   dans `public/products/`, `public/parts/`, `public/hero/` avec les noms de fichiers attendus
   (voir `src/data/products.js` et `src/components/HeroSlider.jsx`).
2. Utiliser de vraies photos produit si le fournisseur Vitraco en fournit.

Le design a été pensé pour bien fonctionner dans les deux cas : les cartes produit et le
hero slider masquent proprement l'image si le fichier est absent, sans casser la mise en page.

## Démarrage — Frontend

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:5173.

## Démarrage — Backend (Neon)

```bash
cd server
npm install
cp .env.example .env
# Renseigner DATABASE_URL avec la chaîne de connexion Neon
npm run migrate
npm run dev
```

## Structure

```
src/
  components/   Header, Footer, HeroSlider, Chatbot, ProductCard, PartCard,
                SpecBar (signature), StatBar, WhyUs, TricycleSpotlight,
                Testimonials, NewsletterCTA
  pages/        Home, Shop, ProductDetail, Hardware, Cart, Checkout, About
  context/      CartContext (panier en mémoire, useReducer)
  data/         Données de démonstration (products.js, content.js)
  lib/api.js    Client API (submitOrder, fetchProducts)
server/
  index.js      API Express (produits, pièces, commandes, chatbot stub)
  schema.sql    Schéma Postgres
  migrate.js    Exécute schema.sql sur la base Neon
```

## Prochaines étapes suggérées

1. Déposer les vraies images (ou générées par IA) dans `public/` selon les chemins attendus.
2. Brancher `POST /api/chatbot` sur un vrai modèle pour des réponses plus flexibles que la FAQ.
3. Ajouter une notification (WhatsApp Business API ou email) dans `POST /api/orders`.
4. Brancher le formulaire d'inscription WhatsApp (`NewsletterCTA`) sur une vraie table `leads`.
