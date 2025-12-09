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
  Briefcase,
  Camera,
  Megaphone,
  Mic,
  Layout,
  Layers
} from 'lucide-react'

const ServiciosPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const identityRef = useRef(null)
  const isIdentityInView = useInView(identityRef, { once: true, amount: 0.3 })

  const services = [
    // 1. CONSULTORÍA - Punto de partida estratégico
    {
      id: 'consultoria-psicoanalitica',
      icon: Brain,
      title: 'Consultoría Psicoanalítica',
      subtitle: 'Brand Psychology',
      tagline: 'El punto de partida: descifra tu audiencia',
      description: 'Auditoría psicoanalítica profunda de tu marca. Desciframos qué emociones generas, arquetipos, deseos inconscientes de tu audiencia. La base estratégica antes de cualquier diseño.',
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
    },
    // 2. IDENTIDAD VISUAL - Sistema completo
    {
      id: 'identidad-visual',
      icon: Sparkles,
      title: 'Identidad Visual',
      subtitle: 'Brand Identity System',
      tagline: 'Sistema completo que conecta y permanece',
      description: 'Identidad de marca completa basada en psicología y neurociencia. Logo, colores, tipografía, manual de marca. Cada elemento diseñado para conectar con el inconsciente de tu audiencia.',
      gradient: 'from-fuchsia-500 to-pink-600',
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
    // 3. LOGO DESIGN - Elemento base
    {
      id: 'logo-design',
      icon: Palette,
      title: 'Logo Design',
      subtitle: 'Visual Identity',
      tagline: 'Identidad memorable que perdura',
      description: 'Diseño de logotipo profesional con fundamento psicológico. Minimalista, memorable, versátil. Incluye variaciones, paleta de color y archivos editables.',
      gradient: 'from-purple-400 to-purple-600',
      features: [
        'Logotipo Principal + Variaciones',
        'Versiones: Color, B/N, Negativo',
        'Paleta de Color Estratégica',
        'Guía de Uso Básica',
        'Archivos Vectoriales (AI, EPS, SVG)',
        'Formatos Web (PNG, WebP)',
        'Favicon + App Icon',
        '3 Conceptos + Revisiones Ilimitadas'
      ],
      process: [
        'Briefing + Moodboard',
        'Investigación de Competencia',
        'Conceptualización (3 propuestas)',
        'Refinamiento del Concepto Elegido',
        'Vectorización + Versiones',
        'Entrega Final + Guidelines'
      ],
      duration: '2-3 semanas'
    },
    // 4. PÁGINAS WEB - Presencia digital
    {
      id: 'paginas-web',
      icon: Code,
      title: 'Páginas Web',
      subtitle: 'Web Development',
      tagline: 'Sitios que convierten visitantes en clientes',
      description: 'Desarrollo de páginas web profesionales con React. Diseño responsivo, optimización SEO, hosting incluido. UI/UX con psicología aplicada que convierte.',
      gradient: 'from-indigo-500 to-blue-600',
      features: [
        'Diseño UI/UX Personalizado',
        'Desarrollo con React/Next.js',
        'Responsive (Mobile, Tablet, Desktop)',
        'Optimización SEO',
        'Animaciones Fluidas (Framer Motion)',
        'Formularios + Integraciones',
        'Deploy + Hosting (1 año)',
        'Mantenimiento + Soporte'
      ],
      process: [
        'Definición de Estructura + Contenido',
        'Wireframes + Diseño UI',
        'Desarrollo Frontend',
        'Optimización + SEO',
        'Testing Cross-Browser',
        'Deploy + Capacitación'
      ],
      duration: '4-6 semanas'
    },
    // 5. APPS MÓVILES - Experiencias digitales
    {
      id: 'apps-moviles',
      icon: Smartphone,
      title: 'Apps Móviles',
      subtitle: 'Full-Stack Development',
      tagline: 'Experiencias fluidas que enamoran',
      description: 'Desarrollo full-stack de aplicaciones móviles y web. React Native, Node.js, bases de datos, hosting. UI/UX con psicología aplicada que convierte usuarios en clientes leales.',
      gradient: 'from-cyan-500 to-blue-600',
      features: [
        'UI/UX Design + Prototipos Interactivos',
        'Desarrollo Frontend (React/React Native)',
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
    // 6. VIDEO BRANDING - Contenido visual
    {
      id: 'video-branding',
      icon: Video,
      title: 'Video Branding',
      subtitle: 'Motion Content',
      tagline: 'Contenido visual que hipnotiza',
      description: 'Producción de video profesional para tu marca. Shooting, edición cinematográfica, motion graphics, reels para redes. Contenido que viraliza y posiciona.',
      gradient: 'from-violet-500 to-purple-600',
      features: [
        'Video Profesional (Shooting + Edición)',
        'Reels + TikToks Optimizados',
        'Video Ads para Redes Sociales',
        'Intro/Outro para YouTube',
        'Motion Graphics',
        'Color Grading Cinematográfico',
        'Subtítulos + Captions',
        'Formatos Optimizados (IG, TT, YT)'
      ],
      process: [
        'Briefing Creativo + Referencias',
        'Storyboard + Guion',
        'Shooting (si aplica)',
        'Edición + Motion Graphics',
        'Color Grading + Audio',
        'Revisiones + Entrega Final'
      ],
      duration: '2-4 semanas'
    },
    // 7. ANIMACIÓN - Logos en movimiento
    {
      id: 'animacion',
      icon: Layers,
      title: 'Animación de Logo',
      subtitle: 'Motion Graphics',
      tagline: 'Logos que cobran vida',
      description: 'Animación profesional de tu logotipo. Perfect para intros de video, redes sociales, presentaciones. Motion graphics fluidos con efecto WOW.',
      gradient: 'from-indigo-400 to-violet-600',
      features: [
        'Animación de Logo (5-10 segundos)',
        'Motion Graphics Cinematográficos',
        'Versión Horizontal + Vertical',
        'Con/Sin Audio',
        'Formatos: MP4, MOV, GIF',
        'Transparencia (Alpha Channel)',
        'Optimizado para Redes Sociales',
        'Archivos After Effects (Editable)'
      ],
      process: [
        'Análisis del Logo',
        'Concepto de Animación',
        'Storyboard + Timing',
        'Animación + Motion Graphics',
        'Sound Design',
        'Exportación Múltiple'
      ],
      duration: '1-2 semanas'
    },
    // 8. FOTOGRAFÍA - Sesiones profesionales
    {
      id: 'fotografia',
      icon: Camera,
      title: 'Fotografía',
      subtitle: 'Professional Shooting',
      tagline: 'Sesiones que capturan la esencia',
      description: 'Fotografía profesional para tu marca. Producto, retrato corporativo, lifestyle. Edición profesional con estilo cinematográfico que eleva tu presencia visual.',
      gradient: 'from-pink-500 to-rose-600',
      features: [
        'Sesión Fotográfica Profesional',
        'Edición Profesional (Color Grading)',
        'Retoque + Composición',
        '50-100 Fotos Editadas',
        'Archivos RAW + JPEG',
        'Optimización para Web/Redes',
        'Derechos de Uso Comercial',
        'Banco de Imágenes Personalizado'
      ],
      process: [
        'Briefing + Concepto Visual',
        'Preparación de Locación/Producto',
        'Sesión Fotográfica',
        'Selección de Mejores Tomas',
        'Edición + Retoque',
        'Entrega + Optimización'
      ],
      duration: '1-2 semanas'
    },
    // 9. AUDIO BRANDING - Identidad sonora
    {
      id: 'audio-branding',
      icon: Mic,
      title: 'Audio Branding',
      subtitle: 'Sonic Identity',
      tagline: 'Identidad sonora que se graba en la mente',
      description: 'Creación de identidad sonora para tu marca. Audio logo, jingles, música corporativa. Sonidos que activan reconocimiento y recuerdo emocional.',
      gradient: 'from-orange-500 to-amber-600',
      features: [
        'Audio Logo (3-5 segundos)',
        'Jingle Corporativo (15-30 seg)',
        'Música de Fondo para Videos',
        'Sound Design para Producto',
        'Variaciones Instrumentales',
        'Formatos: WAV, MP3, AAC',
        'Derechos de Uso Comercial',
        'Guidelines de Uso Sonoro'
      ],
      process: [
        'Análisis de Identidad de Marca',
        'Referencias Sonoras',
        'Composición + Arreglos',
        'Grabación + Mezcla',
        'Mastering Profesional',
        'Entrega + Documentación'
      ],
      duration: '2-3 semanas'
    },
    // 10. AVATARES IA - Representación digital
    {
      id: 'avatares-ia',
      icon: Bot,
      title: 'Avatares IA',
      subtitle: 'Generative AI',
      tagline: 'Tu portavoz digital generado con IA',
      description: 'Creamos avatares digitales generados con IA, entrenados específicamente para tu marca. Aparecen en videos, redes sociales y contenido automatizado.',
      gradient: 'from-emerald-500 to-teal-600',
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
    // 11. MARKETING - Campañas efectivas
    {
      id: 'marketing',
      icon: Megaphone,
      title: 'Marketing Digital',
      subtitle: 'Growth Strategy',
      tagline: 'Campañas que generan resultados reales',
      description: 'Estrategia y ejecución de campañas de marketing digital. Ads, contenido orgánico, automatización. Enfocado en conversión y ROI medible.',
      gradient: 'from-cyan-400 to-teal-600',
      features: [
        'Estrategia de Marketing 360°',
        'Gestión de Redes Sociales',
        'Campañas de Ads (Meta, Google)',
        'Email Marketing + Automatización',
        'Copywriting Persuasivo',
        'Análisis + Optimización',
        'Reportes Mensuales',
        'Consultoría Continua'
      ],
      process: [
        'Auditoría de Marca + Competencia',
        'Definición de Objetivos + KPIs',
        'Estrategia de Contenido',
        'Implementación de Campañas',
        'Monitoreo + A/B Testing',
        'Optimización Continua'
      ],
      duration: 'Mensual (retainer)'
    },
    // 12. MATERIAL IMPRESO - Tangibles de lujo
    {
      id: 'material-impreso',
      icon: FileText,
      title: 'Material Impreso',
      subtitle: 'Print Design',
      tagline: 'Tangibles de lujo que impresionan',
      description: 'Diseño de material impreso premium. Tarjetas de presentación, brochures, packaging, señalética. Impresión en materiales de alta calidad con acabados especiales.',
      gradient: 'from-fuchsia-400 to-purple-600',
      features: [
        'Tarjetas de Presentación Premium',
        'Brochures + Catálogos',
        'Packaging Personalizado',
        'Papelería Corporativa',
        'Señalética + Letreros',
        'Diseño + Mockups 3D',
        'Gestión de Impresión',
        'Archivos Print-Ready (CMYK)'
      ],
      process: [
        'Briefing + Especificaciones',
        'Diseño + Mockups',
        'Selección de Materiales',
        'Aprobación + Ajustes',
        'Preparación de Archivos',
        'Gestión de Impresión + Entrega'
      ],
      duration: '2-4 semanas'
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

      {/* Quick Navigation - Hexagon Grid PREMIUM */}
      <section className="py-20 lg:py-32 px-6 lg:px-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Header mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-3 h-3 text-white/60" strokeWidth={1.5} />
              <span className="text-xs text-white/70 font-light uppercase tracking-[0.2em]">
                Soluciones Premium
              </span>
            </motion.div>

            <h2 className="text-3xl lg:text-5xl font-light text-white mb-6 tracking-wide">
              ¿Qué Necesitas <span className="italic font-normal">Crear?</span>
            </h2>
            <p className="text-white/60 text-sm lg:text-base font-extralight leading-relaxed tracking-wide max-w-2xl mx-auto mb-8">
              Selecciona el servicio que buscas y te llevaremos directo a los detalles. Cada proyecto está diseñado para conectar, convertir y trascender.
            </p>

            {/* CTA WhatsApp - Ayuda personalizada */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-3 text-white/50 text-sm font-extralight"
            >
              <Brain className="w-4 h-4" strokeWidth={1.5} />
              <span>¿No sabes por dónde empezar?</span>
              <a
                href="https://wa.me/420776711575?text=Hola! Necesito ayuda para elegir el servicio ideal para mi proyecto"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 text-white hover:text-white transition-colors"
              >
                <span className="relative">
                  Te Ayudo a Decidir
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </a>
            </motion.div>
          </motion.div>

          {/* Hexagon Grid - ORDEN POR RELEVANCIA */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 mb-12">
            {[
              { id: 'consultoria', icon: Brain, title: 'Consultoría', subtitle: 'Empieza aquí', color: 'from-purple-500 to-violet-600', target: 'consultoria-psicoanalitica' },
              { id: 'identidad-visual', icon: Sparkles, title: 'Identidad Visual', subtitle: 'Sistema completo', color: 'from-fuchsia-500 to-pink-600', target: 'identidad-visual' },
              { id: 'logo-design', icon: Palette, title: 'Logo Design', subtitle: 'Identidad memorable', color: 'from-purple-400 to-purple-600', target: 'logo-design' },
              { id: 'paginas-web', icon: Code, title: 'Páginas Web', subtitle: 'Sitios que convierten', color: 'from-indigo-500 to-blue-600', target: 'paginas-web' },
              { id: 'apps-moviles', icon: Smartphone, title: 'Apps Móviles', subtitle: 'Experiencias fluidas', color: 'from-cyan-500 to-blue-600', target: 'apps-moviles' },
              { id: 'video-branding', icon: Video, title: 'Video Branding', subtitle: 'Contenido visual', color: 'from-violet-500 to-purple-600', target: 'video-branding' },
              { id: 'animacion', icon: Layers, title: 'Animación', subtitle: 'Logos en movimiento', color: 'from-indigo-400 to-violet-600', target: 'animacion' },
              { id: 'fotografia', icon: Camera, title: 'Fotografía', subtitle: 'Sesiones profesionales', color: 'from-pink-500 to-rose-600', target: 'fotografia' },
              { id: 'audio-branding', icon: Mic, title: 'Audio Branding', subtitle: 'Identidad sonora', color: 'from-orange-500 to-amber-600', target: 'audio-branding' },
              { id: 'avatares-ia', icon: Bot, title: 'Avatares IA', subtitle: 'Representación digital', color: 'from-emerald-500 to-teal-600', target: 'avatares-ia' },
              { id: 'marketing', icon: Megaphone, title: 'Marketing', subtitle: 'Campañas efectivas', color: 'from-cyan-400 to-teal-600', target: 'marketing' },
              { id: 'material-impreso', icon: FileText, title: 'Material Impreso', subtitle: 'Tangibles de lujo', color: 'from-fuchsia-400 to-purple-600', target: 'material-impreso' },
            ].map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById(item.target);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="group relative flex flex-col items-center cursor-pointer"
              >
                {/* Hexagon Container - SOLO BORDES */}
                <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex items-center justify-center">
                  {/* Hexagon OUTLINE ONLY con gradiente */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <defs>
                      {/* Gradiente para el borde */}
                      <linearGradient id={`gradient-stroke-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                      </linearGradient>
                      {/* Gradiente para hover */}
                      <linearGradient id={`gradient-hover-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Hexágono de fondo transparente con borde elegante */}
                    <polygon
                      points="50 1 95 25 95 75 50 99 5 75 5 25"
                      className="fill-none transition-all duration-500"
                      stroke={`url(#gradient-stroke-${item.id})`}
                      strokeWidth="1"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))'
                      }}
                    />
                    
                    {/* Hexágono hover (aparece en hover) */}
                    <polygon
                      points="50 1 95 25 95 75 50 99 5 75 5 25"
                      className="fill-none opacity-0 group-hover:opacity-100 transition-all duration-500"
                      stroke={`url(#gradient-hover-${item.id})`}
                      strokeWidth="1.5"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                      }}
                    />
                  </svg>
                  
                  {/* Icon con color del gradiente */}
                  <item.icon 
                    className="relative z-10 w-9 h-9 lg:w-11 lg:h-11 text-white/70 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" 
                    strokeWidth={1.2} 
                  />
                  
                  {/* Glow effect sutil en hover - más grande */}
                  <div className={`absolute -inset-4 rounded-full bg-gradient-to-br ${item.color} opacity-0 blur-2xl group-hover:opacity-20 transition-all duration-500`} />
                  
                  {/* Punto luminoso giratorio en hover */}
                  <motion.div
                    className="absolute w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
                    style={{ top: '10%', left: '50%' }}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                </div>

                {/* Text */}
                <div className="mt-5 text-center">
                  <h3 className="text-white/90 group-hover:text-white text-sm lg:text-base font-light tracking-[0.1em] mb-1.5 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/30 group-hover:text-white/50 text-[10px] lg:text-xs font-extralight tracking-[0.15em] transition-colors duration-300">
                    {item.subtitle}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* CTA Portafolio - Abajo de los hexágonos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-center gap-3 text-white/40 text-sm font-extralight">
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              <span>¿Quieres ver ejemplos de nuestro trabajo?</span>
              <a
                href="/portafolio"
                className="group relative inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <span className="relative">
                  Explora el Portafolio
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicios-detalle" className="py-20 px-6 lg:px-20">
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
    <div ref={ref} id={service.id} className="relative scroll-mt-32">
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

            {/* CTA Premium - WhatsApp con mensaje personalizado */}
            <motion.a
              href={`https://wa.me/420776711575?text=${encodeURIComponent(`Hola! Solicito cotización para ${service.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
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
