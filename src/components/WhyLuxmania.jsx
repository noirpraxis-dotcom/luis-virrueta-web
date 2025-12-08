import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Palette, Lightbulb } from 'lucide-react'

const WhyLuxmania = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative bg-[#0A0A0A] py-16 lg:py-20 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d946ef]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title - Minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light text-white mb-3 font-display tracking-tight leading-[1.1]">
            El problema con el branding{' '}
            <span className="text-white/30 italic" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}>tradicional</span>
          </h2>
        </motion.div>

        {/* Main Content - Minimalista */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12">
          {/* Left: Text Content with Arquetipos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-5"
          >
            <p className="text-white/60 text-lg lg:text-2xl leading-relaxed font-light">
              La mayoría de las agencias <span className="text-white">diseñan para impresionar</span>.
            </p>
            <p className="text-white/60 text-lg lg:text-2xl leading-relaxed font-light">
              Nosotros <span className="text-white" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}>diseñamos para conectar</span>.
            </p>
            <div className="h-px bg-gradient-to-r from-white/20 to-transparent w-3/4 my-6" />
            <p className="text-white/50 text-base lg:text-xl leading-relaxed font-light">
              Tu cliente no compra productos, compra <span className="text-white">identidad</span>. 
              No busca servicios, busca <span className="text-white">pertenencia</span>. 
              No elige marcas, elige <span className="text-white">arquetipos que resuenan con su propia psique</span>.
            </p>
          </motion.div>

          {/* Right: Visual Icons - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4"
          >
            {/* Brain Icon */}
            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-[#a855f7]/20 blur-xl rounded-full" />
                <Brain className="relative w-10 h-10 text-[#a855f7]" />
              </div>
              <span className="text-white/60 text-xs font-light">Psicología</span>
            </div>

            {/* Palette Icon */}
            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-[#d946ef]/20 blur-xl rounded-full" />
                <Palette className="relative w-10 h-10 text-[#d946ef]" />
              </div>
              <span className="text-white/60 text-xs font-light">Diseño</span>
            </div>

            {/* Lightbulb Icon */}
            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e879f9]/20 blur-xl rounded-full" />
                <Lightbulb className="relative w-10 h-10 text-[#e879f9]" />
              </div>
              <span className="text-white/60 text-xs font-light">Estrategia</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default WhyLuxmania
