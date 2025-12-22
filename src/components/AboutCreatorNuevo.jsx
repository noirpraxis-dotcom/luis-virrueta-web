import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, ArrowRight, Eye, Heart, Compass, BookOpen, Users } from 'lucide-react'

const AboutCreator = () => {
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isContentInView = useInView(contentRef, { once: true, amount: 0.2 })

  return (
    <>
      {/* Hero Video Section */}
      <section 
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero Sobre mi.mp4" type="video/mp4" />
        </video>

        {/* Degradado en la parte inferior */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        {/* Contenido Principal */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 mb-4"
            >
              <Gem className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <span className="text-sm text-white/80 font-light tracking-wider uppercase">
                Sobre Mí
              </span>
            </motion.div>

            {/* Título principal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-display leading-tight"
            >
              <span className="block text-white text-6xl lg:text-9xl font-light" style={{ letterSpacing: '0.15em' }}>
                <span className="inline-block relative">
                  {/* L brillosa */}
                  <motion.span
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0.9, 0.6]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-white via-white to-white bg-clip-text text-transparent blur-lg"
                  >
                    L
                  </motion.span>
                  <span className="relative text-white">L</span>
                </span>
                UIS{' '}
                VIRUET
                <span className="inline-block relative">
                  {/* A brillosa */}
                  <motion.span
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0.9, 0.6]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute inset-0 bg-gradient-to-tl from-white via-white to-white bg-clip-text text-transparent blur-lg"
                  >
                    A
                  </motion.span>
                  <span className="relative text-white">A</span>
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/70 text-xl lg:text-2xl font-extralight tracking-wide max-w-3xl mx-auto leading-relaxed"
            >
              Psicólogo · Psicoanalista · Explorador
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section 
        ref={contentRef}
        className="relative bg-black py-24 lg:py-32 overflow-hidden"
      >
        {/* Orbs sutiles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Introducción cinemática */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto mb-24 text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-light text-white mb-8 font-display tracking-wide leading-[1.1]"
            >
              Acompaño procesos que{' '}
              <motion.span
                className="inline-block relative"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255, 255, 255, 0.3)',
                    '0 0 40px rgba(255, 255, 255, 0.5)',
                    '0 0 20px rgba(255, 255, 255, 0.3)',
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                transforman
              </motion.span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isContentInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/60 text-xl lg:text-2xl font-light leading-relaxed"
            >
              No desde el consejo, sino desde el inconsciente.
            </motion.p>
          </motion.div>

          {/* 3 Cards con animaciones de gradiente */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mb-24"
          >
            {/* Card Psicoanálisis */}
            <motion.div
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-2xl p-8 lg:p-10 border border-white/10 group"
            >
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                  backgroundSize: '200% 200%',
                  opacity: 0.15
                }}
                className="absolute inset-0"
              />
              <div className="relative">
                <Brain className="w-12 h-12 text-white/90 mb-6" strokeWidth={1.5} />
                <h3 className="text-2xl font-light text-white mb-4 tracking-wide">Psicoanálisis</h3>
                <p className="text-white/70 font-light leading-relaxed">
                  Estudié psicología y me especialicé en psicoanálisis. Pero no me conformé con ello: sigo explorando.
                </p>
              </div>
            </motion.div>

            {/* Card Culturas */}
            <motion.div
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-2xl p-8 lg:p-10 border border-white/10 group"
            >
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                  backgroundSize: '200% 200%',
                  opacity: 0.15
                }}
                className="absolute inset-0"
              />
              <div className="relative">
                <Compass className="w-12 h-12 text-white/90 mb-6" strokeWidth={1.5} />
                <h3 className="text-2xl font-light text-white mb-4 tracking-wide">Exploración</h3>
                <p className="text-white/70 font-light leading-relaxed">
                  Vivo en Europa explorando culturas y tradiciones. Mi vida es reflejo de mi búsqueda.
                </p>
              </div>
            </motion.div>

            {/* Card Religiones */}
            <motion.div
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-2xl p-8 lg:p-10 border border-white/10 group"
            >
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                  backgroundSize: '200% 200%',
                  opacity: 0.15
                }}
                className="absolute inset-0"
              />
              <div className="relative">
                <BookOpen className="w-12 h-12 text-white/90 mb-6" strokeWidth={1.5} />
                <h3 className="text-2xl font-light text-white mb-4 tracking-wide">Tradiciones</h3>
                <p className="text-white/70 font-light leading-relaxed">
                  Desde pequeño exploré religiones. Todas decían ser la verdadera. Busqué lo que compartían.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Storytelling Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-4xl mx-auto mb-24"
          >
            <div className="border-l-2 border-white/10 pl-8 py-6 space-y-8">
              <div className="flex items-start gap-4">
                <Eye className="w-6 h-6 text-white/60 mt-1 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-white/90 text-lg lg:text-xl font-light leading-relaxed mb-4">
                    Cada cultura tiene <span className="text-white font-normal">su verdad, sus símbolos, sus rituales</span>. Todas comparten algo más profundo.
                  </p>
                  <p className="text-white/70 text-base lg:text-lg font-light leading-relaxed">
                    Crecí en el catolicismo pero exploraba otras religiones. <span className="text-white">Todas decían ser la verdadera</span>. 
                    Busqué lo que compartían.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/[0.02] rounded-xl p-8 border border-white/5">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-white/80 text-lg font-light leading-relaxed italic">
                    "El psicoanálisis no da respuestas. Ayuda a <span className="text-white not-italic font-normal">hacer las preguntas correctas</span>. 
                    La vida es <span className="text-white not-italic font-normal">el reflejo de tu búsqueda</span>."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="text-center"
          >
            <a 
              href="https://wa.me/5218115936829?text=Hola%20Luis,%20me%20gustaría%20iniciar%20un%20proceso%20de%20acompañamiento" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-12 py-5 rounded-full backdrop-blur-sm bg-black/50 overflow-hidden"
              >
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.15
                  }}
                  className="absolute inset-0"
                />
                
                <span className="relative flex items-center gap-3 text-white/90 font-light text-lg tracking-wide">
                  Iniciemos tu proceso
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </motion.div>
                </span>

                <motion.div 
                  className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                />
              </motion.button>
            </a>
          </motion.div>

        </div>

        {/* Gradient fade to black at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
      </section>
    </>
  )
}

export default AboutCreator
