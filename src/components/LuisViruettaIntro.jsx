import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Sparkles, Palette, Code } from 'lucide-react'

const LuisViruettaIntro = () => {
  return (
    <section className="relative bg-black py-16 lg:py-24 overflow-hidden">
      {/* Gradient background effects - Intensos y luminosos fucsia/morado/azul */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Degradado principal - fucsia/morado hacia la foto */}
        <div className="absolute top-[15%] right-[20%] w-[700px] h-[700px] bg-gradient-to-br from-[#d946ef]/25 via-[#a855f7]/20 to-[#7c3aed]/15 rounded-full blur-3xl" />
        {/* Degradado secundario - azul/violeta intenso */}
        <div className="absolute top-[35%] right-[28%] w-[550px] h-[550px] bg-gradient-to-bl from-[#6366f1]/20 via-[#8b5cf6]/15 to-transparent rounded-full blur-3xl" />
        {/* Degradado inferior - fucsia difuminado hacia abajo */}
        <div className="absolute bottom-[-180px] right-[22%] w-[850px] h-[850px] bg-gradient-to-t from-[#d946ef]/20 via-[#c026d3]/15 to-transparent rounded-full blur-3xl" />
        {/* Degradado izquierdo - complemento luminoso */}
        <div className="absolute top-[50%] left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-[#a855f7]/15 via-[#e879f9]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left: Content - CINEMÁTICO Y MINIMALISTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            {/* Eyebrow - minimal con icono */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <Brain className="w-5 h-5 text-[#a855f7]" strokeWidth={1.5} />
              <p className="text-[#d946ef]/70 text-xs font-mono uppercase tracking-[0.3em]">
                Sobre el Creador
              </p>
            </motion.div>

            {/* Main heading - Tipografía elegante con nombre */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-extralight text-white mb-8 tracking-tight font-display leading-tight"
            >
              Luis{' '}
              <span className="bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#e879f9] bg-clip-text text-transparent font-light">
                Virrueta
              </span>
            </motion.h2>

            {/* Subtitle descriptivo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-white/80 text-xl lg:text-2xl font-light mb-12"
            >
              Psicólogo que diseña marcas
            </motion.p>

            {/* Description - Enfocado en psicología/diseño/tech */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/60 text-lg lg:text-xl font-light leading-relaxed mb-12 max-w-xl"
            >
              Combinando{' '}
              <span className="text-[#a855f7]">psicología del comportamiento</span>,{' '}
              <span className="text-[#d946ef]">diseño estratégico</span> y{' '}
              <span className="text-[#e879f9]">tecnología</span>,{' '}
              creo identidades de marca que conectan emocionalmente antes de ser comprendidas racionalmente.
            </motion.p>

            {/* CTA Button - minimalista y elegante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/sobre-mi">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-transparent border border-[#d946ef]/30 hover:border-[#d946ef] px-8 py-3 rounded-full text-white font-light text-base tracking-wide transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-white/70 group-hover:text-white transition-colors">Conocer más</span>
                    <ArrowRight className="w-4 h-4 text-[#d946ef] group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  {/* Hover gradient fill */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#a855f7]/10 to-[#d946ef]/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Video horizontal - Static border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Video container horizontal */}
            <div className="relative mx-auto w-full max-w-[500px]">
              {/* Static gradient border */}
              <div className="relative rounded-2xl bg-gradient-to-br from-[#a855f7] via-[#d946ef] to-[#e879f9] p-[3px]">
                <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl">
                  {/* Loading animation - Brain pulse */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-[#0A0A0A] to-black z-10"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Brain className="w-16 h-16 text-[#a855f7]" />
                    </motion.div>
                  </motion.div>

                  {/* YouTube Video Embed */}
                  <iframe
                    src="https://www.youtube.com/embed/PR7GISY0yPM?autoplay=1&mute=1&loop=1&playlist=PR7GISY0yPM&controls=0&modestbranding=1&rel=0&showinfo=0"
                    title="Luis Virrueta Presentación"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                  />
                </div>
              </div>

              {/* Floating badge con iconos individuales - PERFECTAMENTE CENTRADO */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7c3aed] via-[#d946ef] to-[#8b5cf6] p-[2px] rounded-full shadow-2xl"
              >
                <div className="bg-black px-5 py-2 rounded-full flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 text-[#a855f7]" strokeWidth={2} />
                  <span className="text-white/90 text-xs font-medium tracking-wider whitespace-nowrap">
                    Psych
                  </span>
                  <span className="text-white/30 text-xs">×</span>
                  <Palette className="w-4 h-4 text-[#d946ef]" strokeWidth={2} />
                  <span className="text-white/90 text-xs font-medium tracking-wider whitespace-nowrap">
                    Design
                  </span>
                  <span className="text-white/30 text-xs">×</span>
                  <Code className="w-4 h-4 text-[#8b5cf6]" strokeWidth={2} />
                  <span className="text-white/90 text-xs font-medium tracking-wider whitespace-nowrap">
                    Tech
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default LuisViruettaIntro
