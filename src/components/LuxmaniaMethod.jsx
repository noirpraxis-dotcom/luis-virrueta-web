import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, Layers, Sparkles, Rocket } from 'lucide-react'

const LuxmaniaMethod = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const phases = [
    {
      number: "01",
      icon: Search,
      title: "PSICOANÁLISIS DE MARCA",
      description: "No empezamos dibujando. Empezamos escuchando.",
      details: "¿Quién es tu cliente ideal? ¿Qué arquetipo representa tu marca? ¿Qué emociones quieres activar?",
      color: "#a855f7"
    },
    {
      number: "02",
      icon: Layers,
      title: "ESTRATEGIA SIMBÓLICA",
      description: "Definimos colores, formas y narrativas basadas en psicología del comportamiento.",
      details: "Cada decisión tiene un porqué científico y emocional.",
      color: "#d946ef"
    },
    {
      number: "03",
      icon: Sparkles,
      title: "DISEÑO CONSCIENTE",
      description: "Creamos tu identidad visual: desde el logo hasta la experiencia digital completa.",
      details: "Hermoso, sí. Pero sobre todo, estratégico.",
      color: "#e879f9"
    },
    {
      number: "04",
      icon: Rocket,
      title: "ACTIVACIÓN E IMPACTO",
      description: "Lanzamos tu marca al mundo con un sistema completo.",
      details: "Web, contenido, fotografía, animaciones. Todo alineado a tu arquetipo de marca.",
      color: "#d946ef"
    }
  ]

  return (
    <section 
      id="metodo"
      ref={ref}
      className="relative bg-gradient-to-b from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] py-24 lg:py-32 overflow-hidden"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#d946ef]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 lg:mb-28"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#a855f7] text-sm sm:text-base font-mono uppercase tracking-widest mb-4"
          >
            El Método Luxmania
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display"
          >
            Donde el diseño encuentra{' '}
            <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">
              la mente inconsciente
            </span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent mx-auto w-80"
          />
        </motion.div>

        {/* Phases Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {phases.map((phase, index) => {
            const Icon = phase.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-[#d946ef]/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 lg:p-10 h-full hover:border-white/20 transition-all duration-500">
                  {/* Number Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <span 
                      className="text-6xl font-bold font-mono opacity-20"
                      style={{ color: phase.color }}
                    >
                      {phase.number}
                    </span>
                    <div 
                      className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/10"
                    >
                      <Icon 
                        className="w-8 h-8" 
                        style={{ color: phase.color }}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-white text-xl lg:text-2xl font-bold mb-4 font-display">
                    {phase.title}
                  </h3>
                  <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-4">
                    {phase.description}
                  </p>
                  <p className="text-white/50 text-sm lg:text-base leading-relaxed">
                    {phase.details}
                  </p>

                  {/* Decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    className="h-px bg-gradient-to-r from-transparent to-white/20 mt-6 origin-left"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-20"
        >
          <p className="text-white/60 text-lg mb-8">
            Un proceso probado que transforma ideas en marcas inolvidables
          </p>
          <motion.a
            href="#servicios"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#a855f7] text-white rounded-full text-base font-medium tracking-wide uppercase hover:bg-[#7c3aed] transition-all duration-300 shadow-lg shadow-[#a855f7]/20 hover:shadow-[#a855f7]/40"
          >
            <span>Explorar Servicios</span>
            <Sparkles className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default LuxmaniaMethod
