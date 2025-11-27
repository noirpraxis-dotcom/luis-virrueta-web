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
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
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
    
    // Agregar listeners a todos los elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
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
      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-white"
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        />
      </motion.div>

      {/* Cursor Trail (Estela) */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-white"
          animate={{
            scale: isHovering ? 0 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
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
    </>
  )
}

export default CustomCursor
