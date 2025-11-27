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
      {/* Neural network effect background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neural-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-psych-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 text-center">
        {/* Manifesto Opening */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 space-y-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white/60 text-lg lg:text-xl font-light leading-relaxed max-w-4xl mx-auto font-body"
          >
            {t('hero.manifesto1')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/70 text-lg lg:text-xl font-light leading-relaxed max-w-4xl mx-auto font-body"
          >
            {t('hero.manifesto2')}
          </motion.p>
        </motion.div>

        {/* Main Title with Neural Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="text-6xl lg:text-9xl font-bold mb-6 font-display"
        >
          <span className="text-neural bg-gradient-to-r from-neural-400 via-psych-500 to-design-500 bg-clip-text text-transparent">
            Ainimation
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/50 text-xl lg:text-2xl font-light tracking-wide mb-4 font-mono"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 1, ease: [0.76, 0, 0.24, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-neural-500/60 to-transparent mx-auto w-80 mb-12"
        />

        {/* Core message */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-white text-2xl lg:text-3xl font-medium leading-relaxed mb-8 max-w-4xl mx-auto font-display"
        >
          {t('hero.manifesto3')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-white/80 text-lg lg:text-xl font-light leading-relaxed mb-16 max-w-4xl mx-auto font-body"
        >
          {t('hero.manifesto4')}
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="/about"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.6 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-10 py-5 bg-neural-500/10 backdrop-blur-md border border-neural-500/30 rounded-full text-white text-sm tracking-wider uppercase font-medium hover:bg-neural-500/20 hover:border-neural-500/50 transition-all duration-500 shadow-2xl group font-mono"
        >
          <span>{t('hero.cta')}</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.a>

        {/* Decorative dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 1.8 }}
          className="mt-20 flex justify-center gap-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 0.4, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.8 + i * 0.1 }}
              className="w-1.5 h-1.5 bg-neural-500 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
