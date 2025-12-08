import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll()
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 origin-left"
        style={{ scaleX }}
      />
      
      {/* Progress percentage badge - aparece después del 10% */}
      {progress > 10 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full"
        >
          <span className="text-xs font-medium text-white">{progress}%</span>
        </motion.div>
      )}
    </div>
  )
}

export default ReadingProgressBar
