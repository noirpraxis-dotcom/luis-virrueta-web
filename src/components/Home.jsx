import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Palette, Code, Gem } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="relative h-screen w-full overflow-x-hidden overflow-y-auto flex items-center justify-center pt-16 md:pt-0 lg:pt-0"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          filter: 'contrast(1.1) saturate(1.2) brightness(1.05)',
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      >
        <source src="/HERO HOME.mp4" type="video/mp4" />
      </video>

      {/* Degradado sutil en la parte inferior para transición suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

      {/* Overlay oscuro cinematográfico - Más transparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Orbs sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 w-full max-w-[95vw] sm:max-w-6xl mx-auto px-4 md:px-8 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge superior - Estilo Portafolio - COMPACTO MÓVIL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 mb-4"
          >
            <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm md:text-base text-white/80 font-light tracking-wide whitespace-nowrap uppercase">
              {t('home.badge')}
            </span>
          </motion.div>

          {/* Título principal con efecto 3D - Estilo Portafolio */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display leading-tight mb-8"
          >
            {/* Construimos - más pequeño */}
            <span className="block text-white/70 text-lg sm:text-xl md:text-2xl lg:text-4xl mb-2 sm:mb-3" style={{ fontWeight: 200, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t('home.weBuild')}
            </span>
            
            {/* Tu Marca / Your Brand - MUY GRANDE EN MÓVIL */}
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl" style={{ 
              letterSpacing: '0.04em',
              fontWeight: 300,
              textTransform: 'uppercase'
            }}>
              {(() => {
                const brandText = t('home.yourBrand')
                const firstLetter = brandText.charAt(0)
                const lastLetter = brandText.charAt(brandText.length - 1)
                const middleText = brandText.slice(1, -1)
                
                return (
                  <span className="relative inline-block">
                    {/* Primera letra con efecto lumínico */}
                    <span className="relative inline-block">
                      <motion.span
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 0.9, 0.6]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-white via-white to-white bg-clip-text text-transparent blur-lg"
                      >
                        {firstLetter}
                      </motion.span>
                      <span className="relative text-white">{firstLetter}</span>
                    </span>
                    {/* Texto del medio */}
                    <span className="text-white">{middleText}</span>
                    {/* Última letra con efecto lumínico */}
                    <span className="relative inline-block">
                      <motion.span
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 0.9, 0.6]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.3
                        }}
                        className="absolute inset-0 bg-gradient-to-tl from-white via-white to-white bg-clip-text text-transparent blur-lg"
                      >
                        {lastLetter}
                      </motion.span>
                      <span className="relative text-white">{lastLetter}</span>
                    </span>
                  </span>
                )
              })()}
            </span>
          </motion.h1>

          {/* Fórmula con iconos - Estilo Portafolio */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 lg:gap-4 flex-wrap justify-center mb-8"
          >
            {/* Psicología */}
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-white/70" strokeWidth={1.5} />
              <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                {t('home.psychology')}
              </span>
            </div>

            <span className="text-white/40 text-xs">+</span>

            {/* Diseño */}
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-white/70" strokeWidth={1.5} />
              <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                {t('home.design')}
              </span>
            </div>

            <span className="text-white/40 text-xs">+</span>

            {/* Tecnología */}
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-white/70" strokeWidth={1.5} />
              <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                {t('home.technology')}
              </span>
            </div>
          </motion.div>

          {/* Línea decorativa animada */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-px mx-auto w-80 overflow-hidden mb-8"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>

          {/* Botones CTA - Mejorados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center gap-6 pt-4"
          >
            {/* Contenedor de botones */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              {/* Botón principal - Más elegante */}
              <Link
                to="/servicios"
                className="group relative px-10 py-5 md:px-12 md:py-6 bg-white text-black font-light rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_80px_rgba(255,255,255,0.3)]"
              >
                {/* Efecto shine continuo */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
                <span className="relative z-10 flex items-center gap-3 text-base md:text-lg tracking-wide">
                  <span>{t('home.ctaPrimary')}</span>
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              </Link>

              {/* Botón secundario - Más sutil */}
              <a
                href={`https://wa.me/420776711575?text=${encodeURIComponent(t('home.whatsappMessage'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 md:px-12 md:py-6 text-white font-light rounded-full border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm transition-opacity duration-300 group-hover:bg-white/10" />
                <span className="relative z-10 flex items-center gap-3 text-base md:text-lg tracking-wide">
                  <span>{t('home.ctaSecondary')}</span>
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </a>
            </div>

            {/* Texto aclaratorio debajo de botones */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-white/40 text-xs md:text-sm font-extralight tracking-wider text-center max-w-md mb-8 lg:mb-0"
            >
              {t('home.ctaSubtitle')}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator con texto - MÁS PEQUEÑO Y SEPARADO EN MÓVIL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/50 text-[10px] sm:text-xs font-light tracking-widest uppercase"
        >
          {t('home.scrollText')}
        </motion.p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5 sm:p-2"
        >
          <div className="w-0.5 h-1.5 sm:w-1 sm:h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Home
