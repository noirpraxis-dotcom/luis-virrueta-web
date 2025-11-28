import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Brain, Palette, Cpu, Eye, Heart, Zap, Sparkles } from 'lucide-react'

const PhilosophyPage = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Eye className="w-16 h-16 mx-auto text-fuchsia-400 mb-6" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="font-display"
          >
            <div className="text-xl lg:text-2xl mb-6 text-white/50 uppercase tracking-[0.3em] font-mono">
              Filosofía
            </div>
            <div className="text-7xl sm:text-8xl lg:text-9xl leading-none mb-8 font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                Ainimation
              </span>
            </div>
            <p className="text-xl lg:text-2xl text-white/70 font-light max-w-4xl mx-auto leading-relaxed">
              Donde la psicología, el diseño y la inteligencia artificial se fusionan para crear marcas que piensan, sienten y perduran
            </p>
          </motion.h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent mx-auto w-96 mt-12"
          />
        </div>
      </section>

      {/* Content Sections */}
      <div className="px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ManifestoSection />
          <ThreePillars />
          <TheDifference />
          <TheSystem />
          <FinalStatement />
        </div>
      </div>
    </div>
  )
}

const ManifestoSection = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const manifestoPoints = [
    { key: 'intro', delay: 0 },
    { key: 'difference', delay: 0.15 },
    { key: 'approach', delay: 0.3 },
    { key: 'ai', delay: 0.45 }
  ]

  return (
    <div ref={ref} className="py-20">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <Sparkles className="w-12 h-12 mx-auto text-purple-400 mb-6" strokeWidth={1.5} />
        <h2 className="text-5xl lg:text-6xl font-bold mb-6 font-display">
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            Manifiesto
          </span>
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent w-64 mx-auto" />
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {manifestoPoints.map((point) => (
          <motion.div
            key={point.key}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: point.delay }}
            className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500"
          >
            <p className="text-white/80 text-lg leading-relaxed font-light">
              {t(`about.manifesto.${point.key}`)}
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-fuchsia-500/50 to-cyan-500/50 rounded-b-2xl origin-left"
            />
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
    <div ref={ref} className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <Brain className="w-12 h-12 mx-auto text-fuchsia-400 mb-6" strokeWidth={1.5} />
        <h2 className="text-5xl lg:text-6xl font-bold mb-6 font-display">
          <span className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Tres Pilares
          </span>
        </h2>
        <p className="text-lg text-white/60 mb-6 max-w-2xl mx-auto">
          Un objetivo: marcas que trascienden
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent w-64 mx-auto" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            className="group relative"
          >
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 h-full">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <pillar.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 font-display">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-white/70 text-sm leading-relaxed">
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
    <div ref={ref} className="py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 lg:p-12 overflow-hidden"
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <Eye className="w-12 h-12 mx-auto text-cyan-400 mb-6" strokeWidth={1.5} />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-display">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
                {t('about.manifesto.system')}
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/80 leading-relaxed mb-6 font-light"
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
    <div ref={ref} className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <Zap className="w-12 h-12 mx-auto text-cyan-400 mb-6" strokeWidth={1.5} />
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-display">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
            Tres Niveles
          </span>
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-6">
          Atención, deseo y memoria trabajando en sincronía
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent w-64 mx-auto" />
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            className="group relative"
          >
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 h-full">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <layer.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 font-display">
                {layer.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {layer.description}
              </p>
              
              {/* Gradient line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
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
    <div ref={ref} className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="bg-gradient-to-br from-purple-950/30 via-fuchsia-950/30 to-cyan-950/30 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl p-10 lg:p-16 relative overflow-hidden text-center"
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Sparkles className="w-12 h-12 mx-auto text-fuchsia-400 mb-6" strokeWidth={1.5} />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-2xl text-white/80 leading-relaxed mb-6 font-light"
          >
            {t('about.manifesto.calibration')}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent w-full max-w-2xl mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-3xl lg:text-4xl font-bold mb-8 font-display"
          >
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              {t('about.manifesto.permanence')}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-5xl lg:text-6xl font-bold font-display mb-3">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
                Ainimation
              </span>
            </div>
            <p className="text-white/50 text-xs tracking-widest uppercase font-mono">
              {t('hero.tagline')}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default PhilosophyPage
