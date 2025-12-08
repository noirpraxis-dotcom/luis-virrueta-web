import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Sparkles, Code, Palette } from 'lucide-react'
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

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left: Texto con video background - PREMIUM */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-2 lg:order-1 flex flex-col justify-center relative"
          >
            {/* Video background premium */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                style={{ filter: 'brightness(0.9)' }}
              >
                <source src="/MUESTRA TRABAJO SECCION.mp4" type="video/mp4" />
              </video>
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/40" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 p-8 lg:p-12">
            
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm w-fit"
            >
              <Sparkles className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <p className="text-white/70 text-xs font-light uppercase tracking-[0.25em]">
                Nuestro Trabajo
              </p>
            </motion.div>

            {/* Título MUESTRA - Estilo LUXMANIA */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-light text-white mb-6 tracking-[0.15em] font-display leading-[1.05]"
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

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-white/50 text-sm lg:text-base font-light uppercase tracking-[0.3em] mb-6"
            >
              Diseño UX/UI Élite
            </motion.p>

            {/* Descripción */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/70 text-xl lg:text-2xl font-extralight tracking-wide mb-4 max-w-xl leading-relaxed"
            >
              Sitios web que{' '}
              <motion.span
                className="text-white font-light"
                style={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
                }}
              >
                convierten visitantes en clientes
              </motion.span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-white/50 text-base lg:text-lg font-light leading-relaxed mb-10 max-w-xl"
            >
              Experiencias digitales premium con{' '}
              <span className="text-white/70">UX intuitiva</span> y{' '}
              <span className="text-white/70">UI cinematográfica</span>.
            </motion.p>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-2 mb-10"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full cursor-pointer"
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
                  <Code className="w-4 h-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Desarrollo</span>
                </div>
              </motion.div>

              <span className="text-white/30 text-xs mx-1">+</span>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full cursor-pointer"
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
                  <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">UX/UI</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="relative mb-10"
            >
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              
              <div className="relative pl-8 space-y-1">
                <Sparkles className="absolute left-0 top-2 w-5 h-5 text-white/40" strokeWidth={1.5} />

                <p className="text-white/60 text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  Cada{' '}
                  <span className="text-white font-normal">
                    clic está pensado
                  </span>.
                </p>

                <p className="text-white/60 text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  Cada{' '}
                  <span className="text-white font-normal">
                    scroll es intencional
                  </span>.
                </p>

                <p className="text-white/60 text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  El diseño{' '}
                  <span className="text-white font-normal">
                    guía hacia la acción
                  </span>.
                </p>
              </div>

              <motion.div 
                className="mt-4 h-[1px] bg-gradient-to-r from-white/20 to-transparent max-w-md"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Link to="/portafolio">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden px-8 py-4 rounded-full backdrop-blur-sm bg-white/5"
                >
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
                      opacity: 0.2
                    }}
                  />

                  <motion.div
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
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
                      opacity: 0.3
                    }}
                  />

                  <span className="relative flex items-center gap-3">
                    <span className="text-white/90 group-hover:text-white font-light text-base tracking-wide transition-colors">
                      Ver portafolio completo
                    </span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            </div>
          </motion.div>

          {/* Right: Video vertical */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/-Swi2UlM4JI?autoplay=1&mute=1&loop=1&playlist=-Swi2UlM4JI&controls=0&modestbranding=1&rel=0&showinfo=0"
                  title="Muestra de Sitios Web"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full shadow-2xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <Code className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-xs font-light tracking-wider whitespace-nowrap">
                    UX
                  </span>
                  <span className="text-white/30 text-xs">×</span>
                  <Palette className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-xs font-light tracking-wider whitespace-nowrap">
                    UI
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
    </section>
  )
}

export default BrandCTA
