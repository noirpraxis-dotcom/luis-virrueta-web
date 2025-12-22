import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Palette, Code, Sparkles, Award, Target, Zap, Heart, Eye, Users, TrendingUp, Lightbulb } from 'lucide-react'

const AboutCreator = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const skills = [
    {
      icon: Brain,
      title: "Psicólogo Clínico & Psicoanalista",
      description: "Licenciatura en Psicología con especialización en psicoanálisis. Entiendo los mecanismos inconscientes de decisión, memoria emocional y construcción de vínculos.",
      color: "#a855f7",
      years: "2015-2020"
    },
    {
      icon: Palette,
      title: "Diseñador Multidisciplinario",
      description: "8+ años diseñando identidades visuales, motion graphics, experiencias digitales y branding estratégico para marcas premium y startups.",
      color: "#d946ef",
      years: "2016-Presente"
    },
    {
      icon: Code,
      title: "Desarrollador Full-stack & Especialista IA",
      description: "React, Node.js, Python. Fine-tuning de modelos LLM, automatización con IA, desarrollo de apps premium y experiencias interactivas.",
      color: "#e879f9",
      years: "2020-Presente"
    }
  ]

  const methodology = [
    {
      icon: Eye,
      title: "Observación Psicoanalítica",
      description: "Analizo los patrones inconscientes de tu audiencia: qué los motiva, qué temen, qué desean profundamente."
    },
    {
      icon: Target,
      title: "Estrategia de Posicionamiento",
      description: "Defino el territorio emocional único de tu marca. No compites por precio, compites por significado."
    },
    {
      icon: Palette,
      title: "Diseño con Propósito",
      description: "Cada color, forma y tipografía responde a principios psicológicos probados. Nada es decorativo."
    },
    {
      icon: Zap,
      title: "Implementación Premium",
      description: "Desarrollo apps, sitios web y experiencias digitales con la calidad técnica que tu marca merece."
    }
  ]

  const achievements = [
    {
      icon: Users,
      number: "50+",
      label: "Marcas transformadas"
    },
    {
      icon: TrendingUp,
      number: "200%",
      label: "ROI promedio en campañas"
    },
    {
      icon: Award,
      number: "3",
      label: "Certificaciones internacionales"
    },
    {
      icon: Heart,
      number: "100%",
      label: "Clientes satisfechos"
    }
  ]

  return (
    <section 
      id="sobre-mi"
      ref={ref}
      className="relative bg-gradient-to-b from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] py-32 lg:py-40 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#a855f7]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#d946ef]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#d946ef] text-sm sm:text-base font-mono uppercase tracking-widest mb-4"
          >
            El Creador
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display"
          >
            Psicólogo ·{' '}
            <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">
              Filósofo · Investigador
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/50 text-sm"
          >
            La mayoría de las personas no vive la realidad. Vive la interpretación que hace de ella.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center mb-20">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="lg:col-span-2 relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl border border-white/10 group">
              {/* Placeholder for photo */}
              <div className="w-full h-full bg-gradient-to-br from-[#a855f7]/20 via-[#1A1A1A] to-[#d946ef]/20 flex items-center justify-center">
                <div className="text-center px-6">
                  <Sparkles className="w-16 h-16 mx-auto text-[#a855f7] mb-4" strokeWidth={1.5} />
                  <p className="text-white/60 text-sm font-mono">Tu foto profesional</p>
                  <p className="text-white/30 text-xs font-mono mt-2">Actualizar imagen</p>
                </div>
              </div>
              
              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-[#a855f7]/30 via-transparent to-transparent"
              />
            </div>

            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-[#a855f7]/20 rounded-3xl -z-10" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Name */}
            <div>
              <h3 className="text-5xl lg:text-6xl font-light text-white mb-3 tracking-wide font-display">
                Luis Virrueta
              </h3>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 1 }}
                className="h-px bg-gradient-to-r from-[#a855f7] via-[#d946ef]/50 to-transparent w-56"
              />
            </div>

            {/* Bio */}
            <p className="text-white/80 text-lg lg:text-xl leading-relaxed">
              Soy psicólogo, psicoanalista y diseñador. Mi carrera comenzó en el consultorio, 
              escuchando las historias más profundas del ser humano.
            </p>
            <p className="text-white/70 text-base lg:text-lg leading-relaxed">
              Aprendí que <span className="text-white font-semibold">detrás de cada decisión hay una emoción</span>. 
              Detrás de cada compra, un deseo inconsciente.
            </p>
            <p className="text-white/70 text-base lg:text-lg leading-relaxed">
              Entonces me pregunté: <span className="text-[#a855f7] italic">¿Y si aplicáramos esto al branding?</span>
            </p>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="border-l-2 border-[#d946ef]/40 pl-6 py-4 mt-8"
            >
              <p className="text-[#d946ef] text-lg lg:text-xl italic font-light">
                "Como psicólogo y diseñador, fusiono la precisión del análisis humano 
                con la belleza estratégica del diseño."
              </p>
            </motion.div>

            <p className="text-white/60 text-base">
              No solo creo marcas. Diseño identidades que resuenan con lo más profundo de tu audiencia.
            </p>
          </motion.div>
        </div>

        {/* Personal Journey - Exploration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="max-w-5xl mx-auto mb-24 bg-white/[0.02] border border-white/10 rounded-3xl p-12 lg:p-16"
        >
          <div className="mb-10 text-center">
            <Brain className="w-12 h-12 text-[#a855f7] mx-auto mb-6" strokeWidth={1.5} />
            <h4 className="text-2xl lg:text-3xl font-light text-white mb-4 font-display tracking-wide">
              Mi trabajo gira alrededor de una pregunta central:
            </h4>
            <p className="text-[#d946ef] text-xl lg:text-2xl italic">
              ¿Cómo se construye la experiencia que llamamos realidad?
            </p>
          </div>

          <div className="space-y-6 text-white/70 text-base lg:text-lg leading-relaxed">
            <p>
              <span className="text-white font-semibold">Estudié psicología</span> y me especialicé en psicoanálisis. 
              Pero no me conformé con ello.
            </p>
            <p>
              <span className="text-white font-semibold">Actualmente vivo en Europa</span>, explorando diferentes culturas y tradiciones. 
              Mi vida es el reflejo de mi búsqueda.
            </p>
            <p>
              Desde pequeño crecí dentro del catolicismo, pero me exploraba a ir a otro tipo de religiones 
              para empezar a ver <span className="text-white font-semibold">qué era lo que compartían entre ellas</span>.
            </p>
            <p className="text-white/90 text-lg lg:text-xl italic border-l-2 border-[#a855f7]/40 pl-6 py-4 mt-8">
              Y me daba cuenta que <span className="text-[#a855f7] not-italic font-semibold">todas decían que ellas eran la verdadera</span>.
            </p>
            <p>
              No como una teoría abstracta ni como una promesa de cambio rápido, sino como un fenómeno vivo 
              que ocurre en el tiempo. Porque lo que hoy comenzamos a descubrir, en muchos sentidos, 
              <span className="text-white font-semibold"> ya había sido intuido</span>: la idea de que el inicio y el final 
              no están separados, sino que conviven en el presente.
            </p>
          </div>
        </motion.div>

        {/* Skills Grid - Expanded */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="text-center mb-16">
            <h4 className="text-3xl lg:text-5xl font-light text-white mb-6 font-display tracking-wide">
              Mi Triple Formación
            </h4>
            <p className="text-white/60 text-lg max-w-3xl mx-auto mb-8">
              La combinación única que hace que mi trabajo sea diferente a cualquier agencia de branding
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 1.6 }}
              className="h-px bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent mx-auto w-80"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {skills.map((skill, index) => {
              const Icon = skill.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.7 + index * 0.15 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="relative group"
                >
                  <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 h-full hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#a855f7]/10">
                    {/* Year badge */}
                    <div className="text-[#d946ef] text-xs font-mono uppercase tracking-widest mb-6">
                      {skill.years}
                    </div>
                    
                    <div 
                      className="w-16 h-16 rounded-2xl p-4 mb-8 inline-flex"
                      style={{ backgroundColor: `${skill.color}15` }}
                    >
                      <Icon 
                        className="w-full h-full" 
                        style={{ color: skill.color }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <h5 className="text-white text-xl lg:text-2xl font-bold mb-5 font-display leading-tight">
                      {skill.title}
                    </h5>
                    <p className="text-white/70 text-base leading-relaxed">
                      {skill.description}
                    </p>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      style={{ backgroundColor: skill.color }}
                      className="h-0.5 mt-8 origin-left"
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Methodology Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <Lightbulb className="w-12 h-12 text-[#d946ef] mx-auto mb-6" strokeWidth={1.5} />
            <h4 className="text-3xl lg:text-5xl font-light text-white mb-6 font-display tracking-wide">
              Mi Metodología
            </h4>
            <p className="text-white/60 text-lg max-w-3xl mx-auto">
              Cómo aplico psicología, diseño y tecnología para crear marcas que conectan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodology.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 2.4 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#a855f7]/50 transition-all duration-500"
                >
                  <Icon className="w-10 h-10 text-[#a855f7] mb-6" strokeWidth={1.5} />
                  <h5 className="text-white text-lg font-semibold mb-4">
                    {item.title}
                  </h5>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h4 className="text-3xl lg:text-5xl font-light text-white mb-6 font-display tracking-wide">
              Resultados que Hablan
            </h4>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 3 }}
              className="h-px bg-gradient-to-r from-transparent via-[#d946ef]/40 to-transparent mx-auto w-80"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 3.2 + index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-12 h-12 text-[#a855f7] mx-auto mb-4" strokeWidth={1.5} />
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 font-display">
                    {item.number}
                  </div>
                  <div className="text-white/60 text-sm uppercase tracking-wider">
                    {item.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 3.6 }}
          className="text-center bg-gradient-to-br from-[#a855f7]/10 via-[#1A1A1A] to-[#d946ef]/10 border border-white/10 rounded-3xl p-12 lg:p-16"
        >
          <h4 className="text-3xl lg:text-4xl font-light text-white mb-6 font-display">
            ¿Listo para iniciar <span className="text-[#a855f7] font-semibold">tu proceso de transformación</span>?
          </h4>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            No desde el consejo, sino desde el inconsciente. Un acompañamiento profundo para cambiar tu realidad.
          </p>
          <motion.a
            href="https://wa.me/5218115936829?text=Hola%20Luis,%20me%20gustaría%20iniciar%20un%20proceso%20de%20acompañamiento"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-[#a855f7] to-[#d946ef] px-12 py-5 rounded-full text-white font-semibold text-lg shadow-2xl"
          >
            Iniciemos tu proceso
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutCreator
