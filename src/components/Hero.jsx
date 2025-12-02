import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Brain, Sparkles, Zap, ChevronDown, ArrowRight } from 'lucide-react'
import ArchetypesModal from './ArchetypesModal'

const Hero = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })
  const [isArchetypesModalOpen, setIsArchetypesModalOpen] = useState(false)
  
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
      className="relative bg-[#0A0A0A] flex items-center justify-center py-20 lg:py-24 overflow-hidden"
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
          className="absolute top-1/4 -left-20 lg:left-1/4 w-72 lg:w-[600px] h-72 lg:h-[600px] bg-[#a855f7] rounded-full blur-3xl"
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
          className="absolute bottom-1/4 -right-20 lg:right-1/4 w-64 lg:w-[500px] h-64 lg:h-[500px] bg-[#d946ef] rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 lg:w-96 h-48 lg:h-96 bg-gradient-to-r from-[#a855f7] to-[#d946ef] rounded-full blur-3xl"
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
              className="absolute inset-0 bg-[#a855f7] rounded-full blur-xl"
            />
            <Brain className="relative w-12 h-12 text-[#a855f7] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" strokeWidth={1.5} />
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
              className="absolute inset-0 bg-[#d946ef] rounded-full blur-xl"
            />
            <Sparkles className="relative w-10 h-10 text-[#d946ef] drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]" strokeWidth={1.5} />
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
              className="absolute inset-0 bg-[#e879f9] rounded-full blur-xl"
            />
            <Zap className="relative w-10 h-10 text-[#e879f9] drop-shadow-[0_0_15px_rgba(232,121,249,0.5)]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Stats Grid - Minimalista y elegante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="mb-20 lg:mb-24"
        >
          {/* Manifesto principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white text-3xl sm:text-4xl lg:text-5xl font-extralight leading-tight max-w-4xl mx-auto mb-16 text-center"
          >
            {t('hero.manifesto1')}
          </motion.h2>

          {/* Stats compactos */}
          <div className="flex flex-wrap justify-center gap-12 lg:gap-16 mb-12">
            {/* Stat 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent mb-2">
                95%
              </div>
              <p className="text-white/50 text-xs lg:text-sm font-light uppercase tracking-wider">
                Decisiones<br />Inconscientes
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#d946ef] to-[#e879f9] bg-clip-text text-transparent mb-2">
                7s
              </div>
              <p className="text-white/50 text-xs lg:text-sm font-light uppercase tracking-wider">
                Primera<br />Impresión
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <div className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#e879f9] to-[#a855f7] bg-clip-text text-transparent mb-2">
                80%
              </div>
              <p className="text-white/50 text-xs lg:text-sm font-light uppercase tracking-wider">
                Identidad<br />Visual
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name - LUXMANIA reducido para elegancia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 1, 
            delay: 0.4, 
            ease: [0.6, 0.05, 0.01, 0.9]
          }}
          className="mb-5 lg:mb-6 relative"
        >
          <motion.h1 
            className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display leading-tight tracking-wide"
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
        </motion.div>

        {/* Subtitle minimalista */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/30 text-xs font-light tracking-[0.4em] mb-10 font-mono uppercase"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Button - Arquetipos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex justify-center"
        >
          {/* Archetipos CTA */}
          <motion.button
            onClick={() => setIsArchetypesModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-3 bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white rounded-full font-medium text-sm tracking-wide hover:shadow-lg hover:shadow-[#a855f7]/50 transition-all duration-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Descubre tu Arquetipo</span>
          </motion.button>
        </motion.div>


      </motion.div>

      {/* Archetipos Modal */}
      <ArchetypesModal 
        isOpen={isArchetypesModalOpen} 
        onClose={() => setIsArchetypesModalOpen(false)} 
      />
    </section>
  )
}

export default Hero
