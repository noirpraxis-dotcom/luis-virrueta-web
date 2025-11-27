import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Brain, Palette, Cpu, Eye, Heart, Zap } from 'lucide-react'

const PhilosophyPage = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero Section - MEJORADO */}
      <section ref={heroRef} className="relative py-32 lg:py-48 px-6 lg:px-20 overflow-hidden">
        {/* Gradient orbs más visibles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Icon decorativo arriba del título */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <Eye className="w-16 h-16 mx-auto text-fuchsia-400 mb-6" strokeWidth={1.5} />
            </motion.div>

            {/* Título principal CINEMATOGRÁFICO */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="font-bold tracking-tight mb-12 font-display"
            >
              {/* Subtítulo pequeño */}
              <div className="text-2xl lg:text-3xl mb-6 text-white/60 uppercase tracking-[0.3em] font-mono">
                Filosofía
              </div>
              {/* Título principal GRANDE Y VISIBLE */}
              <div className="text-6xl sm:text-7xl lg:text-9xl leading-none mb-8">
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                  Ainimation
                </span>
              </div>
              {/* Tagline */}
              <div className="text-xl lg:text-3xl text-white/80 font-light max-w-4xl mx-auto leading-relaxed">
                Donde la psicología, el diseño y la inteligencia artificial se fusionan para crear marcas que piensan, sienten y perduran
              </div>
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent mx-auto w-96 mb-12"
            />
          </motion.div>

          {/* Manifesto Sections */}
          <ManifestoSection />
          
          {/* Three Pillars */}
          <ThreePillars />
          
          {/* The Difference */}
          <TheDifference />
          
          {/* The System */}
          <TheSystem />
          
          {/* Final Statement */}
          <FinalStatement />
        </div>
      </section>
    </div>
  )
}

const ManifestoSection = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const manifestoPoints = [
    { key: 'intro', delay: 0 },
    { key: 'difference', delay: 0.2 },
    { key: 'approach', delay: 0.4 },
    { key: 'ai', delay: 0.6 }
  ]

  return (
    <div ref={ref} className="mb-32">
      <div className="space-y-8 max-w-5xl mx-auto">
        {manifestoPoints.map((point, index) => (
          <motion.div
            key={point.key}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: point.delay }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-12 hover:border-purple-500/30 transition-all duration-500"
          >
            <p className="text-white/90 text-xl lg:text-2xl leading-relaxed font-light font-body">
              {t(`about.manifesto.${point.key}`)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const ThreePillars = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const pillars = [
    {
      icon: Brain,
      title: t('about.credentials.psych'),
      color: 'psych',
      gradient: 'from-fuchsia-500 to-fuchsia-600',
      description: 'Entendemos cómo funciona la mente: atención, emoción, memoria. Cada decisión visual está fundamentada en neurociencia y psicología cognitiva.'
    },
    {
      icon: Palette,
      title: t('about.credentials.design'),
      color: 'design',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Dominamos todos los lenguajes visuales: identidad, motion, UI/UX, 3D. No improvisamos: diseñamos sistemas coherentes que escalan.'
    },
    {
      icon: Cpu,
      title: t('about.credentials.tech'),
      color: 'neural',
      gradient: 'from-cyan-500 to-cyan-600',
      description: 'Trabajamos con IA generativa, fine-tuning, workflows de producción. No usamos la IA como atajo: la entrenamos para nuestros objetivos.'
    }
  ]

  return (
    <div ref={ref} className="mb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <Sparkles className="w-12 h-12 mx-auto text-purple-400 mb-6" strokeWidth={1.5} />
        <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 font-display">
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            Tres Pilares
          </span>
        </h2>
        <p className="text-xl text-white/60 mb-6 max-w-2xl mx-auto">
          Un objetivo: marcas que trascienden
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent w-80 mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group relative"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 h-full">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 shadow-lg`}
              >
                <pillar.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-white/70 leading-relaxed font-body">
                {pillar.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const TheDifference = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="mb-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 lg:p-16 overflow-hidden"
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Eye className="w-16 h-16 mx-auto text-purple-400 mb-6" strokeWidth={1.5} />
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 font-display">
              <span className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                {t('about.manifesto.system')}
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl lg:text-3xl text-white/90 leading-relaxed mb-8 font-light font-body"
          >
            {t('about.manifesto.result')}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-full max-w-3xl mx-auto"
          />
        </div>
      </motion.div>
    </div>
  )
}

const TheSystem = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const layers = [
    {
      icon: Eye,
      title: 'Atención',
      description: 'Diseñamos jerarquías visuales que guían la mirada de forma inconsciente. Controlamos dónde mira primero, cuánto tiempo permanece, y hacia dónde se mueve.',
      color: 'from-cyan-400 to-cyan-500',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Heart,
      title: 'Deseo',
      description: 'Cada forma, color y ritmo está calibrado para generar una respuesta emocional específica. No decoramos: arquitecturamos el deseo.',
      color: 'from-fuchsia-400 to-fuchsia-500',
      gradient: 'from-fuchsia-500 to-fuchsia-600'
    },
    {
      icon: Zap,
      title: 'Memoria',
      description: 'Construimos estructuras mnemónicas que se anclan en el inconsciente. Tu marca no solo se ve: se recuerda, se reconoce, se prefiere.',
      color: 'from-purple-400 to-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div ref={ref} className="mb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <Zap className="w-12 h-12 mx-auto text-cyan-400 mb-6" strokeWidth={1.5} />
        <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 font-display">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
            Tres Niveles Invisibles
          </span>
        </h2>
        <p className="text-xl text-white/60 max-w-3xl mx-auto font-body mb-6">
          Construimos un sistema de significado que conecta la atención, el deseo y la memoria
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent w-80 mx-auto" />
      </motion.div>

      <div className="space-y-6">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group relative"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-white/20 transition-all duration-500">
              <div className="flex items-start gap-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${layer.gradient} flex items-center justify-center shadow-lg shadow-${layer.gradient.split('-')[1]}-500/30`}
                >
                  <layer.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4 font-display">
                    {layer.title}
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed font-body">
                    {layer.description}
                  </p>
                </div>
              </div>
              {/* Gradient line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${layer.gradient} rounded-b-2xl origin-left`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const FinalStatement = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="bg-gradient-to-br from-purple-950/30 via-fuchsia-950/30 to-cyan-950/30 backdrop-blur-xl border border-fuchsia-500/30 rounded-3xl p-12 lg:p-20 relative overflow-hidden"
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Sparkles className="w-12 h-12 mx-auto text-fuchsia-400 mb-8" strokeWidth={1.5} />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl lg:text-3xl text-white/90 leading-relaxed mb-8 font-light font-body"
          >
            {t('about.manifesto.calibration')}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent w-full max-w-2xl mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-12 font-display"
          >
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              {t('about.manifesto.permanence')}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="inline-block"
          >
            <div className="text-6xl lg:text-7xl font-bold font-display mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
                Ainimation
              </span>
            </div>
            <p className="text-white/50 text-sm tracking-widest uppercase font-mono">
              {t('hero.tagline')}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default PhilosophyPage
