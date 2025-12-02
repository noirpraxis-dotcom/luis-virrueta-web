import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const Header = ({ menuItems }) => {
  const [hoveredItem, setHoveredItem] = useState(null)
  const location = useLocation()
  const timeoutRef = useRef(null)

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredItem(index)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null)
    }, 200) // 200ms delay antes de cerrar
  }

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
    >
      <nav className="bg-black/70 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/">
              <motion.div 
                whileHover={{ 
                  scale: 1.03,
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                className="cursor-pointer relative"
                style={{ fontFamily: 'Gotham, sans-serif' }}
              >
                {/* LUXMANIA - Elegant silver chrome con animación en MANIA */}
                <div className="text-[2.2rem] font-bold tracking-wider font-display flex">
                  {/* LUX - Estático */}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #a8a9ad 0%, #ffffff 20%, #d4d4d8 40%, #fafafa 60%, #e4e4e7 80%, #ffffff 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.25))',
                      letterSpacing: '0.1em'
                    }}
                  >
                    LUX
                  </span>
                  {/* MANIA - Animado con degradados morado/azul/fucsia */}
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      background: 'linear-gradient(90deg, #ffffff 0%, #a855f7 15%, #6366f1 30%, #d946ef 45%, #e879f9 60%, #8b5cf6 75%, #ffffff 90%, #ffffff 100%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 25px rgba(168,85,247,0.3))',
                      letterSpacing: '0.1em'
                    }}
                  >
                    MANIA
                  </motion.span>
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
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF] to-transparent opacity-0"
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            {/* Menu Items - mejor espaciado */}
            <div className="flex items-center gap-8">
              <ul className="flex space-x-10 items-center">
              {menuItems.map((item, index) => (
                <li 
                  key={index} 
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link to={item.href}>
                    <motion.div
                      className="text-white/70 hover:text-white transition-all duration-500 text-[0.75rem] font-light tracking-[0.25em] uppercase cursor-pointer whitespace-nowrap"
                      style={{ 
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 300,
                        letterSpacing: '0.25em'
                      }}
                      whileHover={{ y: -2, letterSpacing: '0.3em' }}
                      transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                  
                  {/* Hover underline effect */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (hoveredItem === index || isActive(item.href)) ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent origin-center"
                  />
                </li>
              ))}
              </ul>
              
              {/* Language Selector */}
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

export default Header
