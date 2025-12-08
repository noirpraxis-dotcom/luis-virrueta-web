import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, MessageCircle, Brain } from 'lucide-react'
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
      
      {/* Gradient background effects - Conectado con sección anterior */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#a855f7]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#d946ef]/10 rounded-full blur-3xl" />
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
            {/* Heading principal - Copy claro y enganchador */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white tracking-tight font-display leading-[1.1]"
            >
              Diseñamos desde cero{' '}
              <span className="bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#e879f9] bg-clip-text text-transparent font-light">
                tu marca
              </span>
            </motion.h2>

            {/* Subtitle con mejor tecnología */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/70 text-lg lg:text-xl font-light leading-relaxed max-w-lg"
            >
              Combinando lo mejor de la{' '}
              <span className="text-[#a855f7] font-normal">psicología</span>,{' '}
              <span className="text-[#d946ef] font-normal">diseño</span> y{' '}
              <span className="text-[#e879f9] font-normal">tecnología</span>
            </motion.p>

            <div className="h-px bg-gradient-to-r from-[#a855f7]/20 via-[#d946ef]/20 to-transparent w-2/3" />

            {/* Badges elegantes con iconos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <div className="group relative overflow-hidden px-5 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#a855f7]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#a855f7]" />
                  <span className="text-white/70 text-sm font-light">Psicología</span>
                </div>
              </div>

              <div className="group relative overflow-hidden px-5 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#d946ef]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d946ef]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#d946ef]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span className="text-white/70 text-sm font-light">Diseño</span>
                </div>
              </div>

              <div className="group relative overflow-hidden px-5 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#e879f9]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#e879f9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#e879f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white/70 text-sm font-light">Tecnología</span>
                </div>
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
            <div className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">
              {/* Sombras animadas premium - más extensas y con cambio de intensidad */}
              <motion.div
                className="absolute -inset-12 rounded-3xl blur-[80px]"
                animate={{
                  background: [
                    'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)',
                    'radial-gradient(ellipse at 50% 75%, rgba(217,70,239,0.6), rgba(232,121,249,0.4), rgba(168,85,247,0.25), transparent)',
                    'radial-gradient(ellipse at 50% 85%, rgba(232,121,249,0.55), rgba(192,38,211,0.4), rgba(217,70,239,0.22), transparent)',
                    'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)'
                  ],
                  opacity: [0.4, 0.6, 0.5, 0.4]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Segunda capa de sombra inferior más intensa */}
              <motion.div
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-40 rounded-full blur-[60px]"
                animate={{
                  background: [
                    'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.4), rgba(217,70,239,0.25), transparent)',
                    'radial-gradient(ellipse at 50% 50%, rgba(217,70,239,0.5), rgba(192,38,211,0.3), transparent)',
                    'radial-gradient(ellipse at 50% 50%, rgba(232,121,249,0.45), rgba(168,85,247,0.28), transparent)',
                    'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.4), rgba(217,70,239,0.25), transparent)'
                  ],
                  opacity: [0.5, 0.7, 0.6, 0.5]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Video container con sombras sutiles */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(168,85,247,0.4),0_15px_45px_-15px_rgba(217,70,239,0.3)] hover:shadow-[0_25px_70px_-20px_rgba(168,85,247,0.5),0_20px_55px_-15px_rgba(217,70,239,0.4)] transition-shadow duration-500">
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
                        <Brain className="w-12 h-12 text-[#a855f7]/60" />
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

                  {/* Badge premium dentro del video - inferior derecho */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute bottom-4 right-4 z-20"
                  >
                    <motion.div 
                      className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl whitespace-nowrap"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.7)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-4 h-4 text-[#a855f7] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-white text-xs font-medium">Una muestra de nuestro trabajo</span>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d946ef]" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
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
              {/* Efecto de brillo interno animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-200%', '200%']
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              />
              
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
