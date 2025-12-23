import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { User2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const LuisViruettaIntro = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  return (
    <section 
      id="about-luis" 
      ref={ref}
      className="relative bg-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Gradient orbs premium */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.06, 0.1, 0.06]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-fuchsia-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-violet-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Foto circular premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 via-fuchsia-500/30 to-purple-500/30 blur-2xl animate-pulse-scale" />
              {/* Photo */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-2 border-white/20 backdrop-blur-sm">
                <img 
                  src="/luxmania perfil.webp" loading="lazy" 
                  alt="Luis Virrueta" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Nombre y Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
              Luis Virrueta
            </h2>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
                <User2 className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
                <span className="text-sm text-white/80 font-light tracking-wide">
                  Psicólogo · Creador de AIÓN
                </span>
              </div>
            </div>
          </motion.div>

          {/* Frase impactante principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center mb-10"
          >
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-tight mb-6">
              La mayoría de las personas no vive la realidad.
              <br />
              Vive la{' '}
              <span 
                className="font-normal bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'gradient-x 5s ease infinite'
                }}
              >
                interpretación
              </span>
              {' '}que hace de ella.
            </p>
            <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
              ¿Qué están viviendo entonces?
            </p>
          </motion.div>

          {/* La promesa/propuesta de valor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center max-w-4xl mx-auto mb-12 space-y-6"
          >
            <p className="text-lg lg:text-xl text-white/80 font-light leading-relaxed">
              Tu <span className="text-purple-300 font-normal">enfermedad</span>, tu{' '}
              <span className="text-fuchsia-300 font-normal">ansiedad</span>, tus{' '}
              <span className="text-violet-300 font-normal">relaciones</span>, tu{' '}
              <span className="text-pink-300 font-normal">economía</span>...{' '}
              no responden a la realidad.{' '}
              <span className="text-white/90 font-normal">Responden a esa interpretación</span>.
            </p>
            
            <p className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed">
              Cuando cambias el{' '}
              <span 
                className="font-normal bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
              >
                marco desde el que interpretas
              </span>
              , todo se reorganiza.
            </p>

            <p className="text-base lg:text-lg text-white/60 font-light italic">
              Actualmente en Europa. Cientos de casos en México y distintas ciudades europeas.
            </p>
          </motion.div>

          {/* Pregunta central en tarjeta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="relative max-w-3xl mx-auto p-8 lg:p-10 bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden mb-12"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 opacity-50" 
                 style={{
                   backgroundSize: '200% 200%',
                   animation: 'gradient-xy 8s ease infinite'
                 }}
            />
            
            <div className="relative text-center space-y-4">
              <p className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed italic">
                ¿Cómo se construye la experiencia que llamamos realidad?
              </p>
              <p className="text-base lg:text-lg text-white/60 font-light">
                Esta es la pregunta central de mi trabajo.
              </p>
            </div>
          </motion.div>

          {/* CTA premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex justify-center"
          >
            <Link
              to="/sobre-mi"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full font-light text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-105"
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

export default LuisViruettaIntro
