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
            {/* Eyebrow - quién soy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <Brain className="w-5 h-5 text-[#a855f7]" strokeWidth={1.5} />
              <p className="text-[#d946ef]/70 text-xs font-mono uppercase tracking-[0.3em]">
                Sobre Mí
              </p>
            </motion.div>

            {/* Main heading - Nombre con efecto MANIA en Virrueta */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-extralight text-white mb-6 tracking-tight font-display leading-[1.1]"
            >
              Luis{' '}
              <motion.span
                className="bg-gradient-to-r from-[#ffffff] via-[#a855f7] to-[#d946ef] bg-clip-text text-transparent font-light"
                style={{
                  backgroundSize: '200% 100%',
                  backgroundPosition: '0% 50%'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Virrueta
              </motion.span>
            </motion.h2>

            {/* Subtitle breve */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-white/70 text-lg lg:text-xl font-light mb-8 max-w-lg"
            >
              Psicólogo y diseñador. Fundé{' '}
              <span className="text-[#d946ef] font-normal">Luxmania</span>{' '}
              para crear marcas que trascienden el inconsciente.
            </motion.p>

            {/* 'Con lo mejor de:' */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/50 text-sm font-light mb-5"
            >
              Con lo mejor de:
            </motion.p>

            {/* Badges con animaciones continuas elegantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              {/* Badge Psicología */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(168,85,247,0)',
                    '0 0 20px 0 rgba(168,85,247,0.3)',
                    '0 0 0 0 rgba(168,85,247,0)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="group relative overflow-hidden px-5 py-3 rounded-full bg-white/[0.03] cursor-pointer"
                style={{
                  border: '1px solid',
                  borderImage: 'linear-gradient(90deg, rgba(168,85,247,0.3), rgba(168,85,247,0.1), rgba(168,85,247,0.3)) 1'
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />
                
                {/* Glow continuo */}
                <motion.div
                  className="absolute inset-0 bg-[#a855f7]/10 blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <div className="relative flex items-center gap-2">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Brain className="w-4 h-4 text-[#a855f7]" />
                  </motion.div>
                  <span className="text-white/70 group-hover:text-white text-sm font-light transition-colors">Psicología</span>
                </div>
              </motion.div>

              {/* Badge Diseño */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(217,70,239,0)',
                    '0 0 20px 0 rgba(217,70,239,0.3)',
                    '0 0 0 0 rgba(217,70,239,0)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                className="group relative overflow-hidden px-5 py-3 rounded-full bg-white/[0.03] cursor-pointer"
                style={{
                  border: '1px solid',
                  borderImage: 'linear-gradient(90deg, rgba(217,70,239,0.3), rgba(217,70,239,0.1), rgba(217,70,239,0.3)) 1'
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d946ef]/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut", delay: 0.8 }}
                />
                
                {/* Glow continuo */}
                <motion.div
                  className="absolute inset-0 bg-[#d946ef]/10 blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
                
                <div className="relative flex items-center gap-2">
                  <motion.div
                    animate={{ 
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2.2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Palette className="w-4 h-4 text-[#d946ef]" />
                  </motion.div>
                  <span className="text-white/70 group-hover:text-white text-sm font-light transition-colors">Diseño</span>
                </div>
              </motion.div>

              {/* Badge Tecnología */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(232,121,249,0)',
                    '0 0 20px 0 rgba(232,121,249,0.3)',
                    '0 0 0 0 rgba(232,121,249,0)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
                className="group relative overflow-hidden px-5 py-3 rounded-full bg-white/[0.03] cursor-pointer"
                style={{
                  border: '1px solid',
                  borderImage: 'linear-gradient(90deg, rgba(232,121,249,0.3), rgba(232,121,249,0.1), rgba(232,121,249,0.3)) 1'
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e879f9]/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut", delay: 1.6 }}
                />
                
                {/* Glow continuo */}
                <motion.div
                  className="absolute inset-0 bg-[#e879f9]/10 blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />
                
                <div className="relative flex items-center gap-2">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2.4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Code className="w-4 h-4 text-[#e879f9]" />
                  </motion.div>
                  <span className="text-white/70 group-hover:text-white text-sm font-light transition-colors">Tecnología</span>
                </div>
              </motion.div>
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

        {/* CTA Button centrado abajo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mt-12"
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
      </div>
    </section>
  )
}

export default LuisViruettaIntro
