import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Briefcase, ExternalLink, Eye, Heart, Zap, Star, Award, Sparkles, Palette, Type, Droplets, Image as ImageIcon, FileText } from 'lucide-react'

const PortafolioPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const [activeFilter, setActiveFilter] = useState('all')

  const categories = [
    { id: 'all', label: 'Todos los Proyectos' },
    { id: 'branding', label: 'Branding' },
    { id: 'apps', label: 'Apps' },
    { id: 'motion', label: 'Motion' },
    { id: 'ai', label: 'IA' },
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
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Icon - Más elegante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-16 h-16 mx-auto text-[#0ea5e9] mb-6" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Title - Con más letter-spacing */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl lg:text-8xl font-bold text-center mb-8 font-display tracking-[0.15em]"
            style={{ letterSpacing: '0.15em' }}
          >
            <span className="bg-gradient-to-r from-[#0ea5e9] via-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">
              PORTAFOLIO
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/70 text-center max-w-3xl mx-auto font-light mb-12"
          >
            Proyectos reales donde la psicología, el diseño y la tecnología transforman marcas
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mx-auto w-80"
          />
        </div>
      </section>

      {/* Diseño de Identidad Visual Section */}
      <section className="relative bg-black py-16 lg:py-20 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#d946ef]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1"
            >
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[#a855f7] text-sm font-mono uppercase tracking-widest mb-4"
              >
                Branding Premium
              </motion.p>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl lg:text-5xl font-bold mb-6"
              >
                Diseñamos tu{' '}
                <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">
                  Identidad Visual Completa
                </span>
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white/60 text-lg mb-10"
              >
                Desde el concepto hasta la implementación. Cada elemento diseñado estratégicamente para conectar con tu audiencia.
              </motion.p>

              {/* Lo que incluye - Grid minimalista */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Palette, label: "Logotipos" },
                  { icon: Type, label: "Tipografías" },
                  { icon: Droplets, label: "Paleta de Color" },
                  { icon: ImageIcon, label: "Mockups" },
                  { icon: FileText, label: "Manual de Marca" },
                  { icon: Sparkles, label: "Aplicaciones" }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#a855f7]/30 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-[#a855f7]" strokeWidth={1.5} />
                      <span className="text-white/70 text-sm font-light">{item.label}</span>
                    </motion.div>
                  )
                })}
              </div>

              {/* Espacio para métricas o CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex gap-4 text-sm text-white/50"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#d946ef]" />
                  <span>100+ Marcas creadas</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Visual placeholder - Aquí irán las imágenes */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">
                {/* Sombras animadas premium */}
                <motion.div
                  className="absolute -inset-12 rounded-3xl blur-[80px]"
                  animate={{
                    background: [
                      'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)',
                      'radial-gradient(ellipse at 50% 75%, rgba(217,70,239,0.6), rgba(232,121,249,0.4), rgba(168,85,247,0.25), transparent)',
                      'radial-gradient(ellipse at 50% 85%, rgba(232,121,249,0.55), rgba(192,38,211,0.4), rgba(217,70,239,0.22), transparent)',
                      'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)'
                    ],
                    opacity: [0.4, 0.6, 0.5, 0.4]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Placeholder para imágenes de identidad visual */}
                <div className="relative rounded-3xl overflow-hidden border border-[#a855f7]/30 bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d]">
                  <div className="aspect-[16/11] flex items-center justify-center p-8">
                    {/* Grid de placeholders para fotos */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {[1, 2, 3, 4].map((num) => (
                        <motion.div
                          key={num}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + num * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="aspect-square rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-[#d946ef]/20 border border-white/10 flex items-center justify-center"
                        >
                          <ImageIcon className="w-8 h-8 text-white/30" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20">
                      <Eye className="w-4 h-4 text-[#a855f7]" />
                      <span className="text-white text-xs font-medium whitespace-nowrap">Galería de Proyectos</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
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
              { icon: Award, label: 'Proyectos', value: '50+' },
              { icon: Heart, label: 'Satisfacción', value: '98%' },
              { icon: Zap, label: 'Entregas a Tiempo', value: '100%' },
              { icon: Star, label: 'Clientes Recurrentes', value: '85%' },
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
              <p className="text-xs text-white/50 uppercase tracking-wider font-mono mb-1">Satisfacción</p>
              <p className={`text-lg font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                {project.stats.satisfaction}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-mono mb-1">Duración</p>
              <p className="text-sm text-white/80">{project.stats.duration}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-mono mb-1">Inversión</p>
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

export default PortafolioPage
