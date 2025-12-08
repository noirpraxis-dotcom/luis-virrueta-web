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
            {/* Video background solo en esta área - premium */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                style={{
                  filter: 'blur(1px) brightness(0.7)',
                }}
              >
                <source src="/LUIS VIRRUETA SECCION.mp4" type="video/mp4" />
              </video>
              
              {/* Overlay gradient para que el texto se vea bien */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
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
              {/* Badge Psicología */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/20 cursor-pointer"
              >
                <div className="relative flex items-center gap-2">
                  <Brain className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/70 group-hover:text-white text-sm font-light transition-colors tracking-wide">Psicología</span>
                </div>
              </motion.div>

              <span className="text-white/30 text-xs mx-1">+</span>

              {/* Badge Diseño */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/20 cursor-pointer"
              >
                <div className="relative flex items-center gap-2">
                  <Palette className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/70 group-hover:text-white text-sm font-light transition-colors tracking-wide">Diseño</span>
                </div>
              </motion.div>

              <span className="text-white/30 text-xs mx-1">+</span>

              {/* Badge Tecnología */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/20 cursor-pointer"
              >
                <div className="relative flex items-center gap-2">
                  <Code className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <span className="text-white/70 group-hover:text-white text-sm font-light transition-colors tracking-wide">Tecnología</span>
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
                  className="w-full aspect-video"
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
              className="group relative bg-transparent border border-white/30 hover:border-white/60 px-8 py-3 rounded-full text-white font-light text-base tracking-wide transition-all duration-500"
            >
              <span className="flex items-center gap-3">
                <span className="text-white/70 group-hover:text-white transition-colors">Conocer más</span>
                <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Gradient fade to black at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
    </section>
  )
}

export default LuisViruettaIntro
