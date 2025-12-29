import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { 
  Palette, 
  Smartphone, 
  Video, 
  Bot, 
  Brain,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react'

const ServicesOverview = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const services = [
    {
      icon: Palette,
      title: 'Identidad de Marca',
      subtitle: 'Brand Identity',
      description: 'Sistemas visuales completos: logo, tipografía, paleta de color, manual de marca. Diseñamos la personalidad visual que tu audiencia recordará para siempre.',
      gradient: 'from-purple-500 to-purple-600',
      glowColor: 'purple',
      includes: ['Logo + Variantes', 'Manual de Marca', 'Papelería Completa', 'Aplicaciones Digitales']
    },
    {
      icon: Smartphone,
      title: 'Apps Premium',
      subtitle: 'Full-Stack Development',
      description: 'Desarrollo completo de apps y plataformas web. React, Node.js, bases de datos, hosting. UI/UX con psicología aplicada que convierte.',
      gradient: 'from-fuchsia-500 to-fuchsia-600',
      glowColor: 'fuchsia',
      includes: ['Desarrollo Full-Stack', 'UI/UX Design', 'Backend + Database', 'Deploy & Mantenimiento']
    },
    {
      icon: Video,
      title: 'Contenido Digital',
      subtitle: 'Motion & Audio',
      description: 'Video, motion graphics, edición de audio, animaciones 3D. Contenido visual que hipnotiza, viraliza y posiciona tu marca en otro nivel.',
      gradient: 'from-cyan-500 to-cyan-600',
      glowColor: 'cyan',
      includes: ['Motion Graphics', 'Edición de Video', 'Audio Branding', 'Animación 3D']
    },
    {
      icon: Bot,
      title: 'Avatares IA',
      subtitle: 'Generative AI',
      description: 'Avatares generados con IA entrenada específicamente para tu marca. Tu portavoz digital que aparece en videos, redes sociales y contenido automatizado.',
      gradient: 'from-emerald-500 to-emerald-600',
      glowColor: 'emerald',
      includes: ['Fine-tuning IA', 'Avatar Personalizado', 'Voice Clone', 'Workflow Automatizado']
    },
    {
      icon: Brain,
      title: 'Consultoría Psicológica',
      subtitle: 'Psychology Consulting',
      description: 'Análisis profundo de personalidad, vocación y desarrollo personal desde el psicoanálisis y la psicología humanista.',
      gradient: 'from-violet-500 to-violet-600',
      glowColor: 'violet',
      includes: ['Análisis Profundo', 'Test Vocacional', 'Orientación Personal', 'Reporte Personalizado']
    }
  ]

  return (
    <section 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black py-20 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title - Mobile First */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="mb-6 sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs sm:text-sm tracking-widest uppercase font-mono mb-6 sm:mb-8">
              <Layers className="w-4 h-4" strokeWidth={2} />
              Servicios Premium
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-white text-4xl sm:text-5xl lg:text-7xl font-light tracking-[0.1em] sm:tracking-[0.15em] font-display mb-4 sm:mb-6"
          >
            LO QUE HAGO
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/70 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto font-light font-body mb-6 sm:mb-8"
          >
            Cinco formas de transformar tu marca en una experiencia inolvidable
          </motion.p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto w-48 sm:w-64 lg:w-80"
          />
        </div>

        {/* Services Grid - Mobile First */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
              className={`group relative ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-white/20 transition-all duration-500 h-full overflow-hidden">
                {/* Hover glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-2xl`}
                  initial={false}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient} p-3 sm:p-3.5 md:p-4 mb-6 sm:mb-8`}
                >
                  <service.icon className="w-full h-full text-white" strokeWidth={1.5} />
                </motion.div>

                {/* Title & Subtitle */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl md:text-2xl font-medium text-white mb-2 font-display">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-sm text-white/50 uppercase tracking-widest font-mono">
                    {service.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-sm text-white/70 leading-relaxed mb-6 sm:mb-8 font-light font-body">
                  {service.description}
                </p>

                {/* Includes List */}
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider font-mono mb-3 sm:mb-4">
                    Incluye:
                  </p>
                  {service.includes.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-2 sm:gap-3"
                    >
                      <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`} />
                      <span className="text-xs sm:text-sm text-white/60 font-light font-body">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Arrow */}
                <motion.div
                  className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-xs sm:text-sm uppercase tracking-widest font-mono">Ver más</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.div>

                {/* Bottom gradient line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} origin-left`}
                />
              </div>

              {/* External glow on hover */}
              <motion.div
                className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
          className="text-center mt-16 sm:mt-20 lg:mt-24"
        >
          <motion.a
            href="/servicios"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-md border border-purple-500/30 rounded-full text-white text-sm sm:text-base tracking-wider uppercase font-medium hover:border-fuchsia-500/50 hover:shadow-lg hover:shadow-fuchsia-500/20 transition-all duration-500 font-mono"
          >
            <span>Ver todos los servicios</span>
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesOverview
