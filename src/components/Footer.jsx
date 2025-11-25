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
          {/* Logo/Brand */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-light tracking-[0.15em]"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              <span className="bg-gradient-to-r from-[#8dc1ab] via-[#8dc1ab] to-[#7ab09a] bg-clip-text text-transparent">Green</span>
              <span className="text-white">leaf</span>
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
          <div className="text-white/40 text-xs tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
            © {currentYear} Greenleaf Lightworks. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
