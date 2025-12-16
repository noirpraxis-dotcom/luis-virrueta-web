import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Sparkles, ArrowRight, Zap, Users, Heart, TrendingUp, Activity } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const MetodoPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const storyRef = useRef(null)
  const isStoryInView = useInView(storyRef, { once: true, amount: 0.3 })
  const scienceRef = useRef(null)
  const isScienceInView = useInView(scienceRef, { once: true, amount: 0.3 })

  const problemAreas = [
    {
      icon: Activity,
      title: 'Salud',
      problem: 'Síntomas físicos sin causa aparente',
      science: 'La epigenética demuestra que tus pensamientos alteran la expresión de tus genes',
      ancestral: 'La medicina ancestral siempre supo: "La enfermedad nace en la mente"',
      reversible: 'Al cambiar los filtros mentales, el cuerpo responde',
      delay: 0.2
    },
    {
      icon: Heart,
      title: 'Relaciones',
      problem: 'Las mismas dinámicas con diferentes personas',
      science: 'La neurociencia afectiva revela que tu cerebro busca lo familiar, no lo sano',
      ancestral: 'Los griegos enseñaban: "Conócete a ti mismo para conocer al otro"',
      reversible: 'Transforma tu filtro interno y tus relaciones se transforman',
      delay: 0.3
    },
    {
      icon: Brain,
      title: 'Emociones',
      problem: 'Ansiedad y depresión que no ceden',
      science: 'La psicobiología confirma que la mente crea los químicos que experimentas',
      ancestral: 'Buda enseñó: "El sufrimiento viene de la interpretación, no del evento"',
      reversible: 'Cambia el filtro, cambia la emoción',
      delay: 0.4
    },
    {
      icon: TrendingUp,
      title: 'Dinero',
      problem: 'Patrones económicos repetitivos',
      science: 'La psicología económica prueba que el mercado se mueve por creencias colectivas',
      ancestral: 'Hermes Trismegisto: "Como es arriba, es abajo; como adentro, es afuera"',
      reversible: 'Tu realidad financiera es tu filtro monetario materializado',
      delay: 0.5
    }
  ]

  return (
    <>
      <SEOHead 
        title="El Método Aión | Luis Virrueta - Psicólogo"
        description="El método que integra sabiduría ancestral y ciencia contemporánea para transformar tu salud, relaciones, emociones y economía desde la raíz."
        image="/og-metodo.jpg"
        url="/metodo"
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28 overflow-hidden">
        {/* Hero Section con Video */}
        <section ref={heroRef} className="relative py-20 lg:py-40 px-6 lg:px-20 overflow-hidden">
          {/* Video de fondo */}
          <div className="absolute inset-0 -top-20 lg:-top-28 -bottom-16 overflow-hidden pointer-events-none z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-40"
              style={{
                minWidth: '100vw',
                minHeight: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            >
              <source src="/header psicologia.mp4" type="video/mp4" />
            </video>
            {/* Gradiente superior que se mezcla con el header */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
            {/* Gradiente inferior que se mezcla con el contenido */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent z-10" />
          </div>

          <div className="relative max-w-6xl mx-auto z-10">
            {/* Badge de entrada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
                <Sparkles className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-white/80 font-light tracking-wide uppercase">
                  El Método
                </span>
              </div>
            </motion.div>

            {/* Título Hero */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-light text-center text-white mb-8 leading-tight"
            >
              La Intersección Entre
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
                Lo Ancestral y Lo Contemporáneo
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl lg:text-2xl font-light text-center text-white/70 max-w-4xl mx-auto leading-relaxed"
            >
              Lo que estamos por descubrir ya lo habíamos descubierto.
              <br />
              <span className="text-white/90">El tiempo no es lineal cuando hablamos del conocimiento profundo.</span>
            </motion.p>
          </div>
        </section>

        {/* Mi Historia - Sección filosófica */}
        <section ref={storyRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Inicio filosófico */}
              <div className="text-center mb-16">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isStoryInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-2xl lg:text-4xl font-light text-white/90 leading-relaxed mb-8"
                >
                  Desde hace tiempo me di cuenta de algo fundamental
                </motion.p>
              </div>

              {/* Párrafos narrativos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="space-y-6 text-lg lg:text-xl font-light text-white/70 leading-relaxed"
              >
                <p>
                  Trabajando como psicólogo en Europa, atendiendo pacientes de distintas culturas y realidades, empecé a notar un patrón invisible que se repetía una y otra vez: <span className="text-white">las mismas historias, diferentes personas</span>.
                </p>
                
                <p>
                  No importaba si venían por ansiedad, por problemas de pareja, por una enfermedad crónica o por estancamiento económico. <span className="text-purple-300">El problema nunca era el problema</span>. Era el <span className="text-fuchsia-300 italic">filtro</span> con el que miraban su realidad.
                </p>

                <p>
                  Y entonces descubrí algo que cambió todo: <span className="text-white">la ciencia más rigurosa de nuestra época estaba llegando a las mismas conclusiones que la sabiduría más antigua de la humanidad</span>.
                </p>
              </motion.div>

              {/* Quote destacado */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isStoryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 0.6 }}
                className="my-16 p-10 lg:p-14 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl"
              >
                <p className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed text-center italic">
                  "Los físicos cuánticos confirman lo que los místicos siempre supieron:
                  <br />
                  <span className="text-purple-300 font-normal">el observador crea la realidad observada</span>"
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="space-y-6 text-lg lg:text-xl font-light text-white/70 leading-relaxed"
              >
                <p>
                  La epigenética demostrando que <span className="text-white">tus pensamientos cambian tu ADN</span>. La psicología económica revelando que <span className="text-white">el mercado se mueve por emociones colectivas</span>. La neurociencia afectiva confirmando que <span className="text-white">repites relaciones porque tu cerebro busca lo familiar</span>.
                </p>

                <p>
                  Y hace 2,500 años, Buda ya lo sabía: <span className="text-purple-300 italic">"Tu sufrimiento no viene de lo que te pasa, sino de cómo lo interpretas"</span>.
                </p>

                <p className="text-white/90 text-2xl lg:text-3xl font-normal mt-12">
                  No estamos descubriendo nada nuevo.
                  <br />
                  <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                    Estamos recordando lo que siempre supimos.
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Divisor elegante */}
        <div className="max-w-6xl mx-auto px-6 lg:px-20">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isStoryInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-20"
          />
        </div>

        {/* Sección de Problemas - Ciencia + Ancestral */}
        <section ref={scienceRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-6xl mx-auto">
            {/* Introducción a los problemas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl lg:text-5xl font-light text-white mb-8 leading-tight">
                Por eso, si sufres de algún problema
                <br />
                <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  en estas áreas...
                </span>
              </h2>
              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed max-w-3xl mx-auto">
                <span className="text-white">Es posible transformarlo</span>. Y te lo demostraré con ciencia y sabiduría ancestral.
              </p>
            </motion.div>

            {/* Grid de áreas de problema */}
            <div className="space-y-12 lg:space-y-16">
              {problemAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: area.delay }}
                  className="group"
                >
                  <div className="relative p-8 lg:p-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl hover:border-purple-500/40 transition-all duration-500">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/5 group-hover:to-fuchsia-500/5 rounded-3xl transition-all duration-500"
                    />
                    
                    <div className="relative space-y-6">
                      {/* Header con icono y título */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                          <area.icon className="w-7 h-7 text-purple-300" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-normal text-white">
                          {area.title}
                        </h3>
                      </div>

                      {/* El problema */}
                      <div className="pl-4 border-l-2 border-red-500/30">
                        <p className="text-sm uppercase tracking-wide text-red-400/60 mb-2">El Patrón</p>
                        <p className="text-lg lg:text-xl font-light text-white/80 italic">
                          {area.problem}
                        </p>
                      </div>

                      {/* La ciencia */}
                      <div className="pl-4 border-l-2 border-purple-500/50">
                        <p className="text-sm uppercase tracking-wide text-purple-400/80 mb-2">La Ciencia Contemporánea</p>
                        <p className="text-base lg:text-lg font-light text-white/70">
                          {area.science}
                        </p>
                      </div>

                      {/* Lo ancestral */}
                      <div className="pl-4 border-l-2 border-fuchsia-500/50">
                        <p className="text-sm uppercase tracking-wide text-fuchsia-400/80 mb-2">La Sabiduría Ancestral</p>
                        <p className="text-base lg:text-lg font-light text-white/70 italic">
                          {area.ancestral}
                        </p>
                      </div>

                      {/* La solución */}
                      <div className="pl-4 border-l-2 border-emerald-500/50 mt-8">
                        <p className="text-sm uppercase tracking-wide text-emerald-400/80 mb-2">Por lo tanto...</p>
                        <p className="text-lg lg:text-xl font-normal text-white">
                          ✓ {area.reversible}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Final - AIÓN */}
        <section className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto">
            {/* Introducción a AIÓN */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-center mb-16"
            >
              <p className="text-2xl lg:text-3xl font-light text-white/80 leading-relaxed mb-12">
                Cada área de tu vida refleja el <span className="text-white">filtro</span> con el que la miras.
                <br />
                <span className="text-white/90">Cuando cambias el filtro...</span>
                <br />
                <span className="text-purple-300 font-normal">todo se transforma</span>.
              </p>

              {/* Divisor */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isScienceInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-16"
              />

              {/* AIÓN título */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isScienceInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.4)',
                      '0 0 40px rgba(217, 70, 239, 0.6)',
                      '0 0 20px rgba(168, 85, 247, 0.4)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl lg:text-8xl font-light tracking-wider text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text inline-block mb-8"
                >
                  AIÓN
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isScienceInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 1.4 }}
                className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed max-w-3xl mx-auto mb-16"
              >
                Es el método que creé integrando <span className="text-purple-300">neurociencia</span>,{' '}
                <span className="text-fuchsia-300">psicoanálisis</span> y{' '}
                <span className="text-violet-300">sabiduría ancestral</span> para identificar qué filtros inconscientes están construyendo tu experiencia actual—y cómo{' '}
                <span className="text-white font-normal">transformarlos</span> para que todo cambie.
              </motion.p>
            </motion.div>

            {/* Box premium de teoría de filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.6 }}
              className="relative p-10 lg:p-14 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 backdrop-blur-2xl border-2 border-purple-500/40 rounded-[2rem] overflow-hidden mb-16"
            >
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-[2rem]"
              />
              
              <motion.div
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{ width: '50%' }}
              />
              
              <div className="relative space-y-6">
                <p className="text-2xl lg:text-4xl font-light text-white/90 leading-relaxed">
                  Tu <span className="font-normal text-white">realidad</span> son tus{' '}
                  <span className="font-normal bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                    filtros operando
                  </span>
                </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
                
                <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                  La <span className="text-purple-300">salud</span>, las <span className="text-fuchsia-300">relaciones</span>,
                  las <span className="text-violet-300">emociones</span>, la <span className="text-purple-300">economía</span>...
                  <br className="hidden lg:block" />
                  <span className="text-white/90">Solo corresponden al filtro actual que sostienes</span>
                  <span className="text-white/50"> sin que te des cuenta</span>.
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent" />

                <p className="text-xl lg:text-2xl font-normal text-white leading-relaxed">
                  Al cambiar los filtros, cambia <span className="italic">todo</span>.
                </p>
              </div>
            </motion.div>

            {/* CTA Final */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="text-center"
            >
              <a
                href={`https://wa.me/420776711575?text=${encodeURIComponent('Hola Luis, quiero conocer Aión')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white rounded-full font-light text-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/50"
                style={{ backgroundSize: '200% 100%' }}
              >
                <motion.div
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ width: '50%' }}
                />
                
                <span className="relative z-10">Hablemos de Tu Situación</span>
                <motion.svg 
                  className="relative z-10 w-5 h-5"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default MetodoPage
