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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white mb-3 font-display">
            El problema con el branding{' '}
            <span className="text-white/40">tradicional</span>
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
            <p className="text-white/70 text-base lg:text-lg leading-relaxed font-light">
              La mayoría de las agencias <span className="text-white">diseñan para impresionar</span>.
            </p>
            <p className="text-white/70 text-base lg:text-lg leading-relaxed font-light">
              Nosotros <span className="text-[#a855f7]">diseñamos para conectar</span>.
            </p>
            <div className="h-px bg-gradient-to-r from-[#a855f7]/20 to-transparent w-3/4 my-6" />
            <p className="text-white/60 text-sm lg:text-base leading-relaxed font-light">
              Tu cliente no compra productos, compra <span className="text-white">identidad</span>. 
              No busca servicios, busca <span className="text-white">pertenencia</span>. 
              No elige marcas, elige <span className="text-[#d946ef]">arquetipos que resuenan con su propia psique</span>.
            </p>
          </motion.div>

          {/* Right: Visual Icons - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4"
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center aspect-square"
            >
              <Brain className="w-10 h-10 text-[#a855f7] mb-2" strokeWidth={1.5} />
              <p className="text-white/60 text-xs text-center">Psicología</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center aspect-square"
            >
              <Palette className="w-10 h-10 text-[#d946ef] mb-2" strokeWidth={1.5} />
              <p className="text-white/60 text-xs text-center">Diseño</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center aspect-square"
            >
              <Lightbulb className="w-10 h-10 text-[#e879f9] mb-2" strokeWidth={1.5} />
              <p className="text-white/60 text-xs text-center">Tecnología</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom: About Creator - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 lg:p-8"
        >
          <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-4 font-light">
            Como <span className="text-[#a855f7]">psicólogo, psicoanalista y diseñador</span>, 
            descifro el código emocional de tu audiencia y lo transformo en una identidad visual que 
            <span className="text-[#d946ef]"> se siente antes de entenderse</span>.
          </p>
          <div className="flex items-center gap-3">
            <div className="h-px bg-gradient-to-r from-[#a855f7] to-transparent flex-1" />
            <span className="text-white/30 text-xs font-mono uppercase tracking-[0.3em]">Luxmania</span>
            <div className="h-px bg-gradient-to-l from-[#d946ef] to-transparent flex-1" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyLuxmania
