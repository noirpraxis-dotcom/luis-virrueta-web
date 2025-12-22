import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: t('footer.privacyPolicy'), href: '/politica-privacidad' },
    { name: t('footer.termsConditions'), href: '/terminos-condiciones' },
    { name: t('footer.cookiePolicy'), href: '/politica-cookies' }
  ]

  const handleCookieSettings = () => {
    localStorage.removeItem('cookieConsent')
    window.location.reload()
  }

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:px-12">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo Luis Virrueta - Igual que el Header */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="cursor-pointer text-center"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              <div className="text-white font-bold text-xl leading-tight"
                style={{ letterSpacing: '0.05em' }}
              >
                Luis Virrueta
              </div>
              <div className="text-white/50 text-[0.5rem] font-medium uppercase mt-0.5"
                style={{ letterSpacing: '0.3em' }}
              >
                Psicólogo · Psicoanalista
              </div>
            </motion.div>
          </Link>

          {/* Legal Links - Optimizado para móvil */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
            {footerLinks.map((link, index) => (
              <span key={link.name} className="flex items-center gap-x-2 sm:gap-x-6">
                <Link
                  to={link.href}
                  className="text-white/60 hover:text-fuchsia-400 transition-colors duration-300 whitespace-nowrap"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  {link.name}
                </Link>
                {index < footerLinks.length - 1 && (
                  <span className="text-white/20 hidden sm:inline">|</span>
                )}
              </span>
            ))}
            <span className="flex items-center gap-x-2 sm:gap-x-6 w-full sm:w-auto justify-center">
              <span className="text-white/20 hidden sm:inline">|</span>
              <button
                onClick={handleCookieSettings}
                className="text-white/60 hover:text-fuchsia-400 transition-colors duration-300 whitespace-nowrap"
                style={{ fontFamily: 'Gotham, sans-serif' }}
              >
                {t('footer.cookieSettings')}
              </button>
            </span>
          </div>

          {/* Copyright - Más compacto en móvil */}
          <div className="text-white/40 text-[10px] sm:text-xs tracking-wide font-mono text-center px-4">
            © {currentYear} Luis Virrueta. {t('footer.rights')}.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
