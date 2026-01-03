import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Tag, User, TrendingUp, Sparkles, BookOpen, Brain, Zap, Eye, Plus, Lock, LogOut, X, AlertTriangle, Trash2 } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/AdminLogin'
import AdminBlogEditor from '../components/AdminBlogEditor'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { getArticleContent } from '../data/blogArticlesContent'
import { supabase } from '../lib/supabase'
// Updated: Dec 17, 2025 - New images for articles 17-20
const BlogPage = () => {
  const { t, currentLanguage } = useLanguage()
  const { isAdmin, logout } = useAuth()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const [activeCategory, setActiveCategory] = useState('all')
  
  // Estados para admin
  const [showLogin, setShowLogin] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [deletingArticle, setDeletingArticle] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Datos iniciales de blog posts (se cargan en useEffect)
  const [blogPosts, setBlogPosts] = useState([])
  const categories = [
    { id: 'all', label: t('blogPage.categories.all'), icon: BookOpen },
    { id: 'philosophy', label: currentLanguage === 'en' ? 'Philosophy' : 'Filosofía', icon: Eye },
    { id: 'psychology', label: t('blogPage.categories.psychology'), icon: Brain },
    { id: 'psychoanalysis', label: currentLanguage === 'en' ? 'Psychoanalysis' : 'Psicoanálisis', icon: Sparkles },
    { id: 'perception', label: currentLanguage === 'en' ? 'Perception' : 'Percepción', icon: Zap },
    { id: 'consciousness', label: currentLanguage === 'en' ? 'Consciousness' : 'Consciencia', icon: TrendingUp },
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

  // Función para confirmar eliminación
  const handleDeleteClick = (post) => {
    setDeletingArticle(post)
  }

  // Función para cancelar eliminación
  const handleCancelDelete = () => {
    setDeletingArticle(null)
    setIsDeleting(false)
  }

  // Función para eliminar artículo
  const handleConfirmDelete = async () => {
    if (!deletingArticle) return

    setIsDeleting(true)
    
    try {
      // Eliminar de Supabase (si está allí)
      if (deletingArticle.id) {
        const { error } = await supabase
          .from('blog_articles')
          .delete()
          .eq('id', deletingArticle.id)
        
        if (error) throw error
      }

      // Eliminar del estado local
      setBlogPosts(blogPosts.filter(post => post.id !== deletingArticle.id))
      
      handleCancelDelete()
    } catch (error) {
      console.error('Error eliminando artículo:', error)
      alert('Error al eliminar el artículo: ' + error.message)
      setIsDeleting(false)
    }
  }

  // Cargar blogs al iniciar
  useEffect(() => {
    // Cargar datos iniciales de blogs
    const initialBlogs = [
    {
      id: 34,
      title: currentLanguage === 'en' 
        ? 'SU·DO·KU: The art of thinking by elimination'
        : 'SU·DO·KU: El arte de pensar por descarte',
      excerpt: currentLanguage === 'en'
        ? 'Why life doesn\'t answer by affirming. What if the problem wasn\'t the lack of answers, but the rush to close them?'
        : 'Por qué la vida no responde afirmando. ¿Y si el problema no fuera la falta de respuestas, sino la prisa por clausurarlas?',
      category: currentLanguage === 'en' ? 'Psychoanalysis' : 'Psicoanálisis',
      author: 'Luis Virrueta',
      date: '22 Dic 2025',
      readTime: '15 min',
      gradient: 'from-purple-500/20 to-fuchsia-500/20',
      borderGradient: 'from-purple-500 to-fuchsia-500',
      tags: currentLanguage === 'en'
        ? ['Thinking', 'Psychoanalysis', 'Philosophy', 'Life', 'Negative Way', 'Lacan']
        : ['Pensamiento', 'Psicoanálisis', 'Filosofía', 'Vida', 'Vía Negativa', 'Lacan'],
      slug: 'sudoku',
      image: '/IMAGENES BLOG/SUDOKU HUMANO.jpg',
      rating: 5.0,
      featured: true
    },
    {
      id: 33,
      title: currentLanguage === 'en' 
        ? 'P.U.T.A. (Panic · Usurpation · Terror · Autonomy)'
        : 'P.U.T.A. (Pánico · Usurpación · Terror · Autonomía)',
      excerpt: currentLanguage === 'en'
        ? 'The word doesn\'t describe the other. It reveals the one who needs to say it to avoid feeling.'
        : 'La palabra no describe al otro. Revela a quien necesita decirla para no sentir.',
      category: currentLanguage === 'en' ? 'Psychoanalysis' : 'Psicoanálisis',
      author: 'Luis Virrueta',
      date: '22 Dic 2025',
      readTime: '19 min',
      gradient: 'from-red-600/20 to-pink-700/20',
      borderGradient: 'from-red-600 to-pink-700',
      tags: currentLanguage === 'en'
        ? ['Psychoanalysis', 'Lacan', 'Freud', 'Žižek', 'Desire', 'Jouissance', 'Repression', 'Projection']
        : ['Psicoanálisis', 'Lacan', 'Freud', 'Žižek', 'Deseo', 'Goce', 'Represión', 'Proyección'],
      slug: 'puta-panico-usurpacion-terror-autonomia',
      image: '/IMAGENES BLOG/puta.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 32,
      title: currentLanguage === 'en' 
        ? 'The Game No One Confesses to Playing'
        : 'El juego que nadie confiesa estar jugando',
      excerpt: currentLanguage === 'en'
        ? 'Calling something "corruption" is sometimes just a way to avoid seeing yourself in the game.'
        : 'Llamar "corrupción" a algo es a veces solo una forma de no verte jugando.',
      category: currentLanguage === 'en' ? 'Ethics' : 'Ética',
      author: 'Luis Virrueta',
      date: '18 Dic 2025',
      readTime: '16 min',
      gradient: 'from-slate-600/20 to-zinc-700/20',
      borderGradient: 'from-slate-600 to-zinc-700',
      tags: currentLanguage === 'en'
        ? ['Morality', 'Ethics', 'Lacan', 'Žižek', 'Language', 'Symbolic Game', 'Responsibility', 'Spirituality']
        : ['Moral', 'Ética', 'Lacan', 'Žižek', 'Lenguaje', 'Juego Simbólico', 'Responsabilidad', 'Espiritualidad'],
      slug: 'el-juego-que-nadie-confiesa-estar-jugando',
      image: '/IMAGENES BLOG/ajedrez.jpg',
      rating: 4.8,
      featured: true
    },
    {
      id: 31,
      title: currentLanguage === 'en' 
        ? 'The Breaking of the Break'
        : 'La ruptura de la ruptura',
      excerpt: currentLanguage === 'en'
        ? 'Why what relieves you at first stops working later. The dark night of the soul explained.'
        : '¿Por qué lo que alivia primero, después deja de hacerlo? La noche oscura del alma explicada.',
      category: currentLanguage === 'en' ? 'Spirituality' : 'Espiritualidad',
      author: 'Luis Virrueta',
      date: '10 Dic 2025',
      readTime: '15 min',
      gradient: 'from-indigo-500/20 to-purple-600/20',
      borderGradient: 'from-indigo-500 to-purple-600',
      tags: currentLanguage === 'en'
        ? ['Meditation', 'Dark Night', 'Enlightenment', 'Unity', 'Presence', 'Consciousness', 'Spirituality']
        : ['Meditación', 'Noche Oscura', 'Iluminación', 'Unidad', 'Presencia', 'Conciencia', 'Espiritualidad'],
      slug: 'la-ruptura-de-la-ruptura',
      image: '/IMAGENES BLOG/ruptura.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 30,
      title: currentLanguage === 'en' 
        ? 'It Doesn\'t Hurt Because Something Breaks'
        : 'No duele porque algo se rompe, duele porque algo no puede romperse',
      excerpt: currentLanguage === 'en'
        ? 'Pain doesn\'t empty the world: it fills it. What does that reveal about consciousness?'
        : 'El dolor no vacía el mundo: lo llena. ¿Qué revela eso sobre la conciencia?',
      category: currentLanguage === 'en' ? 'Phenomenology' : 'Fenomenología',
      author: 'Luis Virrueta',
      date: '28 Nov 2025',
      readTime: '17 min',
      gradient: 'from-red-500/20 to-orange-600/20',
      borderGradient: 'from-red-500 to-orange-600',
      tags: currentLanguage === 'en'
        ? ['Pain', 'Merleau-Ponty', 'Lacan', 'The Real', 'Body', 'Consciousness', 'Psychoanalysis', 'Phenomenology']
        : ['Dolor', 'Merleau-Ponty', 'Lacan', 'Lo Real', 'Cuerpo', 'Conciencia', 'Psicoanálisis', 'Fenomenología'],
      slug: 'no-duele-porque-algo-se-rompe',
      image: '/IMAGENES BLOG/no duele.jpg',
      rating: 4.7,
      featured: true
    },
    {
      id: 29,
      title: currentLanguage === 'en' 
        ? 'Where Is the Body When Everything Works?'
        : '¿Dónde está el cuerpo cuando todo funciona?',
      excerpt: currentLanguage === 'en'
        ? 'Your arm falls asleep and suddenly you feel what was always there. What does that reveal?'
        : 'Tu brazo se duerme y de pronto sientes lo que siempre estuvo ahí. ¿Qué revela eso?',
      category: currentLanguage === 'en' ? 'Consciousness' : 'Conciencia',
      author: 'Luis Virrueta',
      date: '15 Nov 2025',
      readTime: '14 min',
      gradient: 'from-purple-500/20 to-violet-600/20',
      borderGradient: 'from-purple-500 to-violet-600',
      tags: currentLanguage === 'en'
        ? ['Body', 'Perception', 'Merleau-Ponty', 'Lacan', 'Kybalion', 'Consciousness', 'Psychoanalysis']
        : ['Cuerpo', 'Percepción', 'Merleau-Ponty', 'Lacan', 'Kybalion', 'Conciencia', 'Psicoanálisis'],
      slug: 'donde-esta-el-cuerpo-cuando-todo-funciona',
      image: '/IMAGENES BLOG/gas.jpg',
      rating: 4.8,
      featured: true
    },
    {
      id: 28,
      title: currentLanguage === 'en' 
        ? 'The Tearing of Unity'
        : 'El desgarro de la unidad',
      excerpt: currentLanguage === 'en'
        ? 'What if love isn\'t born from uniting two pieces, but from tearing a single one?'
        : '¿Y si el amor no nace de unir dos piezas, sino de desgarrar una sola?',
      category: currentLanguage === 'en' ? 'Love & Relationships' : 'Amor y Relaciones',
      author: 'Luis Virrueta',
      date: '2 Nov 2025',
      readTime: '15 min',
      gradient: 'from-amber-500/20 to-rose-600/20',
      borderGradient: 'from-amber-500 to-rose-600',
      tags: currentLanguage === 'en'
        ? ['Love', 'Unity', 'Falling in Love', 'Lack', 'Psychoanalysis', 'Ontology', 'Relationship']
        : ['Amor', 'Unidad', 'Enamoramiento', 'Falta', 'Psicoanálisis', 'Ontología', 'Relación'],
      slug: 'el-desgarro-de-la-unidad',
      image: '/IMAGENES BLOG/desgarro.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 27,
      title: currentLanguage === 'en' 
        ? 'The Fish That Is Not Eaten'
        : 'El pez que no se come',
      excerpt: currentLanguage === 'en'
        ? 'Seagulls pass a fish between them without eating it. What does that say about relationships?'
        : 'Las gaviotas se pasan un pez sin comerlo. ¿Qué dice eso sobre las relaciones?',
      category: currentLanguage === 'en' ? 'Love & Relationships' : 'Amor y Relaciones',
      author: 'Luis Virrueta',
      date: '20 Oct 2025',
      readTime: '13 min',
      gradient: 'from-cyan-500/20 to-blue-600/20',
      borderGradient: 'from-cyan-500 to-blue-600',
      tags: currentLanguage === 'en'
        ? ['Žižek', 'Lacan', 'Bond', 'Listening', 'Relationships', 'Desire of the Other', 'Psychoanalysis']
        : ['Žižek', 'Lacan', 'Vínculo', 'Escucha', 'Relaciones', 'Deseo del Otro', 'Psicoanálisis'],
      slug: 'el-pez-que-no-se-come',
      image: '/IMAGENES BLOG/gaviota.jpg',
      rating: 4.8,
      featured: true
    },
    {
      id: 26,
      title: currentLanguage === 'en' 
        ? 'Loving from the Wound'
        : 'Amar desde la herida',
      excerpt: currentLanguage === 'en'
        ? 'If love requires a wound, what happens when you stop asking the other to heal it?'
        : 'Si el amor requiere una herida, ¿qué pasa cuando dejas de pedirle al otro que la cure?',
      category: currentLanguage === 'en' ? 'Psychoanalysis' : 'Psicoanálisis',
      author: 'Luis Virrueta',
      date: '8 Oct 2025',
      readTime: '15 min',
      gradient: 'from-rose-500/20 to-red-600/20',
      borderGradient: 'from-rose-500 to-red-600',
      tags: currentLanguage === 'en'
        ? ['Love', 'Lacan', 'Lack', 'Desire', 'Bond', 'Constitutive Wound', 'Psychoanalysis']
        : ['Amor', 'Lacan', 'Falta', 'Deseo', 'Vínculo', 'Herida constitutiva', 'Psicoanálisis'],
      slug: 'amar-desde-la-herida',
      image: '/IMAGENES BLOG/herida.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 25,
      title: currentLanguage === 'en' 
        ? 'Being Free Is Not Choosing: It Is Not Being Able to Stop Repeating'
        : 'Ser libre no es elegir: es no poder dejar de repetir',
      excerpt: currentLanguage === 'en'
        ? 'You change masks, but always fail in the same place. What if that\'s your only freedom?'
        : 'Cambias de máscara, pero siempre fallas en el mismo lugar. ¿Y si esa es tu única libertad?',
      category: currentLanguage === 'en' ? 'Philosophy' : 'Filosofía',
      author: 'Luis Virrueta',
      date: '25 Sep 2025',
      readTime: '16 min',
      gradient: 'from-sky-500/20 to-indigo-600/20',
      borderGradient: 'from-sky-500 to-indigo-600',
      tags: currentLanguage === 'en'
        ? ['Freedom', 'Hegel', 'Lacan', 'Žižek', 'Symptom', 'Repetition', 'Subjective Act', 'Psychoanalysis']
        : ['Libertad', 'Hegel', 'Lacan', 'Žižek', 'Síntoma', 'Repetición', 'Acto subjetivo', 'Psicoanálisis'],
      slug: 'ser-libre-no-es-elegir-es-no-poder-dejar-de-repetir',
      image: '/IMAGENES BLOG/ser libres.jpg',
      rating: 4.7,
      featured: true
    },
    {
      id: 24,
      title: currentLanguage === 'en' 
        ? 'I Used to Be Happy'
        : 'Antes era feliz',
      excerpt: currentLanguage === 'en'
        ? 'The place you want to return to never existed. Then what is it that you\'re really looking for?'
        : 'El lugar al que quieres volver nunca existió. Entonces, ¿qué es lo que buscas realmente?',
      category: currentLanguage === 'en' ? 'Identity' : 'Identidad',
      author: 'Luis Virrueta',
      date: '12 Sep 2025',
      readTime: '17 min',
      gradient: 'from-violet-500/20 to-purple-600/20',
      borderGradient: 'from-violet-500 to-purple-600',
      tags: currentLanguage === 'en'
        ? ['Psychoanalysis', 'Lacan', 'Nostalgia', 'Identity', 'Constitutive Wound', 'Point Zero', 'Subjectivity']
        : ['Psicoanálisis', 'Lacan', 'Nostalgia', 'Identidad', 'Herida constitutiva', 'Punto cero', 'Subjetividad'],
      slug: 'antes-era-feliz-el-punto-cero',
      image: '/IMAGENES BLOG/ANTES ERA 0.png',
      rating: 4.9,
      featured: true
    },
    {
      id: 23,
      title: currentLanguage === 'en' 
        ? 'From the Dog Who Loves Me to the Void I Inhabit'
        : 'Del perro que me ama al vacío que me habita',
      excerpt: currentLanguage === 'en'
        ? 'Your dog loves without asking. You love and demand. Who actually knows how to love?'
        : 'Tu perro ama sin pedir. Tú amas y exiges. ¿Quién sabe realmente amar?',
      category: currentLanguage === 'en' ? 'Existentialism' : 'Existencialismo',
      author: 'Luis Virrueta',
      date: '30 Ago 2025',
      readTime: '20 min',
      gradient: 'from-purple-500/20 to-fuchsia-600/20',
      borderGradient: 'from-purple-500 to-fuchsia-600',
      tags: currentLanguage === 'en'
        ? ['Lacan', 'Nisargadatta Maharaj', 'Simone Weil', 'Nietzsche', 'Existential Void', 'Psychoanalysis', 'Non-duality']
        : ['Lacan', 'Nisargadatta Maharaj', 'Simone Weil', 'Nietzsche', 'Vacío Existencial', 'Psicoanálisis', 'No-dualidad'],
      slug: 'del-perro-que-me-ama-al-vacio-que-me-habita',
      image: '/IMAGENES BLOG/PERRO.jpg',
      rating: 4.8,
      featured: true
    }
  ]
    
    // Cargar los datos iniciales
    setBlogPosts(initialBlogs)
  }, [])

  const filteredPosts = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory)
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28 overflow-x-hidden">
      <SEOHead 
        title={t('blogPage.seo.title')}
        description={t('blogPage.seo.description')}
        image="/ajedrez video.mp4"
        url="/blog"
        type="website"
        tags={['blog', 'psicología', 'psicoanálisis', 'filosofía', 'inconsciente', 'percepción', 'consciencia', 'transformación']}
      />
      {/* Hero Section - Estilo AboutPage */}
      {/* Header Admin Controls - Elegante y Discreto */}
      <div className="fixed top-32 right-6 z-50">
        <AnimatePresence>
          {!isAdmin ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogin(true)}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 rounded-full transition-all duration-300"
            >
              <Lock className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
              <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors tracking-wide">Admin</span>
            </motion.button>
          ) : (
            <div className="flex items-center gap-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingArticle(null)
                  setShowEditor(true)
                }}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 rounded-full transition-all duration-300"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300 tracking-wide">Nuevo</span>
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/10 hover:border-red-500/50 rounded-full transition-all duration-300"
              >
                <LogOut className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" />
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <section ref={heroRef} className="relative pt-12 lg:pt-20 pb-40 lg:pb-56 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 -top-16 lg:-top-24 -bottom-80 lg:-bottom-96 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
            style={{
              minWidth: '100vw',
              minHeight: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            <source src="/ajedrez video.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Gradiente inferior que se mezcla con el contenido */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto z-10">
          {/* Título Hero - BLOG */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <span
              className="text-6xl sm:text-7xl lg:text-8xl font-light text-white inline-block"
              style={{ 
                letterSpacing: '0.15em',
                textShadow: '0 0 60px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(168, 85, 247, 0.1)'
              }}
            >
              BLOG
            </span>
          </motion.h1>
          {/* Descripción encerrada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
              <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                {currentLanguage === 'en' ? 'Psychoanalysis · Philosophy · Unconscious' : 'Psicoanálisis · Filosofía · Inconsciente'}
              </span>
            </div>
          </motion.div>
          {/* Conceptos clave */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-8"
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">
                {currentLanguage === 'en' ? 'Psychology' : 'Psicología'}
              </span>
            </motion.div>
            <div className="w-px h-6 bg-white/20" />
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Eye className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">
                {currentLanguage === 'en' ? 'Perception' : 'Percepción'}
              </span>
            </motion.div>
          </motion.div>
          {/* Pregunta filosófica */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg sm:text-xl text-white/60 text-center font-light italic mb-8"
          >
            {currentLanguage === 'en' 
              ? 'What if thinking isn\'t what you believe, but what you can\'t stop believing?' 
              : '¿Y si pensar no es lo que crees, sino lo que no puedes dejar de creer?'}
          </motion.p>
          {/* Línea decorativa */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="relative h-px mx-auto w-96 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>
        </div>
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
              <BlogCard 
                key={post.id} 
                post={post} 
                index={index}
                isAdmin={isAdmin}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      </section>
    </div>

    {/* Login Modal */}
    <AnimatePresence>
      {showLogin && (
        <AdminLogin onClose={() => setShowLogin(false)} />
      )}
    </AnimatePresence>

    {/* Editor Modal */}
    <AnimatePresence>
      {showEditor && (
        <AdminBlogEditor
          article={editingArticle}
          onClose={() => {
            setShowEditor(false)
            setEditingArticle(null)
          }}
          onSave={(savedArticle) => {
            console.log('Artículo guardado:', savedArticle)
            // Aquí podrías recargar la lista de blogs
          }}
        />
      )}
    </AnimatePresence>

    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {deletingArticle && (
        <DeleteConfirmModal
          article={deletingArticle}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </AnimatePresence>
  </>
  )
}
const BlogCard = ({ post, index, isAdmin, onDelete }) => {
  const { t, currentLanguage } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  // Mapeo de categorías con traducciones
  const categoryLabels = {
    'all': t('blogPage.categories.all'),
    'design': t('blogPage.categories.design'),
    'branding': t('blogPage.categories.branding'),
    'psychology': t('blogPage.categories.psychology'),
    'trends': t('blogPage.categories.trends'),
    'Philosophy': currentLanguage === 'en' ? 'Philosophy' : 'Filosofía',
    'philosophy': currentLanguage === 'en' ? 'Philosophy' : 'Filosofía',
    'Psychoanalysis': currentLanguage === 'en' ? 'Psychoanalysis' : 'Psicoanálisis',
    'psychoanalysis': currentLanguage === 'en' ? 'Psychoanalysis' : 'Psicoanálisis',
    'Psicoanálisis': currentLanguage === 'en' ? 'Psychoanalysis' : 'Psicoanálisis',
    'Filosofía': currentLanguage === 'en' ? 'Philosophy' : 'Filosofía',
    'Ethics': currentLanguage === 'en' ? 'Ethics' : 'Ética',
    'Ética': currentLanguage === 'en' ? 'Ethics' : 'Ética',
    'Spirituality': currentLanguage === 'en' ? 'Spirituality' : 'Espiritualidad',
    'Espiritualidad': currentLanguage === 'en' ? 'Spirituality' : 'Espiritualidad',
    'Identity': currentLanguage === 'en' ? 'Identity' : 'Identidad',
    'Identidad': currentLanguage === 'en' ? 'Identity' : 'Identidad',
    'Existentialism': currentLanguage === 'en' ? 'Existentialism' : 'Existencialismo',
    'Existencialismo': currentLanguage === 'en' ? 'Existentialism' : 'Existencialismo',
    'Perception': currentLanguage === 'en' ? 'Perception' : 'Percepción',
    'Percepción': currentLanguage === 'en' ? 'Perception' : 'Percepción',
    'Consciousness': currentLanguage === 'en' ? 'Consciousness' : 'Consciencia',
    'Conciencia': currentLanguage === 'en' ? 'Consciousness' : 'Consciencia',
    'Consciencia': currentLanguage === 'en' ? 'Consciousness' : 'Consciencia',
    'Branding × Strategy': currentLanguage === 'en' ? 'Branding × Strategy' : 'Branding × Estrategia',
    'Branding × Estrategia': currentLanguage === 'en' ? 'Branding × Strategy' : 'Branding × Estrategia',
    'Phenomenology': currentLanguage === 'en' ? 'Phenomenology' : 'Fenomenología',
    'Fenomenología': currentLanguage === 'en' ? 'Phenomenology' : 'Fenomenología',
    'Love & Relationships': currentLanguage === 'en' ? 'Love & Relationships' : 'Amor y Relaciones',
    'Amor y Relaciones': currentLanguage === 'en' ? 'Love & Relationships' : 'Amor y Relaciones'
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
          {/* Badges superiores */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
            {/* Category badge izquierda */}
            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-xs text-white/90 uppercase tracking-wider font-medium">
                {categoryLabels[post.category] || post.category}
              </span>
            </div>
            
            {/* Rating y botón eliminar derecha */}
            <div className="flex items-center gap-2">
              {/* Rating con estrellas */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-yellow-500/30">
                <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-white">{post.rating}</span>
              </div>
              
              {/* Botón Eliminar (solo para admin) */}
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete(post)
                  }}
                  className="flex items-center justify-center w-8 h-8 bg-red-500/90 hover:bg-red-600 backdrop-blur-md rounded-full border border-red-400/60 shadow-lg transition-all"
                  title="Eliminar artículo"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </motion.button>
              )}
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

