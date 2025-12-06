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
                {/* LUXMANIA - Con efecto de ondas animadas */}
                <div className="text-[2.2rem] font-bold tracking-wider font-display flex">
                  {/* LUX - Con efecto 3D en la X */}
                  <span className="text-white" style={{ letterSpacing: '0.1em' }}>
                    <span className="relative inline-block">LU</span>
                    <span className="relative inline-block">
                      <span className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent blur-md" style={{ transform: 'translateY(-2px) translateX(1px)' }}>X</span>
                      <span className="absolute inset-0 bg-gradient-to-tl from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(1px) translateX(-0.5px)' }}>X</span>
                      <span className="relative text-white">X</span>
                    </span>
                  </span>
                  {/* MANIA - Animado con ondas de colores superpuestas */}
                  <span className="relative inline-block" style={{ letterSpacing: '0.1em' }}>
                    {/* Capa 1 - Onda azul */}
                    <motion.span
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, transparent 40%, #3b82f6 50%, transparent 60%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      className="absolute inset-0"
                    >
                      MANIA
                    </motion.span>
                    
                    {/* Capa 2 - Onda fucsia */}
                    <motion.span
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%']
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5
                      }}
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, transparent 40%, #d946ef 50%, transparent 60%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      className="absolute inset-0"
                    >
                      MANIA
                    </motion.span>
                    
                    {/* Capa 3 - Onda morada */}
                    <motion.span
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%']
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1
                      }}
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, transparent 40%, #8b5cf6 50%, transparent 60%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      className="absolute inset-0"
                    >
                      MANIA
                    </motion.span>
                    
                    {/* Texto base en blanco */}
                    <span className="relative text-white">MANIA</span>
                  </span>
                </div>
                
                {/* Tagline - Efecto platino/chrome animado */}
                <motion.div 
                  className="text-[0.5rem] uppercase font-bold tracking-[0.4em] text-center -mt-0.5 font-mono"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #71717a 0%, #fafafa 20%, #ffffff 40%, #fafafa 60%, #71717a 80%, #52525b 100%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.4em',
                    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
                  }}
                >
                  Psych × Design × Tech
                </motion.div>
                
                {/* Underline decorativo */}
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
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
                      className="relative cursor-pointer whitespace-nowrap"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <motion.span
                        className="text-[0.8rem] uppercase"
                        style={{ 
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 400,
                          letterSpacing: '0.2em',
                          background: 'linear-gradient(135deg, #ffffff 0%, #e4e4e7 30%, #ffffff 60%, #d4d4d8 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.15))',
                        }}
                        whileHover={{
                          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))',
                          letterSpacing: '0.25em'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
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
