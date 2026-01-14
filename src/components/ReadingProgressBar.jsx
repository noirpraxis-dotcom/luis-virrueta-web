import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const ReadingProgressBar = ({ accentKey = 'purple', contentRef }) => {
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
    if (progress < 1) return 'Baja para leer'
    if (progress < 20) return 'Ya diste el primer paso'
    if (progress < 40) return 'Vas descubriendo algo nuevo'
    if (progress < 60) return 'La mitad ya es tuya'
    if (progress < 80) return 'Casi lo tienes dominado'
    if (progress < 95) return 'Un último empujón'
    return '¡Lo lograste!'
  }, [progress])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Mensaje centrado con porcentaje */}
      <div className="flex items-center justify-center mb-2">
        <div className="px-4 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
          <span className="text-[11px] sm:text-xs text-white/80">{message}</span>
          <span className="text-[11px] sm:text-xs font-bold text-white/90">{progress}%</span>
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
