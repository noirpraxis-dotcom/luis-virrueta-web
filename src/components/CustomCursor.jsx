import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * CustomCursor Component
 * Cursor personalizado premium con efecto magnético
 * Estilo usado en sitios de Apple, Awwwards winners
 */
const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const [sparkles, setSparkles] = useState([])
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Spring más rápido y responsivo
  const springConfig = { damping: 20, stiffness: 400 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      // Centrar el cursor correctamente (pincel es 32x32, centrar en 16,16)
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    // Crear chispas mágicas al hacer click
    const createSparkles = (e) => {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        angle: (i * Math.PI * 2) / 8,
      }))
      
      setSparkles(prev => [...prev, ...newSparkles])
      
      // Limpiar chispas después de la animación
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)))
      }, 1000)
    }

    const handleMouseEnter = (e) => {
      const target = e.target
      
      // Detectar elementos interactivos
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true)
        
        // Texto personalizado si tiene data-cursor-text
        const text = target.getAttribute('data-cursor-text') || 
                     target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text')
        if (text) {
          setCursorText(text)
        }
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setCursorText('')
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('click', createSparkles)
    
    // Agregar listeners a todos los elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('click', createSparkles)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [cursorX, cursorY])

  // Solo mostrar en desktop
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    setIsDesktop(window.innerWidth > 1024)
  }, [])

  if (!isDesktop) return null

  return (
    <>
      {/* Premium Brush Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            scale: isHovering ? 1.3 : 1,
            rotate: isHovering ? 15 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
        >
          {/* Brush handle */}
          <path
            d="M8 24L16 16L20 12L24 8"
            stroke="url(#brushGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Brush bristles */}
          <path
            d="M24 8L28 4M20 12L24 8M16 16L20 12"
            stroke="url(#brushGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Brush tip */}
          <circle
            cx="8"
            cy="24"
            r="3"
            fill="url(#brushGradient)"
            opacity="0.8"
          />
          <circle
            cx="8"
            cy="24"
            r="5"
            fill="url(#brushGradient)"
            opacity="0.3"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>

      {/* Sparkle Trail Effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isHovering ? 0 : [0.8, 1.2, 0.8],
            opacity: isHovering ? 0 : [0.4, 0.7, 0.4],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Sparkle particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 2) * 15],
                y: [0, Math.sin(i * Math.PI / 2) * 15],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Texto del cursor (si existe) */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[10000] bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {cursorText}
        </motion.div>
      )}

      {/* Chispas Mágicas al Click */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="fixed pointer-events-none z-[9997]"
          initial={{
            x: sparkle.x,
            y: sparkle.y,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: sparkle.x + Math.cos(sparkle.angle) * 80,
            y: sparkle.y + Math.sin(sparkle.angle) * 80,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {/* Estrella mágica amarilla/dorada */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill="url(#sparkleGradient)"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "linear" }}
            />
            <motion.path
              d="M12 5L13.5 10.5L19 12L13.5 13.5L12 19L10.5 13.5L5 12L10.5 10.5L12 5Z"
              fill="#FCD34D"
              opacity="0.8"
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 0.8, ease: "linear" }}
            />
            <defs>
              <radialGradient id="sparkleGradient">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="50%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#F59E0B" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </>
  )
}

export default CustomCursor
