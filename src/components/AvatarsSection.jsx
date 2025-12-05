import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'

const AvatarsSection = () => {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const handlePlay = () => {
    setShowLoading(true)
    setTimeout(() => setShowLoading(false), 2000)
    setIsPlaying(true)
  }

  return (
    <section ref={ref} className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 px-6 lg:px-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header elegante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold mb-4 font-display text-white"
            style={{ 
              letterSpacing: '0.05em',
              fontWeight: 300,
              textTransform: 'uppercase'
            }}
          >
            Avatares
          </motion.h2>
        </motion.div>

        {/* Video Container - Vertical (9:16) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative max-w-[500px] mx-auto"
        >
          <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-black">
            {/* Video - usando iframe de YouTube */}
            <iframe
              ref={videoRef}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/XonEErWLLTA?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1&enablejsapi=1&hd=1&loop=1&playlist=XonEErWLLTA`}
              title="Avatares Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/70 pointer-events-none" />
            
            {/* Fade out radial en los bordes */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 50%, rgba(0,0,0,0.8) 100%)'
              }}
            />

            {/* Botón de Play custom - solo visible si no está reproduciendo */}
            {!isPlaying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group hover:bg-white/20 transition-all duration-300">
                  <Play className="w-8 h-8 lg:w-10 lg:h-10 text-white fill-white ml-1" />
                </div>
              </motion.button>
            )}

            {/* Loading animation */}
            {showLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-purple-400" />
                </motion.div>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-4 text-white text-sm font-light"
                >
                  Cargando...
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Texto elegante debajo del video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm font-light tracking-wider uppercase">
            Identidades digitales con personalidad
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default AvatarsSection
