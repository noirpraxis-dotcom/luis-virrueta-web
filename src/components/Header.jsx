import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ToolsMenu from './ToolsMenu'

const Header = ({ menuItems, onMenuToggle, isMenuOpen }) => {
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
    <>
    {/* Header móvil delgado - Solo móvil y tablet */}
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-[100] lg:hidden"
    >
      <nav className="bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          {/* Logo Luis Virrueta */}
          <Link to="/">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer text-center"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              <div className="text-white font-bold text-lg md:text-xl leading-tight"
                style={{ letterSpacing: '0.05em' }}
              >
                Luis Virrueta
              </div>
              <div className="text-white/50 text-[0.45rem] md:text-[0.5rem] font-medium uppercase mt-0.5"
                style={{ letterSpacing: '0.3em' }}
              >
                Psicólogo · Psicoanalista
              </div>
            </motion.div>
          </Link>
          
          {/* Contenedor derecho: Tools + Hamburguesa */}
          <div className="flex items-center gap-3">
            <ToolsMenu />
            
            {/* Botón Hamburguesa Elegante */}
            <motion.button
              onClick={onMenuToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              aria-label="Toggle Menu"
            >
              <div className="relative flex flex-col items-center justify-center w-5 h-5">
                {/* Línea superior */}
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 7 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute top-0 w-full h-[1.5px] bg-white rounded-full origin-center"
                />
                
                {/* Línea media */}
                <motion.span
                  animate={{
                    opacity: isMenuOpen ? 0 : 1,
                    scaleX: isMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-white rounded-full"
                />
                
                {/* Línea inferior */}
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -7 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute bottom-0 w-full h-[1.5px] bg-white rounded-full origin-center"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </nav>
    </motion.header>

    {/* Header desktop - Solo desktop */}
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
    >
      {/* Orbs lumínicos elegantes morado/rosa alrededor del header - MÁS VISIBLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 40, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.12, 0.2, 0.12],
            x: [0, -30, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-[#d946ef] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.18, 0.1],
            x: [0, 20, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-[#a855f7] to-[#d946ef] rounded-full blur-3xl"
        />
      </div>

      <nav className="relative bg-black/70 backdrop-blur-md border-b border-white/5">
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
                {/* Luis Virrueta - Con efectos originales */}
                <div className="text-center">
                  {/* Luis Virrueta - Estilo chrome elegante */}
                  <div 
                    className="text-[2.2rem] font-bold tracking-wide font-display"
                    style={{
                      background: 'linear-gradient(135deg, #a8a9ad 0%, #ffffff 25%, #d4d4d8 45%, #fafafa 65%, #e4e4e7 85%, #ffffff 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.05em',
                      filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.25))'
                    }}
                  >
                    Luis Virrueta
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
                    Psicólogo · Psicoanalista
                  </motion.div>
                </div>
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
                      {item.special ? (
                        <motion.span
                          className="text-[0.8rem] uppercase flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5"
                          style={{ 
                            fontFamily: 'Space Grotesk, monospace',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            color: '#ffffff',
                            textShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 8px rgba(168,85,247,0.2)',
                          }}
                          whileHover={{
                            textShadow: '0 0 30px rgba(255,255,255,0.6), 0 0 15px rgba(168,85,247,0.4)',
                            letterSpacing: '0.2em',
                            borderColor: 'rgba(255,255,255,0.3)',
                            backgroundColor: 'rgba(255,255,255,0.1)'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          {item.name}
                        </motion.span>
                      ) : (
                        <motion.span
                          className="text-[0.8rem] uppercase"
                          style={{ 
                            fontFamily: 'Space Grotesk, monospace',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            color: '#ffffff',
                            textShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 8px rgba(168,85,247,0.2)',
                          }}
                          whileHover={{
                            textShadow: '0 0 30px rgba(255,255,255,0.6), 0 0 15px rgba(168,85,247,0.4)',
                            letterSpacing: '0.2em'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                  
                  {/* Animated indicator: destello continuo solo cuando está activo */}
                  {isActive(item.href) && (
                    <motion.div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center w-full">
                      {/* Punto central que pulsa continuamente */}
                      <motion.div
                        animate={{ 
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute w-1.5 h-1.5 bg-white rounded-full"
                        style={{
                          boxShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(168,85,247,0.5)'
                        }}
                      />
                      
                      {/* Línea que se contrae y expande desde el centro */}
                      <motion.div
                        animate={{ 
                          scaleX: [0.3, 1, 0.3],
                          opacity: [0.4, 1, 0.4]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent origin-center"
                        style={{
                          boxShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 16px rgba(217,70,239,0.4)'
                        }}
                      />
                    </motion.div>
                  )}
                  
                  {/* Hover underline - solo cuando no está activo */}
                  {hoveredItem === index && !isActive(item.href) && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent origin-center"
                    />
                  )}
                </li>
              ))}
              </ul>
              
              {/* Tools Menu */}
              <ToolsMenu />
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
    </>
  )
}

export default Header
