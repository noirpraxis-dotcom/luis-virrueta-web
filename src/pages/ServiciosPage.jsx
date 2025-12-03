import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Palette, 
  Smartphone, 
  Video, 
  Bot, 
  Brain,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Type,
  Droplets,
  Image as ImageIcon,
  FileText,
  Eye,
  Award
} from 'lucide-react'

const ServiciosPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const identityRef = useRef(null)
  const isIdentityInView = useInView(identityRef, { once: true, amount: 0.3 })

  const services = [
    {
      id: 'identidad-marca',
      icon: Palette,
      title: 'Identidad de Marca',
      subtitle: 'Brand Identity',
      tagline: 'Sistemas visuales que permanecen en la memoria',
      description: 'Creamos identidades de marca completas que no solo se ven increíbles, sino que están fundamentadas en psicología y neurociencia. Cada elemento visual está diseñado para conectar con el inconsciente de tu audiencia.',
      gradient: 'from-purple-500 to-purple-600',
      features: [
        'Logo + Sistema de Identidad Completo',
        'Manual de Marca Profesional (PDF)',
        'Paleta de Color Psicológica',
        'Tipografía + Jerarquías',
        'Papelería Corporativa',
        'Plantillas de Redes Sociales',
        'Aplicaciones Digitales',
        'Archivos Editables (AI, SVG, PNG)'
      ],
      process: [
        'Briefing + Investigación de Mercado',
        'Análisis Psicoanalítico de Audiencia',
        'Conceptualización + Bocetos',
        'Desarrollo de Identidad Visual',
        'Manual de Marca + Guidelines',
        'Entrega + Capacitación'
      ],
      duration: '4-6 semanas',
      investment: 'Desde $2,500 USD'
    },
    {
      id: 'apps-premium',
      icon: Smartphone,
      title: 'Apps Premium',
      subtitle: 'Full-Stack Development',
      tagline: 'Desarrollo completo: diseño + código',
      description: 'Desarrollo full-stack de aplicaciones web y móviles. React, Node.js, bases de datos, hosting. UI/UX con psicología aplicada que convierte usuarios en clientes leales.',
      gradient: 'from-fuchsia-500 to-fuchsia-600',
      features: [
        'UI/UX Design + Prototipos Interactivos',
        'Desarrollo Frontend (React/Next.js)',
        'Backend + API (Node.js/Express)',
        'Base de Datos (PostgreSQL/MongoDB)',
        'Autenticación + Seguridad',
        'Responsive + PWA',
        'Deploy + Hosting',
        'Mantenimiento + Soporte'
      ],
      process: [
        'Discovery + Definición de Features',
        'Arquitectura de Información',
        'Diseño UI/UX + Design System',
        'Desarrollo Frontend',
        'Desarrollo Backend + Database',
        'Testing + Deploy'
      ],
      duration: '8-12 semanas',
      investment: 'Desde $5,000 USD'
    },
    {
      id: 'contenido-digital',
      icon: Video,
      title: 'Contenido Digital',
      subtitle: 'Motion & Audio',
      tagline: 'Video, motion graphics y animaciones 3D',
      description: 'Creación de contenido visual que hipnotiza. Video profesional, motion graphics, animaciones 3D, edición de audio. Contenido que viraliza y posiciona tu marca.',
      gradient: 'from-cyan-500 to-cyan-600',
      features: [
        'Video Profesional (Shooting + Edición)',
        'Motion Graphics Cinematográficos',
        'Animaciones 3D (Blender/Cinema 4D)',
        'Edición de Audio + Sound Design',
        'Reels + TikToks Optimizados',
        'Video Ads para Redes Sociales',
        'Intro/Outro para YouTube',
        'Templates Editables (After Effects)'
      ],
      process: [
        'Briefing Creativo + Referencias',
        'Storyboard + Concepto Visual',
        'Shooting (si aplica)',
        'Edición + Motion Graphics',
        'Sound Design + Música',
        'Revisiones + Entrega Final'
      ],
      duration: '2-4 semanas',
      investment: 'Desde $1,500 USD'
    },
    {
      id: 'avatares-ia',
      icon: Bot,
      title: 'Avatares IA',
      subtitle: 'Generative AI',
      tagline: 'Tu portavoz digital generado con IA',
      description: 'Creamos avatares digitales generados con IA, entrenados específicamente para tu marca. Aparecen en videos, redes sociales y contenido automatizado.',
      gradient: 'from-emerald-500 to-emerald-600',
      features: [
        'Fine-tuning de Modelo IA',
        'Avatar Personalizado (Estilo/Personalidad)',
        'Voice Cloning Profesional',
        'Lip-sync Automático',
        'Workflow de Generación',
        'Scripts + Prompts Optimizados',
        'Videos Automatizados',
        'Capacitación + Documentación'
      ],
      process: [
        'Definición de Personalidad del Avatar',
        'Entrenamiento del Modelo IA',
        'Voice Clone + Testing',
        'Workflow de Producción',
        'Pruebas + Ajustes',
        'Entrega + Capacitación'
      ],
      duration: '6-8 semanas',
      investment: 'Desde $4,000 USD'
    },
    {
      id: 'consultoria-psicoanalitica',
      icon: Brain,
      title: 'Consultoría Psicoanalítica',
      subtitle: 'Brand Psychology',
      tagline: 'Desciframos el inconsciente de tu audiencia',
      description: 'Auditoría psicoanalítica profunda de tu marca: qué emociones genera, arquetipos, deseos inconscientes de tu audiencia. Optimización emocional para vender más.',
      gradient: 'from-violet-500 to-violet-600',
      features: [
        'Análisis del Inconsciente de tu Audiencia',
        'Arquetipos de Marca (Jung)',
        'Mapeo de Deseos y Miedos',
        'Auditoría de Identidad Visual',
        'Análisis de Competencia',
        'Estrategia Emocional',
        'Reporte Ejecutivo (PDF)',
        'Sesión de Consultoría (2 horas)'
      ],
      process: [
        'Recopilación de Material de Marca',
        'Entrevistas con Stakeholders',
        'Análisis Psicoanalítico',
        'Mapeo de Arquetipos',
        'Identificación de Oportunidades',
        'Reporte + Presentación'
      ],
      duration: '3-4 semanas',
      investment: 'Desde $2,000 USD'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Sparkles className="w-16 h-16 mx-auto text-fuchsia-400 mb-6" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl lg:text-8xl font-bold text-center mb-8 font-display"
          >
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              Servicios Premium
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/70 text-center max-w-3xl mx-auto font-light mb-12"
          >
            Cinco formas de transformar tu marca en una experiencia inolvidable que conecta con el inconsciente
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto w-80"
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-32">
          {services.map((service, index) => (
            <ServiceDetail key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}

const ServiceDetail = ({ service, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="grid lg:grid-cols-2 gap-12 items-start"
      >
        {/* Left: Info */}
        <div className="space-y-8">
          {/* Icon + Title */}
          <div>
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-3.5 mb-6 inline-block`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <service.icon className="w-full h-full text-white" strokeWidth={1.5} />
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3 font-display">
              {service.title}
            </h2>
            <p className="text-white/50 uppercase tracking-widest text-sm font-mono mb-4">
              {service.subtitle}
            </p>
            <p className={`text-2xl font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-6 font-display`}>
              {service.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-white/80 leading-relaxed">
            {service.description}
          </p>

          {/* Investment + Duration */}
          <div className="flex gap-6 pt-4">
            <div>
              <p className="text-white/50 text-sm uppercase tracking-wider font-mono mb-2">Inversión</p>
              <p className={`text-2xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                {service.investment}
              </p>
            </div>
            <div>
              <p className="text-white/50 text-sm uppercase tracking-wider font-mono mb-2">Duración</p>
              <p className="text-xl font-medium text-white">{service.duration}</p>
            </div>
          </div>
        </div>

        {/* Right: Features + Process */}
        <div className="space-y-8">
          {/* Features */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" strokeWidth={2} />
              ¿Qué incluye?
            </h3>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex items-start gap-3 text-white/70"
                >
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient} mt-2 flex-shrink-0`} />
                  <span className="text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" strokeWidth={2} />
              Proceso
            </h3>
            <ol className="space-y-4">
              {service.process.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex items-start gap-4"
                >
                  <span className={`text-lg font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent flex-shrink-0`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-white/70 text-sm pt-1">{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* CTA */}
          <motion.a
            href="/contacto"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r ${service.gradient} rounded-xl text-white font-medium hover:shadow-lg hover:shadow-${service.gradient.split(' ')[0]}/30 transition-all duration-300`}
          >
            <span>Solicitar Cotización</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </div>
      </motion.div>
    </div>
  )
}

export default ServiciosPage
