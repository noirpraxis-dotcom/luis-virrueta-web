import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Sparkles, Code, Palette, Brain } from 'lucide-react'
import { Link } from 'react-router-dom'

const BrandCTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative bg-black py-16 lg:py-24 overflow-hidden">
      {/* Orbs sutiles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* Header Section - Centrado */}
        <div className="text-center mb-12">
          
          {/* Título MUESTRA - Estilo LUXMANIA */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl lg:text-8xl font-light text-white mb-6 tracking-[0.15em] font-display leading-[1.05]"
          >
            <span className="inline-block relative">
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
                M
              </motion.span>
              <span className="relative text-white">M</span>
            </span>
            UESTR
            <span className="inline-block relative">
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

          {/* Subtítulo - Un poco sobre nuestro trabajo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/50 text-sm lg:text-base font-light uppercase tracking-[0.25em]"
          >
            Un poco sobre nuestro trabajo
          </motion.p>
        </div>

        {/* Video Grande y Centrado - Con bordes redondeados elegantes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
          className="relative mb-8"
        >
          <div className="relative mx-auto w-full max-w-5xl">
            {/* Glow sutil alrededor del video */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
            
            <div className="relative w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
              <iframe
                src="https://www.youtube.com/embed/-Swi2UlM4JI?autoplay=1&mute=1&loop=1&playlist=-Swi2UlM4JI&controls=0&modestbranding=1&rel=0&showinfo=0"
                title="Muestra de Sitios Web"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              />
            </div>
          </div>
        </motion.div>

        {/* Badge Diseño UX/UI Élite - Debajo del video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            <span className="text-white/70 text-xs font-light uppercase tracking-[0.25em]">
              Diseño UX/UI Élite
            </span>
          </div>
        </motion.div>

        {/* Chips abajo con la info - Estilo Luxmania */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-3 mb-12"
        >
          {/* Chip 1 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden px-5 py-2.5 rounded-full cursor-pointer"
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                backgroundSize: '200% 200%',
                opacity: 0.15
              }}
            />
            <div className="relative flex items-center gap-2">
              <Brain className="w-4 h-4 text-white/70" strokeWidth={1.5} />
              <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Cada clic está pensado</span>
            </div>
          </motion.div>

          <span className="text-white/30 text-xs">+</span>

          {/* Chip 2 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden px-5 py-2.5 rounded-full cursor-pointer"
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5
              }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 25%, #3b82f6 50%, #8b5cf6 75%, #6366f1 100%)',
                backgroundSize: '200% 200%',
                opacity: 0.15
              }}
            />
            <div className="relative flex items-center gap-2">
              <Palette className="w-4 h-4 text-white/70" strokeWidth={1.5} />
              <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Cada scroll es intencional</span>
            </div>
          </motion.div>

          <span className="text-white/30 text-xs">+</span>

          {/* Chip 3 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden px-5 py-2.5 rounded-full cursor-pointer"
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 25%, #a855f7 50%, #3b82f6 75%, #8b5cf6 100%)',
                backgroundSize: '200% 200%',
                opacity: 0.15
              }}
            />
            <div className="relative flex items-center gap-2">
              <Code className="w-4 h-4 text-white/70" strokeWidth={1.5} />
              <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">El diseño guía hacia la acción</span>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button - Centrado con más luz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center"
        >
          <Link to="/portafolio">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden px-8 py-4 rounded-full backdrop-blur-sm"
            >
              {/* Gradiente interno más visible y luminoso */}
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                  backgroundSize: '200% 200%',
                  opacity: 0.4
                }}
              />

              {/* Glow exterior */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.15, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-4 rounded-full blur-3xl"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6, #8b5cf6)',
                  opacity: 0.4
                }}
              />

              <span className="relative flex items-center gap-3">
                <span className="text-white font-light text-base tracking-wide">
                  Ver portafolio completo
                </span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-white transition-colors" strokeWidth={1.5} />
                </motion.div>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
    </section>
  )
}

export default BrandCTA
