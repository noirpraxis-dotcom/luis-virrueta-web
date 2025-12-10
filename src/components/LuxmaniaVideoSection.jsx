import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Brain, Palette, Code, Play, Volume2, Gem, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const LuxmaniaVideoSection = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Array de palabras que van rotando - traducidas
  const words = t('home.luxmaniaSection.words')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  // Cambiar palabra cada 2.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <section ref={ref} className="relative bg-black py-16 lg:py-24 overflow-x-hidden">
      {/* Video de fondo - De lado a lado COMPLETO */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover opacity-40 pointer-events-none"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(1.1) contrast(1.2) saturate(1.25)'
          }}
        >
          <source src="/LUXMANIA HOME.mp4" type="video/mp4" />
        </video>
        
        {/* Degradados arriba y abajo para blend perfecto */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        
        {/* Overlay sutil para mantener legibilidad */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Orbs sutiles encima del video */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 w-full max-w-[95vw] sm:max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left: Texto elegante */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            {/* Contenido */}
            <div className="relative z-10 p-4 sm:p-6 lg:p-12">
            {/* Título principal - LUXMANIA con L y última A brillosas */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-light text-white mb-6 tracking-[0.05em] sm:tracking-[0.12em] lg:tracking-[0.15em] font-display leading-[1.05]"
            >
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
              UXMANI
              <span className="inline-block relative">
                {/* Última A brillosa */}
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
            </motion.h2>

            {/* Subtítulo con animación de palabras rotando */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-white/50 text-sm lg:text-base font-light uppercase tracking-[0.3em] mb-6"
            >
              {t('home.luxmaniaSection.subtitle')}
            </motion.p>

            {/* Mensaje central con palabra animada - ALINEADO PERFECTO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-4 max-w-xl"
            >
              <div className="text-xl lg:text-2xl font-extralight tracking-wide leading-relaxed flex items-center gap-2">
                <span className="text-white/70">{t('home.luxmaniaSection.weDesign')}</span>
                <div className="relative inline-block min-w-[180px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWordIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block text-white font-light"
                      style={{
                        textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {words[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Descripción complementaria */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-white/50 text-base lg:text-lg font-light leading-relaxed mb-10 max-w-xl"
            >
              {t('home.luxmaniaSection.description')}{' '}
              <span className="text-white/70">{t('home.luxmaniaSection.feelBefore')}</span>.
            </motion.p>

            {/* Badges con degradado animado - IGUAL A LUIS VIRRUETA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-10"
            >
              {/* Badge Psicología */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-3 sm:px-4 py-2 sm:py-2.5 rounded-full cursor-pointer"
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
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.15
                  }}
                />
                <div className="relative flex items-center gap-1.5 sm:gap-2">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-white/80 group-hover:text-white text-xs sm:text-sm font-light transition-colors tracking-wide">{t('home.luxmaniaSection.psychology')}</span>
                </div>
              </motion.div>

              <span className="text-white/30 text-xs mx-0.5 sm:mx-1">+</span>

              {/* Badge Diseño */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-3 sm:px-4 py-2 sm:py-2.5 rounded-full cursor-pointer"
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
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 25%, #3b82f6 50%, #8b5cf6 75%, #6366f1 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.15
                  }}
                />
                <div className="relative flex items-center gap-1.5 sm:gap-2">
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-white/80 group-hover:text-white text-xs sm:text-sm font-light transition-colors tracking-wide">{t('home.luxmaniaSection.design')}</span>
                </div>
              </motion.div>

              <span className="text-white/30 text-xs mx-0.5 sm:mx-1">+</span>

              {/* Badge Tecnología */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-3 sm:px-4 py-2 sm:py-2.5 rounded-full cursor-pointer"
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
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 25%, #a855f7 50%, #3b82f6 75%, #8b5cf6 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.15
                  }}
                />
                <div className="relative flex items-center gap-1.5 sm:gap-2">
                  <Code className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-white/80 group-hover:text-white text-xs sm:text-sm font-light transition-colors tracking-wide">{t('home.luxmaniaSection.technology')}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Quote sobre percepción - Minimal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="relative mb-10"
            >
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              
              <div className="relative pl-8 space-y-1">
                <Palette className="absolute left-0 top-2 w-5 h-5 text-white/40" strokeWidth={1.5} />

                <p className="text-white/60 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  {t('home.luxmaniaSection.quote1')}{' '}
                  <span className="text-white font-normal">
                    {t('home.luxmaniaSection.quote1Bold')}
                  </span>.
                </p>

                <p className="text-white/60 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  {t('home.luxmaniaSection.quote2')}{' '}
                  <span className="text-white font-normal">
                    {t('home.luxmaniaSection.quote2Bold')}
                  </span>.
                </p>

                <p className="text-white/60 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  {t('home.luxmaniaSection.quote3')}{' '}
                  <span className="text-white font-normal">
                    {t('home.luxmaniaSection.quote3Bold')}
                  </span>.
                </p>
              </div>

              <motion.div 
                className="mt-4 h-[1px] bg-gradient-to-r from-white/20 to-transparent max-w-md"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>

            </div>
            {/* Fin del contenedor con video background */}
          </motion.div>

          {/* Right: Video vertical con play button funcional */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative flex justify-center"
          >
            <div className="relative w-[85vw] sm:w-[70vw] md:w-[60vw] lg:w-full max-w-[500px]">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-black shadow-2xl">
                {/* YouTube iframe - se actualiza el src cuando se hace play */}
                <iframe
                  ref={videoRef}
                  src={`https://www.youtube.com/embed/OUsF8K7G810?${isPlaying ? 'autoplay=1&mute=0' : 'autoplay=0&mute=1'}&loop=1&playlist=OUsF8K7G810&controls=1&modestbranding=1&rel=0&showinfo=0`}
                  title="Luxmania - Cómo construimos marcas"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={`w-full h-full object-cover transition-all duration-500 pointer-events-none ${!isPlaying ? 'opacity-40 blur-sm scale-105' : 'opacity-100'}`}
                />

                {/* Overlay con botón play y copy */}
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 flex flex-col items-center justify-center cursor-pointer z-10"
                    onClick={handlePlay}
                  >
                    {/* Copy arriba del botón */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-center mb-8 px-6"
                    >
                      <p className="text-white text-base sm:text-lg lg:text-xl font-light mb-2 leading-relaxed">
                        {t('home.luxmaniaSection.videoOverlay')}
                      </p>
                      <p className="text-white/70 text-sm sm:text-base font-light">
                        {t('home.luxmaniaSection.videoOverlayBrand')}
                      </p>
                    </motion.div>

                    {/* Botón Play */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlay}
                      aria-label="Reproducir video de Luxmania"
                      className="relative group/btn mb-8"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover/btn:bg-white/30 transition-colors" />
                      <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/40 rounded-full flex items-center justify-center group-hover/btn:border-white/60 group-hover/btn:bg-white/20 transition-all">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" strokeWidth={1.5} />
                      </div>
                    </motion.button>

                    {/* Badge con volumen */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-black/70 backdrop-blur-md border border-white/30 rounded-full">
                        <Volume2 className="w-4 h-4 text-white animate-pulse" strokeWidth={1.5} />
                        <span className="text-xs text-white font-light tracking-wide">
                          {t('home.luxmaniaSection.turnUpVolume')}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Floating badge minimal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-[-30px] sm:bottom-[-20px] left-1/2 -translate-x-1/2 mx-auto bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-2xl"
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-[10px] sm:text-xs font-light tracking-wider whitespace-nowrap">
                    Psych
                  </span>
                  <span className="text-white/30 text-[10px] sm:text-xs">×</span>
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-[10px] sm:text-xs font-light tracking-wider whitespace-nowrap">
                    Design
                  </span>
                  <span className="text-white/30 text-[10px] sm:text-xs">×</span>
                  <Code className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-[10px] sm:text-xs font-light tracking-wider whitespace-nowrap">
                    Tech
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Espaciado adicional para el badge flotante en móvil */}
      <div className="h-12 sm:h-0" />

      {/* Gradient fade to black at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
    </section>
  )
}

export default LuxmaniaVideoSection
