import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section 
      id="about" 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 py-24 lg:py-32 overflow-hidden"
    >
      {/* Efectos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.02, scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-stone-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-light text-stone-800 tracking-[0.15em] mb-4" style={{ fontFamily: 'Gotham, sans-serif' }}>
            ABOUT
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-64"
          />
        </motion.div>

        {/* Contenedor principal con imagen y texto */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Espacio para la foto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="relative group"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
              {/* Placeholder para la foto - Fondo elegante mientras subes la imagen */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-amber-100/50 to-stone-300 flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="w-24 h-24 mx-auto text-stone-400/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-stone-500/60 text-sm tracking-wider font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    Agrega tu foto aquí
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
                className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>

            {/* Marco decorativo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -inset-4 border border-amber-600/20 rounded-2xl -z-10"
            />
          </motion.div>

          {/* Contenido de texto */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Nombre */}
            <div>
              <h3 className="text-4xl lg:text-5xl font-light text-stone-800 mb-2 tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana Erdösová
              </h3>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="h-px bg-gradient-to-r from-amber-600/40 to-transparent w-48 origin-left"
              />
            </div>

            {/* Descripción principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="space-y-6"
            >
              <p className="text-stone-700 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana Erdösová is a <span className="text-amber-700 font-normal">certified Past Life Regression therapist</span>, energy healer trained in the <span className="text-amber-700 font-normal">Emotion Code, Body Code, and Belief Code</span> methods, a <span className="text-amber-700 font-normal">Star Magic Healing facilitator Level 2</span>, and a channeler of <span className="text-amber-700 font-normal">Ilyari</span> (somatic transmission of light codes).
              </p>

              <p className="text-stone-700 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                As a former university researcher with two doctorates in <span className="text-amber-700 font-normal">Linguistics and Latin American Studies</span>, her vocation and passion lie in exploring both the intuitive and scientific aspects of energy healing.
              </p>

              <p className="text-stone-700 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana is also the author of numerous scientific articles, book chapters, and six solo-authored books, including <em className="text-amber-800">"Thinking Otherness: The Mexican Indigenous Community Through Five Sources of Knowledge"</em> and <em className="text-amber-800">"Evolved Proverbs: Updated Wisdom for The Life You Truly Want to Live."</em>
              </p>

              <p className="text-stone-700 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                She is also a translator, singer, and lyricist, and a great enthusiast of horses. She enjoys speaking and working in several languages (English, Spanish, and her native Czech), and living in intercultural environments surrounded by beautiful nature.
              </p>
            </motion.div>

            {/* Elementos decorativos / credenciales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap gap-3 pt-6"
            >
              {['Past Life Regression', 'Energy Healing', 'Star Magic Level 2', 'Ilyari Channeler'].map((badge, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="px-5 py-2 bg-white/60 backdrop-blur-sm border border-amber-600/20 rounded-full text-stone-700 text-sm tracking-wider font-light shadow-sm"
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
