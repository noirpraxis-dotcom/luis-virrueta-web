import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Brain, Palette, Code, Play, Volume2, Gem } from 'lucide-react'

const LuxmaniaVideoSection = () => {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

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
            {/* Título principal - LUXMANIA con L y última A brillosas */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl lg:text-8xl font-light text-white mb-6 tracking-[0.08em] font-display leading-[1.05]"
            >
              <span className="inline-block relative">
                {/* L brillosa */}
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-white via-white to-white bg-clip-text text-transparent blur-lg"
                >
                  L
                </motion.span>
                <span className="relative text-white">L</span>
              </span>
              UXMANI
              <span className="inline-block relative">
                {/* Última A brillosa */}
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute inset-0 bg-gradient-to-tl from-white via-white to-white bg-clip-text text-transparent blur-lg"
                >
                  A
                </motion.span>
                <span className="relative text-white">A</span>
              </span>
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

            {/* Puntos clave minimalistas - versión original */}
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

          {/* Right: Video vertical con play button funcional - ALINEADO CON TÍTULO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative flex items-start justify-center lg:pt-16"
          >
            <div className="relative mx-auto w-full max-w-[400px]">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-black shadow-2xl">
                {/* YouTube iframe - se actualiza el src cuando se hace play */}
                <iframe
                  ref={videoRef}
                  src={`https://www.youtube.com/embed/OUsF8K7G810?${isPlaying ? 'autoplay=1&mute=0' : 'autoplay=0&mute=1'}&loop=1&playlist=OUsF8K7G810&controls=1&modestbranding=1&rel=0&showinfo=0`}
                  title="Luxmania - Cómo construimos marcas"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={`w-full h-full object-cover transition-all duration-500 ${!isPlaying ? 'opacity-40 blur-sm scale-105' : 'opacity-100'}`}
                />

                {/* Overlay con botón play y copy */}
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 flex flex-col items-center justify-center cursor-pointer z-10"
                    onClick={handlePlay}
                  >
                    {/* Copy arriba del botón */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-center mb-8 px-6"
                    >
                      <p className="text-white text-lg lg:text-xl font-light mb-2 leading-relaxed">
                        Descubre qué podemos hacer
                      </p>
                      <p className="text-white/70 text-base font-light">
                        por tu marca
                      </p>
                    </motion.div>

                    {/* Botón Play */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative group/btn mb-8"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover/btn:bg-white/30 transition-colors" />
                      <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/40 rounded-full flex items-center justify-center group-hover/btn:border-white/60 group-hover/btn:bg-white/20 transition-all">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" strokeWidth={1.5} />
                      </div>
                    </motion.button>

                    {/* Badge con volumen */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-black/70 backdrop-blur-md border border-white/30 rounded-full">
                        <Volume2 className="w-4 h-4 text-white animate-pulse" strokeWidth={1.5} />
                        <span className="text-xs text-white font-light tracking-wide">
                          Sube el volumen
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Badge debajo del video - centrado y más elegante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-6 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full">
                  <Gem className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-xs text-white/70 font-light tracking-wide uppercase">
                    Diseño Premium
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default LuxmaniaVideoSection
