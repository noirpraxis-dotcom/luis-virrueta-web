import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' }
  ]

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode)
    setIsOpen(false)
    // Aquí irá la lógica de cambio de idioma cuando tengas las traducciones
    console.log('Language changed to:', langCode)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLang)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Botón actual */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300"
      >
        <span className="text-2xl">{currentLanguage.flag}</span>
        <span className="text-white/80 text-sm font-light tracking-wider uppercase" style={{ fontFamily: 'Gotham, sans-serif' }}>
          {currentLanguage.code}
        </span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 min-w-[160px] border border-white/20"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  currentLang === lang.code ? 'text-amber-400' : 'text-white/75 hover:text-white'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                  {lang.name}
                </span>
                {currentLang === lang.code && (
                  <span className="ml-auto text-amber-400">✓</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSelector
