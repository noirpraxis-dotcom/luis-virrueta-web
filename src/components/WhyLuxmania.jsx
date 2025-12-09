import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Palette, Code, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const WhyLuxmania = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative bg-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Video de fondo - Estilo Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover opacity-40 pointer-events-none"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        >
          <source src="/ARQUETIPOS CEREBRO.mp4" type="video/mp4" />
        </video>
        
        {/* Degradados arriba y abajo para blend perfecto */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        
        {/* Overlay sutil para mantener legibilidad */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Orbs sutiles encima del video */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            <p className="text-white/70 text-xs font-light uppercase tracking-[0.25em]">
              La Diferencia
            </p>
          </div>
        </motion.div>

        {/* Título - Estilo corto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-5xl lg:text-7xl font-light text-white mb-4 tracking-[0.1em] font-display leading-[1.05]">
            EL PROBLEMA
          </h2>
          <p className="text-white/50 text-base lg:text-lg font-light uppercase tracking-[0.3em]">
            Branding Tradicional
          </p>
        </motion.div>

        {/* Contenido Principal - Centrado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-white/70 text-xl lg:text-2xl font-extralight leading-relaxed mb-6">
            La mayoría de las agencias{' '}
            <span className="text-white font-light">diseñan para impresionar</span>.
          </p>
          <p className="text-white/70 text-xl lg:text-2xl font-extralight leading-relaxed mb-8">
            Nosotros{' '}
            <motion.span
              className="text-white font-light"
              style={{
                textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
              }}
            >
              diseñamos para conectar
            </motion.span>.
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full max-w-md mx-auto my-10" />

          <p className="text-white/50 text-base lg:text-lg font-light leading-relaxed">
            Tu cliente no compra productos, compra{' '}
            <span className="text-white/80">identidad</span>.<br />
            No busca servicios, busca{' '}
            <span className="text-white/80">pertenencia</span>.<br />
            No elige marcas, elige{' '}
            <span className="text-white">arquetipos que resuenan con su propia psique</span>.
          </p>
        </motion.div>

        {/* Chips - Estilo Luxmania */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-3 mb-12"
        >
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
              <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Psicología</span>
            </div>
          </motion.div>

          <span className="text-white/30 text-xs">+</span>

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
              <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Diseño</span>
            </div>
          </motion.div>

          <span className="text-white/30 text-xs">+</span>

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
              <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Tecnología</span>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button - Conocer arquetipos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/identidad-de-marca">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden px-8 py-4 rounded-full backdrop-blur-sm"
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
                  opacity: 0.4
                }}
              />

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
                  Conocer arquetipos
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
    </section>
  )
}

export default WhyLuxmania
