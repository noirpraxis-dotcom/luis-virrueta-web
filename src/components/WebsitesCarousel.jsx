import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain } from 'lucide-react'

const WebsitesCarousel = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <section ref={ref} className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 px-6 lg:px-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header elegante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Subtítulo superior con borde */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block text-xs uppercase tracking-[0.3em] text-white/70 font-light mb-6 px-4 py-2 border border-white/30 rounded-full"
          >
            Dev • UI/UX • Responsive
          </motion.p>

          {/* Título principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold mb-6 font-display text-white"
            style={{ 
              letterSpacing: '0.05em',
              fontWeight: 300
            }}
          >
            Sitios <span className="italic font-extralight">Web</span>
          </motion.h2>

          {/* Subtítulo inferior - pregunta provocativa */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base lg:text-lg text-white/60 font-extralight italic max-w-2xl mx-auto"
            style={{ letterSpacing: '0.08em' }}
          >
            ¿Tu sitio web refleja la experiencia que prometes?
          </motion.p>
        </motion.div>

        {/* Video Container - Horizontal grande */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Sombras animadas premium */}
          <motion.div
            className="absolute -inset-12 rounded-3xl blur-[80px]"
            animate={{
              background: [
                'radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.5), rgba(99,102,241,0.35), rgba(79,70,229,0.2), transparent)',
                'radial-gradient(ellipse at 50% 75%, rgba(99,102,241,0.6), rgba(139,92,246,0.4), rgba(59,130,246,0.25), transparent)',
                'radial-gradient(ellipse at 50% 85%, rgba(139,92,246,0.55), rgba(59,130,246,0.4), rgba(99,102,241,0.22), transparent)',
                'radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.5), rgba(99,102,241,0.35), rgba(79,70,229,0.2), transparent)'
              ],
              opacity: [0.4, 0.6, 0.5, 0.4]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Segunda capa de sombra inferior */}
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-40 rounded-full blur-[60px]"
            animate={{
              background: [
                'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.4), rgba(99,102,241,0.25), transparent)',
                'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.5), rgba(79,70,229,0.3), transparent)',
                'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.45), rgba(59,130,246,0.28), transparent)',
                'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.4), rgba(99,102,241,0.25), transparent)'
              ],
              opacity: [0.5, 0.7, 0.6, 0.5]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Video container */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(59,130,246,0.4),0_15px_45px_-15px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_70px_-20px_rgba(59,130,246,0.5),0_20px_55px_-15px_rgba(99,102,241,0.4)] transition-shadow duration-500">
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-black">
              {/* Loading animation */}
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
                    <Brain className="w-12 h-12 text-blue-400/60" />
                  </motion.div>
                </motion.div>
              )}

              {/* YouTube Video Embed - autoplay automático con zoom para eliminar espacios laterales */}
              <iframe
                src="https://www.youtube.com/embed/-Swi2UlM4JI?autoplay=1&mute=1&loop=1&playlist=-Swi2UlM4JI&controls=0&modestbranding=1&rel=0&showinfo=0"
                title="Sitios Web"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setVideoLoaded(true)}
                className="w-full h-full object-cover scale-[1.25] pointer-events-none"
                style={{ transform: 'scale(1.25)' }}
              />

              {/* Badge premium dentro del video */}
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
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-xs font-medium">Experiencias digitales</span>
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
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
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
            Que se sienten y trascienden la razón
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default WebsitesCarousel
