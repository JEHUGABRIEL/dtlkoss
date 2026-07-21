import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Phone } from 'lucide-react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ContactFormModal from './components/ContactFormModal.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Hardware from './pages/Hardware.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import About from './pages/About.jsx'
import ChatBot from './components/ChatBot.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

export default function App() {
  const location = useLocation()
  const { pathname } = location
  const [contactOpen, setContactOpen] = useState(false)
  const isAdmin = pathname.startsWith('/admin')

  const pageRoutes = (
    <Routes location={location} key={pathname}>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/boutique" element={<PageTransition><Shop /></PageTransition>} />
      <Route path="/boutique/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
      <Route path="/quincaillerie" element={<PageTransition><Hardware /></PageTransition>} />
      <Route path="/panier" element={<PageTransition><Cart /></PageTransition>} />
      <Route path="/commande" element={<PageTransition><Checkout /></PageTransition>} />
      <Route path="/a-propos" element={<PageTransition><About /></PageTransition>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        {!isAdmin && <Header />}
        <main className="flex-1">
          {isAdmin ? (
            pageRoutes
          ) : (
            <AnimatePresence mode="wait">
              {pageRoutes}
            </AnimatePresence>
          )}
        </main>

        {!isAdmin && (
          <>
            {/* Prêt à discuter ? — CTA au-dessus du footer */}
            <section className="relative overflow-hidden bg-gradient-to-br from-vt-charcoal to-vt-charcoal-dark px-5 py-14 lg:px-8">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, transparent 0 20px, rgba(255,255,255,0.15) 20px 21px, transparent 21px 40px)',
                }}
              />
              <div className="relative mx-auto max-w-4xl text-center">
                <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
                  Prêt à <span className="text-white/70">discuter</span> ?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
                  Une question sur nos produits, une commande ou un rendez-vous à l'atelier ?
                  Notre équipe est à votre écoute.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setContactOpen(true)}
                    className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display text-lg font-semibold text-vt-red transition-all hover:scale-[1.04] hover:shadow-xl hover:shadow-black/20"
                  >
                    <MessageCircle size={20} />
                    Nous contacter
                    <ArrowRight size={18} />
                  </button>
                  <a
                    href="tel:+23672902076"
                    className="flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 font-display text-lg font-semibold text-white transition-all hover:border-white/60 hover:scale-[1.04]"
                  >
                    <Phone size={18} />
                    +236 72 90 20 76
                  </a>
                </div>
              </div>
            </section>
            <Footer />
            <ChatBot />
          </>
        )}
      </div>

      {!isAdmin && (
        <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />
      )}
    </ToastProvider>
  )
}
