import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Sparkles, Palette, Code } from 'lucide-react'

const LuisViruettaIntro = () => {
  return (
    <section className="relative bg-black py-16 lg:py-24 overflow-hidden">
      {/* Orbs sutiles - Solo blanco minimal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left: Content - CINEMÁTICO Y MINIMALISTA con video background premium */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="order-2 lg:order-1 flex flex-col justify-center relative"
          >
            {/* Video background solo en esta área - premium y MÁS VISIBLE */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                style={{
                  filter: 'brightness(0.9)',
                }}
              >
                <source src="/LUIS VIRRUETA SECCION.mp4" type="video/mp4" />
              </video>
              
              {/* Degradados negros MÁS AMPLIOS en los bordes para transición muy sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
              {/* Fade extra en la parte superior */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
              {/* Fade extra en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
              
              {/* Overlay gradient para que el texto se vea bien */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/40" />
            </div>

            {/* Contenido encima del video */}
            <div className="relative z-10 p-8 lg:p-12">
            {/* Eyebrow - quién soy con borde redondeado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm w-fit"
            >
              <Brain className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <p className="text-white/70 text-xs font-light uppercase tracking-[0.25em]">
                Sobre Mí
              </p>
            </motion.div>

            {/* Main heading - LUIS VIRRUETA en mayúsculas con L y A brillosas */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-light text-white mb-6 font-display leading-[1.05]"
              style={{ letterSpacing: '0.15em' }}
            >
              <span className="inline-block relative">
                {/* L brillosa */}
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-white via-white to-white bg-clip-text text-transparent blur-lg"
                >
                  L
                </motion.span>
                <span className="relative text-white">L</span>
              </span>
              UIS{' '}
              VIRUET
              <span className="inline-block relative">
                {/* A brillosa */}
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute inset-0 bg-gradient-to-tl from-white via-white to-white bg-clip-text text-transparent blur-lg"
                >
                  A
                </motion.span>
                <span className="relative text-white">A</span>
              </span>
            </motion.h2>

            {/* Eyebrow subtitle - Profesión */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-white/50 text-sm lg:text-base font-light uppercase tracking-[0.3em] mb-6"
            >
              Psicólogo × Diseñador
            </motion.p>

            {/* Subtitle principal - Más elegante */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/70 text-xl lg:text-2xl font-extralight tracking-wide mb-4 max-w-xl leading-relaxed"
            >
              Fundé{' '}
              <motion.span
                className="text-white font-light"
                style={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
                }}
                animate={{
                  textShadow: [
                    '0 0 30px rgba(255, 255, 255, 0.3)',
                    '0 0 40px rgba(255, 255, 255, 0.5)',
                    '0 0 30px rgba(255, 255, 255, 0.3)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Luxmania
              </motion.span>
            </motion.p>

            {/* Descripción complementaria */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-white/50 text-base lg:text-lg font-light leading-relaxed mb-10 max-w-xl"
            >
              Para crear marcas que{' '}
              <span className="text-white/70">conectan emocionalmente</span>{' '}
              fusionando:
            </motion.p>

            {/* Badges con formato inline más elegante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-2 mb-10"
            >
              {/* Badge Psicología con degradado animado morado/azul */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full cursor-pointer"
              >
                {/* Degradado animado morado/azul de fondo */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.15
                  }}
                />
                <div className="relative flex items-center gap-2">
                  <Brain className="w-4 h-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Psicología</span>
                </div>
              </motion.div>

              <span className="text-white/30 text-xs mx-1">+</span>

              {/* Badge Diseño con degradado animado morado/azul */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full cursor-pointer"
              >
                {/* Degradado animado morado/azul de fondo */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5
                  }}
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 25%, #3b82f6 50%, #8b5cf6 75%, #6366f1 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.15
                  }}
                />
                <div className="relative flex items-center gap-2">
                  <Palette className="w-4 h-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Diseño</span>
                </div>
              </motion.div>

              <span className="text-white/30 text-xs mx-1">+</span>

              {/* Badge Tecnología con degradado animado morado/azul */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full cursor-pointer"
              >
                {/* Degradado animado morado/azul de fondo */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1
                  }}
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 25%, #a855f7 50%, #3b82f6 75%, #8b5cf6 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.15
                  }}
                />
                <div className="relative flex items-center gap-2">
                  <Code className="w-4 h-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-white/80 group-hover:text-white text-sm font-light transition-colors tracking-wide">Tecnología</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Quote sobre el inconsciente - Minimal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mb-10"
            >
              {/* Línea decorativa - blanco */}
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              
              {/* Contenedor con padding */}
              <div className="relative pl-8 space-y-1">
                {/* Ícono elegante - blanco */}
                <Brain className="absolute left-0 top-2 w-5 h-5 text-white/40" strokeWidth={1.5} />

                <p className="text-white/60 text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  El{' '}
                  <span className="text-white font-normal">
                    95% de las decisiones
                  </span>{' '}
                  ocurren en el inconsciente.
                </p>

                <p className="text-white/60 text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                  Las personas no eligen con la mente,{' '}
                  <span className="text-white font-normal">
                    eligen desde la emoción
                  </span>.
                </p>
              </div>

              {/* Línea horizontal decorativa - blanco */}
              <motion.div 
                className="mt-4 h-[1px] bg-gradient-to-r from-white/20 to-transparent max-w-md"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>

            {/* CTA Button - Flotante con glow premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Link to="/sobre-mi">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden px-8 py-4 rounded-full backdrop-blur-sm"
                >
                  {/* Degradado animado morado/azul de fondo - MÁS LUMINOSO */}
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                      backgroundSize: '200% 200%',
                      opacity: 0.4
                    }}
                  />

                  {/* Glow exterior más visible */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.15, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -inset-4 rounded-full blur-3xl"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #3b82f6, #8b5cf6)',
                      opacity: 0.4
                    }}
                  />

                  <span className="relative flex items-center gap-3">
                    <span className="text-white font-light text-base tracking-wide">
                      Conocer más
                    </span>
                    {/* Flecha dentro de círculo */}
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 text-white transition-colors" strokeWidth={1.5} />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            </div>
            {/* Fin del contenedor con video background */}

          </motion.div>

          {/* Right: Video horizontal - Static border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Video container horizontal - SIN BORDE */}
            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="w-full rounded-xl overflow-hidden bg-black shadow-2xl">
                {/* YouTube Video Embed */}
                <iframe
                  src="https://www.youtube.com/embed/PR7GISY0yPM?autoplay=1&mute=1&loop=1&playlist=PR7GISY0yPM&controls=0&modestbranding=1&rel=0&showinfo=0"
                  title="Luis Virrueta Presentación"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video pointer-events-none"
                />
              </div>

              {/* Floating badge minimal - blanco */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full shadow-2xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-xs font-light tracking-wider whitespace-nowrap">
                    Psych
                  </span>
                  <span className="text-white/30 text-xs">×</span>
                  <Palette className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-xs font-light tracking-wider whitespace-nowrap">
                    Design
                  </span>
                  <span className="text-white/30 text-xs">×</span>
                  <Code className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/80 text-xs font-light tracking-wider whitespace-nowrap">
                    Tech
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient fade to black at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
    </section>
  )
}

export default LuisViruettaIntro
