import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Sparkles, Users, Heart, Crown, Zap, Shield, Compass, ArrowRight, Palette, Code, Smile, Flame, Lightbulb, Handshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

const ArquetiposPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  
  const contentRef = useRef(null)
  const isContentInView = useInView(contentRef, { once: true, amount: 0.2 })

  // 12 Arquetipos completos con estructura premium
  const arquetipos = [
    {
      icon: Crown,
      name: 'El Gobernante',
      pregunta: '¿Buscas transmitir poder, control y liderazgo excepcional?',
      representa: 'Autoridad, excelencia y dominio. Marcas que lideran su industria.',
      ejemplos: 'Mercedes-Benz, Rolex, Microsoft',
      insight: 'Crea orden del caos y establece estándares',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      icon: Heart,
      name: 'El Amante',
      pregunta: '¿Buscas transmitir pasión, belleza y conexión emocional profunda?',
      representa: 'Intimidad, placer y compromiso. Marcas que evocan deseo.',
      ejemplos: 'Victoria\'s Secret, Chanel, Godiva',
      insight: 'Inspira amor y devoción apasionada',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Zap,
      name: 'El Héroe',
      pregunta: '¿Buscas transmitir valentía, fuerza y superación de obstáculos?',
      representa: 'Coraje, determinación y victoria. Marcas que inspiran acción.',
      ejemplos: 'Nike, Red Bull, FedEx',
      insight: 'Transforma desafíos en triunfos épicos',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Brain,
      name: 'El Sabio',
      pregunta: '¿Buscas transmitir conocimiento, verdad y expertise profundo?',
      representa: 'Inteligencia, análisis y sabiduría. Marcas que educan.',
      ejemplos: 'Google, BBC, Harvard',
      insight: 'Ilumina el camino hacia el entendimiento',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Users,
      name: 'El Inocente',
      pregunta: '¿Buscas transmitir pureza, optimismo y confianza absoluta?',
      representa: 'Simplicidad, honestidad y bondad. Marcas que reconfortan.',
      ejemplos: 'Dove, Coca-Cola, McDonald\'s',
      insight: 'Encuentra la felicidad en lo simple y puro',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Compass,
      name: 'El Explorador',
      pregunta: '¿Buscas transmitir libertad, aventura y espíritu pionero?',
      representa: 'Autonomía, descubrimiento y autenticidad. Marcas aventureras.',
      ejemplos: 'Jeep, The North Face, Patagonia',
      insight: 'Abraza lo desconocido con valentía',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Shield,
      name: 'El Cuidador',
      pregunta: '¿Buscas transmitir protección, compasión y servicio desinteresado?',
      representa: 'Generosidad, empatía y cuidado. Marcas que protegen.',
      ejemplos: 'Johnson & Johnson, Volvo, UNICEF',
      insight: 'Cuida y nutre a los que te rodean',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Sparkles,
      name: 'El Mago',
      pregunta: '¿Buscas transmitir transformación, visión y experiencias mágicas?',
      representa: 'Innovación, carisma y poder transformador. Marcas visionarias.',
      ejemplos: 'Disney, Apple, Tesla',
      insight: 'Convierte sueños imposibles en realidad',
      color: 'from-purple-500 to-fuchsia-600'
    },
    {
      icon: Smile,
      name: 'El Bufón',
      pregunta: '¿Buscas transmitir diversión, alegría y espíritu desenfadado?',
      representa: 'Humor, espontaneidad y disfrute. Marcas que hacen reír.',
      ejemplos: 'Ben & Jerry\'s, Old Spice, M&M\'s',
      insight: 'Vive el momento y celebra la vida',
      color: 'from-orange-500 to-yellow-600'
    },
    {
      icon: Flame,
      name: 'El Rebelde',
      pregunta: '¿Buscas transmitir ruptura, revolución y cambio radical?',
      representa: 'Disrupción, libertad y autenticidad. Marcas transgresoras.',
      ejemplos: 'Harley-Davidson, Diesel, Virgin',
      insight: 'Desafía las reglas y libera tu verdad',
      color: 'from-red-600 to-purple-600'
    },
    {
      icon: Lightbulb,
      name: 'El Creador',
      pregunta: '¿Buscas transmitir innovación, creatividad y expresión artística?',
      representa: 'Imaginación, visión y ejecución perfecta. Marcas que crean.',
      ejemplos: 'Lego, Adobe, Crayola',
      insight: 'Da vida a la imaginación sin límites',
      color: 'from-violet-500 to-pink-600'
    },
    {
      icon: Handshake,
      name: 'El Hombre Común',
      pregunta: '¿Buscas transmitir cercanía, pertenencia y valores compartidos?',
      representa: 'Comunidad, igualdad y conexión. Marcas para todos.',
      ejemplos: 'IKEA, Levi\'s, Budweiser',
      insight: 'Todos somos iguales en lo esencial',
      color: 'from-slate-500 to-zinc-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28">
      <SEOHead 
        title="Arquetipos de Marca - 12 Arquetipos de Carl Jung | Luis Virrueta"
        description="Descubre cómo los 12 arquetipos de Carl Jung transforman tu marca. Gobernante, Creador, Sabio, Inocente, Explorador y más. Psicología profunda aplicada al branding."
        image="/ARQUETIPOS CEREBRO.mp4"
        url="/arquetipos"
        type="website"
        tags={['arquetipos de Jung', 'branding', 'psicología', 'identidad de marca', '12 arquetipos', 'Carl Jung']}
      />
      
      {/* Hero Section - EXACTO como Portafolio */}
      <section ref={heroRef} className="relative py-20 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo - Expandido horizontalmente, cubriendo incluso el header */}
        <div className="absolute inset-0 -top-20 lg:-top-28 -bottom-16 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-50"
            style={{
              minWidth: '100vw',
              minHeight: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            <source src="/HEADER ARQUETIPOS.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
          {/* Overlay para que el texto sea legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Gradient orbs (ahora encima del video) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Title - Más elegante y profesional */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-6xl lg:text-9xl font-bold text-center mb-8 font-display relative"
            style={{ 
              letterSpacing: '0.08em',
              fontWeight: 300,
              textTransform: 'uppercase'
            }}
          >
            <span className="relative inline-block">
              {/* A con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>A</span>
                <span className="relative text-white">A</span>
              </span>
              {/* rquetipo */}
              <span className="text-white">rquetipo</span>
              {/* s con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-tl from-fuchsia-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>s</span>
                <span className="relative text-white">s</span>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle con iconos elegantes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            {/* Identidad Profunda - Encerrado en cuadro */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/80 font-light tracking-wider uppercase">
                  Identidad Profunda
                </span>
              </div>
            </motion.div>

            {/* Fórmula con iconos - Ad hoc arquetipos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-3 lg:gap-4 flex-wrap justify-center"
            >
              {/* Inconsciente */}
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Inconsciente
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Símbolos */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Símbolos
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Identidad */}
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Identidad
                </span>
              </div>
            </motion.div>
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
          </motion.div>
        </div>
      </section>

      {/* Sección de Arquetipos - Estilo Home Premium */}
      <section ref={contentRef} className="relative py-16 lg:py-24 px-6 lg:px-12 bg-black">
        <div className="relative max-w-7xl mx-auto">
          
          {/* Título de sección */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-light text-white mb-4 tracking-[0.1em] font-display">
              LOS 12 ARQUETIPOS
            </h2>
            <p className="text-white/50 text-base lg:text-lg font-light max-w-2xl mx-auto">
              Descubre qué arquetipo define la personalidad de tu marca y cómo usarlo para conectar emocionalmente
            </p>
          </motion.div>

          {/* Grid de Arquetipos - 12 COMPLETOS CON GRADIENTES 3D */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {arquetipos.map((arquetipo, index) => {
              const Icon = arquetipo.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-3xl bg-black/80 backdrop-blur-md border border-white/20 p-10 hover:border-white/40 transition-all duration-700"
                >
                  {/* Gradiente 3D animado con luz interior - SIEMPRE VISIBLE */}
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                    className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${arquetipo.color.split(' ')[1]}, ${arquetipo.color.split(' ')[3]}, ${arquetipo.color.split(' ')[1]})`,
                      backgroundSize: '400% 400%',
                      filter: 'blur(60px)'
                    }}
                  />

                  {/* Segundo layer de luz - efecto 3D */}
                  <motion.div
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.15
                    }}
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${arquetipo.color.split(' ')[1].replace('from-', '')}30, transparent 70%)`,
                      filter: 'blur(40px)'
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Ícono con glow animado */}
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      animate={{
                        boxShadow: [
                          `0 0 20px ${arquetipo.color.split(' ')[1].replace('from-', '')}50`,
                          `0 0 40px ${arquetipo.color.split(' ')[1].replace('from-', '')}70`,
                          `0 0 20px ${arquetipo.color.split(' ')[1].replace('from-', '')}50`
                        ]
                      }}
                      transition={{
                        boxShadow: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className={`flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${arquetipo.color} p-5 mb-6 shadow-2xl`}
                    >
                      <Icon className="w-full h-full text-white" strokeWidth={1.5} />
                    </motion.div>

                    {/* Nombre - JERARQUÍA PRINCIPAL */}
                    <h3 className="text-white text-3xl lg:text-4xl font-light mb-4 tracking-wide font-display">
                      {arquetipo.name}
                    </h3>

                    {/* Pregunta destacada - LO PRIMERO QUE BUSCAN */}
                    <div className="mb-6 px-2">
                      <p className="text-white/90 text-base lg:text-lg font-light leading-relaxed italic">
                        {arquetipo.pregunta}
                      </p>
                    </div>

                    {/* Línea separadora más visible */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full mb-6" />

                    {/* Qué representa - MUY LEGIBLE */}
                    <div className="mb-6">
                      <p className="text-white/50 text-xs font-light uppercase tracking-[0.25em] mb-3">
                        Representa
                      </p>
                      <p className="text-white/80 text-base font-light leading-relaxed">
                        {arquetipo.representa}
                      </p>
                    </div>

                    {/* Ejemplos con mejor contraste */}
                    <div className="mb-6">
                      <p className="text-white/50 text-xs font-light uppercase tracking-[0.25em] mb-3">
                        Marcas Icónicas
                      </p>
                      <p className="text-white/90 text-sm font-light leading-relaxed">
                        {arquetipo.ejemplos}
                      </p>
                    </div>

                    {/* Insight Final - Destacado */}
                    <div className="pt-6 border-t border-white/20 mt-2">
                      <p className="text-white/70 text-sm font-light italic leading-relaxed">
                        {arquetipo.insight}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA Section - Premium elegante */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <div className="max-w-3xl mx-auto mb-12">
              <h3 className="text-4xl lg:text-6xl font-light text-white mb-6 tracking-[0.05em] font-display leading-tight">
                ¿Cuál es el arquetipo de{' '}
                <span className="text-white" style={{ textShadow: '0 0 40px rgba(255, 255, 255, 0.4)' }}>
                  tu marca
                </span>?
              </h3>
              <p className="text-white/50 text-lg lg:text-xl font-extralight leading-relaxed mb-6">
                Descubre cómo definir la personalidad profunda de tu marca y crear una identidad que resuene emocionalmente con tu audiencia ideal.
              </p>
              <p className="text-white/70 text-base lg:text-lg font-light leading-relaxed">
                Agenda una sesión personalizada donde, como psicólogo especializado en branding, te ayudaré a identificar el arquetipo que mejor representa la esencia de tu marca.
              </p>
            </div>

            {/* Botón CTA - Videollamada */}
            <Link to="/contacto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden px-12 py-6 rounded-full backdrop-blur-sm"
              >
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
                  <span className="text-white font-light text-lg lg:text-xl tracking-wide">
                    Agendar Sesión de Arquetipos
                  </span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-white transition-colors" strokeWidth={1.5} />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Sección final - Premium sin ícono */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-12 bg-gradient-to-b from-black via-zinc-950/50 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Línea superior decorativa */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-64 mx-auto mb-12" />
            
            <h2 className="text-4xl lg:text-6xl font-light text-white mb-10 tracking-[0.05em] font-display leading-tight">
              La diferencia entre una{' '}
              <span className="text-white/30">marca olvidable</span>
              <br />
              y una{' '}
              <motion.span
                className="text-white"
                style={{
                  textShadow: '0 0 40px rgba(255, 255, 255, 0.4)'
                }}
              >
                marca memorable
              </motion.span>
            </h2>
            
            <p className="text-white/50 text-xl lg:text-2xl font-extralight leading-relaxed max-w-3xl mx-auto">
              Los arquetipos no son una moda, son la base psicológica de todas las marcas icónicas. 
              Cuando tu marca encarna un arquetipo auténtico, no vendes productos—{' '}
              <span className="text-white/80">vendes identidad, pertenencia y significado</span>.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default ArquetiposPage
