import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingCart, Wrench, Phone, Home, Info, X, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext.jsx'
import { CATEGORIES, PART_CATEGORIES } from '../data/products.js'
import ContactFormModal from './ContactFormModal.jsx'
import LanguageSwitcher from './common/LanguageSwitcher.jsx'

const NAV_ITEMS = [
  { to: '/', key: 'home', end: true, icon: Home },
  { to: '/boutique', key: 'shop', icon: ShoppingCart, hasSubmenu: true },
  { to: '/quincaillerie', key: 'hardware', icon: Wrench, hasSubmenu: true },
  { to: '/a-propos', key: 'about', icon: Info },
]

const SUBMENU_ITEMS = {
  shop: [
    { to: '/boutique', label: 'Toute la gamme' },
    ...CATEGORIES.map((cat) => ({ to: `/boutique?cat=${cat.id}`, label: cat.label })),
  ],
  hardware: [
    { to: '/quincaillerie', label: 'Toutes les pièces' },
    ...PART_CATEGORIES.map((cat) => ({ to: `/quincaillerie?cat=${cat.id}`, label: cat.label })),
  ],
}

export default function Header() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [bannerClosing, setBannerClosing] = useState(false)
  const [animatingIn, setAnimatingIn] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [expandedItem, setExpandedItem] = useState(null)
  const bannerTimerRef = useRef(null)
  const toggleRef = useRef(null)
  const navListRef = useRef(null)
  const { totalItems } = useCart()
  const location = useLocation()

  const NAV_LINKS = NAV_ITEMS.map((item) => ({ ...item, label: t(`nav.${item.key}`) }))

  const handleCloseContact = useCallback(() => setContactOpen(false), [])

  // Ferme la modale et le drawer au changement de page
  useEffect(() => {
    setContactOpen(false)
    setOpen(false)
    setExpandedItem(null)
  }, [location.pathname])

  // Body scroll lock when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [open])

  // Animate items in on open with a short delay so drawer slides in first
  // On close, delay hiding items so they remain visible during drawer slide-out
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setAnimatingIn(true), 120)
      return () => clearTimeout(timer)
    } else {
      setNavScrolled(false)
      setExpandedItem(null)
      const hideTimer = setTimeout(() => setAnimatingIn(false), 350)
      return () => clearTimeout(hideTimer)
    }
  }, [open])

  // Close menu on Escape key
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (expandedItem) {
          setExpandedItem(null)
        } else {
          setOpen(false)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, expandedItem])

  // Focus trap: focus the close button when drawer opens
  useEffect(() => {
    if (open && toggleRef.current) {
      const focusTimer = setTimeout(() => {
        const closeBtn = document.querySelector('[data-drawer-close]')
        closeBtn?.focus()
      }, 200)
      return () => clearTimeout(focusTimer)
    }
  }, [open])

  const closeBanner = () => {
    setBannerClosing(true)
    bannerTimerRef.current = setTimeout(() => {
      setBannerVisible(false)
      setBannerClosing(false)
    }, 400)
  }

  // Cleanup du timer si le composant est démonté
  useEffect(() => {
    return () => clearTimeout(bannerTimerRef.current)
  }, [])

  const toggleMenu = () => setOpen((v) => !v)
  const closeMenu = () => setOpen(false)

  const handleNavScroll = (e) => {
    setNavScrolled(e.target.scrollTop > 4)
  }

  const toggleSubmenu = (key) => {
    setExpandedItem((prev) => (prev === key ? null : key))
  }

  const isSubActive = (to) => {
    const [path, search] = to.split('?')
    if (location.pathname !== path) return false
    if (!search) return !location.search
    return location.search === `?${search}`
  }

  return (
    <header className="sticky top-0 z-40 bg-paper-raised text-ink border-b border-line">
      {/* Bandeau au-dessus de la navbar — fermable */}
      {bannerVisible && (
        <div
          className={`flex items-center gap-2 bg-vt-red px-5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-white/95 transition-all duration-300 ease-in-out lg:px-8 ${
            bannerClosing ? 'max-h-0 -translate-y-full overflow-hidden py-0 opacity-0' : 'max-h-12 opacity-100'
          }`}
        >
          <Wrench size={12} className="shrink-0" />
          <span className="flex-1 overflow-hidden lg:truncate">
            <span className="flex w-max animate-[marquee_18s_linear_infinite] gap-8 lg:animate-none lg:w-auto lg:gap-0">
              <span className="shrink-0 lg:hidden">
                {t('nav.banner')}{' '}
                <Link
                  to="/quincaillerie"
                  className="font-semibold underline underline-offset-2 hover:no-underline"
                >
                  {t('nav.bannerLink')}
                </Link>
                {'  —  '}
              </span>
              <span className="hidden shrink-0 lg:inline">
                {t('nav.banner')}{' '}
                <Link
                  to="/quincaillerie"
                  className="font-semibold underline underline-offset-2 hover:no-underline"
                >
                  {t('nav.bannerLink')}
                </Link>
              </span>
              <span className="shrink-0 lg:hidden">
                {t('nav.banner')}{' '}
                <Link
                  to="/quincaillerie"
                  className="font-semibold underline underline-offset-2 hover:no-underline"
                >
                  {t('nav.bannerLink')}
                </Link>
                {'  —  '}
              </span>
            </span>
          </span>
          <button
            onClick={closeBanner}
            className="ml-1 shrink-0 rounded p-0.5 transition-colors hover:bg-white/20"
            aria-label={t('nav.bannerClose')}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
          <span className="font-display text-2xl tracking-tight">
            VITRACO<span className="text-vt-red">.</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-steel sm:block">
            Bangui
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `font-display text-lg font-medium tracking-wide transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-300 ${
                  isActive
                    ? 'text-vt-red after:w-full after:bg-vt-red'
                    : 'text-ink/75 hover:text-ink after:w-0 after:bg-ink/30 hover:after:w-full'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setContactOpen(true)}
            className="hidden items-center gap-1.5 rounded-full bg-vt-red px-3 py-1.5 font-display text-xs font-semibold tracking-wide text-white transition-all hover:scale-[1.04] hover:shadow-lg hover:shadow-vt-red/30 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm lg:flex"
          >
            <Phone size={14} className="sm:size-4" />
            <span>{t('nav.contact')}</span>
          </button>
          <Link
            to="/panier"
            className="relative flex items-center gap-2 rounded-full border border-line px-3 py-2 transition-all hover:border-vt-red hover:shadow-sm active:scale-95"
            aria-label={t('nav.cart')}
          >
            <ShoppingCart size={18} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-vt-red font-mono text-[11px] font-semibold text-white animate-[bounce-soft_0.6s_ease-out]">
                {totalItems}
              </span>
            )}
          </Link>
          {/* Hamburger button — caché quand le drawer est ouvert (le drawer a son propre X) */}
          <button
            ref={toggleRef}
            className={`relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line transition-all hover:border-ink/30 hover:shadow-sm active:scale-90 lg:hidden ${
              open ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
            onClick={toggleMenu}
            aria-label={t('nav.menu')}
            aria-expanded={open}
            aria-hidden={open}
          >
            <span className="flex flex-col items-center justify-center gap-[3px]">
              <span
                className={`block h-[2px] w-5 rounded-full bg-ink transition-all duration-300 ease-out ${
                  open ? 'translate-y-[5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-ink transition-all duration-200 ease-out ${
                  open ? 'scale-x-0 opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-ink transition-all duration-300 ease-out ${
                  open ? '-translate-y-[5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-all duration-[400ms] ease-out lg:hidden ${
          open
            ? 'opacity-100 backdrop-blur-sm'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile drawer — slides in from right */}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-line bg-paper-raised shadow-2xl transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between border-b border-line px-6 pb-4"
          style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}
        >
          <span className="font-display text-xl tracking-tight">
            Menu<span className="text-vt-red">.</span>
          </span>
          <button
            data-drawer-close
            onClick={closeMenu}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-200 hover:border-ink/30 hover:bg-ink/5 hover:shadow-sm active:scale-90"
            aria-label={t('nav.close')}
          >
            <X
              size={16}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </button>
        </div>

        {/* Nav items — with scroll shadow */}
        <div className="relative flex-1">
          {/* Scroll shadow top */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-paper-raised to-transparent transition-opacity duration-300 ${
              navScrolled ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <nav
            ref={navListRef}
            onScroll={handleNavScroll}
            className="scrollbar-thin h-full overflow-y-auto overscroll-contain px-5 pt-4 pb-6"
          >
            <div className="flex flex-col gap-1">
              {/* Contact button at top */}
              <button
                onClick={() => {
                  setContactOpen(true)
                  closeMenu()
                }}
                className={`group flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-vt-red to-vt-red-dark px-4 py-3.5 font-display text-base font-semibold tracking-wide text-white shadow-lg shadow-vt-red/20 transition-all duration-200 hover:shadow-xl hover:shadow-vt-red/30 active:scale-[0.98] ${
                  animatingIn ? 'animate-mobile-nav-item' : 'opacity-0'
                }`}
                style={{ animationDelay: '0ms' }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                  <Phone size={15} />
                </span>
                <span>{t('nav.contact')}</span>
                <span className="ml-auto flex items-center gap-1 text-xs font-mono font-normal text-white/60">
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </span>
              </button>

              <div className="my-2 border-t border-line" />

              {NAV_LINKS.map((link, idx) => {
                const Icon = link.icon
                const isSubmenuExpanded = expandedItem === link.key
                const hasSubmenu = link.hasSubmenu
                const subItems = SUBMENU_ITEMS[link.key]
                const animationDelay = `${120 + idx * 60}ms`

                if (hasSubmenu) {
                  return (
                    <div key={link.to} className="flex flex-col">
                      {/* Main nav button — toggles submenu */}
                      <button
                        onClick={() => toggleSubmenu(link.key)}
                        className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-display text-[17px] tracking-wide transition-all duration-200 ${
                          location.pathname === link.to
                            ? 'bg-vt-red-tint text-vt-red font-semibold'
                            : 'text-ink/80 hover:bg-ink/5 hover:text-ink'
                        } ${animatingIn ? 'animate-mobile-nav-item' : 'opacity-0'}`}
                        style={{ animationDelay }}
                        aria-expanded={isSubmenuExpanded}
                      >
                        {/* Left accent bar for active item */}
                        {location.pathname === link.to && (
                          <span className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-vt-red" />
                        )}
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                            location.pathname === link.to
                              ? 'bg-vt-red/10 text-vt-red'
                              : 'bg-ink/5 text-steel group-hover:bg-ink/10 group-hover:text-ink'
                          }`}
                        >
                          <Icon size={17} />
                        </span>
                        <span className="flex-1 text-left">{link.label}</span>
                        {/* Chevron */}
                        <ChevronDown
                          size={16}
                          className={`text-steel-light transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isSubmenuExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Submenu items */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isSubmenuExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                        role="region"
                        aria-label={`${link.label} — sous-menu`}
                        aria-hidden={!isSubmenuExpanded}
                      >
                        <div className="relative ml-4 mt-1 mb-1.5 pl-6 border-l-2 border-line/60">
                          {subItems.map((subItem, subIdx) => {
                            const active = isSubActive(subItem.to)
                            return (
                              <Link
                                key={subItem.to}
                                to={subItem.to}
                                onClick={closeMenu}
                                className={`group/sub relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 ${
                                  active
                                    ? 'bg-vt-red/5 text-vt-red font-semibold'
                                    : 'text-steel hover:bg-ink/5 hover:text-ink'
                                } ${
                                  isSubmenuExpanded && animatingIn
                                    ? 'animate-submenu-item'
                                    : isSubmenuExpanded
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                }`}
                                style={{
                                  animationDelay: isSubmenuExpanded
                                    ? `${80 + subIdx * 40}ms`
                                    : '0ms',
                                }}
                              >
                                {/* Dot indicator */}
                                <span
                                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 ${
                                    active
                                      ? 'bg-vt-red'
                                      : 'bg-steel-light group-hover/sub:bg-steel'
                                  }`}
                                />
                                <span className="flex-1">{subItem.label}</span>
                                {active && (
                                  <span className="h-1 w-1 rounded-full bg-vt-red animate-pulse-soft" />
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }

                // Simple nav link (Home, About)
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-4 py-3 font-display text-[17px] tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-vt-red-tint text-vt-red font-semibold'
                          : 'text-ink/80 hover:bg-ink/5 hover:text-ink'
                      } ${animatingIn ? 'animate-mobile-nav-item' : 'opacity-0'}`
                    }
                    style={{ animationDelay }}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Left accent bar for active item */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-vt-red" />
                        )}
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-vt-red/10 text-vt-red'
                              : 'bg-ink/5 text-steel group-hover:bg-ink/10 group-hover:text-ink'
                          }`}
                        >
                          <Icon size={17} />
                        </span>
                        <span className="flex-1">{link.label}</span>
                        <span
                          className={`text-steel-light transition-all duration-200 ${
                            isActive
                              ? 'translate-x-0 opacity-100'
                              : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          }`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M4.5 2.5L8 6L4.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </nav>
          {/* Scroll shadow bottom */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-paper-raised to-transparent transition-opacity duration-300 ${
              navScrolled ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Drawer footer */}
        <div
          className="relative border-t border-line px-6 py-5"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {/* Shadow above footer when nav is scrolled */}
          <div
            className={`pointer-events-none absolute inset-x-0 -top-4 h-4 bg-gradient-to-b from-transparent to-paper-raised transition-opacity duration-300 ${
              navScrolled ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`flex items-center justify-between ${
              animatingIn ? 'animate-mobile-nav-item' : 'opacity-0'
            }`}
            style={{ animationDelay: '340ms' }}
          >
            <LanguageSwitcher />
            <Link
              to="/panier"
              onClick={closeMenu}
              className="group flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-steel transition-all duration-200 hover:border-vt-red hover:bg-vt-red-tint hover:text-vt-red active:scale-95"
            >
              <ShoppingCart size={15} strokeWidth={2} />
              <span>{t('nav.cart')}</span>
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-vt-red font-mono text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          <div className={`mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-steel-light transition-all duration-500 ${
            animatingIn ? 'opacity-100' : 'opacity-0'
          }`} style={{ animationDelay: '420ms' }}>
            <span>Vitraco RCA · Bangui</span>
            <span className="hidden sm:inline">Import-Export</span>
          </div>
        </div>
      </div>

      {/* Modal formulaire de contact */}
      <ContactFormModal
        open={contactOpen}
        onClose={handleCloseContact}
      />
    </header>
  )
}
