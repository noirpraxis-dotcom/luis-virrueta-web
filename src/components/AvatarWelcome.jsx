import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'

const AvatarWelcome = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative bg-[#0A0A0A] py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* Magical gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0066FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#D4AF37]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          {/* Magic sparkles */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4 mb-6"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Wand2 className="w-6 h-6 text-[#0066FF]" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-display"
          >
            Welcome to{' '}
            <span 
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #d4d4d8 0%, #fafafa 25%, #e4e4e7 50%, #ffffff 75%, #d4d4d8 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255,255,255,0.3)',
                letterSpacing: '0.05em'
              }}
            >
              LUXMANIA
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/60 text-base sm:text-lg lg:text-xl italic"
          >
            La magia de crear identidades infinitas
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="h-px bg-gradient-to-r from-transparent via-[#0066FF]/40 to-transparent mx-auto w-64 mt-6"
          />
        </motion.div>

        {/* Video Container - Compact and elegant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          className="relative max-w-sm mx-auto"
        >
          {/* Decorative glow - more subtle */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0066FF]/15 via-transparent to-[#D4AF37]/15 rounded-2xl blur-xl -z-10 scale-105" />
          
          {/* Video wrapper - more compact with rounded borders */}
          <div className="relative bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            {/* YouTube Shorts embed - Adjusted for actual video size */}
            <div className="relative w-full" style={{ paddingBottom: '155%' }}> {/* Adjusted aspect ratio for tighter fit */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/XonEErWLLTA"
                title="Welcome to LUXMANIA - Avatar Showcase"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Overlay gradient on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-[#0066FF]/10 via-transparent to-transparent pointer-events-none"
            />
          </div>

          {/* Floating particles - more subtle */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-3 -right-3 w-16 h-16 bg-[#D4AF37]/15 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#0066FF]/15 rounded-full blur-xl"
          />
        </motion.div>

        {/* Service label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-8 sm:mt-10"
        >
          <motion.a
            href="#servicios"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#0066FF] transition-colors duration-300 group"
          >
            <Sparkles className="w-4 h-4 group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest">
              Creación de Avatares IA
            </span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default AvatarWelcome
