import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const BrandCTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative bg-black py-20 lg:py-28 overflow-hidden"
    >
      {/* Transición sutil superior */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/0 via-black/30 to-black pointer-events-none" />
      
      {/* Transición sutil inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/0 via-black/30 to-black pointer-events-none" />

      {/* Gradient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a855f7]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#d946ef]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="mb-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white mb-6 tracking-tight font-display leading-tight"
          >
            ¿Listo para{' '}
            <span className="bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#e879f9] bg-clip-text text-transparent font-light">
              construir tu marca?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/60 text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            Transformemos tu visión en una identidad de marca que conecta, cautiva y convierte
          </motion.p>
        </motion.div>

        {/* CTA Button - Visual y destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA */}
          <Link to="/contacto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-[#a855f7] to-[#d946ef] px-10 py-4 rounded-full text-white font-medium text-lg tracking-wide overflow-hidden shadow-lg shadow-[#a855f7]/30 hover:shadow-[#a855f7]/50 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span>Comenzar mi Marca</span>
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
          </Link>

          {/* Secondary CTA */}
          <Link to="/servicios">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-transparent border border-[#d946ef]/30 hover:border-[#d946ef] px-8 py-4 rounded-full text-white font-light text-base tracking-wide transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-white/70 group-hover:text-white transition-colors">Ver servicios</span>
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
