import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const next = i18n.language === 'fr' ? 'en' : 'fr'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-mono font-medium text-steel transition-all hover:border-vt-red hover:text-vt-red active:scale-95"
      aria-label={`Switch language to ${i18n.language === 'fr' ? 'English' : 'Français'}`}
    >
      <Globe size={13} />
      <span>{i18n.language === 'fr' ? 'FR' : 'EN'}</span>
    </button>
  )
}
