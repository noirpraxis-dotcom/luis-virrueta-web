import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, Bot, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const AvatarWelcome = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative bg-black pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden"
    >
      {/* Gradient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#0066FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Two column layout - desktop side by side, mobile stacked */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-2 lg:order-1"
          >
            {/* Eyebrow with icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <Bot className="w-6 h-6 text-[#0066FF]" />
              <p className="text-[#D4AF37] text-sm font-mono uppercase tracking-widest">
                Nuestros Avatares IA
              </p>
            </motion.div>

            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-light text-white mb-6 tracking-tight font-display leading-tight"
            >
              Welcome to{' '}
              <span 
                className="block lg:inline"
                style={{
                  background: 'linear-gradient(135deg, #a8a9ad 0%, #ffffff 20%, #d4d4d8 40%, #fafafa 60%, #e4e4e7 80%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.25))',
                  letterSpacing: '0.08em'
                }}
              >
                LUXMANIA
              </span>
            </motion.h2>

            {/* Gradient line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-[2px] bg-gradient-to-r from-[#0066FF] via-[#D4AF37] to-transparent w-48 mb-8 origin-left"
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/80 text-lg lg:text-xl leading-relaxed mb-8"
            >
              Nuestros avatares digitales te dan la bienvenida. 
              <span className="text-white font-medium"> Representa tu marca 24/7</span>, 
              humaniza tu comunicación y conecta emocionalmente con tu audiencia.
            </motion.p>

            {/* Benefits list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-3 mb-10"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                <p className="text-white/70 text-base">
                  Portavoz digital de tu marca con tu personalidad
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#0066FF] mt-1 flex-shrink-0" />
                <p className="text-white/70 text-base">
                  Contenido escalable para redes sociales y campañas
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                <p className="text-white/70 text-base">
                  Conexión emocional real con tu audiencia
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link to="/servicios/avatares-ia">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-gradient-to-r from-[#0066FF] to-[#D4AF37] px-8 py-4 rounded-full text-white font-semibold flex items-center gap-3 shadow-2xl"
                >
                  Creación de Avatares IA
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Circular video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Circular video container */}
            <div className="relative mx-auto w-full max-w-[450px] aspect-square">
              {/* Rotating gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0066FF] via-[#D4AF37] to-[#0066FF] p-[3px]"
              >
                <div className="w-full h-full rounded-full bg-black" />
              </motion.div>

              {/* Video */}
              <div className="absolute inset-[3px] rounded-full overflow-hidden border-4 border-black shadow-2xl">
                <div className="relative w-full h-full">
                  <iframe
                    className="absolute inset-0 w-full h-full scale-150"
                    src="https://www.youtube.com/embed/XonEErWLLTA?autoplay=1&mute=1&loop=1&playlist=XonEErWLLTA&controls=0&modestbranding=1"
                    title="Welcome to LUXMANIA"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>

              {/* Floating particles */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-[#D4AF37]/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#0066FF]/20 rounded-full blur-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AvatarWelcome
