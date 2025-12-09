import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Tag, User, TrendingUp, Sparkles, BookOpen, Palette, Brain, Zap } from 'lucide-react'

const categories = [
  { id: 'all', label: 'Todos', icon: BookOpen },
  { id: 'design', label: 'Diseño', icon: Palette },
  { id: 'branding', label: 'Branding', icon: Sparkles },
  { id: 'psychology', label: 'Psicología', icon: Brain },
  { id: 'trends', label: 'Tendencias', icon: TrendingUp },
]

const BlogPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const [activeCategory, setActiveCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: 'Neurociencia del Diseño: Por Qué Algunos Logos Son Inolvidables',
      excerpt: 'La ciencia detrás de los logos icónicos y cómo aplicar estos principios neurológicos a tu marca.',
      category: 'psychology',
      author: 'Luis Virrueta',
      date: '15 Nov 2024',
      readTime: '12 min',
      gradient: 'from-pink-500/20 to-rose-500/20',
      borderGradient: 'from-pink-500 to-rose-500',
      tags: ['Neuroscience', 'Logo Design', 'Brand Recognition'],
      slug: 'neurociencia-del-diseno',
      image: '/blog-compressed/blog-1.webp',
      rating: 4.9,
      commentsCount: 27
    },
    {
      id: 2,
      title: 'La IA Generativa en el Diseño: Del Prompt a la Emoción',
      excerpt: 'Cómo fusionar inteligencia artificial, diseño visual y psicología para crear experiencias que conectan emocionalmente con tu audiencia.',
      category: 'trends',
      author: 'Luis Virrueta',
      date: '22 Nov 2024',
      readTime: '14 min',
      gradient: 'from-purple-500/20 to-fuchsia-500/20',
      borderGradient: 'from-purple-500 to-fuchsia-500',
      tags: ['AI', 'Generative Design', 'Emotional Design', 'Psychology'],
      slug: 'ia-generativa-diseno-emocion',
      image: '/blog-compressed/blog-2.webp',
      heroImage: '/blog-compressed/blog-2.webp',
      rating: 5.0,
      commentsCount: 34
    },
    {
      id: 3,
      title: 'Interfaces que Leen tu Mente: UX Empático con Machine Learning',
      excerpt: 'Descubre cómo el ML y la psicología del usuario se unen para crear interfaces que anticipan necesidades y adaptan experiencias en tiempo real.',
      category: 'design',
      author: 'Luis Virrueta',
      date: '28 Nov 2024',
      readTime: '13 min',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      borderGradient: 'from-cyan-500 to-blue-500',
      tags: ['Machine Learning', 'UX Design', 'User Psychology', 'Technology'],
      slug: 'interfaces-empaticas-machine-learning',
      image: '/blog-compressed/blog-3.webp',
      rating: 4.8,
      commentsCount: 19
    },
    {
      id: 4,
      title: 'La Psicología del Color en el Branding de Lujo',
      excerpt: 'Descubre cómo las marcas premium utilizan la teoría del color para crear conexiones emocionales profundas con su audiencia.',
      category: 'psychology',
      author: 'Luis Virrueta',
      date: '3 Dic 2024',
      readTime: '10 min',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      borderGradient: 'from-emerald-500 to-teal-500',
      tags: ['Color Theory', 'Luxury Branding', 'Psychology'],
      slug: 'psicologia-color-branding-lujo',
      image: '/blog-compressed/blog-4.webp',
      rating: 4.7,
      commentsCount: 15
    },
    {
      id: 5,
      title: 'Tendencias de Diseño 2025: Minimalismo Maximalista',
      excerpt: 'El nuevo paradigma que combina la simplicidad estructural con detalles ricos y experiencias sensoriales complejas.',
      category: 'trends',
      author: 'Luis Virrueta',
      date: '5 Dic 2024',
      readTime: '9 min',
      gradient: 'from-violet-500/20 to-purple-500/20',
      borderGradient: 'from-violet-500 to-purple-500',
      tags: ['Trends 2025', 'Minimalism', 'Visual Design'],
      slug: 'tendencias-diseno-2025',
      image: '/blog-compressed/blog-5.webp',
      rating: 4.9,
      commentsCount: 22
    },
    {
      id: 6,
      title: 'Tu Cliente es el Héroe, No Tu Marca: El Framework StoryBrand',
      excerpt: 'Descubre cómo transformar tu estrategia de branding aplicando los 7 elementos del StoryBrand Framework de Donald Miller y convierte a tus clientes en los protagonistas de tu historia.',
      category: 'branding',
      author: 'Luis Virrueta',
      date: '9 Dic 2024',
      readTime: '16 min',
      gradient: 'from-amber-500/20 to-orange-500/20',
      borderGradient: 'from-amber-500 to-orange-500',
      tags: ['StoryBrand', 'Storytelling', 'Brand Strategy', 'Marketing'],
      slug: 'cliente-heroe-storybrand-framework',
      image: '/blog-compressed/cliente-heroe.webp',
      rating: 5.0,
      commentsCount: 0
    },
    {
      id: 7,
      title: 'Pre-Suasión: Gana la Venta Antes de que Tu Cliente Sepa que Quiere Comprar',
      excerpt: 'Descubre el poder del contexto y el timing en branding. Cómo las marcas más exitosas preparan la mente de su audiencia para decir "sí" antes de presentar su oferta.',
      category: 'branding',
      author: 'Luis Virrueta',
      date: '10 Dic 2024',
      readTime: '15 min',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      borderGradient: 'from-indigo-500 to-purple-500',
      tags: ['Pre-Suasion', 'Persuasion', 'Brand Strategy', 'Neuromarketing'],
      slug: 'pre-suasion-cialdini-branding',
      image: '/blog-compressed/presuasion.webp',
      rating: 5.0,
      commentsCount: 0
    },
    {
      id: 8,
      title: 'Las 6 Armas de la Persuasión: Cómo Aplicarlas a Tu Marca',
      excerpt: 'Los principios científicos de influencia de Robert Cialdini aplicados al branding. Reciprocidad, compromiso, prueba social, autoridad, simpatía y escasez explicados con estrategias prácticas.',
      category: 'branding',
      author: 'Luis Virrueta',
      date: '10 Dic 2024',
      readTime: '18 min',
      gradient: 'from-rose-500/20 to-pink-500/20',
      borderGradient: 'from-rose-500 to-pink-500',
      tags: ['Influence', 'Persuasion', 'Psychology', 'Brand Strategy'],
      slug: 'seis-armas-persuasion-cialdini',
      image: '/blog-compressed/persuasion.webp',
      rating: 5.0,
      commentsCount: 0
    },
    {
      id: 10,
      title: 'La Parálisis de la Elección: Por Qué Tu Menú de 20 Servicios Está Matando Tus Ventas',
      excerpt: 'El experimento de las mermeladas que cambió el marketing para siempre. Descubre por qué menos opciones generan más conversiones y cómo simplificar tu oferta puede multiplicar tus ventas.',
      category: 'branding',
      author: 'Luis Virrueta',
      date: '10 Dic 2024',
      readTime: '14 min',
      gradient: 'from-sky-500/20 to-blue-500/20',
      borderGradient: 'from-sky-500 to-blue-500',
      tags: ['Choice Paradox', 'Psychology', 'Conversion', 'Strategy'],
      slug: 'paralisis-eleccion-simplifica-oferta',
      image: '/blog-compressed/paralisis-eleccion.webp',
      rating: 5.0,
      commentsCount: 0
    },
    {
      id: 9,
      title: 'Creando Identidades de Marca Memorables',
      excerpt: 'Un sistema paso a paso para desarrollar marcas que resuenan emocionalmente y permanecen en la mente del consumidor.',
      category: 'branding',
      author: 'Luis Virrueta',
      date: '7 Dic 2024',
      readTime: '11 min',
      gradient: 'from-amber-500/20 to-orange-500/20',
      borderGradient: 'from-amber-500 to-orange-500',
      tags: ['Brand Identity', 'Strategy', 'Visual Systems'],
      slug: 'identidades-marca-memorables',
      image: '/blog-compressed/blog-6.webp',
      rating: 5.0,
      commentsCount: 31
    },
  ]

  const filteredPosts = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory)

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
            <source src="/header blog.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Title con efecto 3D */}
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
              {/* B con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>B</span>
                <span className="relative text-white">B</span>
              </span>
              {/* lo */}
              <span className="text-white">lo</span>
              {/* g con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-tl from-cyan-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>g</span>
                <span className="relative text-white">g</span>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5"
            >
              <span className="text-sm lg:text-base text-white/80 font-light tracking-wider uppercase">
                Insights × Design × Psicología
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-base lg:text-xl text-white/60 text-center max-w-2xl font-extralight italic"
              style={{ letterSpacing: '0.08em' }}
            >
              Explorando la intersección entre diseño gráfico, psicología y tecnología
            </motion.p>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"
            style={{ maxWidth: '600px' }}
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5
              }}
              className="w-1 h-3 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Degradado suave en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black pointer-events-none z-30" />
      </section>

      {/* Category Filter */}
      <section className="relative py-8 px-6 lg:px-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-white/30'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white/90'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{cat.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const BlogCard = ({ post, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <Link to={post.slug ? `/blog/${post.slug}` : '#'}>
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative"
      >
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500 h-full flex flex-col">
        {/* Image with gradient overlay */}
        <div className={`aspect-[16/9] bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
          {/* Imagen real del blog con Lazy Loading */}
          {post.image && (
            <img 
              src={post.image} 
              alt={post.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Fallback si no hay imagen */}
          {!post.image && (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/20" strokeWidth={1} />
            </div>
          )}
          
          {/* Overlay oscuro cinematic permanente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          
          {/* Overlay hover interactivo */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-white"
            >
              <span className="text-sm font-medium">Leer Artículo</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Category badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 z-20">
            <span className="text-xs text-white/90 uppercase tracking-wider font-medium">
              {categories.find(c => c.id === post.category)?.label}
            </span>
          </div>

          {/* Rating y Comments Count - Esquina superior derecha */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            {/* Rating con estrellas */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-yellow-500/30">
              <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-white">{post.rating}</span>
            </div>
            
            {/* Comments count */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-white/20">
              <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs font-medium text-white/90">{post.commentsCount}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-purple-400 transition-all leading-tight">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-white/70 text-sm leading-relaxed mb-4 flex-grow">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/60 flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Author & CTA */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-white/60">{post.author}</span>
            </div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-1 text-white/80 group-hover:text-white"
            >
              <span className="text-xs font-medium">Leer más</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        {/* Gradient line on hover */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${post.borderGradient} origin-left transition-transform duration-500`}
        />
      </div>
    </motion.article>
    </Link>
  )
}

export default BlogPage
