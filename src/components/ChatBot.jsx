import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Bot,
  User,
  ShoppingBag,
  Clock,
  MapPin,
  Euro,
  RotateCcw,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const QUICK_ACTIONS = [
  { labelKey: 'chat.quickProducts', msgKey: 'chat.quickProductsMsg', icon: ShoppingBag },
  { labelKey: 'chat.quickPrices', msgKey: 'chat.quickPricesMsg', icon: Euro },
  { labelKey: 'chat.quickHours', msgKey: 'chat.quickHoursMsg', icon: Clock },
  { labelKey: 'chat.quickLocation', msgKey: 'chat.quickLocationMsg', icon: MapPin },
]

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: null, // Rempli dynamiquement via t()
}

const STORAGE_KEY = 'vitraco-chat-history'

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return [WELCOME_MESSAGE]
}

export default function ChatBot() {
  const { t } = useTranslation()

  const WELCOME_MESSAGE = {
    role: 'assistant',
    content: t('chat.welcome'),
  }

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch { /* ignore */ }
    return [WELCOME_MESSAGE]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const inputRef = useRef(null)

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [open])

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  useEffect(() => {
    scrollToBottom()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages, scrollToBottom])

  // Show/hide scroll-to-bottom button
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    setShowScrollBtn(!atBottom)
  }, [])

  // Vérifie si ce message est le premier d'un groupe (même expéditeur consécutif)
  const isFirstInGroup = (index) => {
    if (index === 0) return true
    return messages[index].role !== messages[index - 1].role
  }

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return

    const userMsg = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.slice(1), userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      const reply = data.reply || t('chat.errorDefault')

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: t('chat.errorUnavailable'),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [messages, loading, t])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage(input)
      }
    },
    [input, sendMessage]
  )

  const resetChat = useCallback(() => {
    const fresh = { role: 'assistant', content: t('chat.welcome') }
    setMessages([fresh])
    localStorage.removeItem(STORAGE_KEY)
  }, [t])

  const isLastMsg = (i) => i === messages.length - (loading ? 2 : 1)

  return (
    <>
      {/* ═══════════════════════════════════════════
           BOUTON FLOTTANT
           ═══════════════════════════════════════════ */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_32px_rgba(224,32,31,0.45)] ${
          open
            ? 'scale-0 rotate-90 opacity-0'
            : 'scale-100 opacity-100'
        }`}
        style={{
          background: open
            ? 'var(--color-vt-charcoal)'
            : 'linear-gradient(135deg, var(--color-vt-red) 0%, #e04040 50%, var(--color-vt-red-dark) 100%)',
          boxShadow: open
            ? '0 4px 14px rgba(0,0,0,0.2)'
            : '0 4px 20px rgba(224, 32, 31, 0.35)',
        }}          aria-label={open ? t('chat.close') : t('chat.open')}
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle size={24} className="transition-transform duration-300 group-hover:scale-110" />
        </div>

        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-vt-red/30" style={{ animationDuration: '3s' }} />
        )}
      </button>

      {/* ═══════════════════════════════════════════
           FENÊTRE DE CHAT — WRAPPER BORDURE GRADIENT
           ═══════════════════════════════════════════ */}
      <div
        className={`fixed z-50 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        } inset-x-3 bottom-3 top-auto max-h-[85vh] rounded-2xl sm:bottom-6 sm:right-6 sm:w-[420px] sm:max-h-[min(620px,calc(100vh-80px))] sm:inset-x-auto`}
        style={{
          background: open
            ? 'linear-gradient(135deg, var(--color-vt-red) 0%, #e04040 40%, #f06060 60%, var(--color-vt-red-dark) 100%)'
            : 'var(--color-vt-red)',
          padding: '1.5px',
          transform: open
            ? 'perspective(1200px) rotateX(0deg) scale(1) translateY(0)'
            : 'perspective(1200px) rotateX(4deg) scale(0.7) translateY(24px)',
          transformOrigin: 'bottom right',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          boxShadow: open
            ? '0 20px 70px rgba(0,0,0,0.18), 0 6px 24px rgba(0,0,0,0.1)'
            : 'none',
        }}
      >
        {/* ── Contenu glassmorphisme ── */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl">
          {/* ═══════════════════════════════════════════
               HEADER — DÉGRADÉ ANIMÉ
               ═══════════════════════════════════════════ */}
          <div
            className="animated-gradient-header relative flex items-center justify-between px-5 py-4 text-white"
            style={{
              background: 'linear-gradient(135deg, var(--color-vt-red) 0%, #e04040 30%, #f06060 60%, var(--color-vt-red-dark) 100%)',
              backgroundSize: '200% 200%',
            }}
          >
            {/* Motif décoratif subtil */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
              }}
            />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30 ring-offset-0">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">{t('chat.name')}</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 shadow-sm shadow-green-400/50"
                    style={{ animationDuration: '2s' }}
                  />
                  <p className="text-[11px] text-white/70">{t('chat.online')}</p>
                </div>
              </div>
            </div>

            <div className="relative flex items-center gap-0.5">
              <button
                onClick={resetChat}
                className="rounded-lg p-2 text-white/70 transition-all hover:scale-105 hover:bg-white/15 hover:text-white active:scale-90"
                aria-label={t('chat.newConversation')}
                title={t('chat.newConversation')}
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white/70 transition-all hover:scale-105 hover:bg-white/15 hover:text-white active:scale-90"
                aria-label={t('chat.close')}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
               MESSAGES — AVEC GROUPEMENT
               ═══════════════════════════════════════════ */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin max-h-[55vh] sm:max-h-[380px]"
          >
            <div className="space-y-1">
              {messages.map((msg, i) => {
                const first = isFirstInGroup(i)
                const last = isLastMsg(i)
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    } ${!first ? 'mt-0.5' : 'mt-3'} ${last ? 'animate-message-in' : ''}`}
                  >
                    {/* Avatar — caché si pas premier du groupe */}
                    {first ? (
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 transition-transform hover:scale-110 ${
                          msg.role === 'user'
                            ? 'bg-vt-red-tint text-vt-red ring-vt-red/20'
                            : 'bg-vt-steel-tint text-vt-red ring-vt-red/20'
                        }`}
                      >
                        {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                      </div>
                    ) : (
                      /* Espace réservé pour aligner les bulles groupées */
                      <div className="w-7 shrink-0" />
                    )}

                    {/* Bulle */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all ${
                        msg.role === 'user'
                          ? 'rounded-tr-md text-white'
                          : 'rounded-tl-md border border-line/60 bg-white text-ink'
                      } ${first ? 'hover:translate-y-[-1px]' : ''} ${
                        msg.role === 'assistant' && first
                          ? 'hover:shadow-md hover:border-line'
                          : ''
                      }`}
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, var(--color-vt-red) 0%, #e04040 100%)' }
                          : { boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }
                      }
                    >
                      {formatMessage(msg.content)}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Typing indicator avec shimmer */}
            {loading && (
              <div className="mt-3 flex items-start gap-2.5 animate-message-in">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vt-steel-tint text-vt-red ring-2 ring-vt-red/20">
                  <Bot size={13} />
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-md border border-line/60 bg-white px-4 py-3 text-sm shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-steel" style={{ animationDelay: '0ms' }} />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-steel" style={{ animationDelay: '160ms' }} />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-steel" style={{ animationDelay: '320ms' }} />
                  </div>
                  <span className="text-xs text-steel-light/70">{t('chat.thinking')}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ═══════════════════════════════════════════
               BOUTON SCROLL TO BOTTOM
               ═══════════════════════════════════════════ */}
          {showScrollBtn && !loading && (
            <button
              onClick={() => scrollToBottom()}
              className="absolute bottom-[90px] right-7 z-10 flex h-8 w-8 animate-bounce items-center justify-center rounded-full border border-line/70 bg-white text-steel shadow-lg transition-all hover:border-vt-red hover:text-vt-red active:scale-90"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
              aria-label={t('chat.scrollBottom')}
            >
              <ChevronDown size={16} />
            </button>
          )}

          {/* ═══════════════════════════════════════════
               ACTIONS RAPIDES
               ═══════════════════════════════════════════ */}
          {messages.length <= 1 && (
            <div className="flex gap-2 overflow-x-auto border-t border-line/60 px-4 py-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.labelKey}
                    onClick={() => sendMessage(t(action.msgKey))}
                    className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line/70 px-3.5 py-1.5 text-xs font-medium text-steel transition-all hover:border-vt-red hover:bg-vt-red-tint hover:text-vt-red active:scale-95"
                  >
                    <Icon size={13} className="opacity-70" />
                    {t(action.labelKey)}
                  </button>
                )
              })}
            </div>
          )}

          {/* ═══════════════════════════════════════════
               ZONE DE SAISIE
               ═══════════════════════════════════════════ */}
          <div className="flex items-center gap-2 border-t border-line/60 bg-paper/50 px-4 py-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.placeholder')}
                disabled={loading}
                className="w-full rounded-xl border border-line/70 bg-white/80 px-4 py-2.5 pl-4 text-sm outline-none transition-all placeholder:text-steel-light/70 focus:border-vt-red focus:bg-white focus:shadow-sm focus:ring-2 focus:ring-vt-red/10 disabled:opacity-50"
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-all active:scale-90 disabled:opacity-30"
              style={{
                background: !input.trim() || loading
                  ? 'var(--color-steel-light)'
                  : 'linear-gradient(135deg, var(--color-vt-red) 0%, #e04040 100%)',
                boxShadow: input.trim() && !loading
                  ? '0 2px 8px rgba(224, 32, 31, 0.3)'
                  : 'none',
              }}
              aria-label={t('chat.send')}
            >
              <Send size={16} />
            </button>
          </div>

          {/* Pied subtil */}
          <div className="bg-white/50 px-4 py-1.5 text-center text-[10px] text-steel-light/60">
            {t('chat.footer')}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Formate le message : support du gras (**texte**) et des retours à la ligne.
 */
function formatMessage(text) {
  if (!text) return null

  const segments = text.split(/(\*\*[^*]+\*\*)/g)

  return (
    <span>
      {segments.map((seg, i) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return <strong key={i} className="font-semibold">{seg.slice(2, -2)}</strong>
        }
        return seg.split('\n').map((line, j) => (
          <span key={`${i}-${j}`}>
            {j > 0 && <br />}
            {line}
          </span>
        ))
      })}
    </span>
  )
}
