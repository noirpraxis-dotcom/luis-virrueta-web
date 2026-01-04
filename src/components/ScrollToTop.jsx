import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const scrollNow = () => {
      const lenis = window.__lenis
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { immediate: true, force: true })
        return
      }
      window.scrollTo(0, 0)
    }

    // Scroll instantáneo al cambiar de página
    scrollNow()

    // Backups: forzar nuevamente después de frames / layout
    requestAnimationFrame(scrollNow)
    setTimeout(scrollNow, 50)
  }, [pathname])

  return null
}

export default ScrollToTop
