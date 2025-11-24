import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  CinematicTitle, 
  GradientLine, 
  DecorativeBlur 
} from '../elementos/ElementosReutilizables'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section 
      id="about" 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black py-32 lg:py-40 overflow-hidden"
    >
      {/* Efectos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <DecorativeBlur position="top-right" color="amber" size="large" />
        <DecorativeBlur position="bottom-left" color="amber" size="medium" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Título cinematográfico de la sección */}
        <div className="text-center mb-24">
          <CinematicTitle size="large" delay={0}>
            ABOUT
          </CinematicTitle>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            <GradientLine width="w-80" color="amber" opacity="60" className="mt-8" />
          </motion.div>
        </div>

        {/* Contenedor principal con imagen y texto - Estilo cinematográfico */}
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-20 items-start max-w-7xl mx-auto">
          {/* Espacio para la foto - 2 columnas */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="lg:col-span-2 relative group"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl border border-amber-600/20">
              {/* Placeholder para la foto - Estilo dark */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="w-24 h-24 mx-auto text-amber-600/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-amber-600/40 text-sm tracking-wider font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    Your photo here
                  </p>
                </div>
              </div>
              
              {/* Descomenta cuando subas la foto:
              <img 
                src="/zuzana-photo.jpg" 
                alt="Zuzana Erdösová" 
                className="w-full h-full object-cover"
              />
              */}

              {/* Overlay decorativo en hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>

            {/* Marco decorativo brillante */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute -inset-6 border border-amber-600/10 rounded-3xl -z-10 blur-sm"
            />
          </motion.div>

          {/* Contenido de texto - 3 columnas - Estilo cinematográfico */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="lg:col-span-3 flex flex-col justify-center space-y-10"
          >
            {/* Nombre cinematográfico */}
            <div>
              <h3 className="text-5xl lg:text-6xl font-light text-white mb-4 tracking-[0.15em]" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana Erdösová
              </h3>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <GradientLine width="w-56" color="amber" opacity="60" className="mx-0" />
              </motion.div>
            </div>

            {/* Descripción principal con estilo dark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
              className="space-y-8"
            >
              <p className="text-white/80 text-xl leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana Erdösová is a <span className="text-amber-400 font-normal">certified Past Life Regression therapist</span>, energy healer trained in the <span className="text-amber-400 font-normal">Emotion Code, Body Code, and Belief Code</span> methods, a <span className="text-amber-400 font-normal">Star Magic Healing facilitator Level 2</span>, and a channeler of <span className="text-amber-400 font-normal">Ilyari</span> (somatic transmission of light codes).
              </p>

              <p className="text-white/75 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                As a former university researcher with two doctorates in <span className="text-amber-400 font-normal">Linguistics and Latin American Studies</span>, her vocation and passion lie in exploring both the intuitive and scientific aspects of energy healing.
              </p>

              <p className="text-white/75 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana is also the author of numerous scientific articles, book chapters, and six solo-authored books, including <em className="text-amber-300">"Thinking Otherness: The Mexican Indigenous Community Through Five Sources of Knowledge"</em> and <em className="text-amber-300">"Evolved Proverbs: Updated Wisdom for The Life You Truly Want to Live."</em>
              </p>

              <p className="text-white/75 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                She is also a translator, singer, and lyricist, and a great enthusiast of horses. She enjoys speaking and working in several languages (English, Spanish, and her native Czech), and living in intercultural environments surrounded by beautiful nature.
              </p>
            </motion.div>

            {/* Credenciales elegantes estilo dark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-wrap gap-3 pt-8"
            >
              {['Past Life Regression', 'Energy Healing', 'Star Magic Level 2', 'Ilyari Channeler'].map((badge, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-amber-600/30 rounded-full text-amber-400/90 text-sm tracking-[0.15em] uppercase font-light shadow-lg hover:bg-white/10 hover:border-amber-600/50 transition-all duration-300"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
