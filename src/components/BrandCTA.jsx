import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, MessageCircle, Brain, Code } from 'lucide-react'
import { Link } from 'react-router-dom'

const BrandCTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef(null)
  
  // Smooth loop - reinicia antes del final para evitar traba visual
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleTimeUpdate = () => {
      // Reinicia 0.2 segundos antes del final para loop suave
      if (video.duration - video.currentTime < 0.2) {
        video.currentTime = 0
      }
    }
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  return (
    <section 
      ref={ref}
      className="relative bg-black py-16 lg:py-20 overflow-hidden"
    >
      {/* Transición gradiente inferior para siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none z-10" />
      
      {/* Gradient background effects - Minimalista blanco */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Grid: Texto + Video */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-16">
          
          {/* Left: Texto potente y claro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="space-y-10"
          >
            {/* Subtitle pequeño - Similar al Hero */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-white/70 text-2xl lg:text-4xl font-extralight tracking-[0.15em] mb-6 uppercase leading-tight"
            >
              Diseñamos desde cero
            </motion.p>

            {/* Heading principal - Estilo Hero minimalista */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl sm:text-7xl lg:text-9xl font-light text-white tracking-[0.08em] font-display leading-[0.95] mb-10 uppercase"
            >
              <span className="inline-block relative">
                <motion.span
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-white via-white to-white bg-clip-text text-transparent blur-lg"
                >
                  T
                </motion.span>
                <span className="relative text-white">T</span>
              </span>
              u{' '}
              <span className="inline-block relative">
                M
              </span>
              <span className="inline-block relative">
                <motion.span
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                  className="absolute inset-0 bg-gradient-to-tl from-white via-white to-white bg-clip-text text-transparent blur-lg"
                >
                  a
                </motion.span>
                <span className="relative text-white">a</span>
              </span>
              rca
            </motion.h2>

            {/* Fórmula con iconos - Estilo Hero */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-3 lg:gap-4 flex-wrap mb-8"
            >
              {/* Psicología */}
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-white/60" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Psicología
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Diseño */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Diseño
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Tecnología */}
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-white/60" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Tecnología
                </span>
              </div>
            </motion.div>

            {/* Línea decorativa animada */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative h-px mx-auto w-80 overflow-hidden mb-8"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ transformOrigin: 'center' }}
              />
            </motion.div>


          </motion.div>

          {/* Right: Video más cuadrado + caption */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">
              {/* Video container simple - sin sombras de colores */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <div className="relative w-full aspect-[16/11] overflow-hidden bg-black">
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
                        <Brain className="w-12 h-12 text-white/40" />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Video Local con Loop Ultra Suavizado - Sin trabas */}
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={() => setVideoLoaded(true)}
                    className="w-full h-full object-cover scale-[1.01]"
                  >
                    <source src="/faro video.mp4" type="video/mp4" />
                  </video>


                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Button - Estilo minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA - Blanco */}
          <a href="https://wa.me/5215586953032" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 bg-white text-black font-light rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_80px_rgba(255,255,255,0.3)]"
            >
              {/* Efecto shine continuo */}
              <motion.div
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
              <span className="relative z-10 flex items-center gap-3 text-base tracking-wide">
                <MessageCircle className="w-5 h-5" />
                <span>Programar Videollamada</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </a>

          {/* Secondary CTA - Border blanco */}
          <Link to="/portfolio">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 text-white font-light rounded-full border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm transition-opacity duration-300 group-hover:bg-white/10" />
              <span className="relative z-10 flex items-center gap-3 text-base tracking-wide">
                <span>Ver Portafolio</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BrandCTA
