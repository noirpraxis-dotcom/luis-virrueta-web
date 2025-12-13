import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { GraduationCap, Brain, Sparkles, Award, User2, Star } from 'lucide-react'

const AboutLuisSection = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const credentials = [
    {
      icon: Brain,
      title: 'Psicoanálisis',
      description: 'Especialista en psicoanálisis y neurociencia cognitiva. Decodifico el inconsciente para crear marcas que conectan a nivel profundo.',
      gradient: 'from-fuchsia-500 to-fuchsia-600'
    },
    {
      icon: Sparkles,
      title: 'Diseño Gráfico',
      description: '8+ años diseñando identidades visuales premium. Experto en motion graphics, 3D, y sistemas de diseño escalables.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Award,
      title: 'Programación & IA',
      description: 'Full-stack developer + AI specialist. React, Node.js, Python, fine-tuning de modelos, automatización con IA generativa.',
      gradient: 'from-cyan-500 to-cyan-600'
    }
  ]

  return (
    <section 
      id="about-luis" 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black py-20 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Decorative gradient orbs - Mobile optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.12, scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-fuchsia-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title - Mobile First */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <User2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-purple-400 mb-4" strokeWidth={1.5} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.08em] sm:tracking-[0.15em] lg:tracking-[0.2em] font-display mb-6"
          >
            SOBRE MÍ
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto w-48 sm:w-64 lg:w-80"
          />
        </div>

        {/* Main Content Grid - Mobile First */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center max-w-7xl mx-auto mb-20 sm:mb-24 lg:mb-32">
          {/* Photo Section - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="lg:col-span-2 relative group mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-500/30">
              {/* Placeholder - Reemplazar con tu foto profesional */}
              <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-fuchsia-900/40 to-cyan-900/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center px-6">
                  <GraduationCap className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-purple-400 mb-4" strokeWidth={1.5} />
                  <p className="text-white/60 text-sm sm:text-base font-mono">Tu foto profesional aquí</p>
                  <p className="text-white/40 text-xs sm:text-sm font-mono mt-2">Actualizar: /public/luis-virrueta.jpg</p>
                </div>
              </div>

              {/* Gradient Overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>

            {/* Decorative frame */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute -inset-4 sm:-inset-6 border border-purple-500/20 rounded-2xl sm:rounded-3xl -z-10"
            />
          </motion.div>

          {/* Text Content - Mobile First */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="lg:col-span-3 flex flex-col justify-center space-y-6 sm:space-y-8 lg:space-y-10"
          >
            {/* Name - Cinematic */}
            <div>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-light text-white mb-3 sm:mb-4 tracking-[0.1em] sm:tracking-[0.15em] font-display">
                Luis Virrueta
              </h3>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-px bg-gradient-to-r from-purple-500/50 via-fuchsia-500/30 to-transparent w-40 sm:w-48 lg:w-56"
              />
            </div>

            {/* Main Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
              className="space-y-4 sm:space-y-6"
            >
              <p className="text-white/90 text-lg sm:text-xl md:text-2xl lg:text-2xl leading-relaxed font-light tracking-wide font-body">
                Fundador de <span className="text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text font-medium">Ainimation</span>, 
                donde fusiono psicoanálisis, diseño gráfico, programación e inteligencia artificial para crear marcas que conectan con el inconsciente humano.
              </p>
              <p className="text-white/70 text-base sm:text-lg md:text-xl lg:text-xl leading-relaxed font-light font-body">
                Combino mi formación en psicoanálisis con habilidades técnicas avanzadas: desarrollo apps, entreno modelos de IA, 
                y diseño sistemas visuales que no solo se ven increíbles, sino que están fundamentados en cómo funciona la mente humana.
              </p>
            </motion.div>

            {/* Quote/Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.1 }}
              className="border-l-2 border-fuchsia-500/40 pl-4 sm:pl-6 py-2"
            >
              <p className="text-fuchsia-400/90 text-base sm:text-lg lg:text-xl italic font-light font-display">
                "No diseño logos. Arquitecturo emociones que se convierten en marcas inolvidables."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Credentials Section - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.3 }}
        >
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 1.4 }}
              className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mx-auto w-24 sm:w-32 mb-6 sm:mb-8"
            />
            
            <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-400" strokeWidth={1.5} />
              <h3 
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-[0.1em] sm:tracking-[0.15em] font-display"
              >
                FORMACIÓN
              </h3>
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" strokeWidth={1.5} />
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 1.6 }}
              className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent mx-auto w-48 sm:w-64 lg:w-80"
            />
          </div>

          {/* Credentials Grid - Mobile First */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
            {credentials.map((cred, index) => (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.7 + index * 0.15 }}
                className="group relative"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-white/20 transition-all duration-500 h-full">
                  {/* Icon with gradient */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${cred.gradient} p-2.5 sm:p-3 mb-4 sm:mb-6`}
                  >
                    <cred.icon className="w-full h-full text-white" strokeWidth={1.5} />
                  </motion.div>

                  {/* Title */}
                  <h4 className="text-xl sm:text-2xl font-medium text-white mb-3 sm:mb-4 font-display">
                    {cred.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light font-body">
                    {cred.description}
                  </p>

                  {/* Decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`h-0.5 bg-gradient-to-r ${cred.gradient} mt-4 sm:mt-6 origin-left`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutLuisSection
