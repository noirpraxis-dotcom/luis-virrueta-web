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
import { getLegacyBlogIndex } from '../data/blogIndex'
import { supabase } from '../lib/supabase'
// Updated: Dec 17, 2025 - New images for articles 17-20

const HIDDEN_BLOG_SLUGS = new Set([
  'rebranding-vs-refresh-cuando-redisenar-marca-completa',
  'branding-con-inteligencia-artificial-2025-guia-completa',
  // Removed from the public blog (legacy 2024 series)
  'neurociencia-del-diseno',
  'ia-generativa-diseno-emocion',
  'interfaces-empaticas-machine-learning'
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

    const getPostSortTs = (post) => {
      if (!post) return 0

      const iso = post.publishedAt || post.published_at || post.createdAt || post.created_at || null
      if (iso) {
        const ts = Date.parse(iso)
        if (Number.isFinite(ts)) return ts
      }

      // Legacy: intenta parsear fechas tipo "07 Ene 2026" / "22 Dic 2025"
      const raw = String(post.date || '').trim()
      if (!raw) return 0
      const m = raw.match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóúñÑ\.]{3,})\s+(\d{4})$/)
      if (!m) return 0

      const day = Number(m[1])
      const monRaw = String(m[2] || '').replace('.', '').toLowerCase()
      const year = Number(m[3])
      if (!Number.isFinite(day) || !Number.isFinite(year)) return 0

      const months = {
        ene: 0,
        feb: 1,
        mar: 2,
        abr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        ago: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dic: 11
      }
      const mon = months[monRaw]
      if (!Number.isFinite(mon)) return 0

      // Fecha local (suficiente para ordenar)
      const d = new Date(year, mon, day)
      const ts = d.getTime()
      return Number.isFinite(ts) ? ts : 0
    }

    // Cargar datos iniciales (legacy/hardcoded)
    const initialBlogs = getLegacyBlogIndex(currentLanguage)
    
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
          // CRÍTICO: NUNCA permitir que Supabase pise la imagen legacy hardcoded.
          merged.image = legacy.image || ''

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

        const ordered = Array.from(merged.values())
          .sort((a, b) => {
            const ta = getPostSortTs(a)
            const tb = getPostSortTs(b)
            if (tb !== ta) return tb - ta
            const sa = String(a?.slug || '')
            const sb = String(b?.slug || '')
            return sa.localeCompare(sb)
          })

        setBlogPosts(ordered)
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

