import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Hero = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center py-24 lg:py-32"
    >
      {/* Efectos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.02 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12 text-center">
        {/* Título cinematográfico */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="text-white text-6xl lg:text-8xl font-light tracking-[0.2em] mb-8"
          style={{ fontFamily: 'Gotham, sans-serif' }}
        >
          Zuzana Erdösová
        </motion.h1>

        {/* Línea decorativa dorada */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/60 to-transparent mx-auto w-80 mb-12"
        />

        {/* Fragmento resumido elegante */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/80 text-xl lg:text-2xl font-light leading-relaxed tracking-wide mb-16 max-w-4xl mx-auto"
          style={{ fontFamily: 'Gotham, sans-serif' }}
        >
          Certified Past Life Regression therapist, energy healer, and channeler of Ilyari. 
          Former university researcher with two doctorates exploring the intuitive and scientific aspects of energy healing.
        </motion.p>

        {/* Botón "Ver más" elegante */}
        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-md border border-amber-600/30 rounded-full text-white/90 text-sm tracking-[0.25em] uppercase font-light hover:bg-white/10 hover:border-amber-600/50 transition-all duration-500 shadow-2xl group"
          style={{ fontFamily: 'Gotham, sans-serif' }}
        >
          <span>Ver más</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.a>

        {/* Elementos decorativos adicionales */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 1.2 }}
          className="mt-20 flex justify-center gap-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 0.3, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
              className="w-1.5 h-1.5 bg-amber-600 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
