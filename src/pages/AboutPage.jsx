import { motion, useInView } from 'framer-motion'
import { Brain, Code, Palette, Heart, Sparkles, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

const AboutPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const pillars = [
    {
      icon: Brain,
      title: "Psicología",
      subtitle: "Aplicada",
      description: "Comprendo cómo las personas toman decisiones, qué las motiva y cómo crear experiencias que conectan a nivel emocional."
    },
    {
      icon: Palette,
      title: "Diseño",
      subtitle: "Estratégico",
      description: "Cada elemento visual tiene un propósito. Creo identidades que no solo se ven bien, sino que comunican y convierten."
    },
    {
      icon: Code,
      title: "Tecnología",
      subtitle: "Avanzada",
      description: "Desarrollo completo desde la idea hasta el deployment. React, Node.js, IA y las mejores herramientas del mercado."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo cinematográfico */}
        <div className="absolute inset-0 -top-28 -bottom-16 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-50"
            style={{ minWidth: '100vw', minHeight: '100%', objectFit: 'cover', objectPosition: 'center' }}
          >
            <source src="/hero Sobre mi.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Title con efecto 3D igual que Portafolio */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl lg:text-9xl font-bold text-center mb-12 font-display relative"
            style={{ 
              letterSpacing: '0.08em',
              fontWeight: 300,
              textTransform: 'uppercase'
            }}
          >
            <span className="relative inline-block">
              {/* S con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm">S</span>
                <span className="relative text-white">S</span>
              </span>
              {/* obre M */}
              <span className="text-white">obre M</span>
              {/* í con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-tl from-cyan-400 via-white to-white bg-clip-text text-transparent blur-sm">í</span>
                <span className="relative text-white">í</span>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle con estructura elegante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            {/* Etiqueta superior con borde */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/80 font-light tracking-wider uppercase">
                  Mi Historia
                </span>
              </div>
            </motion.div>

            {/* Fórmula con iconos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-3 lg:gap-4 flex-wrap justify-center"
            >
              {/* Psicología */}
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Psicología
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Diseño */}
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Diseño
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Tecnología */}
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Tecnología
                </span>
              </div>
            </motion.div>

            {/* Pregunta provocativa */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-base lg:text-lg text-white/60 text-center max-w-3xl mx-auto font-extralight italic"
              style={{ letterSpacing: '0.08em' }}
            >
              ¿Y si tu marca pudiera pensar como tú, verse como la imaginas y funcionar sin límites?
            </motion.p>
          </motion.div>

          {/* Línea con efecto desde el centro expandiéndose */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative h-px mx-auto w-96 overflow-hidden"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ transformOrigin: 'center' }}
            />
            {/* Punto luminoso que se mueve */}
            <motion.div
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5
              }}
              className="absolute inset-0 w-24 h-full bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
              style={{ left: '50%' }}
            />
          </motion.div>
        </div>

        {/* Degradado suave en la parte inferior para transición elegante */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black pointer-events-none z-30" />
      </section>

      {/* Photo + Bio Section */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Grid: Photo + Bio */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative"
            >
              {/* Sombras animadas premium */}
              <motion.div
                className="absolute -inset-12 rounded-3xl blur-[80px]"
                animate={{
                  background: [
                    'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)',
                    'radial-gradient(ellipse at 50% 75%, rgba(217,70,239,0.6), rgba(232,121,249,0.4), rgba(168,85,247,0.25), transparent)',
                    'radial-gradient(ellipse at 50% 85%, rgba(232,121,249,0.55), rgba(192,38,211,0.4), rgba(217,70,239,0.22), transparent)',
                    'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)'
                  ],
                  opacity: [0.4, 0.6, 0.5, 0.4]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/about ligera.jpg" 
                  alt="Luis Virrueta"
                  className="w-full aspect-[4/5] object-cover"
                />
                
                {/* Badge overlay minimalista */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute bottom-6 right-6"
                >
                  <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/20">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <Palette className="w-4 h-4 text-pink-400" />
                    <Code className="w-4 h-4 text-cyan-400" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Bio elegante */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
              className="space-y-8"
            >
              <motion.h2
                className="text-4xl lg:text-5xl font-extralight text-white"
                style={{ letterSpacing: '0.02em' }}
              >
                Luis <span className="italic font-serif" style={{ fontFamily: 'Georgia, serif', fontWeight: 200 }}>Virrueta</span>
              </motion.h2>

              <motion.p
                className="text-white/70 text-lg lg:text-xl font-light leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                Fundador de{' '}
                <motion.span
                  className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-normal"
                  style={{
                    backgroundSize: '200% 100%',
                    backgroundPosition: '0% 50%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Luxmania
                </motion.span>
                . Combino mi experiencia en psicología clínica con diseño estratégico y desarrollo full-stack para crear marcas que conectan emocionalmente y convierten.
              </motion.p>

              <motion.p
                className="text-white/60 text-base lg:text-lg font-extralight leading-relaxed italic"
              >
                Mi enfoque único fusiona neurociencia aplicada, estética premium y tecnología de vanguardia. No solo creo proyectos, construyo experiencias que trascienden la razón.
              </motion.p>

              {/* Stats minimalistas */}
              <div className="grid grid-cols-3 gap-6 pt-6">
                {[
                  { value: '50+', label: 'Proyectos' },
                  { value: '98%', label: 'Satisfacción' },
                  { value: '5', label: 'Años' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl lg:text-4xl font-light text-white mb-1">{stat.value}</div>
                    <div className="text-white/40 text-xs uppercase tracking-wider font-light">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars Section - Los 3 pilares */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 font-display text-white"
              style={{ 
                letterSpacing: '0.15em',
                fontWeight: 300,
                textTransform: 'uppercase'
              }}
            >
              Pilares <span className="italic font-extralight">Fundamentales</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10 hover:border-purple-500/30 transition-all duration-500">
                    {/* Icon */}
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                    >
                      <Icon className="w-8 h-8 text-purple-400 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-light text-white mb-2" style={{ letterSpacing: '0.05em' }}>
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-purple-400/70 uppercase tracking-widest font-light mb-4">
                      {pillar.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-base font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final minimalista */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl lg:text-5xl font-extralight text-white" style={{ letterSpacing: '0.05em' }}>
              ¿Listo para crear algo{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent italic">extraordinario</span>?
            </h2>
            
            <Link to="/contacto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-4 rounded-full text-white text-base font-light tracking-wider uppercase overflow-hidden group"
                style={{ letterSpacing: '0.15em' }}
              >
                {/* Background gradient animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 group-hover:scale-110 transition-transform duration-500" />
                
                {/* Border */}
                <div className="absolute inset-0 rounded-full border border-white/20" />
                
                {/* Text */}
                <span className="relative z-10">Trabajemos Juntos</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
