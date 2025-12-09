import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll instantáneo al cambiar de página
    // Forzar scroll a 0 inmediatamente sin animación
    window.scrollTo(0, 0)
    
    // Backup: forzar nuevamente después de un frame
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }, [pathname])

  return null
}

export default ScrollToTop
