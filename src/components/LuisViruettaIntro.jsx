import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Sparkles, Palette, Code } from 'lucide-react'

const LuisViruettaIntro = () => {
  return (
    <section className="relative bg-black py-16 lg:py-24 overflow-hidden">
      {/* Gradient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#a855f7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#d946ef]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
          {/* Left: Photo - More compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="relative order-1 lg:order-1"
          >
            {/* Main circular photo container */}
            <div className="relative mx-auto w-full max-w-[380px] aspect-square">
              {/* Rotating gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#a855f7] p-[3px]"
              >
                <div className="w-full h-full rounded-full bg-black" />
              </motion.div>

              {/* Photo */}
              <div className="absolute inset-[3px] rounded-full overflow-hidden border-4 border-black shadow-2xl">
                <img 
                  src="/Luis.png" 
                  alt="Luis Virrueta"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#a855f7] to-[#d946ef] p-[2px] rounded-full shadow-2xl"
              >
                <div className="bg-black px-8 py-3 rounded-full flex items-center gap-3">
                  <Brain className="w-5 h-5 text-[#a855f7]" />
                  <span className="text-white text-sm font-medium tracking-wide">
                    Psych × Design × Tech
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content - CINEMÁTICO Y MINIMALISTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            {/* Eyebrow - minimal */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#d946ef]/70 text-xs font-mono uppercase tracking-[0.3em] mb-6"
            >
              Fundador
            </motion.p>

            {/* Name - Tipografía elegante y grande */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-extralight text-white mb-4 tracking-tight font-display leading-[0.95]"
            >
              Luis
              <br />
              <span className="bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#e879f9] bg-clip-text text-transparent font-light">
                Virrueta
              </span>
            </motion.h2>

            {/* Subtitle - elegante */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/50 text-sm font-light tracking-[0.2em] uppercase mb-10 font-mono"
            >
              Psych × Design × Tech
            </motion.p>

            {/* Quote cinemático - mensaje central */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mb-12"
            >
              <div className="absolute -left-4 top-0 text-6xl text-[#a855f7]/20 font-serif leading-none">"</div>
              <p className="text-white/90 text-2xl lg:text-3xl font-extralight leading-relaxed italic pl-8">
                Diseño marcas que se{' '}
                <span className="text-[#d946ef] not-italic font-light">sienten</span>{' '}
                antes de{' '}
                <span className="text-[#a855f7] not-italic font-light">entenderse</span>
              </p>
            </motion.div>

            {/* CTA Button - minimalista y elegante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
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
        </div>
      </div>
    </section>
  )
}

export default LuisViruettaIntro
