import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Tag, User, TrendingUp, Sparkles, BookOpen, Brain, Zap, Eye, Plus, Lock, LogOut, X, AlertTriangle, Trash2, Edit } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/AdminLogin'
import AdminBlogEditor from '../components/AdminBlogEditor'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { getArticleContent } from '../data/blogArticlesContent'
import { supabase } from '../lib/supabase'
// Updated: Dec 17, 2025 - New images for articles 17-20

const HIDDEN_BLOG_SLUGS = new Set([
  'rebranding-vs-refresh-cuando-redisenar-marca-completa',
  'branding-con-inteligencia-artificial-2025-guia-completa'
])

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

  const isUuid = (value) => {
    if (typeof value !== 'string') return false
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  }

  const tryRemoveStorageByPublicUrl = async (publicUrl) => {
    if (!publicUrl || typeof publicUrl !== 'string') return

    try {
      const u = new URL(publicUrl)
      const marker = '/storage/v1/object/public/'
      const idx = u.pathname.indexOf(marker)
      if (idx === -1) return

      const rest = u.pathname.slice(idx + marker.length)
      const parts = rest.split('/').filter(Boolean)
      if (parts.length < 2) return

      const bucket = parts[0]
      const objectPath = parts.slice(1).join('/')
      if (!bucket || !objectPath) return

      await supabase.storage.from(bucket).remove([objectPath])
    } catch {
      // Best-effort only
    }
  }

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
    if (HIDDEN_BLOG_SLUGS.has(slug)) return { title: '', excerpt: '' }
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

  // Función para editar artículo
  const handleEditClick = async (post) => {
    try {
      // Si el post viene de Supabase, cargar su data completa
      if (post.id && typeof post.id === 'string' && post.id.includes('-')) {
        const { data, error } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('id', post.id)
          .single()
        
        if (error) throw error
        
        setEditingArticle(data)
      } else {
        // Si es un post hardcoded, no podemos editarlo
        alert('Este artículo está hardcoded y no puede ser editado desde el CMS. Solo se pueden editar artículos creados en Supabase.')
        return
      }
      
      setShowEditor(true)
    } catch (error) {
      console.error('Error cargando artículo para editar:', error)
      alert('Error al cargar el artículo: ' + error.message)
    }
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
      // Solo se pueden eliminar artículos creados en Supabase.
      if (!isUuid(deletingArticle.id)) {
        alert('Este artículo es legacy/hardcoded y no se puede eliminar desde el CMS. Solo se pueden eliminar artículos creados en Supabase.')
        handleCancelDelete()
        return
      }

      // Best-effort: borrar también la imagen en Storage si es una URL pública de Supabase
      await tryRemoveStorageByPublicUrl(deletingArticle.image || deletingArticle.image_url)

      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', deletingArticle.id)
      
      if (error) throw error

      // Eliminar del estado local
      setBlogPosts((prev) => prev.filter(post => post.id !== deletingArticle.id))
      
      handleCancelDelete()
    } catch (error) {
      console.error('Error eliminando artículo:', error)
      alert('Error al eliminar el artículo: ' + error.message)
      setIsDeleting(false)
    }
  }

  // Cargar blogs al iniciar
  useEffect(() => {
    let isCancelled = false

    const formatDateForCard = (isoString) => {
      if (!isoString) return ''
      const date = new Date(isoString)
      if (Number.isNaN(date.getTime())) return ''
      return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    // Cargar datos iniciales de blogs
    const initialBlogs = [
    {
      id: 36,
      title: 'REINO ERUDITO',
      excerpt: 'A veces el conocimiento no nos libera; nos domestica. Nos volvemos guardianes del prestigio intelectual antes que amantes de la verdad. Este blog es una rebelión contra el “no estás listo todavía”.\n❓Pregunta: ¿Aprendemos para pensar… o para obedecer?',
      category: 'philosophy',
      author: 'Luis Virrueta',
      date: '07 Ene 2026',
      readTime: '16 min',
      gradient: 'from-emerald-600/20 via-teal-600/20 to-cyan-600/20',
      borderGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      tags: ['Filosofía', 'Psicoanálisis', 'Foucault', 'Adorno', 'Althusser', 'Gramsci', 'Byung-Chul Han', 'Hannah Arendt', 'Lacan', 'Deleuze', 'Nietzsche', 'Kierkegaard'],
      slug: 'reino-erudito',
      image: '/IMAGENES BLOG/REINO ERUDITO.jpg',
      rating: 4.9,
      featured: true,
      accent: 'emerald'
    },
    {
      id: 35,
      title: 'Fábrica de percepciones',
      excerpt: '¿Deseas lo que miras… o deseas la emoción que tu fantasía fabrica? ¿Qué parte de tu realidad es percepción, y qué parte es identidad imaginada? Este ensayo recorre mirada, deseo y el Otro para responderlo.',
      category: 'philosophy',
      author: 'Luis Virrueta',
      date: '07 Ene 2026',
      readTime: '15 min',
      gradient: 'from-indigo-600/20 via-purple-600/20 to-fuchsia-600/20',
      borderGradient: 'from-indigo-600 via-purple-600 to-fuchsia-600',
      tags: ['Psicoanálisis', 'Jacques Lacan', 'Sigmund Freud', 'Jean-Paul Sartre', 'Walter Benjamin', 'Mirada', 'Deseo', 'Percepción'],
      slug: 'fabrica-percepciones-identidades-imaginadas',
      image: '/blog-compressed/blog-22-fabrica.webp',
      rating: 4.9,
      featured: true
    },
    {
      id: 34,
      title: currentLanguage === 'en' 
        ? 'SU·DO·KU: The art of thinking by elimination'
        : 'SU·DO·KU: El arte de pensar por descarte',
      excerpt: currentLanguage === 'en'
        ? 'What if thinking were elimination, not certainty? Sudoku becomes a map of negation, decision and the ethics of sustaining the question instead of “closing” it too fast.'
        : '¿Y si pensar fuera descartar, no “tener razón”? El Sudoku se vuelve un mapa de negación, decisión y la ética de sostener la pregunta en vez de cerrarla con prisa.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '22 Dic 2025',
      readTime: '15 min',
      gradient: 'from-purple-500/20 to-fuchsia-500/20',
      borderGradient: 'from-purple-500 to-fuchsia-500',
      tags: currentLanguage === 'en'
        ? ['Psychoanalysis', 'Jacques Lacan', 'Thinking', 'Decision fatigue', 'Negation', 'Philosophy']
        : ['Psicoanálisis', 'Jacques Lacan', 'Pensamiento', 'Decisión', 'Vía negativa', 'Filosofía'],
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
        ? 'Who does the insult describe: the woman, or the speaker? Panic, usurpation, terror and autonomy of desire—why the word works as a psychic shield.'
        : '¿A quién describe el insulto: a la mujer… o a quien lo pronuncia? Pánico, usurpación, terror y autonomía del deseo: por qué la palabra funciona como escudo psíquico.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '22 Dic 2025',
      readTime: '19 min',
      gradient: 'from-red-600/20 to-pink-700/20',
      borderGradient: 'from-red-600 to-pink-700',
      tags: currentLanguage === 'en'
        ? ['Psychoanalysis', 'Jacques Lacan', 'Sigmund Freud', 'Slavoj Žižek', 'Desire', 'Jouissance', 'Projection']
        : ['Psicoanálisis', 'Jacques Lacan', 'Sigmund Freud', 'Slavoj Žižek', 'Deseo', 'Goce', 'Proyección'],
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
        ? 'What do you gain when you call the world “corrupt”? And what do you lose by keeping your innocence intact? A piece on symbolic games, language and responsibility.'
        : '¿Qué ganas cuando llamas al mundo “corrupto”? ¿Y qué pierdes al preservar tu inocencia intacta? Un ensayo sobre juego simbólico, lenguaje y responsabilidad.',
      category: 'philosophy',
      author: 'Luis Virrueta',
      date: '18 Dic 2025',
      readTime: '16 min',
      gradient: 'from-slate-600/20 to-zinc-700/20',
      borderGradient: 'from-slate-600 to-zinc-700',
      tags: currentLanguage === 'en'
        ? ['Philosophy', 'Ethics', 'Jacques Lacan', 'Slavoj Žižek', 'Language', 'Responsibility', 'Symbolic order']
        : ['Filosofía', 'Ética', 'Jacques Lacan', 'Slavoj Žižek', 'Lenguaje', 'Responsabilidad', 'Orden simbólico'],
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
        ? 'Why does what saved you at first stop working later? When the old self breaks, what is actually beginning? A map of the “dark night” and the clarity that follows.'
        : '¿Por qué lo que te salvó al principio deja de funcionar después? Cuando el yo viejo se rompe, ¿qué es lo que realmente comienza? Un mapa de la “noche oscura” y su claridad.',
      category: 'consciousness',
      author: 'Luis Virrueta',
      date: '10 Dic 2025',
      readTime: '15 min',
      gradient: 'from-indigo-500/20 to-purple-600/20',
      borderGradient: 'from-indigo-500 to-purple-600',
      tags: currentLanguage === 'en'
        ? ['Consciousness', 'Dark night of the soul', 'Meditation', 'Presence', 'Spirituality', 'Transformation']
        : ['Conciencia', 'Noche oscura del alma', 'Meditación', 'Presencia', 'Transformación', 'Espiritualidad'],
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
        ? 'What if pain doesn\'t “go away” but takes over the whole world? What does it reveal about body, meaning and the Real? A phenomenological + psychoanalytic look.'
        : '¿Y si el dolor no fuera algo que se quita, sino algo que ocupa todo el mundo? ¿Qué revela del cuerpo, el sentido y lo Real? Fenomenología + psicoanálisis para mirarlo de frente.',
      category: 'consciousness',
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
        ? 'Where is the body when everything works—and why does it appear only when it fails? A short entry into perception, attention and the invisible background that holds daily life.'
        : '¿Dónde está tu cuerpo cuando todo va bien… y por qué aparece cuando falla? Una entrada breve a percepción, atención y ese fondo invisible que sostiene tu vida diaria.',
      category: 'consciousness',
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
        ? 'What if love isn\'t “two halves becoming one”, but the tear inside unity? Desire, lack, and why union can hurt.'
        : '¿Y si amar no fuera “hacerse uno”, sino sostener el desgarro dentro de la unidad? Deseo, falta y por qué la unión puede doler.',
      category: 'psychoanalysis',
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
        ? 'Why does a bond sometimes need the object—but not the satisfaction? A fish is exchanged without being eaten: a metaphor for desire, listening, and the desire of the Other.'
        : '¿Por qué a veces el vínculo necesita el objeto… pero no la satisfacción? Un pez que se intercambia sin comerse: metáfora de deseo, escucha y deseo del Otro.',
      category: 'psychoanalysis',
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
        ? 'Love often starts where something hurts. What changes when you stop demanding the other repair your lack—and you assume your desire? What becomes possible then?'
        : 'El amor suele empezar donde algo duele. ¿Qué cambia cuando dejas de exigirle al otro que repare tu falta y asumes tu deseo? ¿Qué se vuelve posible entonces?',
      category: 'psychoanalysis',
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
        ? 'Are you free when you choose—or when you can\'t stop repeating? Freedom is where repetition becomes visible, and an act becomes possible.'
        : '¿Eres libre cuando eliges… o cuando ya no puedes dejar de repetir? La libertad aparece cuando la repetición se vuelve visible y el acto se vuelve posible.',
      category: 'psychoanalysis',
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
        ? 'What “before” do you want to return to—if that before never existed? A psychoanalytic look at nostalgia, identity and the fantasy of a lost point zero.'
        : '¿A qué “antes” quieres volver… si ese antes nunca existió? Una lectura psicoanalítica sobre nostalgia, identidad y la fantasía de un punto cero perdido.',
      category: 'psychoanalysis',
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
        ? 'What does a love that doesn\'t demand—your dog\'s—show you about the void you inhabit? A piece on lack, presence and what you keep asking the Other to fill.'
        : '¿Qué te muestra un amor que no exige —el de tu perro— sobre el vacío que habitas? Un texto sobre falta, presencia y eso que sigues pidiéndole al Otro que llene.',
      category: 'psychoanalysis',
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

    // Traer artículos desde Supabase (migrados / creados desde el CMS)
    const loadSupabaseArticles = async () => {
      try {
        const mergePreferLegacyMeta = (legacy, incoming) => {
          if (!legacy) return incoming

          // Para artículos que ya existen hardcoded (legacy), NO permitimos que Supabase
          // pise metadatos visuales si vienen vacíos/por defecto o inconsistentes.
          const merged = { ...legacy, ...incoming }

          // En artículos legacy, conservar copy curado (título/extract/metadata de tarjeta)
          // para que Supabase no los pise con versiones viejas o genéricas.
          merged.title = legacy.title || merged.title
          merged.excerpt = legacy.excerpt || merged.excerpt
          merged.author = legacy.author || merged.author
          merged.readTime = legacy.readTime || merged.readTime
          merged.date = legacy.date || merged.date

          // Mantener gradientes/tags/categoría/rating/image del legacy a menos que incoming traiga algo útil.
          merged.gradient = legacy.gradient
          merged.borderGradient = legacy.borderGradient

          merged.category = legacy.category

          // En artículos legacy, conservar tags originales (los de Supabase suelen venir incompletos)
          merged.tags = Array.isArray(legacy.tags) && legacy.tags.length > 0
            ? legacy.tags
            : (Array.isArray(incoming.tags) ? incoming.tags : [])

          // Si Supabase trae rating 0/null, conservar legacy.
          const incomingRating = typeof incoming.rating === 'number' ? incoming.rating : null
          merged.rating = incomingRating && incomingRating > 0 ? incomingRating : legacy.rating

          // En artículos legacy, conservar SIEMPRE la imagen original para evitar el bug
          // de "todas las tarjetas con la misma imagen" cuando Supabase termina de cargar.
          merged.image = legacy.image || incoming.image || ''

          // Mantener el accent del legacy si existe; si no, usar el del CMS.
          merged.accent = legacy.accent || incoming.accent || null

          return merged
        }

        const { data, error } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('language', currentLanguage)
          .order('published_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })

        if (error) throw error
        if (isCancelled) return

        const supabasePosts = (data || []).map((row) => {
          const bestDateIso = row.published_at || row.created_at
          return {
            id: row.id,
            title: row.title,
            excerpt: row.excerpt,
            category: row.category,
            accent: row.accent || null,
            author: row.author,
            date: formatDateForCard(bestDateIso) || (currentLanguage === 'en' ? 'Draft' : 'Borrador'),
            readTime: row.read_time || '—',
            gradient: 'from-slate-600/20 to-zinc-700/20',
            borderGradient: 'from-slate-600 to-zinc-700',
            tags: row.tags || [],
            slug: row.slug,
            image: row.image_url || '',
            // OJO: usar nullish coalescing para no convertir 0 en 5
            rating: (typeof row.rating === 'number' ? row.rating : null),
            featured: Boolean(row.featured),
            language: row.language,
            isPublished: row.is_published,
            publishedAt: row.published_at,
            createdAt: row.created_at,
            content: row.content
          }
        }).filter((post) => !HIDDEN_BLOG_SLUGS.has(post.slug))

        const filteredInitialBlogs = initialBlogs.filter((post) => !HIDDEN_BLOG_SLUGS.has(post.slug))

        // Merge: supabase posts ganan sobre los hardcodeados por (slug, language)
        const merged = new Map()
        filteredInitialBlogs.forEach((post) => {
          merged.set(`${post.slug}:${currentLanguage}`, post)
        })
        supabasePosts.forEach((post) => {
          const key = `${post.slug}:${currentLanguage}`
          const legacy = merged.get(key)
          merged.set(key, mergePreferLegacyMeta(legacy, post))
        })

        setBlogPosts(Array.from(merged.values()))
      } catch (err) {
        console.warn('No se pudieron cargar artículos desde Supabase:', err)
      }
    }

    loadSupabaseArticles()

    return () => {
      isCancelled = true
    }
  }, [currentLanguage, isAdmin])

  const toCardDate = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return ''
    // Mantener estilo corto similar a los hardcodeados
    return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const normalizeSavedArticleToPost = (savedArticle) => {
    if (!savedArticle) return null

    const publishedIso = savedArticle.published_at || savedArticle.publishedAt || null
    const createdIso = savedArticle.created_at || savedArticle.createdAt || null
    const bestDateIso = publishedIso || createdIso

    return {
      id: savedArticle.id ?? savedArticle.slug,
      title: savedArticle.title,
      excerpt: savedArticle.excerpt,
      category: savedArticle.category,
      author: savedArticle.author,
      date: toCardDate(bestDateIso) || (currentLanguage === 'en' ? 'Draft' : 'Borrador'),
      readTime: savedArticle.read_time || savedArticle.readTime || '—',
      tags: savedArticle.tags || [],
      slug: savedArticle.slug,
      image: savedArticle.image_url || savedArticle.imageUrl || null,
      rating: savedArticle.rating ?? 0,
      featured: false,
      // Campos para lógica de programación
      isPublished: savedArticle.is_published ?? savedArticle.isPublished ?? false,
      publishedAt: publishedIso
    }
  }

  const nowTs = Date.now()
  const visiblePosts = isAdmin
    ? blogPosts
    : blogPosts.filter((post) => {
        const publishedFlag = post.isPublished ?? post.is_published ?? true
        if (!publishedFlag) return false

        const publishedIso = post.publishedAt || post.published_at || null
        if (!publishedIso) return true

        const ts = Date.parse(publishedIso)
        if (!Number.isFinite(ts)) return true
        return ts <= nowTs
      })

  const filteredPosts = activeCategory === 'all'
    ? visiblePosts
    : visiblePosts.filter(post => post.category === activeCategory)
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28 overflow-x-hidden">
      <SEOHead 
        title={t('blogPage.seo.title')}
        description={t('blogPage.seo.description')}
        image="/portada.webp"
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
                onEdit={handleEditClick}
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
            const normalized = normalizeSavedArticleToPost(savedArticle)
            if (!normalized) return

            setBlogPosts((prev) => {
              const index = prev.findIndex((p) => p.id === normalized.id)
              if (index >= 0) {
                const copy = [...prev]
                copy[index] = { ...prev[index], ...normalized }
                return copy
              }
              return [normalized, ...prev]
            })
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
const BlogCard = ({ post, index, isAdmin, onDelete, onEdit }) => {
  const { t, currentLanguage } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const resolvedImageSrc = useMemo(() => {
    const raw = typeof post.image === 'string' ? post.image.trim() : ''
    if (!raw) return ''
    if (/^https?:\/\//i.test(raw)) return raw
    try {
      return encodeURI(raw)
    } catch {
      return raw
    }
  }, [post.image])

  const [cardImageError, setCardImageError] = useState(false)
  useEffect(() => {
    setCardImageError(false)
  }, [resolvedImageSrc])

  // Mapeo de categorías con traducciones
  const categoryLabels = {
    'all': t('blogPage.categories.all'),
    'design': t('blogPage.categories.design'),
    'branding': t('blogPage.categories.branding'),
    'psychology': t('blogPage.categories.psychology'),
    'trends': t('blogPage.categories.trends'),
    'perception': currentLanguage === 'en' ? 'Perception' : 'Percepción',
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
    'consciousness': currentLanguage === 'en' ? 'Consciousness' : 'Consciencia',
    'Conciencia': currentLanguage === 'en' ? 'Consciousness' : 'Consciencia',
    'Consciencia': currentLanguage === 'en' ? 'Consciousness' : 'Consciencia',
    'Branding × Strategy': currentLanguage === 'en' ? 'Branding × Strategy' : 'Branding × Estrategia',
    'Branding × Estrategia': currentLanguage === 'en' ? 'Branding × Strategy' : 'Branding × Estrategia',
    'Phenomenology': currentLanguage === 'en' ? 'Phenomenology' : 'Fenomenología',
    'Fenomenología': currentLanguage === 'en' ? 'Phenomenology' : 'Fenomenología',
    'Love & Relationships': currentLanguage === 'en' ? 'Love & Relationships' : 'Amor y Relaciones',
    'Amor y Relaciones': currentLanguage === 'en' ? 'Love & Relationships' : 'Amor y Relaciones'
  }

  const categoryLabel = categoryLabels[post.category]
    || categoryLabels[String(post.category || '').toLowerCase()]
    || (currentLanguage === 'en' ? 'Article' : 'Artículo')

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
          {resolvedImageSrc && !cardImageError && (
            <img 
              src={resolvedImageSrc} 
              alt={post.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setCardImageError(true)}
            />
          )}
          {/* Fallback si no hay imagen */}
          {(!resolvedImageSrc || cardImageError) && (
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
                {categoryLabel}
              </span>
            </div>
            
            {/* Botones admin derecha */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit(post)
                  }}
                  className="flex items-center justify-center w-8 h-8 bg-blue-500/90 hover:bg-blue-600 backdrop-blur-md rounded-full border border-blue-400/60 shadow-lg transition-all"
                  title="Editar artículo"
                >
                  <Edit className="w-3.5 h-3.5 text-white" />
                </motion.button>
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
              </div>
            )}
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

