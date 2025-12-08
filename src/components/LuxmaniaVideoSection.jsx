import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Palette, Code } from 'lucide-react'

const LuxmaniaVideoSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative bg-black py-16 lg:py-24 overflow-hidden">
      {/* Orbs sutiles - Solo blanco minimal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Texto elegante y minimalista */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            {/* Título principal - LUXMANIA */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl lg:text-8xl font-light text-white mb-6 tracking-tight font-display leading-[1.05]"
            >
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255, 255, 255, 0.1)',
                    '0 0 30px rgba(255, 255, 255, 0.3)',
                    '0 0 20px rgba(255, 255, 255, 0.1)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-white"
              >
                LUXMANIA
              </motion.span>
            </motion.h2>

            {/* Pregunta pequeña */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/50 text-sm lg:text-base font-light uppercase tracking-[0.3em] mb-8"
            >
              ¿Cómo construimos marcas?
            </motion.p>

            {/* Mensaje central */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/70 text-xl lg:text-2xl font-extralight tracking-wide mb-4 max-w-xl leading-relaxed"
            >
              Diseñamos emociones.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-white/50 text-base lg:text-lg font-light leading-relaxed mb-10 max-w-xl"
            >
              Creamos identidades visuales que{' '}
              <span className="text-white/70">se sienten antes de entenderse</span>.
            </motion.p>

            {/* Puntos clave minimalistas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-4 mb-10"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                <p className="text-white/50 text-base font-light">Un color dirige la atención</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                <p className="text-white/50 text-base font-light">Una forma despierta emociones</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                <p className="text-white/50 text-base font-light">El orden visual guía el deseo</p>
              </div>
            </motion.div>

            {/* Fórmula con iconos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm text-white/60 font-light tracking-wide">Psicología</span>
              </div>

              <span className="text-white/30 text-xs mx-1">×</span>

              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm text-white/60 font-light tracking-wide">Diseño</span>
              </div>

              <span className="text-white/30 text-xs mx-1">×</span>

              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm text-white/60 font-light tracking-wide">Tecnología</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Video vertical elegante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative mx-auto w-full max-w-[400px]">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-black shadow-2xl">
                {/* YouTube Video Embed vertical */}
                <iframe
                  src="https://www.youtube.com/embed/OUsF8K7G810?autoplay=1&mute=1&loop=1&playlist=OUsF8K7G810&controls=0&modestbranding=1&rel=0&showinfo=0"
                  title="Luxmania - Cómo construimos marcas"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge debajo del video */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-6 flex items-center justify-center gap-3"
              >
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <p className="text-white/50 text-xs font-light tracking-widest uppercase">
                  Identidades con Alma
                </p>
                <div className="w-1 h-1 rounded-full bg-white/40" />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default LuxmaniaVideoSection
