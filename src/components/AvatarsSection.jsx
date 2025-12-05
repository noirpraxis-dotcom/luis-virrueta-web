import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain } from 'lucide-react'

const AvatarsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [showLoading, setShowLoading] = useState(true)

  const handleIframeLoad = () => {
    setTimeout(() => setShowLoading(false), 1500)
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
            {/* Video - usando iframe de YouTube con autoplay */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/XonEErWLLTA?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&enablejsapi=1&hd=1&loop=1&playlist=XonEErWLLTA"
              title="Avatares Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
            />

            {/* Loading animation */}
            {showLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-12 h-12 text-purple-400" />
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
