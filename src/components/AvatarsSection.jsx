import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const AvatarsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative pt-16 pb-16 lg:pt-20 lg:pb-20 px-6 lg:px-20 overflow-hidden bg-black">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#a855f7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#d946ef]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Grid de dos columnas */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Columna 1: Avatares */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col items-center"
          >
            {/* Título */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl lg:text-5xl font-bold mb-8 font-display text-white text-center"
              style={{ 
                letterSpacing: '0.05em',
                fontWeight: 300,
                textTransform: 'uppercase'
              }}
            >
              Avatares
            </motion.h2>

            {/* Video vertical sin borde */}
            <div className="relative mx-auto w-full max-w-[380px] aspect-[9/16]">
              {/* Video */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative w-full h-full flex items-center justify-center">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/XonEErWLLTA?autoplay=0&loop=1&playlist=XonEErWLLTA&controls=1&modestbranding=1&rel=0"
                    title="Avatares"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Texto elegante debajo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 text-white/40 text-sm font-light tracking-wider uppercase text-center"
            >
              Identidades digitales con personalidad
            </motion.p>
          </motion.div>

          {/* Columna 2: Logotipos Animados */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Título */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold mb-8 font-display text-white text-center"
              style={{ 
                letterSpacing: '0.05em',
                fontWeight: 300,
                textTransform: 'uppercase'
              }}
            >
              Logotipos Animados
            </motion.h2>

            {/* Video vertical sin borde */}
            <div className="relative mx-auto w-full max-w-[380px] aspect-[9/16]">
              {/* Video - placeholder por ahora */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                  {/* Placeholder - reemplazar con el video que proporciones */}
                  <div className="text-white/30 text-center p-6">
                    <p className="text-sm font-light">Video próximamente</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto elegante debajo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 text-white/40 text-sm font-light tracking-wider uppercase text-center"
            >
              Logotipos que cobran vida
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AvatarsSection
