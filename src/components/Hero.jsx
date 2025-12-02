import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Brain, Sparkles, Zap, ChevronDown } from 'lucide-react'

const Hero = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })
  
  // Parallax effect
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Floating particles data
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5
  }))

  return (
    <section 
      ref={ref}
      className="relative min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-8 pb-24 lg:pt-12 lg:pb-32 overflow-hidden"
    >
      {/* Animated gradient orbs with continuous motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-20 lg:left-1/4 w-72 lg:w-[600px] h-72 lg:h-[600px] bg-[#0066FF] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.12, 0.08],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 -right-20 lg:right-1/4 w-64 lg:w-[500px] h-64 lg:h-[500px] bg-[#D4AF37] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.06, 0.12, 0.06],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 lg:w-96 h-48 lg:h-96 bg-gradient-to-r from-[#0066FF] to-[#D4AF37] rounded-full blur-3xl"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center z-10"
        style={{ y: y2 }}
      >
        {/* Floating Icons with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { 
            opacity: [0, 0.6, 0.3, 0.6, 0], 
            y: [0, -20, -10, -20, 0],
            rotate: [0, 10, -5, 15, 0],
            scale: [0, 1.2, 1, 1.1, 0]
          } : {}}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-8 left-[15%] hidden lg:block"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#0066FF] rounded-full blur-xl"
            />
            <Brain className="relative w-12 h-12 text-[#0066FF] drop-shadow-[0_0_15px_rgba(0,102,255,0.5)]" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { 
            opacity: [0, 0.7, 0.4, 0.7, 0], 
            x: [0, 15, 5, 15, 0],
            y: [0, -10, -5, -12, 0],
            rotate: [0, -15, 5, -20, 0],
            scale: [0, 1.3, 1, 1.2, 0]
          } : {}}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 right-[18%] hidden lg:block"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 bg-[#D4AF37] rounded-full blur-xl"
            />
            <Sparkles className="relative w-10 h-10 text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { 
            opacity: [0, 0.5, 0.3, 0.6, 0], 
            x: [0, -12, -5, -15, 0],
            y: [0, 15, 8, 18, 0],
            rotate: [0, 20, -10, 25, 0],
            scale: [0, 1.1, 1, 1.15, 0]
          } : {}}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-[20%] hidden lg:block"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute inset-0 bg-[#0066FF] rounded-full blur-xl"
            />
            <Zap className="relative w-10 h-10 text-[#0066FF] drop-shadow-[0_0_15px_rgba(0,102,255,0.5)]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Manifesto Opening with cinematic reveal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="mb-12 sm:mb-16 lg:mb-20 space-y-8 sm:space-y-10"
        >
          {/* Decorative top line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 0.3 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto w-32 mb-8"
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight max-w-5xl mx-auto relative"
          >
            <motion.span
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.1)",
                  "0 0 40px rgba(255,255,255,0.2)",
                  "0 0 20px rgba(255,255,255,0.1)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {t('hero.manifesto1')}
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/60 text-lg sm:text-xl lg:text-2xl font-light leading-relaxed max-w-4xl mx-auto"
          >
            {t('hero.manifesto2')}
          </motion.p>

          {/* Decorative bottom dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center gap-2 pt-4"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-1.5 h-1.5 rounded-full bg-white/40"
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Brand Name - LUXMANIA with epic reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ 
            duration: 1.5, 
            delay: 1, 
            ease: [0.6, 0.05, 0.01, 0.9]
          }}
          className="mb-8 sm:mb-10 relative"
        >
          {/* Animated glow behind text */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#0066FF]/20 via-white/30 to-[#D4AF37]/20"
            style={{ transform: 'translateY(20px)' }}
          />

          <motion.h1 
            className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-display leading-tight tracking-wide"
            animate={{
              filter: [
                'drop-shadow(0 0 30px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                'drop-shadow(0 0 50px rgba(255,255,255,0.5)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                'drop-shadow(0 0 30px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(135deg, #a8a9ad 0%, #ffffff 25%, #d4d4d8 45%, #fafafa 65%, #e4e4e7 85%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.08em',
              animation: 'chrome-shine 8s ease-in-out infinite'
            }}
          >
            LUXMANIA
          </motion.h1>

          {/* Decorative lines */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 1.3 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-px"
          >
            <motion.div
              animate={{
                background: [
                  'linear-gradient(90deg, transparent, rgba(0,102,255,0.5), transparent)',
                  'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
                  'linear-gradient(90deg, transparent, rgba(0,102,255,0.5), transparent)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/40 text-xs sm:text-sm lg:text-base font-light tracking-[0.3em] mb-12 font-mono uppercase"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 1, ease: [0.76, 0, 0.24, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-[#0066FF]/40 to-transparent mx-auto w-48 sm:w-64 lg:w-96 mb-12 sm:mb-16"
        />

        {/* Core message */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-white/90 text-lg sm:text-xl lg:text-2xl font-light leading-relaxed mb-16 sm:mb-20 max-w-5xl mx-auto"
        >
          {t('hero.manifesto3')}
        </motion.p>

        {/* CTA Buttons with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center items-center"
        >
          <motion.a
            href="#metodo"
            whileHover={{ 
              scale: 1.08, 
              y: -4,
              boxShadow: "0 20px 60px rgba(0,102,255,0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-10 sm:px-12 py-5 sm:py-6 bg-[#0066FF] text-white rounded-full text-sm sm:text-base font-semibold tracking-wide uppercase overflow-hidden shadow-lg shadow-[#0066FF]/30"
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#0066FF]"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <span className="relative z-10">{t('hero.cta')}</span>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="relative z-10 w-5 h-5" />
            </motion.div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.a>
          
          <motion.a
            href="#portfolio"
            whileHover={{ 
              scale: 1.08, 
              y: -4,
              borderColor: 'rgba(212,175,55,0.8)'
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-10 sm:px-12 py-5 sm:py-6 bg-transparent border-2 border-white/20 text-white rounded-full text-sm sm:text-base font-semibold tracking-wide uppercase overflow-hidden transition-colors duration-300"
          >
            {/* Hover fill effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 group-hover:text-[#D4AF37] transition-colors">
              {t('hero.cta2')}
            </span>

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(212,175,55,0)',
                  '0 0 0 4px rgba(212,175,55,0.2)',
                  '0 0 0 0 rgba(212,175,55,0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.a>
        </motion.div>

        {/* Scroll indicator with cinematic animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, delay: 2 }}
          className="mt-20 sm:mt-24 lg:mt-28"
        >
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex flex-col items-center gap-3 cursor-pointer group"
          >
            {/* Animated circle */}
            <motion.div
              className="relative w-8 h-12 border-2 border-white/20 rounded-full"
              whileHover={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              <motion.div
                animate={{
                  y: [0, 16, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/60 rounded-full"
              />
            </motion.div>

            {/* Chevron */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
            </motion.div>

            {/* Ripple effect */}
            <motion.div
              className="absolute bottom-0 w-20 h-20 border border-white/10 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
