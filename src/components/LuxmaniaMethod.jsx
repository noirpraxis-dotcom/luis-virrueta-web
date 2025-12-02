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
      className="relative bg-gradient-to-b from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] py-16 lg:py-20 overflow-hidden"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#d946ef]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header - Minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-14"
        >
          <p className="text-[#a855f7] text-xs font-mono uppercase tracking-[0.4em] mb-3">
            El Método Luxmania
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white font-display">
            Donde el diseño encuentra{' '}
            <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">
              la mente inconsciente
            </span>
          </h2>
        </motion.div>

        {/* Phases Grid - Compact */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {phases.map((phase, index) => {
            const Icon = phase.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="relative group"
              >
                <div className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 lg:p-7 h-full hover:border-white/20 transition-all duration-300">
                  {/* Number Badge - Compact */}
                  <div className="flex items-start justify-between mb-4">
                    <span 
                      className="text-4xl font-bold font-mono opacity-20"
                      style={{ color: phase.color }}
                    >
                      {phase.number}
                    </span>
                    <div 
                      className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10"
                    >
                      <Icon 
                        className="w-6 h-6" 
                        style={{ color: phase.color }}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Content - Compact */}
                  <h3 className="text-white text-lg lg:text-xl font-semibold mb-3 font-display">
                    {phase.title}
                  </h3>
                  <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-3 font-light">
                    {phase.description}
                  </p>
                  <p className="text-white/50 text-xs lg:text-sm leading-relaxed font-light">
                    {phase.details}
                  </p>

                  {/* Decorative line - Subtle */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    className="h-px bg-gradient-to-r from-transparent to-white/20 mt-4 origin-left"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA - Minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-white/50 text-sm mb-6 font-light">
            Un proceso probado que transforma ideas en marcas inolvidables
          </p>
          <motion.a
            href="#servicios"
            whileHover={{ scale: 1.02, x: 3 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-3 bg-transparent border border-[#a855f7]/30 hover:border-[#a855f7] text-white rounded-full text-sm font-light tracking-wide transition-all duration-300"
          >
            <span>Explorar Servicios</span>
            <Sparkles className="w-4 h-4 text-[#a855f7]" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default LuxmaniaMethod
