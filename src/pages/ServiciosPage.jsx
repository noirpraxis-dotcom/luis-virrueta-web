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
  Award,
  Code,
  Briefcase
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
      tagline: 'Diseños que conectan y permanecen',
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
      duration: '4-6 semanas'
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
      duration: '8-12 semanas'
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
      duration: '2-4 semanas'
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
      duration: '6-8 semanas'
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
      duration: '3-4 semanas'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 -top-28 -bottom-16 overflow-hidden pointer-events-none z-0">
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
            <source src="/hero servicios.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
          {/* Overlay oscuro uniforme */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Title con efecto 3D igual que Portafolio */}
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
              {/* S con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>S</span>
                <span className="relative text-white">S</span>
              </span>
              {/* ervicio */}
              <span className="text-white">ervicio</span>
              {/* s con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-tl from-cyan-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>s</span>
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
            {/* Etiqueta superior con borde */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/80 font-light tracking-wider uppercase">
                  Servicios Premium
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
              {/* Estrategia */}
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Estrategia
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Creatividad */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Creatividad
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Ejecución */}
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  Ejecución
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
        className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-start"
      >
        {/* Left: Info - Estilo premium */}
        <div className="space-y-10">
          {/* Icon + Title */}
          <div>
            {/* Icon con animación sutil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-8"
            >
              <service.icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <span className="text-white/70 text-xs font-light uppercase tracking-[0.25em]">
                {service.subtitle}
              </span>
            </motion.div>
            
            {/* Título grande y espaciado */}
            <h2 className="text-4xl lg:text-6xl font-light text-white mb-6 font-display tracking-[0.05em] leading-[1.1]">
              {service.title}
            </h2>
            
            {/* Tagline con estilo italic minimalista */}
            <p className="text-lg lg:text-xl text-white/60 font-light italic leading-relaxed tracking-wide mb-8">
              {service.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="text-base lg:text-lg text-white/70 leading-[1.9] font-extralight tracking-wide">
            {service.description}
          </p>

          {/* Duration + CTA combinados */}
          <div className="pt-4 space-y-6">
            {/* Duration */}
            <div className="flex items-baseline gap-3">
              <span className="text-white/40 text-xs uppercase tracking-[0.2em] font-light">Duración</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              <span className="text-base lg:text-lg font-light text-white/90 tracking-wide">{service.duration}</span>
            </div>

            {/* CTA Premium - Estilo LuisViruettaIntro */}
            <motion.a
              href="/contacto"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative inline-flex items-center gap-3 overflow-hidden"
            >
              {/* Línea animada */}
              <motion.div
                className="h-px bg-white/60 transition-all duration-500 group-hover:w-24"
                style={{ width: '48px' }}
              />
              
              {/* Texto del botón */}
              <span className="text-sm font-light text-white uppercase tracking-[0.25em] transition-all duration-300 group-hover:tracking-[0.3em]">
                Solicitar Cotización
              </span>
              
              {/* Ícono con animación */}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4 text-white/80" strokeWidth={1.5} />
              </motion.div>
            </motion.a>
          </div>
        </div>

        {/* Right: Features + Process - Minimalista */}
        <div className="space-y-8">
          {/* Features */}
          <div className="border border-white/10 rounded-2xl p-8 lg:p-10 bg-white/[0.02] backdrop-blur-sm">
            <h3 className="text-base font-light text-white/90 mb-8 uppercase tracking-[0.2em]">
              Qué Incluye
            </h3>
            <ul className="space-y-5">
              {service.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex items-start gap-4 group"
                >
                  {/* Punto minimalista que crece en hover */}
                  <div className="relative mt-2">
                    <div className="w-1 h-1 rounded-full bg-white/40 transition-all duration-300 group-hover:w-1.5 group-hover:h-1.5 group-hover:bg-white/70" />
                  </div>
                  <span className="text-sm font-light text-white/70 leading-[1.8] tracking-wide transition-colors duration-300 group-hover:text-white/90">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="border border-white/10 rounded-2xl p-8 lg:p-10 bg-white/[0.02] backdrop-blur-sm">
            <h3 className="text-base font-light text-white/90 mb-8 uppercase tracking-[0.2em]">
              Proceso
            </h3>
            <ol className="space-y-5">
              {service.process.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex items-start gap-5 group"
                >
                  {/* Número con tipografía minimalista */}
                  <span className="text-xs font-light text-white/30 flex-shrink-0 mt-1 tracking-wider transition-colors duration-300 group-hover:text-white/50 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-light text-white/70 leading-[1.8] tracking-wide transition-colors duration-300 group-hover:text-white/90">
                    {step}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ServiciosPage
