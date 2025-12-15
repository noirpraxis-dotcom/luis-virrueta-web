import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Tag, User, TrendingUp, Sparkles, BookOpen, Palette, Brain, Zap } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { useLanguage } from '../context/LanguageContext'
import { getArticleContent } from '../data/blogArticlesContent'

// Updated: Dec 17, 2025 - New images for articles 17-20
const BlogPage = () => {
  const { t, currentLanguage } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: t('blogPage.categories.all'), icon: BookOpen },
    { id: 'design', label: t('blogPage.categories.design'), icon: Palette },
    { id: 'branding', label: t('blogPage.categories.branding'), icon: Sparkles },
    { id: 'psychology', label: t('blogPage.categories.psychology'), icon: Brain },
    { id: 'trends', label: t('blogPage.categories.trends'), icon: TrendingUp },
  ]

  // Helper function to get translated content
  const getPostContent = (slug) => {
    const content = getArticleContent(slug, currentLanguage)
    console.log(`🌐 BlogPage - Getting content for: ${slug}, language: ${currentLanguage}`, content?.title)
    if (content) {
      return {
        title: content.title,
        excerpt: content.sections?.[0]?.content || ''
      }
    }
    return { title: '', excerpt: '' }
  }

  const blogPosts = [
    {
      id: 21,
      ...getPostContent('trend-vs-keyword-gap-contenido-viral-no-construye-crecimiento'),
      category: 'trends',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 15, 2025' : '15 Dic 2025',
      readTime: '16 min',
      gradient: 'from-indigo-600/20 via-purple-600/20 to-fuchsia-600/20',
      borderGradient: 'from-indigo-600 via-purple-600 to-fuchsia-600',
      tags: currentLanguage === 'en' 
        ? ['Content Marketing', 'SEO Strategy', 'Trend Monitoring', 'Keyword Research', 'Growth Strategy']
        : ['Content Marketing', 'Estrategia SEO', 'Monitoreo de Tendencias', 'Keyword Research', 'Estrategia de Crecimiento'],
      slug: 'trend-vs-keyword-gap-contenido-viral-no-construye-crecimiento',
      image: '/blog-compressed/blog-21-trend-keyword-gap.webp',
      heroImage: '/blog-compressed/blog-21-trend-keyword-gap.webp',
      rating: 5.0,
      commentsCount: 12,
      featured: true
    },
    {
      id: 20,
      ...getPostContent('rebranding-vs-refresh-cuando-redisenar-marca-completa'),
      category: 'branding',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 17, 2025' : '17 Dic 2025',
      readTime: '18 min',
      gradient: 'from-emerald-600/20 via-teal-500/20 to-cyan-600/20',
      borderGradient: 'from-emerald-600 via-teal-500 to-cyan-600',
      tags: currentLanguage === 'en' 
        ? ['Rebranding', 'Brand Refresh', 'Brand Strategy', 'Brand Evolution', 'Visual Identity', 'Brand Redesign']
        : ['Rebranding', 'Brand Refresh', 'Rediseño de Marca', 'Estrategia de Marca', 'Evolución de Marca', 'Identidad Visual'],
      slug: 'rebranding-vs-refresh-cuando-redisenar-marca-completa',
      image: '/blog-compressed/blog-20-rebranding-refresh.webp',
      heroImage: '/blog-compressed/blog-20-rebranding-refresh.webp',
      rating: 5.0,
      commentsCount: 30,
      featured: true
    },
    {
      id: 19,
      ...getPostContent('branding-con-inteligencia-artificial-2025-guia-completa'),
      category: 'trends',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 16, 2025' : '16 Dic 2025',
      readTime: '20 min',
      gradient: 'from-violet-600/20 via-purple-500/20 to-fuchsia-600/20',
      borderGradient: 'from-violet-600 via-purple-500 to-fuchsia-600',
      tags: currentLanguage === 'en' 
        ? ['Artificial Intelligence', 'Branding', 'Midjourney', 'ChatGPT', 'Claude', 'AI Design', 'Brand Strategy']
        : ['Inteligencia Artificial', 'Branding', 'Midjourney', 'ChatGPT', 'Claude', 'Runway', 'Diseño con IA', 'Estrategia de Marca'],
      slug: 'branding-con-inteligencia-artificial-2025-guia-completa',
      image: '/blog-compressed/blog-19-branding-ia.webp',
      heroImage: '/blog-compressed/blog-19-branding-ia.webp',
      rating: 5.0,
      commentsCount: 35,
      featured: true
    },
    {
      id: 18,
      ...getPostContent('por-que-tu-logo-no-funciona-7-errores-neurociencia'),
      category: 'design',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 15, 2025' : '15 Dic 2025',
      readTime: '15 min',
      gradient: 'from-red-600/20 via-rose-500/20 to-pink-600/20',
      borderGradient: 'from-red-600 via-rose-500 to-pink-600',
      tags: currentLanguage === 'en' 
        ? ['Logo Design', 'Neuroscience', 'Design Errors', 'Visual Identity', 'Brand Recognition', 'Branding']
        : ['Diseño de Logo', 'Neurociencia', 'Errores de Diseño', 'Identidad Visual', 'Reconocimiento de Marca', 'Branding'],
      slug: 'por-que-tu-logo-no-funciona-7-errores-neurociencia',
      image: '/blog-compressed/blog-18-logo-errores.webp',
      heroImage: '/blog-compressed/blog-18-logo-errores.webp',
      rating: 5.0,
      commentsCount: 28,
      featured: true
    },
    {
      id: 17,
      ...getPostContent('12-arquetipos-jung-branding-cual-elegir-marca'),
      category: 'branding',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 14, 2025' : '14 Dic 2025',
      readTime: '24 min',
      gradient: 'from-amber-600/20 via-orange-500/20 to-rose-600/20',
      borderGradient: 'from-amber-600 via-orange-500 to-rose-600',
      tags: currentLanguage === 'en' 
        ? ['Jung Archetypes', 'Brand Psychology', 'Brand Strategy', 'Carl Jung', 'Brand Personality', 'Design']
        : ['Arquetipos de Jung', 'Psicología de Marca', 'Estrategia de Marca', 'Carl Jung', 'Personalidad de Marca', 'Diseño'],
      slug: '12-arquetipos-jung-branding-cual-elegir-marca',
      image: '/blog-compressed/blog-17-arquetipos-jung.webp',
      heroImage: '/blog-compressed/blog-17-arquetipos-jung.webp',
      rating: 5.0,
      commentsCount: 32,
      featured: true
    },
    {
      id: 16,
      ...getPostContent('mapa-completo-inteligencias-artificiales-2025-cual-usar'),
      category: 'trends',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 13, 2025' : '13 Dic 2025',
      readTime: '25 min',
      gradient: 'from-purple-600/20 to-pink-500/20',
      borderGradient: 'from-purple-600 via-pink-500 to-red-500',
      tags: currentLanguage === 'en' 
        ? ['Artificial Intelligence', 'ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Midjourney', 'Runway', 'Complete Guide 2025']
        : ['Inteligencia Artificial', 'ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Midjourney', 'Runway', 'Sora', 'Guía Completa 2025'],
      slug: 'mapa-completo-inteligencias-artificiales-2025-cual-usar',
      image: '/blog-compressed/blog-16-mapa-ias-2025.webp',
      heroImage: '/blog-compressed/blog-16-mapa-ias-2025.webp',
      rating: 4.9,
      commentsCount: 28,
      featured: true
    },
    {
      id: 15,
      ...getPostContent('cloudflare-infraestructura-invisible-que-hace-tu-web-premium'),
      category: 'trends',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 12, 2025' : '12 Dic 2025',
      readTime: '11 min',
      gradient: 'from-orange-500/20 to-amber-600/20',
      borderGradient: 'from-orange-500 to-amber-600',
      tags: currentLanguage === 'en' 
        ? ['Cloudflare', 'CDN', 'Web Performance', 'Security', 'Infrastructure']
        : ['Cloudflare', 'CDN', 'Rendimiento Web', 'Seguridad', 'Infraestructura'],
      slug: 'cloudflare-infraestructura-invisible-que-hace-tu-web-premium',
      image: '/blog-compressed/blog-15-cloudflare.webp',
      rating: 4.9,
      commentsCount: 12,
      featured: true
    },
    {
      id: 14,
      ...getPostContent('tu-cerebro-no-busca-informacion-busca-sorpresa-minima-andy-clark'),
      category: 'neuroscience',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 10, 2025' : '10 Dic 2025',
      readTime: currentLanguage === 'en' ? '14 min' : '17 min',
      gradient: 'from-violet-500/20 to-indigo-600/20',
      borderGradient: 'from-violet-500 to-indigo-600',
      tags: currentLanguage === 'en' 
        ? ['Andy Clark', 'Neuroscience', 'Bayesian Brain', 'Predictive Branding', 'Free Energy']
        : ['Andy Clark', 'Neurociencia', 'Cerebro Bayesiano', 'Branding Predictivo', 'Free Energy'],
      slug: 'tu-cerebro-no-busca-informacion-busca-sorpresa-minima-andy-clark',
      image: '/blog-compressed/blog-14-no-busca-informacion.webp',
      rating: 4.8,
      commentsCount: 18,
      featured: true
    },
    {
      id: 13,
      ...getPostContent('tu-cerebro-decide-antes-que-tu-experimento-libet'),
      category: 'psychology',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Dec 5, 2025' : '5 Dic 2025',
      readTime: '13 min',
      gradient: 'from-rose-500/20 to-purple-600/20',
      borderGradient: 'from-rose-500 to-purple-600',
      tags: currentLanguage === 'en' 
        ? ['Neuroscience', 'Irrational Decisions', 'Libet Experiment', 'Branding']
        : ['Neurociencia', 'Decisiones Irracionales', 'Experimento Libet', 'Branding'],
      slug: 'tu-cerebro-decide-antes-que-tu-experimento-libet',
      image: '/blog-compressed/blog-13-cerebro-decide-antes.webp',
      rating: 4.7,
      commentsCount: 15,
      featured: true
    },
    {
      id: 12,
      ...getPostContent('inteligencia-no-acumula-reorganiza-neurociencia-branding'),
      category: 'psychology',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Nov 28, 2025' : '28 Nov 2025',
      readTime: '15 min',
      gradient: 'from-cyan-500/20 to-blue-600/20',
      borderGradient: 'from-cyan-500 to-blue-600',
      tags: currentLanguage === 'en' 
        ? ['Neuroscience', 'Intelligent Branding', 'Cognitive Psychology', 'AI', 'Design']
        : ['Neurociencia', 'Branding Inteligente', 'Psicología Cognitiva', 'IA', 'Diseño'],
      slug: 'inteligencia-no-acumula-reorganiza-neurociencia-branding',
      image: '/blog-compressed/blog-12-inteligencia-no-acumula.webp',
      rating: 4.9,
      commentsCount: 14,
      featured: true
    },
    {
      id: 11,
      ...getPostContent('que-ia-contratar-2025-comparativa-completa'),
      category: 'trends',
      author: 'Luis Virrueta',
      date: currentLanguage === 'en' ? 'Nov 21, 2025' : '21 Nov 2025',
      readTime: '19 min',
      gradient: 'from-indigo-500/20 to-purple-600/20',
      borderGradient: 'from-indigo-500 to-purple-600',
      tags: currentLanguage === 'en' 
        ? ['ChatGPT', 'Google Gemini', 'Grok', 'AI Comparison', 'Practical Guide']
        : ['ChatGPT', 'Google Gemini', 'Grok', 'Comparativa IA', 'Guía Práctica'],
      slug: 'que-ia-contratar-2025-comparativa-completa',
      image: '/blog-compressed/blog-11-que-ia-contratar.webp',
      rating: 4.8,
      commentsCount: 21,
      featured: true
    },
    {
      id: 1,
      title: t('blogPage.posts.post1.title'),
      excerpt: t('blogPage.posts.post1.excerpt'),
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
      title: t('blogPage.posts.post2.title'),
      excerpt: t('blogPage.posts.post2.excerpt'),
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
      title: t('blogPage.posts.post3.title'),
      excerpt: t('blogPage.posts.post3.excerpt'),
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
      title: t('blogPage.posts.post4.title'),
      excerpt: t('blogPage.posts.post4.excerpt'),
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
      title: t('blogPage.posts.post5.title'),
      excerpt: t('blogPage.posts.post5.excerpt'),
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
      title: t('blogPage.posts.post6.title'),
      excerpt: t('blogPage.posts.post6.excerpt'),
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
      title: t('blogPage.posts.post7.title'),
      excerpt: t('blogPage.posts.post7.excerpt'),
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
      title: t('blogPage.posts.post8.title'),
      excerpt: t('blogPage.posts.post8.excerpt'),
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
      title: t('blogPage.posts.post10.title'),
      excerpt: t('blogPage.posts.post10.excerpt'),
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
      title: t('blogPage.posts.post9.title'),
      excerpt: t('blogPage.posts.post9.excerpt'),
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
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28">
      <SEOHead 
        title={t('blogPage.seo.title')}
        description={t('blogPage.seo.description')}
        image="/blog-compressed/blog-1.webp"
        url="/blog"
        type="website"
        tags={['branding', 'psychology', 'marketing', 'design', 'neuromarketing', 'storytelling', 'trends']}
      />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo */}
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
            <source src="/header blog.mp4" type="video/mp4" />
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
                {t('blogPage.hero.badge')}
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
              {t('blogPage.hero.subtitle')}
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
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Mapeo de categorías con traducciones
  const categoryLabels = {
    'all': t('blogPage.categories.all'),
    'design': t('blogPage.categories.design'),
    'branding': t('blogPage.categories.branding'),
    'psychology': t('blogPage.categories.psychology'),
    'trends': t('blogPage.categories.trends')
  }

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
              <span className="text-sm font-medium">{t('blogPage.labels.readArticle')}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Category badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 z-20">
            <span className="text-xs text-white/90 uppercase tracking-wider font-medium">
              {categoryLabels[post.category]}
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
              <span className="text-xs font-medium">{t('blogPage.labels.readMore')}</span>
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
