import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-conditions' },
    { name: 'Cookie Policy', href: '/cookie-policy' }
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
          {/* Logo/Brand - Ainimation */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer relative"
            >
              {/* Ainimation - Neural gradient */}
              <div className="text-[2.75rem] font-bold tracking-tight font-display">
                <span className="bg-gradient-to-r from-neural-400 via-psych-500 to-design-500 bg-clip-text text-transparent animate-gradient">
                  Ainimation
                </span>
              </div>
              
              {/* Tagline */}
              <div 
                className="text-[0.6rem] uppercase font-medium tracking-[0.3em] text-center -mt-1 font-mono"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer-slow 4s ease-in-out infinite'
                }}
              >
                Psych × Design × AI
              </div>
            </motion.div>
          </Link>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link, index) => (
              <span key={link.name} className="flex items-center gap-x-6">
                <Link
                  to={link.href}
                  className="text-white/60 hover:text-[#8dc1ab] transition-colors duration-300"
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
                className="text-white/60 hover:text-[#8dc1ab] transition-colors duration-300"
                style={{ fontFamily: 'Gotham, sans-serif' }}
              >
                Cookie Settings
              </button>
            </span>
          </div>

          {/* Copyright */}
          <div className="text-white/40 text-xs tracking-wide font-mono">
            © {currentYear} Ainimation. Psicología × Diseño × IA. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
