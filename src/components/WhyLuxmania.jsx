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
      className="relative bg-[#0A0A0A] py-24 lg:py-32 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d946ef]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display"
          >
            El problema con el branding{' '}
            <span className="text-white/40">tradicional</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent mx-auto w-64 mb-8"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            <p className="text-white/70 text-lg lg:text-xl leading-relaxed">
              La mayoría de las agencias <span className="text-white font-semibold">diseñan para impresionar</span>.
            </p>
            <p className="text-white/70 text-lg lg:text-xl leading-relaxed">
              Nosotros <span className="text-[#a855f7] font-semibold">diseñamos para conectar</span>.
            </p>
            <div className="h-px bg-gradient-to-r from-[#a855f7]/20 to-transparent w-full my-8" />
            <p className="text-white/60 text-base lg:text-lg leading-relaxed">
              Porque entendemos algo fundamental: tu cliente no compra productos, compra <span className="text-white">identidad</span>. 
              No busca servicios, busca <span className="text-white">pertenencia</span>. 
              No elige marcas, elige <span className="text-[#d946ef]">arquetipos que resuenan con su propia psique</span>.
            </p>
          </motion.div>

          {/* Right: Visual Icons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-6"
          >
            <motion.div
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square"
            >
              <Brain className="w-12 h-12 text-[#a855f7] mb-3" strokeWidth={1.5} />
              <p className="text-white/60 text-sm text-center">Psicología</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square"
            >
              <Palette className="w-12 h-12 text-[#d946ef] mb-3" strokeWidth={1.5} />
              <p className="text-white/60 text-sm text-center">Diseño</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square"
            >
              <Lightbulb className="w-12 h-12 text-[#e879f9] mb-3" strokeWidth={1.5} />
              <p className="text-white/60 text-sm text-center">Tecnología</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom: About Creator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-3xl p-8 lg:p-12"
        >
          <p className="text-white/80 text-lg lg:text-xl leading-relaxed mb-6">
            Como <span className="text-[#a855f7] font-semibold">psicólogo, psicoanalista y diseñador</span>, 
            descifro el código emocional de tu audiencia y lo transformo en una identidad visual que 
            <span className="text-[#d946ef] font-semibold"> se siente antes de entenderse</span>.
          </p>
          <div className="flex items-center gap-4">
            <div className="h-px bg-gradient-to-r from-[#a855f7] to-transparent flex-1" />
            <span className="text-white/40 text-sm font-mono uppercase tracking-widest">Luxmania</span>
            <div className="h-px bg-gradient-to-l from-[#d946ef] to-transparent flex-1" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyLuxmania
