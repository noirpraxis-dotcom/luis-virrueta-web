import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, MessageCircle, Brain } from 'lucide-react'
import { Link } from 'react-router-dom'

const BrandCTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <section 
      ref={ref}
      className="relative bg-black py-20 lg:py-28 overflow-hidden"
    >
      {/* Transición gradiente inferior para siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none z-10" />
      
      {/* Gradient background effects - Conectado con sección anterior */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#a855f7]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#d946ef]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Grid: Texto + Video */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Texto minimalista */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="space-y-8"
          >
            {/* Heading principal - más directo */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white tracking-tight font-display leading-tight"
            >
              Diseñamos{' '}
              <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent font-light">
                tu identidad visual
              </span>
            </motion.h2>

            {/* Subtitle simple */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/50 text-base lg:text-lg font-light leading-relaxed max-w-md"
            >
              Una marca que trasciende el inconsciente. No sólo se ve, se siente.
            </motion.p>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-1/2 my-8" />

            {/* Iconos minimalistas con info clave */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                <p className="text-white/60 text-sm lg:text-base font-light">
                  Psicología aplicada al diseño
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#d946ef]" />
                <p className="text-white/60 text-sm lg:text-base font-light">
                  Identidades que conectan emocionalmente
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#e879f9]" />
                <p className="text-white/60 text-sm lg:text-base font-light">
                  Marcas que tu competencia no puede replicar
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Video más cuadrado + caption */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto">
              {/* Video container con borde sutil */}
              <div className="relative rounded-2xl bg-gradient-to-br from-[#a855f7]/30 via-[#d946ef]/20 to-transparent p-[2px]">
                <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl relative" style={{ aspectRatio: '4/3' }}>
                  {/* Loading animation - Brain pulse */}
                  {!videoLoaded && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black z-10"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Brain className="w-12 h-12 text-[#a855f7]/60" />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* YouTube Video Embed */}
                  <iframe
                    src="https://www.youtube.com/embed/-Swi2UlM4JI?autoplay=1&mute=1&loop=1&playlist=-Swi2UlM4JI&controls=0&modestbranding=1&rel=0&showinfo=0"
                    title="Nuestro Trabajo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setVideoLoaded(true)}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Caption minimalista debajo del video */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/40 text-sm font-light text-center lg:text-right max-w-[480px] mx-auto lg:mx-0 lg:ml-auto"
            >
              Un poco de nuestro trabajo
            </motion.p>
          </motion.div>
        </div>

        {/* CTA Button - Visual y destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA */}
          <a href="https://wa.me/5215586953032" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-[#a855f7] to-[#d946ef] px-10 py-4 rounded-full text-white font-medium text-lg tracking-wide overflow-hidden shadow-lg shadow-[#a855f7]/30 hover:shadow-[#a855f7]/50 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                <span>Programar Videollamada</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Hover gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#c026d3]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </a>

          {/* Secondary CTA */}
          <Link to="/portfolio">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-transparent border border-[#d946ef]/30 hover:border-[#d946ef] px-8 py-4 rounded-full text-white font-light text-base tracking-wide transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-white/70 group-hover:text-white transition-colors">Ver Portafolio</span>
                <ArrowRight className="w-4 h-4 text-[#d946ef] group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Hover gradient fill */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#a855f7]/10 to-[#d946ef]/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm font-light"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
            <span>Consulta gratuita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d946ef]" />
            <span>Resultados garantizados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e879f9]" />
            <span>Soporte continuo</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BrandCTA
