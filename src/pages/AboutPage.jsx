import { motion, useInView } from 'framer-motion'
import { Brain, Compass, BookOpen, Heart, Sparkles, Zap, Instagram, Linkedin, Lamp } from 'lucide-react'
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
      title: 'Psicoanálisis',
      subtitle: 'Profunda',
      description: 'Estudié psicología y me especialicé en psicoanálisis. Trabajo desde el inconsciente, no desde el consejo. Entiendo los mecanismos que sostienen tu realidad.'
    },
    {
      icon: Compass,
      title: 'Exploración',
      subtitle: 'Constante',
      description: 'Vivo en Europa explorando culturas y tradiciones. Desde pequeño investigué diferentes religiones para encontrar qué compartían, más allá de quién tenía la verdad.'
    },
    {
      icon: BookOpen,
      title: 'Conexión',
      subtitle: 'Integradora',
      description: 'Descubrí que lo antiguo y lo nuevo convergen: lo que hoy descubre la neurociencia, ya lo intuían las tradiciones ancestrales. El problema nunca fue el conocimiento, sino el ego.'
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
      <section ref={heroRef} className="relative pt-12 lg:pt-20 pb-40 lg:pb-56 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 -top-16 lg:-top-24 -bottom-80 lg:-bottom-96 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
            style={{
              minWidth: '100vw',
              minHeight: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            <source src="/sobre mi vid.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Gradiente inferior que se mezcla con el contenido */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Título Hero - Sobre Mí */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <span
              className="text-6xl sm:text-7xl lg:text-8xl font-light text-white inline-block"
              style={{ 
                letterSpacing: '0.15em',
                textShadow: '0 0 60px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(168, 85, 247, 0.1)'
              }}
            >
              SOBRE MÍ
            </span>
          </motion.h1>

          {/* Descripción encerrada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
              <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                Psicología · Filosofía · Transformación
              </span>
            </div>
          </motion.div>
          
          {/* Conceptos clave - Sin encerrar, en blanco, elegantes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-8"
          >
            {/* Inconsciente */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">Inconsciente</span>
            </motion.div>

            {/* Separador minimalista */}
            <div className="w-px h-6 bg-white/20" />

            {/* Percepción */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">Percepción</span>
            </motion.div>
          </motion.div>

          {/* Pregunta relacionada con About */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg sm:text-xl text-white/60 text-center font-light italic mb-8"
          >
            ¿Y si el problema no es tu vida, sino cómo la estás mirando?
          </motion.p>

          {/* Línea decorativa */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.8 }}
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
                  src="/Luis.png" 
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
              {/* NUEVA SECCIÓN AL INICIO: Una búsqueda constante - EXPANDIDA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="relative bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-10"
              >
                <div className="space-y-6">
                  <h3 className="text-white text-2xl lg:text-3xl font-light mb-6 flex items-center gap-3">
                    <Lamp className="w-6 h-6 text-purple-400" />
                    Una búsqueda constante
                  </h3>
                  
                  {/* Formación */}
                  <p className="text-white/80 text-lg leading-relaxed font-light">
                    Estudié psicología y me especialicé en psicoanálisis. Pero no me conformé con ello.
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed font-light">
                    <span className="text-white font-semibold">Actualmente vivo en Europa</span>, explorando diferentes culturas y tradiciones. 
                    Mi vida es el reflejo de mi búsqueda.
                  </p>

                  {/* Religiones */}
                  <p className="text-white/80 text-lg leading-relaxed font-light">
                    Desde pequeño crecí dentro del catolicismo, pero me exploraba a ir a otro tipo de religiones 
                    para empezar a ver <span className="text-white font-semibold">qué era lo que compartían entre ellas</span>.
                  </p>

                  {/* Quote destacada - Todas decían ser la verdadera */}
                  <div className="border-l-2 border-purple-400/50 pl-6 py-4 bg-black/20 rounded-r-lg">
                    <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic">
                      Y me daba cuenta que <span className="text-purple-400 not-italic font-semibold">todas decían que ellas eran la verdadera</span>.
                    </p>
                  </div>

                  {/* NUEVA EXPANSIÓN: El ego y las peleas entre saberes */}
                  <div className="space-y-4 pt-4">
                    <p className="text-white/90 text-lg leading-relaxed font-light">
                      Pero no solo eso: <span className="text-white font-semibold">la gente se pelea constantemente con el ego</span> tratando de demostrar quién tiene la razón, quién es mejor que el otro, quién posee EL conocimiento verdadero.
                    </p>
                    <p className="text-white/80 text-lg leading-relaxed font-light">
                      Precisamente <span className="text-purple-400 font-semibold">eso es lo que lleva a peleas constantes entre distintos saberes</span>, en lugar de reconciliarlos. Psicoanálisis vs. neurociencia. Oriente vs. Occidente. Tradición vs. ciencia. Cuando en realidad, <span className="text-white font-semibold">todos están describiendo el mismo fenómeno desde ángulos distintos</span>.
                    </p>
                    <p className="text-white/80 text-lg leading-relaxed font-light">
                      <span className="text-purple-400 font-semibold">Es una cuestión puramente egoica</span>. El ego necesita tener razón para existir. Necesita sentirse superior, validado, especial.
                    </p>
                  </div>

                  {/* NUEVA EXPANSIÓN: El ego y las enfermedades */}
                  <div className="border-t border-white/10 pt-6 mt-6 space-y-4">
                    <p className="text-white/90 text-lg leading-relaxed font-light">
                      Y desde ese mismo ego <span className="text-white font-semibold">aparecen las enfermedades, los problemas de pareja, los problemas económicos</span>. No por casualidad, sino porque <span className="text-purple-400 font-semibold">queremos ser parte de una realidad</span>.
                    </p>
                    <p className="text-white/80 text-lg leading-relaxed font-light">
                      Aunque conscientemente digamos "quiero cambiar", <span className="text-white font-semibold">inconscientemente NO queremos dejar de formar parte de un circuito, de un contexto</span>. Sabemos que si cambiáramos, se rompería el sistema familiar, las dinámicas relacionales, la identidad que nos sostiene.
                    </p>
                    <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic border-l-2 border-purple-500/50 pl-6 py-4 bg-black/20 rounded-r-lg">
                      Lejos de ser lo que más queremos, <span className="text-purple-400 not-italic font-semibold">cambiar es lo que más nos da miedo</span>. Porque se rompería el ego, y con ello la imagen que teníamos de nosotros mismos.
                    </p>
                    <p className="text-white/70 text-base leading-relaxed font-light">
                      Preferimos seguir sufriendo de una forma conocida, que arriesgarnos a descubrir quiénes seríamos sin ese sufrimiento.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Párrafo 1 - Interpretación vs Realidad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.4 }}
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
                transition={{ duration: 0.8, delay: 1.6 }}
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
                    href="https://wa.me/527228720520"
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

      {/* Pillars Section - Los 3 pilares MEJORADO - REMOVIDA la sección de Experiencia y Trayectoria */}
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

      {/* Trayectoria - Sección nueva con explicación profunda */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20 border-t border-white/10">
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-extralight text-white tracking-wide mb-16">
              Trayectoria
            </h2>

            <div className="space-y-12">
              {/* La relación entre lo antiguo y lo nuevo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500/50 via-fuchsia-500/30 to-transparent rounded-full" />
                <div className="pl-8 space-y-6">
                  <h3 className="text-2xl lg:text-3xl text-white/90 font-light mb-4">
                    Lo antiguo y lo nuevo convergen
                  </h3>
                  <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                    A lo largo de mi formación descubrí algo fascinante: <span className="text-white font-semibold">lo que hoy descubre la neurociencia contemporánea ya lo intuían las tradiciones ancestrales</span>. La epigenética de Bruce Lipton se parece al concepto chino de Shen-Qi de hace 3,000 años. Los sesgos cognitivos de Daniel Kahneman eran conocidos como Vipallasa en el budismo hace 2,500 años. Einstein habló del tiempo como ilusión; los griegos lo llamaban AIÓN, el tiempo eterno donde todo coexiste.
                  </p>
                  <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                    No estamos descubriendo nada nuevo. <span className="text-purple-400 font-semibold">Estamos recordando</span>.
                  </p>
                </div>
              </motion.div>

              {/* El problema de las religiones y la verdad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-10"
              >
                <h3 className="text-2xl lg:text-3xl text-white/90 font-light mb-6">
                  Todas dicen tener LA verdad
                </h3>
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light mb-6">
                  Desde pequeño me exploraba a ir a diferentes religiones. Y me daba cuenta de algo inquietante: <span className="text-white font-semibold">todas decían que ellas eran la verdadera, y descartaban a las otras</span>. Catolicismo, budismo, islam, judaísmo... cada una afirmaba poseer la verdad absoluta.
                </p>
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light mb-6">
                  Pero cuando empecé a estudiar psicoanálisis, entendí algo: <span className="text-purple-400 font-semibold">el problema no era cuál tenía razón. El problema era el ego</span>.
                </p>
                <div className="border-l-2 border-purple-500/50 pl-6 py-4">
                  <p className="text-xl lg:text-2xl text-white/90 italic font-light">
                    El ego necesita tener la razón. Necesita que su verdad sea LA verdad. Y desde ahí, desde esa necesidad de validación, se sostiene toda una realidad.
                  </p>
                </div>
              </motion.div>

              {/* El ego como origen de los problemas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-fuchsia-500/50 via-purple-500/30 to-transparent rounded-full" />
                <div className="pl-8 space-y-6">
                  <h3 className="text-2xl lg:text-3xl text-white/90 font-light mb-4">
                    El ego crea tu realidad (y tus problemas)
                  </h3>
                  <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                    <span className="text-white font-semibold">Desde el ego se crean problemas de salud, problemas económicos, problemas de pareja</span>. No porque sean inevitables, sino porque sostienen una estructura psíquica específica. Tu dolor tiene una función: mantener una identidad, pertenecer a un sistema familiar, evitar el vacío de la incertidumbre.
                  </p>
                  <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light">
                    Por eso la persona sigue eligiendo lo que le duele. Por eso repite el mismo patrón. <span className="text-purple-400 font-semibold">Porque cambiar implicaría dejar de ser quien cree que es</span>.
                  </p>
                </div>
              </motion.div>

              {/* La paradoja: no queremos cambiar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-10"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Heart className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl text-white/90 font-light">
                    La paradoja del cambio
                  </h3>
                </div>
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light mb-6">
                  Aquí está la verdad más incómoda: <span className="text-white font-semibold">en última instancia, lo que más queremos no es cambiar, sino NO cambiar</span>.
                </p>
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light mb-6">
                  Porque cambiar significa dejar de pertenecer. Significa traicionar el mandato familiar. Significa perder la identidad que te costó tanto construir. <span className="text-purple-400 font-semibold">Preferimos el dolor conocido a la incertidumbre de lo nuevo</span>.
                </p>
                <div className="border-l-2 border-purple-400/50 pl-6 py-4 bg-black/20 rounded-r-lg">
                  <p className="text-xl lg:text-2xl text-white/90 italic font-light mb-4">
                    "Lo que más queremos es ser parte del contexto familiar, aunque eso siempre duela."
                  </p>
                  <p className="text-white/60 text-base font-light">
                    Y ahí radica el trabajo psicoanalítico: no en motivarte a cambiar, sino en hacer consciente esa resistencia. En descubrir qué función cumple tu síntoma. En entender qué perderías si dejaras de sufrir.
                  </p>
                </div>
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light mt-6">
                  Solo cuando eso se hace visible, cuando la persona puede <span className="text-white font-semibold">sostener la pérdida</span>, puede comenzar algo diferente. No antes.
                </p>
              </motion.div>
            </div>
          </motion.div>
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
                ¿Listo para iniciar <span className="italic font-light">tu proceso de transformación</span>?
              </h2>
              <p className="text-white/50 text-base lg:text-lg font-extralight leading-[1.9] tracking-wide max-w-3xl">
                No desde el consejo, sino desde el inconsciente. Un acompañamiento profundo para cambiar tu realidad.
              </p>
            </div>
            
            <a 
              href="https://wa.me/5218115936829?text=Hola%20Luis,%20me%20gustaría%20iniciar%20un%20proceso%20de%20acompañamiento"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
            >
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 text-white font-extralight text-sm tracking-[0.3em] uppercase"
              >
                <span>Iniciemos tu proceso</span>
                <motion.div
                  className="w-16 h-px bg-white/40 group-hover:bg-white transition-colors"
                  whileHover={{ width: 80 }}
                />
                <Sparkles className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" strokeWidth={1} />
              </motion.div>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
