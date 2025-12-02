import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Sparkles, Palette, Code } from 'lucide-react'

const LuisViruettaIntro = () => {
  return (
    <section className="relative bg-black py-16 lg:py-24 overflow-hidden">
      {/* Transición sutil superior */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/0 via-black/30 to-black pointer-events-none" />
      
      {/* Transición sutil inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/0 via-black/30 to-black pointer-events-none" />
      
      {/* Gradient background effects - Elegante azul + fucsia MÁS VISIBLES */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[#7c3aed]/15 via-[#a855f7]/20 to-[#6366f1]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-[#d946ef]/15 via-[#c026d3]/20 to-[#8b5cf6]/12 rounded-full blur-3xl" />
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

          {/* Right: Photo - Static border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Main circular photo container */}
            <div className="relative mx-auto w-full max-w-[380px] aspect-square">
              {/* Static gradient ring - SIN ROTAR */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#a855f7] via-[#d946ef] to-[#e879f9] p-[3px]">
                <div className="w-full h-full rounded-full bg-black" />
              </div>

              {/* Photo */}
              <div className="absolute inset-[3px] rounded-full overflow-hidden border-4 border-black shadow-2xl">
                <img 
                  src="/Luis.png" 
                  alt="Luis Virrueta"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge con iconos individuales */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7c3aed] via-[#d946ef] to-[#8b5cf6] p-[2px] rounded-full shadow-2xl"
              >
                <div className="bg-black px-6 py-2.5 rounded-full flex items-center gap-2">
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
