import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const CookieBanner = () => {
  const { t } = useLanguage()
  const [showBanner, setShowBanner] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      // Show banner after 1 second for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: false,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  const handleCustomSave = (preferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
    setShowCustomize(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => setShowBanner(false)}
          />

          {/* Banner - PREMIUM MINIMALISTA */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-12 lg:max-w-md z-[101]"
          >
            <div className="relative overflow-hidden rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
              {/* Glow sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-fuchsia-500/5" />
              
              <div className="relative p-6">
                {!showCustomize ? (
                  <div className="space-y-5">
                    {/* Header minimalista */}
                    <div>
                      <h3 className="text-white text-base font-light tracking-wide mb-2 font-display">
                        Privacidad y Experiencia
                      </h3>
                      <p className="text-white/60 text-xs font-light leading-relaxed">
                        Usamos cookies para personalizar tu experiencia en nuestra plataforma de branding psicológico y próxima tienda. Tu privacidad es importante.{' '}
                        <Link 
                          to="/politica-privacidad" 
                          className="text-fuchsia-400 hover:text-fuchsia-300 underline-offset-2 hover:underline transition-all"
                          onClick={() => setShowBanner(false)}
                        >
                          Más info
                        </Link>
                      </p>
                    </div>

                    {/* Botones premium */}
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAcceptAll}
                        className="group relative overflow-hidden w-full px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-white/10 hover:border-white/30 transition-all duration-300"
                      >
                        <motion.div
                          animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #a855f7 100%)',
                            backgroundSize: '200% 200%',
                            opacity: 0.15
                          }}
                        />
                        <span className="relative text-white text-sm font-light tracking-wide">
                          Aceptar Todo
                        </span>
                      </motion.button>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowCustomize(true)}
                          className="flex-1 px-4 py-2.5 text-white/70 hover:text-white text-xs font-light border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
                        >
                          Personalizar
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleRejectAll}
                          className="flex-1 px-4 py-2.5 text-white/70 hover:text-white text-xs font-light border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
                        >
                          Solo Esenciales
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <CustomizePreferences onSave={handleCustomSave} onBack={() => setShowCustomize(false)} t={t} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const CustomizePreferences = ({ onSave, onBack, t }) => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false
  })

  const togglePreference = (key) => {
    if (key === 'necessary') return // Necessary cookies can't be disabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-white text-base font-light tracking-wide mb-2 font-display">
          Preferencias de Cookies
        </h3>
        <p className="text-white/60 text-xs font-light">
          Elige qué cookies deseas permitir en tu experiencia
        </p>
      </div>

      <div className="space-y-3">
        {/* Necesarias */}
        <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex-1">
            <h4 className="text-white text-xs font-light mb-1">Esenciales</h4>
            <p className="text-white/50 text-[10px] leading-relaxed">
              Necesarias para el funcionamiento del sitio
            </p>
          </div>
          <div className="w-10 h-5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-end px-0.5">
            <div className="w-4 h-4 bg-white rounded-full shadow" />
          </div>
        </div>

        {/* Análisis */}
        <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex-1">
            <h4 className="text-white text-xs font-light mb-1">Análisis</h4>
            <p className="text-white/50 text-[10px] leading-relaxed">
              Mejoran tu experiencia con datos anónimos
            </p>
          </div>
          <button
            onClick={() => togglePreference('analytics')}
            className="flex items-center"
          >
            <div className={`w-10 h-5 rounded-full flex items-center transition-all duration-300 px-0.5 ${
              preferences.analytics 
                ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 justify-end' 
                : 'bg-white/20 justify-start'
            }`}>
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </button>
        </div>

        {/* Marketing */}
        <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex-1">
            <h4 className="text-white text-xs font-light mb-1">Marketing</h4>
            <p className="text-white/50 text-[10px] leading-relaxed">
              Para ofertas personalizadas de nuestra tienda
            </p>
          </div>
          <button
            onClick={() => togglePreference('marketing')}
            className="flex items-center"
          >
            <div className={`w-10 h-5 rounded-full flex items-center transition-all duration-300 px-0.5 ${
              preferences.marketing 
                ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 justify-end' 
                : 'bg-white/20 justify-start'
            }`}>
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 px-4 py-2.5 text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-xs font-light transition-all duration-300"
        >
          Volver
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSave(preferences)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-white border border-white/10 hover:border-white/30 rounded-xl text-xs font-light transition-all duration-300"
        >
          Guardar Preferencias
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CookieBanner
