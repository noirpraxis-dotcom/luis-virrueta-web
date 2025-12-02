import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, Bot, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const AvatarWelcome = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative bg-black py-12 lg:py-16 overflow-hidden"
    >
      {/* Transición gradiente superior desde sección anterior */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-black/50 to-black pointer-events-none z-10" />
      
      {/* Gradient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#a855f7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#d946ef]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Two column layout - desktop side by side, mobile stacked */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left: Content - CINEMÁTICO Y MINIMALISTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            {/* Eyebrow - minimal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <Bot className="w-5 h-5 text-[#a855f7]" strokeWidth={1.5} />
              <p className="text-[#d946ef]/70 text-xs font-mono uppercase tracking-[0.3em]">
                Bienvenida
              </p>
            </motion.div>

            {/* Main heading - Tipografía elegante */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-extralight text-white mb-12 tracking-tight font-display leading-tight"
            >
              Nuestros Avatares te dan la{' '}
              <span className="block lg:inline bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#e879f9] bg-clip-text text-transparent font-light">
                Bienvenida
              </span>
            </motion.h2>

            {/* Description - Enfocado en psicología/diseño/tech */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/60 text-lg lg:text-xl font-light leading-relaxed mb-12 max-w-xl"
            >
              Presiona play. Descubre el aspecto cinemático que se logra cuando combinamos{' '}
              <span className="text-[#a855f7]">psicología</span>,{' '}
              <span className="text-[#d946ef]">diseño</span> y{' '}
              <span className="text-[#e879f9]">tecnología</span>{' '}
              de vanguardia.
            </motion.p>

            {/* CTA Button - minimalista */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/servicios/avatares-ia">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-transparent border border-[#d946ef]/30 hover:border-[#d946ef] px-8 py-3 rounded-full text-white font-light text-base tracking-wide transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-white/70 group-hover:text-white transition-colors">Explorar servicio</span>
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
          </motion.div>

          {/* Right: Rectangular vertical video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Rectangular vertical video container */}
            <div className="relative mx-auto w-full max-w-[380px] aspect-[9/16]">
              {/* Static gradient ring - sin rotación */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#a855f7] via-[#d946ef] to-[#e879f9] p-[3px]">
                <div className="w-full h-full rounded-3xl bg-black" />
              </div>

              {/* Video */}
              <div className="absolute inset-[3px] rounded-3xl overflow-hidden border-4 border-black shadow-2xl">
                <div className="relative w-full h-full flex items-center justify-center">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/XonEErWLLTA?autoplay=0&loop=1&playlist=XonEErWLLTA&controls=1&modestbranding=1&rel=0"
                    title="Welcome to LUXMANIA"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Floating particles */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-[#d946ef]/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#e879f9]/20 rounded-full blur-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AvatarWelcome
