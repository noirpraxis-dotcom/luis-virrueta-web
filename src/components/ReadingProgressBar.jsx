import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const ReadingProgressBar = ({ accentKey = 'purple', contentRef, onToggleTOC }) => {
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start end', 'end end']
  })
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setProgress(Math.round(latest * 100))
    })
  }, [scrollYProgress])

  const colorMap = {
    purple: { from: '#a855f7', to: '#d946ef' },
    red: { from: '#f87171', to: '#ec4899' },
    emerald: { from: '#34d399', to: '#14b8a6' },
    amber: { from: '#fbbf24', to: '#f97316' },
    indigo: { from: '#818cf8', to: '#6366f1' },
    blue: { from: '#60a5fa', to: '#3b82f6' },
    cyan: { from: '#22d3ee', to: '#14b8a6' },
    pink: { from: '#f472b6', to: '#ec4899' },
    orange: { from: '#f97316', to: '#ef4444' },
    slate: { from: '#94a3b8', to: '#64748b' },
    lime: { from: '#84cc16', to: '#22c55e' },
    violet: { from: '#8b5cf6', to: '#a855f7' }
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
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Contenedor con botón de contenido y mensaje */}
      <div className="flex items-center justify-center mb-2 gap-3">
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
            className="absolute inset-0 opacity-30 transition-all duration-300"
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
