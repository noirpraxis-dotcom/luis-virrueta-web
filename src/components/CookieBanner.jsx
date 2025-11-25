import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CookieBanner = () => {
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

          {/* Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[101]"
          >
            <div className="bg-black/95 backdrop-blur-xl border-t border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-8 lg:px-12">
                {!showCustomize ? (
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                        <span className="text-2xl">🍪</span>
                        <h3 
                          className="text-white text-lg font-light tracking-wide"
                          style={{ fontFamily: 'Gotham, sans-serif' }}
                        >
                          We value your privacy
                        </h3>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                        We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                        By clicking "Accept All", you consent to our use of cookies.{' '}
                        <Link 
                          to="/privacy-policy" 
                          className="text-[#8dc1ab] hover:text-[#7ab09a] underline transition-colors"
                          onClick={() => setShowBanner(false)}
                        >
                          Learn more
                        </Link>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRejectAll}
                        className="px-6 py-2.5 text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-full text-sm font-light tracking-wide transition-all duration-300"
                        style={{ fontFamily: 'Gotham, sans-serif' }}
                      >
                        Reject All
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCustomize(true)}
                        className="px-6 py-2.5 text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-full text-sm font-light tracking-wide transition-all duration-300"
                        style={{ fontFamily: 'Gotham, sans-serif' }}
                      >
                        Customize
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(141, 193, 171, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAcceptAll}
                        className="px-8 py-2.5 bg-[#8dc1ab] text-black rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:bg-[#7ab09a]"
                        style={{ fontFamily: 'Gotham, sans-serif' }}
                      >
                        Accept All
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <CustomizePreferences onSave={handleCustomSave} onBack={() => setShowCustomize(false)} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const CustomizePreferences = ({ onSave, onBack }) => {
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
      className="space-y-6"
    >
      <div className="text-center lg:text-left">
        <h3 
          className="text-white text-xl font-light tracking-wide mb-2"
          style={{ fontFamily: 'Gotham, sans-serif' }}
        >
          Cookie Preferences
        </h3>
        <p className="text-white/60 text-sm">
          Choose which cookies you want to accept
        </p>
      </div>

      <div className="space-y-4">
        {/* Necessary Cookies */}
        <div className="flex items-start justify-between gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex-1">
            <h4 className="text-white text-sm font-medium mb-1">Necessary Cookies</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Required for the website to function properly. Cannot be disabled.
            </p>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-6 bg-[#8dc1ab] rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="flex items-start justify-between gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex-1">
            <h4 className="text-white text-sm font-medium mb-1">Analytics Cookies</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Help us understand how visitors interact with our website.
            </p>
          </div>
          <button
            onClick={() => togglePreference('analytics')}
            className="flex items-center"
          >
            <div className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 px-1 ${
              preferences.analytics ? 'bg-[#8dc1ab] justify-end' : 'bg-white/20 justify-start'
            }`}>
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </button>
        </div>

        {/* Marketing Cookies */}
        <div className="flex items-start justify-between gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex-1">
            <h4 className="text-white text-sm font-medium mb-1">Marketing Cookies</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Used to track visitors across websites for advertising purposes.
            </p>
          </div>
          <button
            onClick={() => togglePreference('marketing')}
            className="flex items-center"
          >
            <div className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 px-1 ${
              preferences.marketing ? 'bg-[#8dc1ab] justify-end' : 'bg-white/20 justify-start'
            }`}>
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-2.5 text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-full text-sm font-light tracking-wide transition-all duration-300"
          style={{ fontFamily: 'Gotham, sans-serif' }}
        >
          Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(141, 193, 171, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSave(preferences)}
          className="px-8 py-2.5 bg-[#8dc1ab] text-black rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:bg-[#7ab09a]"
          style={{ fontFamily: 'Gotham, sans-serif' }}
        >
          Save Preferences
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CookieBanner
