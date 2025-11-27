import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

const Hero = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })

  return (
    <section 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center py-24 lg:py-32"
    >
      {/* Cinematic gradient orbs - mobile optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.15 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 -left-20 lg:left-1/4 w-64 lg:w-96 h-64 lg:h-96 bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.15 } : {}}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-1/4 -right-20 lg:right-1/4 w-64 lg:w-96 h-64 lg:h-96 bg-fuchsia-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.1 } : {}}
          transition={{ duration: 2, delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 lg:w-80 h-48 lg:h-80 bg-cyan-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        {/* Manifesto Opening - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 lg:mb-16 space-y-4 sm:space-y-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white/60 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-4xl mx-auto"
          >
            {t('hero.manifesto1')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/70 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-4xl mx-auto"
          >
            {t('hero.manifesto2')}
          </motion.p>
        </motion.div>

        {/* Main Title with Cinematic Gradient - Mobile First */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-4 sm:mb-6 font-display leading-tight"
        >
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            Ainimation
          </span>
        </motion.h1>

        {/* Subtitle - Mobile optimized */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/50 text-sm sm:text-base lg:text-xl font-light tracking-wider mb-3 sm:mb-4 font-mono uppercase"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Decorative line - Mobile responsive */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 1, ease: [0.76, 0, 0.24, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent mx-auto w-48 sm:w-64 lg:w-80 mb-8 sm:mb-12"
        />

        {/* Core message - Mobile First */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed mb-6 sm:mb-8 max-w-4xl mx-auto font-display"
        >
          {t('hero.manifesto3')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-white/80 text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-12 sm:mb-16 max-w-4xl mx-auto"
        >
          {t('hero.manifesto4')}
        </motion.p>

        {/* CTA Button - Mobile First */}
        <motion.a
          href="/about"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.6 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-md border border-purple-500/30 rounded-full text-white text-xs sm:text-sm tracking-wider uppercase font-medium hover:border-fuchsia-500/50 hover:shadow-lg hover:shadow-fuchsia-500/20 transition-all duration-500 group font-mono"
        >
          <span>{t('hero.cta')}</span>
          <motion.svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.a>

        {/* Decorative dots - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 1.8 }}
          className="mt-12 sm:mt-16 lg:mt-20 flex justify-center gap-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 0.4, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.8 + i * 0.1 }}
              className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
