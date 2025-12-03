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
              {/* Sombras animadas suaves y difuminadas */}
              <motion.div
                className="absolute -inset-6 rounded-3xl blur-3xl opacity-25"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.3), rgba(217,70,239,0.2), transparent)',
                    'radial-gradient(circle at 50% 50%, rgba(217,70,239,0.3), rgba(232,121,249,0.2), transparent)',
                    'radial-gradient(circle at 50% 50%, rgba(232,121,249,0.3), rgba(168,85,247,0.2), transparent)',
                    'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.3), rgba(217,70,239,0.2), transparent)'
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Video container con sombras sutiles */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_15px_45px_-15px_rgba(168,85,247,0.25),0_10px_30px_-12px_rgba(217,70,239,0.18)] hover:shadow-[0_20px_55px_-15px_rgba(168,85,247,0.35),0_15px_40px_-12px_rgba(217,70,239,0.28)] transition-shadow duration-500">
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

                  {/* YouTube Video Embed */}
                  <iframe
                    src="https://www.youtube.com/embed/-Swi2UlM4JI?autoplay=1&mute=1&loop=1&playlist=-Swi2UlM4JI&controls=0&modestbranding=1&rel=0&showinfo=0"
                    title="Nuestro Trabajo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setVideoLoaded(true)}
                    className="w-full h-full object-cover scale-[1.01]"
                  />
                </div>
              </div>
            </div>

            {/* Caption elegante con ícono y flecha animada */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-end gap-3 max-w-[500px] mx-auto lg:mx-0 lg:ml-auto px-2"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10">
                <svg className="w-4 h-4 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-white/50 text-sm font-light">Un poco de nuestro trabajo</span>
                <motion.svg 
                  className="w-4 h-4 text-[#d946ef]"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </motion.svg>
              </div>
            </motion.div>
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
