import { motion, useInView } from 'framer-motion'
import { Brain, Code, Palette, Heart, Sparkles, Zap, Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import SEOHead from '../components/SEOHead'

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
      <SEOHead 
        title="Sobre Luis Virrueta - Psicólogo, Diseñador y Developer"
        description="Psicólogo especializado en branding estratégico. Combino psicología del inconsciente, diseño premium e inteligencia artificial para crear marcas que conectan emocionalmente."
        image="/yo mero.png"
        url="/sobre-mi"
        type="profile"
        tags={['Luis Virrueta', 'psicología', 'branding', 'diseñador', 'developer', 'arquetipos']}
      />
      
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
                <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>S</span>
                <span className="relative text-white">S</span>
              </span>
              {/* obre M */}
              <span className="text-white">obre M</span>
              {/* í con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-tl from-cyan-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>í</span>
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

      {/* Photo + Bio Section - REDISEÑADO */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Grid: Photo + Bio */}
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            {/* Photo con placeholder temporal */}
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

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {/* Placeholder temporal con gradiente */}
                <div className="w-full aspect-[4/5] bg-gradient-to-br from-purple-900/30 via-fuchsia-900/20 to-cyan-900/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mx-auto flex items-center justify-center">
                      <Brain className="w-12 h-12 text-white/40" strokeWidth={1} />
                    </div>
                    <p className="text-white/30 text-sm font-extralight tracking-wider">Foto próximamente</p>
                  </div>
                </div>
                
                {/* Badge overlay minimalista */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute bottom-6 right-6"
                >
                  <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/20">
                    <Brain className="w-4 h-4 text-purple-400" strokeWidth={1} />
                    <Palette className="w-4 h-4 text-pink-400" strokeWidth={1} />
                    <Code className="w-4 h-4 text-cyan-400" strokeWidth={1} />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Bio elegante EXPANDIDA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
              className="space-y-10"
            >
              <motion.h2
                className="text-5xl lg:text-6xl font-extralight text-white tracking-wide"
              >
                Luis <span className="italic font-light">Virrueta</span>
              </motion.h2>

              <div className="space-y-6">
                <motion.p
                  className="text-white/70 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide"
                >
                  Fundador de{' '}
                  <span className="text-white font-light">LUXMANIA</span>
                  . Especialista en branding psicológico que fusiona neurociencia, diseño estratégico y desarrollo full-stack para crear marcas que no solo se ven excepcionales, sino que <span className="italic text-white/90">conectan, convierten y trascienden</span>.
                </motion.p>

                <motion.p
                  className="text-white/60 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide"
                >
                  Con formación en <span className="text-white font-light">psicología clínica</span> y años de experiencia en tecnología, entiendo que las marcas exitosas no venden productos, venden <span className="italic">identidad, pertenencia y transformación</span>.
                </motion.p>

                <motion.p
                  className="text-white/60 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide"
                >
                  Mi proceso combina análisis arquetipal, diseño emocional y desarrollo técnico impecable. Trabajo con fundadores y empresas que buscan diferenciarse radicalmente en mercados saturados.
                </motion.p>
              </div>

              {/* Stats minimalistas mejorados */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                {[
                  { value: '50+', label: 'Proyectos Completados' },
                  { value: '98%', label: 'Satisfacción Cliente' },
                  { value: '5+', label: 'Años Experiencia' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl lg:text-5xl font-extralight text-white mb-2 tracking-wide">{stat.value}</div>
                    <div className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-light">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links - Minimalista */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="flex items-center gap-6 pt-8"
              >
                <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-light">Conecta</span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                <div className="flex gap-4">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/_horadorada_?igsh=MXRoZDJpaHdqbWRwYg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-fuchsia-400/60 hover:bg-fuchsia-400/10 transition-all duration-300 group"
                  >
                    <Instagram className="w-4 h-4 text-white/50 group-hover:text-fuchsia-400 transition-colors" strokeWidth={1.5} />
                  </a>
                  {/* LinkedIn */}
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-cyan-400/60 hover:bg-cyan-400/10 transition-all duration-300 group"
                  >
                    <Linkedin className="w-4 h-4 text-white/50 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experiencia y Trayectoria */}
      <section className="py-20 px-6 lg:px-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-extralight text-white tracking-wide mb-6">
              Mi <span className="italic font-light">Trayectoria</span>
            </h2>
            <p className="text-white/50 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide max-w-3xl">
              Cada proyecto es el resultado de años estudiando cómo las personas toman decisiones, qué las motiva y cómo construir experiencias que trascienden lo visual.
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                year: '2020',
                title: 'Fundación de LUXMANIA',
                description: 'Después de años trabajando en agencias tradicionales, decidí crear un estudio que fusionara psicología, diseño y tecnología de manera única.'
              },
              {
                year: '2018-2020',
                title: 'Psicología Clínica + Full Stack Development',
                description: 'Formación dual que me permite entender tanto la mente del usuario como la arquitectura técnica de productos digitales.'
              },
              {
                year: '2016-2018',
                title: 'Diseñador Senior en Agencias Boutique',
                description: 'Lideré proyectos de identidad visual para startups tech y marcas de lujo, descubriendo mi pasión por el branding estratégico.'
              },
              {
                year: '2024',
                title: 'Especialización en Neuromarketing & IA',
                description: 'Integración de inteligencia artificial y neurociencia aplicada para crear experiencias de marca que anticipan necesidades.'
              }
            ].map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid lg:grid-cols-[180px_1fr] gap-8 items-start group"
              >
                <div className="text-white/20 text-2xl font-extralight tracking-wider lg:text-right">
                  {milestone.year}
                </div>
                <div className="border-l border-white/10 pl-8 group-hover:border-white/20 transition-colors">
                  <h3 className="text-white text-xl lg:text-2xl font-extralight tracking-wide mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-white/50 font-extralight text-base leading-[1.9] tracking-wide">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section - Los 3 pilares MEJORADO */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20 border-t border-white/10">
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-extralight text-white tracking-wide">
              Mi <span className="italic font-light">Enfoque</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="relative border border-white/10 rounded-2xl p-10 hover:border-white/20 transition-all duration-500 bg-white/[0.02]">
                    {/* Icon minimal */}
                    <Icon className="w-10 h-10 text-white/30 mb-8 group-hover:text-white/50 transition-colors" strokeWidth={1} />

                    {/* Title */}
                    <h3 className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-light mb-3">
                      {pillar.subtitle}
                    </h3>
                    <h4 className="text-2xl lg:text-3xl font-extralight text-white mb-6 tracking-wide">
                      {pillar.title}
                    </h4>

                    {/* Description */}
                    <p className="text-white/50 text-base font-extralight leading-[1.9] tracking-wide">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final minimalista premium */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20 border-t border-white/10">
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-extralight text-white tracking-wide leading-tight">
                ¿Listo para crear una marca que{' '}
                <span className="italic font-light">trascienda</span>?
              </h2>
              <p className="text-white/50 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide max-w-3xl">
                No trabajo con todos. Selecciono proyectos donde puedo generar impacto real y donde existe alineación de visión. Si buscas diferenciarte radicalmente, hablemos.
              </p>
            </div>
            
            <Link to="/contacto" className="inline-block group">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 text-white font-extralight text-sm tracking-[0.3em] uppercase"
              >
                <span>Trabajemos Juntos</span>
                <motion.div
                  className="w-16 h-px bg-white/40 group-hover:bg-white transition-colors"
                  whileHover={{ width: 80 }}
                />
                <Sparkles className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" strokeWidth={1} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
