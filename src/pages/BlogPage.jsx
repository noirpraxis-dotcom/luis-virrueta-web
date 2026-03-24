import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Tag, User, TrendingUp, Sparkles, BookOpen, Brain, Zap, Eye, Plus, Lock, LogOut, X, AlertTriangle, Trash2, Edit, Search } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
// AdminLogin removed — admin is detected automatically via Firebase Auth header login
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { getArticleContent } from '../data/blogArticlesContent'
import { getLegacyBlogIndex } from '../data/blogIndex'
import { getBlogArticles, deleteBlogArticle, trackPageView } from '../lib/supabase'
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
  const { isAdmin } = useAuth()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const [activeCategory, setActiveCategory] = useState('all')
  
  // Estados para admin
  const [deletingArticle, setDeletingArticle] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isUuid = (value) => {
    if (typeof value !== 'string') return false
    // Firestore auto-IDs are 20-char alphanumeric — also valid for delete
    // Legacy IDs are numeric (23, 24, 36...). Anything non-numeric is a Firestore doc.
    return !/^\d+$/.test(value)
  }

  const tryRemoveStorageByPublicUrl = async () => {
    // Images are now on R2 CDN, no automatic cleanup needed
  }

  // Datos iniciales de blog posts (se cargan en useEffect)
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(true)
  const [activeTag, setActiveTag] = useState(null)
  const [tagSearch, setTagSearch] = useState('')
  const tagSearchRef = useRef(null)

  // Category label mapping (extensible — new categories from CMS auto-appear)
  const CATEGORY_META = {
    philosophy: { label: 'Filosofía', icon: Eye },
    psychology: { label: 'Psicología', icon: Brain },
    psychoanalysis: { label: 'Psicoanálisis', icon: Sparkles },
    perception: { label: 'Percepción', icon: Zap },
    consciousness: { label: 'Consciencia', icon: TrendingUp },
    metaphysics: { label: 'Metafísica', icon: Sparkles },
    reflections: { label: 'Reflexiones', icon: BookOpen },
    diary: { label: 'Diario', icon: BookOpen },
    ethics: { label: 'Ética', icon: Eye },
    existence: { label: 'Existencia', icon: TrendingUp },
  }

  // Dynamic categories from actual articles
  const categories = useMemo(() => {
    const catSet = new Set()
    blogPosts.forEach((p) => {
      if (p.category) catSet.add(p.category)
    })
    const dynamic = Array.from(catSet)
      .sort()
      .map((id) => ({
        id,
        label: CATEGORY_META[id]?.label || id.charAt(0).toUpperCase() + id.slice(1),
        icon: CATEGORY_META[id]?.icon || BookOpen,
      }))
    return [{ id: 'all', label: t('blogPage.categories.all'), icon: BookOpen }, ...dynamic]
  }, [blogPosts, t])

  // Dynamic tags from actual articles
  const allTags = useMemo(() => {
    const tagCount = {}
    blogPosts.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        const t = String(tag).trim()
        if (t) tagCount[t] = (tagCount[t] || 0) + 1
      })
    })
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }, [blogPosts])
  // Helper function to get translated content
  const getPostContent = (slug) => {
    if (HIDDEN_BLOG_SLUGS.has(slug)) return { title: '', excerpt: '' }
    const content = getArticleContent(slug, currentLanguage)

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

  // Función para editar artículo - ahora redirige a la página del artículo
  const handleEditClick = async (post) => {
    // Redirigir a la página del artículo con parámetro de edición
    window.location.href = `/blog/${post.slug}?edit=true`
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
      const articleId = String(deletingArticle.id || '')
      // Legacy articles have pure numeric IDs and no Firestore doc
      if (/^\d+$/.test(articleId)) {
        alert('Este artículo es legacy y no tiene registro en la base de datos. Contacta al desarrollador para eliminarlo.')
        handleCancelDelete()
        return
      }

      await tryRemoveStorageByPublicUrl()
      await deleteBlogArticle(articleId)

      // Eliminar del estado local
      setBlogPosts((prev) => prev.filter(post => post.id !== deletingArticle.id))
      
      handleCancelDelete()
    } catch (error) {
      console.error('Error eliminando artículo:', error)
      alert('Error al eliminar el artículo: ' + error.message)
      setIsDeleting(false)
    }
  }

  // Registrar visita a la página del blog
  useEffect(() => {
    trackPageView({ path: '/blog', slug: null })
  }, [])

  // Cargar blogs al iniciar
  useEffect(() => {
    let isCancelled = false

    const formatDateForCard = (isoString) => {
      if (!isoString) return ''
      const date = new Date(isoString)
      if (Number.isNaN(date.getTime())) return ''
      return date.toLocaleDateString('es-MX', {
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

    // Traer artículos desde Firebase (migrados / creados desde el CMS)
    const loadSupabaseArticles = async () => {
      try {
        const mergePreferLegacyMeta = (legacy, incoming) => {
          if (!legacy) return incoming

          // Start with legacy base, overlay incoming CMS data
          const merged = { ...legacy }

          // ALWAYS use the Firestore id (needed for delete/edit)
          merged.id = incoming.id

          // CMS data wins when it has been edited (non-empty)
          merged.title = incoming.title || legacy.title
          merged.excerpt = incoming.excerpt || legacy.excerpt
          merged.author = incoming.author || legacy.author
          merged.readTime = incoming.readTime || legacy.readTime
          merged.date = incoming.date || legacy.date

          // CMS image wins only if it's a valid HTTP URL; otherwise keep legacy
          const incomingImgValid = incoming.image && /^https?:\/\//i.test(incoming.image)
          merged.image = incomingImgValid ? incoming.image : (legacy.image || incoming.image || '')

          // CMS category wins if set
          merged.category = incoming.category || legacy.category

          // CMS tags win if present
          merged.tags = Array.isArray(incoming.tags) && incoming.tags.length > 0
            ? incoming.tags
            : (Array.isArray(legacy.tags) ? legacy.tags : [])

          // Keep gradients from legacy as fallback, but allow CMS accent
          merged.gradient = legacy.gradient
          merged.borderGradient = legacy.borderGradient
          merged.accent = incoming.accent || legacy.accent || null

          // Rating: incoming wins if positive
          const incomingRating = typeof incoming.rating === 'number' ? incoming.rating : null
          merged.rating = incomingRating && incomingRating > 0 ? incomingRating : legacy.rating

          // CMS publish state
          merged.isPublished = incoming.isPublished
          merged.publishedAt = incoming.publishedAt || legacy.publishedAt
          merged.createdAt = incoming.createdAt || legacy.createdAt
          merged.content = incoming.content || legacy.content

          return merged
        }

        const data = await getBlogArticles(false, currentLanguage)

        if (isCancelled) return

        const firestorePosts = (data || []).map((row) => {
          const bestDateIso = row.published_at || row.created_at
          return {
            id: row.id,
            title: row.title,
            excerpt: row.excerpt,
            category: row.category,
            accent: row.accent || null,
            author: row.author,
            date: formatDateForCard(bestDateIso) || 'Borrador',
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

        // Merge: firestore posts ganan sobre los hardcodeados por (slug, language)
        const merged = new Map()
        filteredInitialBlogs.forEach((post) => {
          merged.set(`${post.slug}:${currentLanguage}`, post)
        })
        firestorePosts.forEach((post) => {
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
        setBlogLoading(false)
      } catch (err) {
        console.warn('No se pudieron cargar artículos desde Firebase:', err)
        // On error, show legacy articles as fallback
        setBlogPosts(initialBlogs)
        setBlogLoading(false)
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
    return date.toLocaleDateString('es-MX', {
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
      date: toCardDate(bestDateIso) || 'Borrador',
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

  const filteredPosts = useMemo(() => {
    let posts = visiblePosts
    if (activeCategory !== 'all') {
      posts = posts.filter(post => post.category === activeCategory)
    }
    if (activeTag) {
      posts = posts.filter(post => (post.tags || []).some(t => t.toLowerCase() === activeTag.toLowerCase()))
    }
    return posts
  }, [visiblePosts, activeCategory, activeTag])
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28 overflow-x-hidden">
      <SEOHead 
        title={t('blogPage.seo.title')}
        description={t('blogPage.seo.description')}
        image="https://radiografia-worker.noirpraxis.workers.dev/media/products/portada.webp"
        url="/blog"
        type="website"
        tags={['blog', 'psicología', 'psicoanálisis', 'filosofía', 'inconsciente', 'percepción', 'consciencia', 'transformación']}
      />
      {/* Hero Section - Estilo AboutPage */}
      {/* Header Admin Controls - Removed: now using dashed card in grid */}

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
            <source src="https://radiografia-worker.noirpraxis.workers.dev/media/headers/ajedrez-video.mp4" type="video/mp4" />
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
                Psicoanálisis · Filosofía · Inconsciente
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
                Psicología
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
                Percepción
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
            ¿Y si pensar no es lo que crees, sino lo que no puedes dejar de creer?
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
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setActiveTag(null); setTagSearch('') }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-white/30'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white/90'
                  }`}
                >
                  <span className="text-sm">{cat.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Tag search input */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="max-w-md mx-auto relative" ref={tagSearchRef}>
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Buscar por etiqueta..."
                className="w-full px-4 py-2.5 pl-10 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              {/* Matching tag suggestions */}
              {tagSearch.trim() && (() => {
                const q = tagSearch.trim().toLowerCase()
                const matches = allTags.filter(t => t.toLowerCase().includes(q)).slice(0, 10)
                return matches.length > 0 ? (
                  <div className="absolute top-full mt-1 w-full bg-zinc-900/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-[200px] overflow-y-auto">
                    {matches.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => { setActiveTag(tag); setTagSearch('') }}
                        className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <Tag className="w-3 h-3 text-white/40" />
                        #{tag}
                      </button>
                    ))}
                  </div>
                ) : null
              })()}
            </div>
            {/* Active tag chip */}
            {activeTag && (
              <div className="flex items-center gap-2 mt-3 justify-center">
                <span className="px-3 py-1.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-2">
                  #{activeTag}
                  <button onClick={() => setActiveTag(null)} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Blog Posts Grid */}
      <section className="relative py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Admin: Dashed card to create new post */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative cursor-pointer"
                onClick={() => { window.location.href = '/blog/nuevo?edit=true' }}
              >
                <div className="relative bg-transparent border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-500 h-full flex flex-col items-center justify-center min-h-[320px]">
                  <div className="flex flex-col items-center gap-4 text-white/40 group-hover:text-purple-400 transition-colors duration-300">
                    <Plus className="w-12 h-12" strokeWidth={1.5} />
                    <span className="text-sm font-medium tracking-wide uppercase">Nuevo artículo</span>
                  </div>
                </div>
              </motion.div>
            )}
            {blogLoading ? (
              // Loading skeleton cards
              Array.from({ length: 6 }).map((_, i) => (
                <div key={`skel-${i}`} className="animate-pulse">
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="aspect-[16/9] bg-white/5" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-white/10 rounded w-1/3" />
                      <div className="h-5 bg-white/10 rounded w-full" />
                      <div className="h-5 bg-white/10 rounded w-2/3" />
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-4/5" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredPosts.map((post, index) => (
                <BlogCard 
                  key={post.slug || post.id} 
                  post={post} 
                  index={index}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>



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
  const isDraft = isAdmin && !(post.isPublished ?? post.is_published ?? true)

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

  // Category label resolution
  const categoryLabel = (() => {
    const raw = post.category
    if (!raw) return 'Artículo'
    const v = String(raw).trim().toLowerCase()
    const map = {
      philosophy: 'Filosofía', psychoanalysis: 'Psicoanálisis', psychology: 'Psicología',
      perception: 'Percepción', consciousness: 'Conciencia', metaphysics: 'Metafísica',
      reflections: 'Reflexiones', diary: 'Diario', ethics: 'Ética', existence: 'Existencia',
      epistemology: 'Epistemología', ontology: 'Ontología', aesthetics: 'Estética',
      phenomenology: 'Fenomenología', hermeneutics: 'Hermenéutica', spirituality: 'Espiritualidad',
      identity: 'Identidad', design: 'Diseño', branding: 'Branding', trends: 'Tendencias',
      poetry: 'Poesía'
    }
    // Check both raw and lowercased version; fallback to capitalize raw
    return map[v] || map[raw] || raw.charAt(0).toUpperCase() + raw.slice(1)
  })()

  return (
    <Link to={post.slug ? `/blog/${post.slug}` : '#'}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
        className={`group relative ${isDraft ? 'opacity-50 grayscale-[40%]' : ''}`}
      >
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500 h-full flex flex-col">
        {/* Draft badge */}
        {isDraft && (
          <div className="absolute top-0 left-0 right-0 z-30 bg-amber-500/90 text-black text-xs font-bold text-center py-1 tracking-wider uppercase">
            Borrador
          </div>
        )}
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

