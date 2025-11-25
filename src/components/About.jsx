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
      className="relative min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 py-32 lg:py-40 overflow-hidden"
    >
      {/* Efectos decorativos de fondo suaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.04, scale: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-stone-300 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Título cinematográfico de la sección - Estilo light */}
        <div className="text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-stone-800 text-6xl lg:text-8xl font-light tracking-[0.2em]"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            ABOUT
          </motion.h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mt-8"
          />
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
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl border border-amber-600/30">
              {/* Foto de Zuzana */}
              <img 
                src="/about ligera.jpg" 
                alt="Zuzana Erdösová" 
                className="w-full h-full object-cover"
              />

              {/* Overlay decorativo en hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>

            {/* Marco decorativo dorado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute -inset-6 border border-amber-600/20 rounded-3xl -z-10"
            />
          </motion.div>

          {/* Contenido de texto - 3 columnas - Estilo cinematográfico light */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="lg:col-span-3 flex flex-col justify-center space-y-10"
          >
            {/* Nombre cinematográfico */}
            <div>
              <h3 className="text-5xl lg:text-6xl font-light text-stone-800 mb-4 tracking-[0.15em]" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana Erdösová
              </h3>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-px bg-gradient-to-r from-amber-600/50 via-amber-600/30 to-transparent w-56"
              />
            </div>

            {/* Descripción principal con estilo light elegante */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
              className="space-y-8"
            >
              <p className="text-stone-700 text-xl leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana Erdösová is a <span className="text-amber-700 font-normal">certified Past Life Regression therapist</span>, energy healer trained in the <span className="text-amber-700 font-normal">Emotion Code, Body Code, and Belief Code</span> methods, a <span className="text-amber-700 font-normal">Star Magic Healing facilitator Level 2</span>, and a channeler of <span className="text-amber-700 font-normal">Ilyari</span> (somatic transmission of light codes).
              </p>

              <p className="text-stone-600 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                As a former university researcher with two doctorates in <span className="text-amber-700 font-normal">Linguistics and Latin American Studies</span>, her vocation and passion lie in exploring both the intuitive and scientific aspects of energy healing.
              </p>

              <p className="text-stone-600 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Zuzana is also the author of numerous scientific articles, book chapters, and six solo-authored books, including <em className="text-amber-800">"Thinking Otherness: The Mexican Indigenous Community Through Five Sources of Knowledge"</em> and <em className="text-amber-800">"Evolved Proverbs: Updated Wisdom for The Life You Truly Want to Live."</em>
              </p>

              <p className="text-stone-600 text-lg leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                She is also a translator, singer, and lyricist, and a great enthusiast of horses. She enjoys speaking and working in several languages (English, Spanish, and her native Czech), and living in intercultural environments surrounded by beautiful nature.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Certifications Section - Positioned higher for visibility */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-20 lg:mt-24"
        >
          {/* Section Title */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 1.4 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
            />
            
            <h2 
              className="text-4xl lg:text-6xl font-light text-stone-800 mb-6 tracking-[0.15em]"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              CERTIFICATIONS
            </h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 1.6 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mt-8"
            />
          </div>

          {/* Emotion, Body & Belief Code Certificates */}
          <div className="mb-24">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.7 }}
              className="text-2xl lg:text-4xl font-light text-stone-800 mb-12 text-center tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Emotion, Body & <span className="italic text-amber-700">Belief Code</span>
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {[1, 2, 3].map((num, index) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.8 + index * 0.15 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-stone-200 hover:border-amber-600/40 transition-all duration-500 hover:shadow-2xl bg-white">
                    <img 
                      src={`/${num}.jpg`}
                      alt={`Certification ${num}`}
                      className="w-full h-auto object-contain"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hypnotherapy & Energy Healing Certificates */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 2.3 }}
              className="text-2xl lg:text-4xl font-light text-stone-800 mb-12 text-center tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Hypnotherapy & <span className="italic text-amber-700">Energy Healing</span>
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {[4, 5].map((num, index) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 2.4 + index * 0.15 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-stone-200 hover:border-amber-600/40 transition-all duration-500 hover:shadow-2xl bg-white">
                    <img 
                      src={`/${num}.jpg`}
                      alt={`Certification ${num}`}
                      className="w-full h-auto object-contain"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
