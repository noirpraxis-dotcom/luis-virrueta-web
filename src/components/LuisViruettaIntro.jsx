import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Sparkles, Palette, Code } from 'lucide-react'

const LuisViruettaIntro = () => {
  return (
    <section className="relative bg-black py-20 lg:py-32 overflow-hidden">
      {/* Gradient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#0066FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Main circular photo container */}
            <div className="relative mx-auto w-full max-w-[500px] aspect-square">
              {/* Rotating gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0066FF] via-[#D4AF37] to-[#0066FF] p-[3px]"
              >
                <div className="w-full h-full rounded-full bg-black" />
              </motion.div>

              {/* Photo */}
              <div className="absolute inset-[3px] rounded-full overflow-hidden border-4 border-black shadow-2xl">
                <img 
                  src="/yo mero.png" 
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
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0066FF] to-[#D4AF37] p-[2px] rounded-full shadow-2xl"
              >
                <div className="bg-black px-8 py-3 rounded-full flex items-center gap-3">
                  <Brain className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-white text-sm font-medium tracking-wide">
                    Psych × Design × AI
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-1 lg:order-2"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#D4AF37] text-sm font-mono uppercase tracking-widest mb-4"
            >
              El Cerebro Detrás de LUXMANIA
            </motion.p>

            {/* Name - Large and impactful */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-light text-white mb-6 tracking-tight font-display"
            >
              Luis Virrueta
            </motion.h2>

            {/* Gradient line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-[2px] bg-gradient-to-r from-[#0066FF] via-[#D4AF37] to-transparent w-48 mb-8 origin-left"
            />

            {/* Main hook - What makes him unique */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white text-2xl lg:text-3xl font-light leading-relaxed mb-8"
            >
              Diseño marcas que <span className="text-[#0066FF] font-medium">conectan con lo inconsciente</span>, 
              activan <span className="text-[#D4AF37] font-medium">emociones profundas</span> y construyen memoria duradera.
            </motion.p>

            {/* Supporting copy - Three key credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 mb-10"
            >
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[#0066FF] mt-2 flex-shrink-0" />
                <p className="text-white/80 text-lg leading-relaxed">
                  Entiendo <span className="text-white font-semibold">cómo funciona el inconsciente</span> y qué mecanismos activan decisiones de compra
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                <p className="text-white/80 text-lg leading-relaxed">
                  Diseño identidades visuales que <span className="text-white font-semibold">hablan directamente a las emociones</span> de tu audiencia
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[#0066FF] mt-2 flex-shrink-0" />
                <p className="text-white/80 text-lg leading-relaxed">
                  Desarrollo experiencias digitales que <span className="text-white font-semibold">construyen vínculos inconscientes</span> con tu marca
                </p>
              </div>
            </motion.div>

            {/* Experience badges/chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <div className="bg-gradient-to-r from-[#0066FF]/20 to-[#0066FF]/10 backdrop-blur-sm border border-[#0066FF]/30 rounded-full px-6 py-3 flex items-center gap-3">
                <Brain className="w-5 h-5 text-[#0066FF]" strokeWidth={2} />
                <div>
                  <p className="text-white text-sm font-semibold">Psicología</p>
                  <p className="text-white/60 text-xs">2015 - Presente</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-3 flex items-center gap-3">
                <Palette className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
                <div>
                  <p className="text-white text-sm font-semibold">Diseño</p>
                  <p className="text-white/60 text-xs">8+ años</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#0066FF]/20 to-[#0066FF]/10 backdrop-blur-sm border border-[#0066FF]/30 rounded-full px-6 py-3 flex items-center gap-3">
                <Code className="w-5 h-5 text-[#0066FF]" strokeWidth={2} />
                <div>
                  <p className="text-white text-sm font-semibold">Desarrollo IA</p>
                  <p className="text-white/60 text-xs">2020 - Presente</p>
                </div>
              </div>
            </motion.div>

            {/* Value proposition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 mb-10"
            >
              <p className="text-white/70 text-base lg:text-lg leading-relaxed italic">
                "No diseño para que tu marca <span className="text-white not-italic">se vea bien</span>. 
                Diseño para que tu audiencia <span className="text-[#0066FF] font-semibold not-italic">sienta, recuerde y actúe</span>."
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/sobre-mi">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-gradient-to-r from-[#0066FF] to-[#D4AF37] px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Conoce mi historia completa
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </Link>

              <p className="text-white/40 text-sm mt-4 font-mono">
                → Descubre cómo la psicología transforma el branding
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default LuisViruettaIntro
