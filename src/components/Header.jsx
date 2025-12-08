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
                {/* LUXMANIA - Con efecto de ondas animadas */}
                <div className="text-[2.2rem] font-bold tracking-wider font-display flex">
                  {/* LUX - Con efecto 3D MEJORADO en la X */}
                  <span className="text-white" style={{ letterSpacing: '0.1em' }}>
                    <span className="relative inline-block">LU</span>
                    <span className="relative inline-block">
                      {/* Capa 0 - Glow ultra extendido */}
                      <span className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent blur-2xl" style={{ transform: 'translateY(-5px) translateX(3px)', opacity: 0.6, fontSize: '1.15em' }}>X</span>
                      {/* Capa 1 - Glow azul/cyan más grande */}
                      <span className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-400 to-white bg-clip-text text-transparent blur-xl" style={{ transform: 'translateY(-4px) translateX(2.5px)', opacity: 0.8 }}>X</span>
                      {/* Capa 2 - Glow intermedio cyan */}
                      <span className="absolute inset-0 bg-gradient-to-br from-blue-300 via-cyan-300 to-white bg-clip-text text-transparent blur-lg" style={{ transform: 'translateY(-2px) translateX(1.5px)', opacity: 0.9 }}>X</span>
                      {/* Capa 3 - Glow morado/púrpura extendido */}
                      <span className="absolute inset-0 bg-gradient-to-tl from-purple-400 via-fuchsia-400 to-white bg-clip-text text-transparent blur-xl" style={{ transform: 'translateY(3px) translateX(-2.5px)', opacity: 0.8 }}>X</span>
                      {/* Capa 4 - Glow rosa intermedio */}
                      <span className="absolute inset-0 bg-gradient-to-tl from-pink-400 via-purple-300 to-white bg-clip-text text-transparent blur-lg" style={{ transform: 'translateY(2px) translateX(-1.5px)', opacity: 0.9 }}>X</span>
                      {/* Capa 5 - Glow púrpura ultra extendido */}
                      <span className="absolute inset-0 bg-gradient-to-tl from-purple-300 via-fuchsia-300 to-white bg-clip-text text-transparent blur-2xl" style={{ transform: 'translateY(4px) translateX(-3px)', opacity: 0.6, fontSize: '1.15em' }}>X</span>
                      {/* X principal blanca */}
                      <span className="relative text-white" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.7)' }}>X</span>
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
