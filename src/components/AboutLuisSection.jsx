import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { User2 } from 'lucide-react'

const AboutLuisSection = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section 
      id="about-luis" 
      ref={ref}
      className="relative bg-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Gradient orbs minimalistas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-fuchsia-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
            <User2 className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm text-white/80 font-light tracking-wide uppercase">
              Sobre Mí
            </span>
          </div>
        </motion.div>

        {/* Contenido principal minimalista y centrado */}
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Título principal */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight"
          >
            Actualmente vivo en Europa.
            <br />
            <span className="text-white/60">
              He trabajado con cientos de pacientes en México y distintas ciudades europeas.
            </span>
          </motion.h2>

          {/* Descripción filosófica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8"
          >
            <p className="text-xl lg:text-2xl text-white/80 font-light leading-relaxed">
              En cada caso, descubrí que{' '}
              <span className="text-purple-300">lo que los científicos contemporáneos están descubriendo</span>
              {' '}ya lo sabían los sabios ancestrales.
            </p>

            <p className="text-lg lg:text-xl text-white/70 font-light leading-relaxed">
              Bruce Lipton habla de epigenética. Los chinos llamaban a esto <span className="text-fuchsia-300">Shen-Qi</span>.
              <br />
              Daniel Kahneman describe sesgos cognitivos. Los budistas los llamaron <span className="text-purple-300">Vipallasa</span> hace 2,500 años.
            </p>

            {/* Box destacado con filosofía AIÓN */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative p-8 lg:p-10 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 animate-pulse-scale" />
              
              <div className="relative space-y-4">
                <p className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed">
                  En <span className="font-normal bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">AIÓN</span>,{' '}
                  estas verdades siempre han coexistido.
                </p>
                <p className="text-base lg:text-lg text-white/70 font-light">
                  No estamos descubriendo nada nuevo.{' '}
                  <span className="text-purple-300">Estamos recordando</span>.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA al About completo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/sobre-mi"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full font-light text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500"
            >
              <span>Conoce Mi Trayectoria</span>
              <motion.svg 
                className="w-5 h-5"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default AboutLuisSection
