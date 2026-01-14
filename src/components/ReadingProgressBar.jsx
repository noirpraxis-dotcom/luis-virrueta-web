import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const ReadingProgressBar = ({ accentKey = 'purple', contentRef, onToggleTOC }) => {
  const progressValue = useMotionValue(0)
  const scaleX = useSpring(progressValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (!contentRef?.current) return

    let rafId = null

    const updateProgress = () => {
      const element = contentRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 0
      const scrollY = window.scrollY || window.pageYOffset || 0

      const elementTop = rect.top + scrollY
      const elementBottom = rect.bottom + scrollY

      const start = elementTop - viewportHeight
      const end = elementBottom - viewportHeight
      const total = Math.max(1, end - start)

      const raw = (scrollY - start) / total
      const clamped = Math.max(0, Math.min(1, raw))

      progressValue.set(clamped)
      setProgress(Math.round(clamped * 100))
    }

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateProgress)
    }

    const lenis = window.__lenis
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', onScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const resizeObserver = new ResizeObserver(() => onScroll())
    resizeObserver.observe(contentRef.current)

    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', onScroll)
      }
      resizeObserver.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [contentRef, progressValue])

  const colorMap = {
    purple: { from: '#9333ea', to: '#c026d3' },
    red: { from: '#ef4444', to: '#db2777' },
    emerald: { from: '#10b981', to: '#0d9488' },
    amber: { from: '#f59e0b', to: '#ea580c' },
    indigo: { from: '#6366f1', to: '#4f46e5' },
    blue: { from: '#3b82f6', to: '#2563eb' },
    cyan: { from: '#06b6d4', to: '#0891b2' },
    pink: { from: '#ec4899', to: '#db2777' },
    orange: { from: '#f97316', to: '#dc2626' },
    slate: { from: '#64748b', to: '#475569' },
    lime: { from: '#65a30d', to: '#16a34a' },
    violet: { from: '#7c3aed', to: '#9333ea' }
  }

  const colors = colorMap[accentKey] || colorMap.purple

  const message = useMemo(() => {
    if (progress < 1) return 'Baja para empezar'
    if (progress < 15) return 'El inicio ya ocurrió'
    if (progress < 40) return 'Esto avanza'
    if (progress < 50) return 'Estás cerca de la mitad'
    if (progress < 70) return 'Más para allá que para acá'
    if (progress < 80) return 'No hay vuelta atrás'
    if (progress < 90) return 'Estás en la recta final'
    if (progress < 100) return 'A un pelín'
    return '¡Felicidades!'
  }, [progress])

  const isComplete = progress >= 100

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
      {/* Contenedor con botón de contenido y mensaje */}
      <div className="flex items-center justify-center mb-2 gap-3 px-4">
        {/* Botón de contenido a la izquierda */}
        <button
          onClick={onToggleTOC}
          className="pointer-events-auto w-9 h-9 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center hover:border-white/40 transition-all duration-300 shadow-lg"
          style={{
            background: `linear-gradient(to bottom right, ${colors.from}33, ${colors.to}33)`
          }}
          aria-label="Tabla de contenidos"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mensaje con efecto de relleno */}
        <div className="relative px-4 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full overflow-hidden">
          {/* Relleno gradiente que crece */}
          <div
            className="absolute inset-0 opacity-50 transition-all duration-300"
            style={{
              background: isComplete 
                ? 'linear-gradient(90deg, #a855f7, #d946ef, #ec4899, #f97316, #fbbf24, #84cc16, #22d3ee, #60a5fa)'
                : `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
              width: `${progress}%`,
              animation: isComplete ? 'rainbow 2s ease-in-out infinite' : 'none'
            }}
          />
          <div className="relative flex items-center gap-2">
            <span className="text-[11px] sm:text-xs text-white/90 font-medium">{message}</span>
            <span className="text-[11px] sm:text-xs font-bold text-white">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="h-[2px] origin-left"
        style={{
          scaleX,
          background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`
        }}
      />
    </div>
  )
}

export default ReadingProgressBar
