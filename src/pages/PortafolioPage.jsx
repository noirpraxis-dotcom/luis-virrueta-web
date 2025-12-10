import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Briefcase, ExternalLink, Eye, Heart, Zap, Star, Award, Sparkles, Palette, Type, Droplets, Image as ImageIcon, FileText, Brain, Code, Lightbulb } from 'lucide-react'
import LogoCarousel3D from '../components/LogoCarousel3D'
import WorkSamplesCarousel from '../components/WorkSamplesCarousel'
import WebsitesCarousel from '../components/WebsitesCarousel'
import AvatarsSection from '../components/AvatarsSection'
import AnimatedLogosSection from '../components/AnimatedLogosSection'
import BrandingShowcase from '../components/BrandingShowcase'
import { useLanguage } from '../context/LanguageContext'

const PortafolioPage = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const [activeFilter, setActiveFilter] = useState('all')

  const categories = [
    { id: 'all', label: t('portfolio.categories.all') },
    { id: 'branding', label: t('portfolio.categories.branding') },
    { id: 'apps', label: t('portfolio.categories.apps') },
    { id: 'motion', label: t('portfolio.categories.motion') },
    { id: 'ai', label: t('portfolio.categories.ai') },
  ]

  const projects = [
    {
      id: 1,
      title: 'NeuralBrand Studio',
      category: 'branding',
      tags: ['Identidad', 'Psicología', 'Premium'],
      description: 'Identidad de marca completa para estudio de diseño con enfoque en neurociencia aplicada.',
      gradient: 'from-purple-500 to-purple-600',
      image: '/placeholder-1.jpg', // Reemplazar con imagen real
      stats: { satisfaction: '98%', duration: '6 semanas', investment: '$3,500' }
    },
    {
      id: 2,
      title: 'MindFlow App',
      category: 'apps',
      tags: ['React', 'Node.js', 'UX'],
      description: 'Plataforma SaaS para gestión de productividad con gamificación y psicología positiva.',
      gradient: 'from-fuchsia-500 to-fuchsia-600',
      image: '/placeholder-2.jpg',
      stats: { satisfaction: '100%', duration: '10 semanas', investment: '$7,000' }
    },
    {
      id: 3,
      title: 'Luxury Real Estate Reel',
      category: 'motion',
      tags: ['Video', 'After Effects', '3D'],
      description: 'Reel cinematográfico para marca de bienes raíces de lujo con animaciones 3D.',
      gradient: 'from-cyan-500 to-cyan-600',
      image: '/placeholder-3.jpg',
      stats: { satisfaction: '95%', duration: '3 semanas', investment: '$2,200' }
    },
    {
      id: 4,
      title: 'AI Brand Avatar - TechCorp',
      category: 'ai',
      tags: ['IA', 'Voice Clone', 'Avatar'],
      description: 'Avatar digital con IA para CEO de tech startup, incluyendo voice cloning y lip-sync.',
      gradient: 'from-emerald-500 to-emerald-600',
      image: '/placeholder-4.jpg',
      stats: { satisfaction: '100%', duration: '7 semanas', investment: '$4,500' }
    },
    {
      id: 5,
      title: 'Wellness Brand Identity',
      category: 'branding',
      tags: ['Logo', 'Manual', 'Papelería'],
      description: 'Sistema de identidad completo para marca de wellness con paleta terapéutica.',
      gradient: 'from-violet-500 to-violet-600',
      image: '/placeholder-5.jpg',
      stats: { satisfaction: '97%', duration: '5 semanas', investment: '$2,800' }
    },
    {
      id: 6,
      title: 'E-Commerce Fashion',
      category: 'apps',
      tags: ['Shopify', 'Custom', 'Mobile'],
      description: 'Tienda online custom para marca de moda con AR virtual try-on.',
      gradient: 'from-pink-500 to-pink-600',
      image: '/placeholder-6.jpg',
      stats: { satisfaction: '99%', duration: '12 semanas', investment: '$8,500' }
    },
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo - Expandido horizontalmente, cubriendo incluso el header */}
        <div className="absolute inset-0 -top-20 lg:-top-28 -bottom-16 overflow-hidden pointer-events-none z-0">
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
            <source src="/hero portafolio.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
          {/* Overlay para que el texto sea legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Gradient orbs (ahora encima del video) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Title - Más elegante y profesional */}
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
              {t('portfolio.hero.title').split('').map((char, i, arr) => {
                const isFirst = i === 0
                const isLast = i === arr.length - 1
                
                if (isFirst || isLast) {
                  return (
                    <span key={i} className="relative">
                      <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>
                        {char}
                      </span>
                      <span className="relative text-white">{char}</span>
                    </span>
                  )
                }
                return <span key={i} className="text-white">{char}</span>
              })}
            </span>
          </motion.h1>

          {/* Subtitle con iconos elegantes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            {/* Proyectos Reales - Encerrado en cuadro */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/80 font-light tracking-wider uppercase">
                  {t('portfolio.hero.badge')}
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
              {/* Psicología */}
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  {t('portfolio.hero.psychology')}
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Diseño */}
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  {t('portfolio.hero.design')}
                </span>
              </div>

              <span className="text-white/40 text-xs">+</span>

              {/* Tecnología */}
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                  {t('portfolio.hero.technology')}
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

      {/* Identidades Visuales */}
      <WorkSamplesCarousel />

      {/* Sitios Web */}
      <WebsitesCarousel />

      {/* Video Farolito - Animación pequeña con degradado hacia afuera */}
      <section className="relative py-12 px-6 lg:px-20">
        <div className="max-w-xl mx-auto relative">
          {/* Video */}
          <div className="relative rounded-lg overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              <source src="/FAROLITO ANIMACION.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Degradado hacia AFUERA - superior */}
          <div className="absolute -top-20 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-black/40 to-black pointer-events-none" />
          
          {/* Degradado hacia AFUERA - inferior */}
          <div className="absolute -bottom-20 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
          
          {/* Degradado hacia AFUERA - izquierda */}
          <div className="absolute top-0 bottom-0 -left-20 w-32 bg-gradient-to-l from-transparent via-black/40 to-black pointer-events-none" />
          
          {/* Degradado hacia AFUERA - derecha */}
          <div className="absolute top-0 bottom-0 -right-20 w-32 bg-gradient-to-r from-transparent via-black/40 to-black pointer-events-none" />
        </div>
      </section>

      {/* Logotipos 3D */}
      <LogoCarousel3D />

      {/* Logos Animados + Avatares - En la misma línea */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <AnimatedLogosSection />
          <AvatarsSection />
        </div>
      </section>

      {/* Lighthouse Section - Video con efecto de loop reverso */}
      <LighthouseSection />

      {/* Secciones eliminadas - Filter Buttons y Projects Grid */}
      {false && (
        <>
          <section className="py-12 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeFilter === cat.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="py-12 px-6 lg:px-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-20 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, label: t('portfolio.stats.projects'), value: t('portfolio.stats.projectsValue') },
              { icon: Heart, label: t('portfolio.stats.satisfaction'), value: t('portfolio.stats.satisfactionValue') },
              { icon: Zap, label: t('portfolio.stats.onTime'), value: t('portfolio.stats.onTimeValue') },
              { icon: Star, label: t('portfolio.stats.recurring'), value: t('portfolio.stats.recurringValue') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-3"
              >
                <stat.icon className="w-10 h-10 mx-auto text-cyan-400" strokeWidth={1.5} />
                <div className={`text-4xl font-bold bg-gradient-to-r ${
                  i === 0 ? 'from-purple-400 to-purple-600' :
                  i === 1 ? 'from-fuchsia-400 to-fuchsia-600' :
                  i === 2 ? 'from-cyan-400 to-cyan-600' :
                  'from-emerald-400 to-emerald-600'
                } bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <p className="text-white/60 text-sm uppercase tracking-wider font-mono">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lighthouse Section - Video con efecto de loop reverso */}
      <LighthouseSection />
      </>
      )}
    </div>
  )
}

const ProjectCard = ({ project, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500">
        {/* Image Placeholder */}
        <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Eye className="w-16 h-16 text-white/30" strokeWidth={1} />
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ExternalLink className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white font-display group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-purple-400 transition-all">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed">
            {project.description}
          </p>

          {/* Stats */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-mono mb-1">{t('portfolio.projectCard.satisfaction')}</p>
              <p className={`text-lg font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                {project.stats.satisfaction}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-mono mb-1">{t('portfolio.projectCard.duration')}</p>
              <p className="text-sm text-white/80">{project.stats.duration}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-mono mb-1">{t('portfolio.projectCard.investment')}</p>
              <p className="text-sm text-white/80">{project.stats.investment}</p>
            </div>
          </div>
        </div>

        {/* Gradient line on hover */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient} origin-left`}
        />
      </div>
    </motion.div>
  )
}

// Componente Lighthouse Section con video que se reproduce en reversa
const LighthouseSection = () => {
  const { t } = useLanguage()
  const videoRef = useRef(null)
  const [isReversing, setIsReversing] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      // Cuando llegue al final, hacer reversa
      if (!isReversing && video.currentTime >= video.duration - 0.1) {
        setIsReversing(true)
        video.pause()
        
        // Esperar un momento en la imagen final
        setTimeout(() => {
          // Reproducir en reversa
          const playReverse = setInterval(() => {
            if (video.currentTime <= 0.1) {
              clearInterval(playReverse)
              setIsReversing(false)
              video.currentTime = 0
              video.play()
            } else {
              video.currentTime -= 0.033 // ~30fps en reversa
            }
          }, 33)
        }, 800) // Pausa de 800ms en la imagen final
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [isReversing])

  return (
    <section ref={sectionRef} className="relative py-20 px-6 lg:px-20 overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 mb-8"
          >
            <span className="text-sm lg:text-base text-white/80 font-light tracking-wider uppercase">
              {t('portfolio.lighthouse.badge')}
            </span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6"
            style={{ 
              letterSpacing: '0.05em',
              fontWeight: 300
            }}
          >
            {t('portfolio.lighthouse.title')}
          </h2>

          <p className="text-base lg:text-lg text-white/60 font-extralight italic max-w-2xl mx-auto"
            style={{ letterSpacing: '0.08em' }}
          >
            {t('portfolio.lighthouse.subtitle')}
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: '21/9' }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/faro video.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Border glow effect */}
          <div className="absolute inset-0 rounded-2xl border border-white/10" />
        </motion.div>
      </div>
    </section>
  )
}

export default PortafolioPage
