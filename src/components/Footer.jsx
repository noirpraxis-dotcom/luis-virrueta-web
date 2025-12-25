import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useState } from 'react'
import { ChevronDown, Instagram, FileText, MessageCircle, Mail } from 'lucide-react'

const Footer = () => {
  const { t, currentLanguage } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [legalOpen, setLegalOpen] = useState(false)

  const navigationLinks = [
    { name: currentLanguage === 'es' ? 'Inicio' : currentLanguage === 'en' ? 'Home' : 'Domů', href: '/' },
    { name: currentLanguage === 'es' ? 'Metodología' : currentLanguage === 'en' ? 'Method' : 'Metoda', href: '/metodo' },
    { name: currentLanguage === 'es' ? 'Quién Soy' : currentLanguage === 'en' ? 'About Me' : 'O Mně', href: '/sobre-mi' },
    { name: currentLanguage === 'es' ? 'Servicios' : currentLanguage === 'en' ? 'Services' : 'Služby', href: '/servicios' },
    { name: 'Blog', href: '/blog' },
    { name: currentLanguage === 'es' ? 'Tienda' : currentLanguage === 'en' ? 'Store' : 'Obchod', href: '/tienda' }
  ]

  const legalLinks = [
    { name: t('footer.privacyPolicy'), href: '/politica-privacidad' },
    { name: t('footer.termsConditions'), href: '/terminos-condiciones' },
    { name: t('footer.cookiePolicy'), href: '/politica-cookies' }
  ]

  const socialLinks = [
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/_horadorada_?igsh=MXRoZDJpaHdqbWRwYg==',
      icon: Instagram,
      color: 'from-purple-600 to-pink-600'
    },
    { 
      name: 'Substack', 
      href: 'https://luisvirrueta.substack.com',
      icon: FileText,
      color: 'from-orange-600 to-red-600'
    },
    { 
      name: 'WhatsApp', 
      href: 'https://wa.me/5215512345678', // Reemplazar con tu número
      icon: MessageCircle,
      color: 'from-green-600 to-emerald-600'
    }
  ]

  const handleCookieSettings = () => {
    localStorage.removeItem('cookieConsent')
    window.location.reload()
  }

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">
        <div className="space-y-10">
          
          {/* Logo */}
          <div className="flex justify-center">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                className="cursor-pointer text-center"
                style={{ fontFamily: 'Gotham, sans-serif' }}
              >
                <div className="text-white font-bold text-2xl leading-tight"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Luis Virrueta
                </div>
                <div className="text-white/50 text-[0.6rem] font-medium uppercase mt-1"
                  style={{ letterSpacing: '0.3em' }}
                >
                  Psicólogo · Psicoanalista
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Navigation Links - Grid responsivo */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-center"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="text-white/70 hover:text-white text-sm transition-colors duration-300"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${social.color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all duration-300`}
                  >
                    <Icon className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    <span className="text-xs text-white/80 group-hover:text-white transition-colors font-medium tracking-wide">
                      {social.name}
                    </span>
                  </motion.div>
                </a>
              )
            })}
          </div>

          {/* Legal Section - Desplegable */}
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setLegalOpen(!legalOpen)}
              className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white/80 transition-colors duration-300 py-2"
            >
              <span className="text-sm font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                {currentLanguage === 'es' ? 'Legal y Privacidad' : currentLanguage === 'en' ? 'Legal & Privacy' : 'Právní a Soukromí'}
              </span>
              <motion.div
                animate={{ rotate: legalOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
              </motion.div>
            </button>

            <AnimatePresence>
              {legalOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-3 pt-4 pb-2">
                    {legalLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="text-white/50 hover:text-fuchsia-400 transition-colors duration-300 text-xs"
                        style={{ fontFamily: 'Gotham, sans-serif' }}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleCookieSettings}
                      className="text-white/50 hover:text-fuchsia-400 transition-colors duration-300 text-xs"
                      style={{ fontFamily: 'Gotham, sans-serif' }}
                    >
                      {t('footer.cookieSettings')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Copyright */}
          <div className="text-white/50 text-xs tracking-wide font-light text-center">
            © {currentYear} Luis Virrueta. {t('footer.rights')}.
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
