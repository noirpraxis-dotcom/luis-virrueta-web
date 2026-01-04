import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

/**
 * SmoothScroll Component
 * Implementa smooth scroll cinematográfico usando Lenis
 * Usado por sitios premium ganadores de Awwwards
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Inicializar Lenis con configuración premium
    const lenis = new Lenis({
      duration: 1.2,           // Duración de scroll (segundos)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing suave
      orientation: 'vertical', // Dirección
      gestureOrientation: 'vertical',
      smoothWheel: true,       // Smooth con mouse wheel
      wheelMultiplier: 1,      // Velocidad del wheel
      smoothTouch: false,      // No smooth en mobile (mejor UX)
      touchMultiplier: 2,
      infinite: false,
    })

    // Exponer Lenis para scroll programático (route changes, TOC, etc.)
    window.__lenis = lenis

    // RAF loop para animaciones
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (window.__lenis === lenis) {
        delete window.__lenis
      }
      lenis.destroy()
    }
  }, [])

  return children
}

export default SmoothScroll
