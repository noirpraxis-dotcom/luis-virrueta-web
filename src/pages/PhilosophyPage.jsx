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
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 lg:py-40 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="text-white font-bold tracking-tight mb-8 font-display"
            >
              <div className="text-4xl lg:text-5xl mb-4 text-white/60">{t('about.title')}</div>
              <div className="text-6xl lg:text-8xl">
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                  {t('about.subtitle')}
                </span>
              </div>
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto w-80 mb-12"
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
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
          Tres disciplinas, un objetivo
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-64 mx-auto" />
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
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 font-display">
              {t('about.manifesto.system')}
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
      color: 'from-cyan-400 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Deseo',
      description: 'Cada forma, color y ritmo está calibrado para generar una respuesta emocional específica. No decoramos: arquitecturamos el deseo.',
      color: 'from-fuchsia-400 to-fuchsia-500'
    },
    {
      icon: Zap,
      title: 'Memoria',
      description: 'Construimos estructuras mnemónicas que se anclan en el inconsciente. Tu marca no solo se ve: se recuerda, se reconoce, se prefiere.',
      color: 'from-purple-400 to-purple-500'
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
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
          Los tres niveles invisibles
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto font-body">
          Construimos un sistema de significado que conecta la atención, el deseo y la memoria
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-64 mx-auto mt-8" />
      </motion.div>

      <div className="space-y-6">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-white/20 transition-all duration-500">
              <div className="flex items-start gap-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center shadow-lg`}
                >
                  <layer.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3 font-display">
                    {layer.title}
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed font-body">
                    {layer.description}
                  </p>
                </div>
              </div>
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
        className="bg-gradient-to-br from-black via-zinc-900 to-black border border-white/20 rounded-3xl p-12 lg:p-20"
      >
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
          className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full max-w-2xl mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-white mb-12 font-display"
        >
          {t('about.manifesto.permanence')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="inline-block"
        >
          <div className="text-5xl lg:text-6xl font-bold font-display">
            <span className="bg-gradient-to-r from-neural-400 via-psych-500 to-design-500 bg-clip-text text-transparent">
              Ainimation
            </span>
          </div>
          <p className="text-white/50 text-sm mt-4 tracking-widest uppercase font-mono">
            {t('hero.tagline')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PhilosophyPage
