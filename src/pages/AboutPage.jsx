import { motion, useInView } from 'framer-motion'
import { Brain, Code, Palette, Heart, Sparkles, Zap, Instagram, Linkedin, Lamp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import SEOHead from '../components/SEOHead'
import { useLanguage } from '../context/LanguageContext'

const AboutPage = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const pillars = [
    {
      icon: Brain,
      title: t('aboutPage.approach.pillar1Title'),
      subtitle: t('aboutPage.approach.pillar1Label'),
      description: t('aboutPage.approach.pillar1Desc')
    },
    {
      icon: Palette,
      title: t('aboutPage.approach.pillar2Title'),
      subtitle: t('aboutPage.approach.pillar2Label'),
      description: t('aboutPage.approach.pillar2Desc')
    },
    {
      icon: Code,
      title: t('aboutPage.approach.pillar3Title'),
      subtitle: t('aboutPage.approach.pillar3Label'),
      description: t('aboutPage.approach.pillar3Desc')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28 overflow-x-hidden">
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
        <div className="absolute inset-0 -top-20 lg:-top-28 -bottom-16 overflow-hidden pointer-events-none z-0">
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
              {t('aboutPage.hero.title').split('').map((char, i, arr) => {
                const isFirst = i === 0
                const isLast = i === arr.length - 1
                
                if (isFirst || isLast) {
                  return (
                    <span key={i} className="relative">
                      <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>
                        {char}
                      </span>
                      <span className="relative text-white">{char}</span>
                    </span>
                  )
                }
                return <span key={i} className="text-white">{char}</span>
              })}
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
                  {t('aboutPage.hero.badge')}
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
              {/* Arquetipos */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  {t('aboutPage.hero.pillar1')}
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Identidad */}
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  {t('aboutPage.hero.pillar2')}
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Transformación */}
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  {t('aboutPage.hero.pillar3')}
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
              {t('aboutPage.hero.question')}
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

      {/* Photo + Bio Section con nueva información */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Nombre principal centrado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl lg:text-8xl font-light text-white mb-4" style={{ letterSpacing: '0.05em' }}>
              Luis <span className="italic font-normal">Virrueta</span>
            </h2>
            <p className="text-white/50 text-lg lg:text-xl font-light tracking-wide">Psicólogo · Filósofo · Investigador</p>
          </motion.div>

          {/* Grid: Photo + Contenido */}
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-start mb-20">
            {/* Photo profesional */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative sticky top-32"
            >
              {/* Sombras animadas premium */}
              <motion.div
                className="absolute -inset-12 rounded-full blur-[80px]"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.4), rgba(217,70,239,0.3), rgba(124,58,237,0.15), transparent)',
                    'radial-gradient(circle at 50% 50%, rgba(217,70,239,0.5), rgba(232,121,249,0.35), rgba(168,85,247,0.2), transparent)',
                    'radial-gradient(circle at 50% 50%, rgba(232,121,249,0.45), rgba(192,38,211,0.35), rgba(217,70,239,0.18), transparent)',
                    'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.4), rgba(217,70,239,0.3), rgba(124,58,237,0.15), transparent)'
                  ],
                  opacity: [0.5, 0.7, 0.6, 0.5]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/luxmania perfil.png" 
                  alt="Luis Virrueta - Psicólogo"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </motion.div>

            {/* Contenido nuevo - Información de Luis */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
              className="space-y-12"
            >
              {/* Párrafo 1 - Interpretación vs Realidad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500/50 via-fuchsia-500/30 to-transparent rounded-full" />
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light pl-6">
                  La mayoría de las personas no vive la realidad. Vive la interpretación que hace de ella. Y rara vez se detiene a preguntarse desde dónde está interpretando.
                </p>
              </motion.div>

              {/* Tarjeta especial - Pregunta central */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="relative bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white text-lg font-light">Mi trabajo gira alrededor de una pregunta central:</h3>
                </div>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic">
                  ¿Cómo se construye la experiencia que llamamos realidad?
                </p>
              </motion.div>

              {/* Párrafo 2 - Tiempo */}
              <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                No como una teoría abstracta ni como una promesa de cambio rápido, sino como un fenómeno vivo que ocurre en el tiempo. Porque lo que hoy comenzamos a descubrir, en muchos sentidos, ya había sido intuido: la idea de que el inicio y el final no están separados, de que el tiempo no avanza solo en línea recta, y de que la forma en que percibimos el mundo modifica profundamente cómo lo habitamos. Sabidurías antiguas lo nombraron de una forma; la ciencia contemporánea empieza a describirlo con otra. Pero ambas señalan hacia el mismo punto.
              </p>

              {/* Párrafo 3 - Formación */}
              <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                Me formé como psicólogo, pero muy pronto entendí que los modelos tradicionales explicaban conductas, no experiencias. Desde entonces estudio, conecto y aplico psicología profunda, psicoanálisis, neurociencia, filosofía y sistemas contemporáneos de pensamiento para comprender cómo una persona se interpreta a sí misma a lo largo del tiempo… y cómo esa interpretación se convierte en su historia, en su cuerpo y en su realidad cotidiana. No como algo fijo, sino como un proceso que se sostiene mientras cumple una función.
              </p>

              {/* Tarjeta especial - Método */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <h3 className="text-white text-xl lg:text-2xl font-light mb-4">Mi Método</h3>
                <p className="text-white/80 text-lg leading-relaxed font-light mb-6">
                  No trabajo motivando. No trabajo "reprogramando". No trabajo prometiendo cambios rápidos. Trabajo modificando el marco desde el cual alguien observa su vida. Y cuando ese marco cambia, lo que antes parecía absolutamente real comienza a perder su evidencia.
                </p>
                <Link 
                  to="/metodo"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-light tracking-wide">Conoce el Método AIÓN</span>
                  <motion.div
                    className="w-8 h-px bg-purple-400/50 group-hover:bg-purple-300 transition-colors"
                    whileHover={{ width: 48 }}
                  />
                </Link>
              </motion.div>

              {/* Párrafo 4 - Proceso (con mención del ego) */}
              <div className="space-y-4">
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                  No porque fuera mentira, sino porque pertenecía a una forma específica de sostenerse: a un síntoma, a una identidad, a una manera de habitar el tiempo. Cuando eso se mueve, esa realidad ya no tiene por qué seguir ahí.
                </p>
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                  Y ese tránsito no es cómodo: implica dejar atrás certezas, vínculos, narrativas y versiones de uno mismo. Hay una pérdida real. Una{' '}
                  <Link to="/metodo" className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30 hover:decoration-purple-300/50 transition-all">
                    pequeña muerte del ego
                  </Link>
                  . Pero es justamente ahí donde algo más amplio puede comenzar a organizarse.
                </p>
              </div>

              {/* Párrafo 5 - Trabajo actual */}
              <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                Actualmente acompaño a personas, proyectos y equipos que sienten que algo no encaja, aunque desde fuera todo parezca funcionar. Personas que piensan mucho, sienten profundo y saben que repetir fórmulas no es la salida. A través de sesiones, contenidos y proyectos exploro cómo operan los filtros mentales, el deseo, la percepción del tiempo y la forma en que construimos sentido, entendiendo que no toda transformación es ganancia, pero sí puede ser verdad.
              </p>

              {/* Conclusión destacada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative border-l-2 border-purple-500/50 pl-8 py-4"
              >
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light">
                  No creo que el problema sea la vida que tienes. Creo que es la forma en que la estás mirando. Y cambiar la mirada no siempre es cómodo, pero puede ser profundamente liberador.
                </p>
                <p className="text-white/50 text-sm font-light mt-4 italic">— Luis Virrueta</p>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-8 border-t border-white/10"
              >
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-light">Conecta</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/420776711575"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 rounded-full border border-emerald-400/30 bg-emerald-400/5 hover:bg-emerald-400/10 hover:border-emerald-400/50 transition-all duration-300"
                  >
                    <Zap className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                    <span className="text-white/80 text-sm font-light">WhatsApp</span>
                  </a>
                  <a
                    href="https://www.instagram.com/_horadorada_?igsh=MXRoZDJpaHdqbWRwYg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-fuchsia-400/60 hover:bg-fuchsia-400/10 transition-all"
                  >
                    <Instagram className="w-5 h-5 text-white/50" strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/luis-virrueta/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-cyan-400/60 hover:bg-cyan-400/10 transition-all"
                  >
                    <Linkedin className="w-5 h-5 text-white/50" strokeWidth={1.5} />
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
              {t('aboutPage.journey.title').split(' ')[0]} <span className="italic font-light">{t('aboutPage.journey.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-white/50 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide max-w-3xl">
              {t('aboutPage.journey.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                year: t('aboutPage.journey.milestone1Year'),
                title: t('aboutPage.journey.milestone1Title'),
                description: t('aboutPage.journey.milestone1Desc')
              },
              {
                year: t('aboutPage.journey.milestone2Year'),
                title: t('aboutPage.journey.milestone2Title'),
                description: t('aboutPage.journey.milestone2Desc')
              },
              {
                year: t('aboutPage.journey.milestone3Year'),
                title: t('aboutPage.journey.milestone3Title'),
                description: t('aboutPage.journey.milestone3Desc')
              },
              {
                year: t('aboutPage.journey.milestone4Year'),
                title: t('aboutPage.journey.milestone4Title'),
                description: t('aboutPage.journey.milestone4Desc')
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
              {t('aboutPage.approach.title').split(' ')[0]} <span className="italic font-light">{t('aboutPage.approach.title').split(' ').slice(1).join(' ')}</span>
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
              <h2 className="text-4xl lg:text-6xl font-extralight text-white tracking-wide leading-tight" dangerouslySetInnerHTML={{ __html: t('aboutPage.cta.title') }} />
              <p className="text-white/50 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide max-w-3xl">
                {t('aboutPage.cta.subtitle')}
              </p>
            </div>
            
            <Link to="/contacto" className="inline-block group">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 text-white font-extralight text-sm tracking-[0.3em] uppercase"
              >
                <span>{t('aboutPage.cta.button')}</span>
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
