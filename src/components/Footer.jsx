import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: 'Política de Privacidad', href: '/politica-privacidad' },
    { name: 'Términos y Condiciones', href: '/terminos-condiciones' },
    { name: 'Política de Cookies', href: '/politica-cookies' }
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
          {/* Logo/Brand - LUXMANIA */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="cursor-pointer relative"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              {/* LUXMANIA - Elegant silver chrome */}
              <div 
                className="text-[2.2rem] font-bold tracking-wider font-display"
                style={{
                  background: 'linear-gradient(135deg, #a8a9ad 0%, #ffffff 20%, #d4d4d8 40%, #fafafa 60%, #e4e4e7 80%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.25))',
                  letterSpacing: '0.1em'
                }}
              >
                LUXMANIA
              </div>
              
              {/* Tagline - Elegant subtle */}
              <div 
                className="text-[0.5rem] uppercase font-medium tracking-[0.4em] text-center -mt-0.5 font-mono"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.4em'
                }}
              >
                Psych × Design × Tech
              </div>
              
              {/* Underline decorativo */}
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d946ef] to-transparent opacity-0"
                whileHover={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link, index) => (
              <span key={link.name} className="flex items-center gap-x-6">
                <Link
                  to={link.href}
                  className="text-white/60 hover:text-fuchsia-400 transition-colors duration-300"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  {link.name}
                </Link>
                {index < footerLinks.length - 1 && (
                  <span className="text-white/20">|</span>
                )}
              </span>
            ))}
            <span className="flex items-center gap-x-6">
              <span className="text-white/20">|</span>
              <button
                onClick={handleCookieSettings}
                className="text-white/60 hover:text-fuchsia-400 transition-colors duration-300"
                style={{ fontFamily: 'Gotham, sans-serif' }}
              >
                Configuración de Cookies
              </button>
            </span>
          </div>

          {/* Copyright */}
          <div className="text-white/40 text-xs tracking-wide font-mono">
            © {currentYear} LUXMANIA. Psych × Design × Tech. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
