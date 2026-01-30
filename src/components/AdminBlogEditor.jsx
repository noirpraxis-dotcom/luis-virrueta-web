import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Save, Eye, Image as ImageIcon, Upload, Loader, 
  Calendar, Clock, Tag, Globe, Sparkles, ArrowLeft,
  AlertCircle, CheckCircle, Trash2, User,
  Crown, Moon, Diamond, Star, Bookmark
} from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import { supabase } from '../lib/supabase'

/**
 * Editor principal de blogs con todas las funcionalidades
 * - Upload de imágenes con compresión
 * - Editor de contenido inteligente
 * - Preview en tiempo real
 * - Guardado en Supabase
 */
export default function AdminBlogEditor({ article, onClose, onSave }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const extractMetaFromContent = (blocks) => {
    const list = Array.isArray(blocks) ? blocks : []
    let extractedTitle = ''
    let extractedSubtitle = ''
    const body = []

    for (const b of list) {
      const type = String(b?.type || '')
      if (!extractedTitle && type === 'title') {
        extractedTitle = String(b?.content || '').trim()
        continue
      }
      if (!extractedSubtitle && type === 'subtitle') {
        extractedSubtitle = String(b?.content || '').trim()
        continue
      }
      body.push(b)
    }

    return { extractedTitle, extractedSubtitle, body }
  }

  const seedContentWithMetaBlocks = (blocks, metaTitle, metaSubtitle) => {
    const list = Array.isArray(blocks) ? blocks : []
    const hasTitle = list.some((b) => String(b?.type || '') === 'title')
    const hasSubtitle = list.some((b) => String(b?.type || '') === 'subtitle')

    const seeded = []
    const makeId = (suffix) => `meta-${Date.now()}-${suffix}`

    if (!hasTitle && String(metaTitle || '').trim()) {
      seeded.push({ id: makeId('title'), type: 'title', content: String(metaTitle || '').trim() })
    }
    if (!hasSubtitle && String(metaSubtitle || '').trim()) {
      seeded.push({ id: makeId('subtitle'), type: 'subtitle', content: String(metaSubtitle || '').trim() })
    }

    return seeded.length ? [...seeded, ...list] : list
  }
  
  // Metadatos del artículo
  const [title, setTitle] = useState(article?.title || '')
  const [subtitle, setSubtitle] = useState(article?.subtitle || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [author, setAuthor] = useState(article?.author || 'Luis Virrueta')
  const [category, setCategory] = useState(article?.category || 'philosophy')
  const [accent, setAccent] = useState(article?.accent || 'purple')
  const getInitialSectionIcon = () => {
    const blocks = Array.isArray(article?.content) ? article.content : []
    const firstHeadingWithIcon = blocks.find((b) => String(b?.type || '') === 'heading' && String(b?.icon || '').trim())
    const raw = String(firstHeadingWithIcon?.icon || '').trim()
    const migrate = {
      // old emoji/symbol variants -> new key-based icons
      '👑': 'crown',
      '♛': 'crown',
      '⚜': 'crown',
      '⚜️': 'crown',
      '☾': 'moon',
      '✦': 'star',
      '✧': 'sparkles',
      '⟡': 'sparkles',
      '❖': 'diamond',
      '⬦': 'diamond',
      '⬥': 'diamond'
    }
    const normalized = raw ? (migrate[raw] || raw) : ''
    return normalized || 'crown'
  }
  const [sectionIcon, setSectionIcon] = useState(getInitialSectionIcon)
  const [tags, setTags] = useState(article?.tags?.join(', ') || '')
  const [readTime, setReadTime] = useState(article?.readTime || '15 min')
  const [language, setLanguage] = useState(article?.language || 'es')
  
  // Imagen
  const [imageFile, setImageFile] = useState(null)
  const initialImage = article?.image_url || article?.imageUrl || article?.image || null
  const [imagePreview, setImagePreview] = useState(initialImage)
  const [imageUrl, setImageUrl] = useState(initialImage)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [compressionStats, setCompressionStats] = useState(null) // { original, compressed, percentage }
  
  // Contenido (bloques del editor)
  const [content, setContent] = useState(() => seedContentWithMetaBlocks(article?.content || [], article?.title || '', article?.subtitle || ''))
  
  // Estado de publicación
  const [isPublished, setIsPublished] = useState(article?.isPublished ?? article?.is_published ?? false)

  // Estados para dropdowns de badges
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  // Fecha/hora de publicación (permite programar)
  const toLocalDateTimeInputValue = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return ''
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const nowLocalDateTimeInputValue = () => {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
  }

  const [publishedAtLocal, setPublishedAtLocal] = useState(
    toLocalDateTimeInputValue(article?.published_at || article?.publishedAt || null) || nowLocalDateTimeInputValue()
  )

  // Si el artículo no trae read_time, calcularlo desde el contenido inicial
  useEffect(() => {
    const hasReadTime = Boolean(article?.read_time || article?.readTime)
    if (!hasReadTime && content?.length) {
      setReadTime(calculateReadTime(content))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const fileInputRef = useRef(null)

  // Evita doble scrollbar (page + modal) bloqueando el scroll del body
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'

    // Evita “layout shift” cuando desaparece la scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [])

  /**
   * Calcular tiempo de lectura automáticamente
   * Basado en 200 palabras por minuto (promedio de lectura en español)
   */
  const calculateReadTime = (contentBlocks) => {
    if (!contentBlocks || contentBlocks.length === 0) return '5 min'
    
    const totalText = contentBlocks
      .map(block => block.content || '')
      .join(' ')
    
    const wordCount = totalText.trim().split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    
    return `${Math.max(minutes, 1)} min`
  }

  const toSentenceCase = (raw) => {
    const t = String(raw ?? '').replace(/\s+/g, ' ').trim()
    if (!t) return ''
    const lower = t.toLocaleLowerCase('es-MX')
    const match = lower.match(/\p{L}/u)
    if (!match || typeof match.index !== 'number') return lower
    const i = match.index
    return lower.slice(0, i) + lower[i].toLocaleUpperCase('es-MX') + lower.slice(i + 1)
  }

  // Actualizar tiempo de lectura cuando cambia el contenido
  const handleContentChange = (newContent) => {
    setContent(newContent)

    const { extractedTitle, extractedSubtitle, body } = extractMetaFromContent(newContent)
    // Solo actualizar si hay valor extraído no vacío (evitar borrar título/subtítulo cuando usuario vacía bloques)
    if (extractedTitle && extractedTitle.trim() && extractedTitle !== title) setTitle(extractedTitle)
    if (extractedSubtitle && extractedSubtitle.trim() && extractedSubtitle !== subtitle) setSubtitle(extractedSubtitle)

    const calculatedTime = calculateReadTime(body)
    setReadTime(calculatedTime)
  }



  /**
   * Manejar selección de imagen
   */
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Importar dinámicamente las funciones de compresión
    const { compressImage, isValidImage, getImagePreview } = await import('../utils/imageCompression')

    // Validar imagen
    const validation = isValidImage(file)
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.error })
      return
    }

    const originalSize = file.size
    setUploadingImage(true)
    setMessage({ type: 'info', text: 'Comprimiendo imagen...' })

    try {
      // Comprimir imagen agresivamente (70-100KB)
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.70,
        type: 'image/webp',
        targetSizeKB: 100
      })

      const compressedSize = compressed.size
      const percentage = Math.round((1 - compressedSize / originalSize) * 100)

      setImageFile(compressed)
      setImagePreview(getImagePreview(compressed))
      setCompressionStats({
        original: (originalSize / 1024).toFixed(0), // KB
        compressed: (compressedSize / 1024).toFixed(0), // KB
        percentage
      })
      setMessage({ type: 'success', text: '✅ Imagen optimizada' })
    } catch (error) {
      console.error('Error comprimiendo imagen:', error)
      setMessage({ type: 'error', text: 'Error al procesar imagen' })
    } finally {
      setUploadingImage(false)
    }
  }

  /**
   * Subir imagen a Supabase Storage
   */
  const uploadImageToSupabase = async () => {
    if (!imageFile) return imageUrl

    try {
      const fileName = `blog-${Date.now()}-${imageFile.name}`
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      throw new Error('Error al subir imagen')
    }
  }

  /**
   * Guardar artículo en Supabase
   */
  const handleSave = async (publish = false) => {
    const { extractedTitle, extractedSubtitle, body } = extractMetaFromContent(content)
    const finalTitle = (extractedTitle || title).trim()
    const finalSubtitle = (extractedSubtitle || subtitle).trim()

    // Validaciones
    if (!finalTitle) {
      setMessage({ type: 'error', text: 'El título es obligatorio' })
      return
    }

    if (!Array.isArray(body) || body.length === 0) {
      setMessage({ type: 'error', text: 'El contenido no puede estar vacío' })
      return
    }

    setSaving(true)
    setMessage({ type: 'info', text: 'Guardando...' })

    try {
      // Subir imagen si hay una nueva
      let finalImageUrl = imageUrl
      if (imageFile) {
        setMessage({ type: 'info', text: 'Subiendo imagen...' })
        finalImageUrl = await uploadImageToSupabase()
      }

      // Preparar datos del artículo
      const finalIsPublished = publish ? true : isPublished

      const resolvePublishedAtIso = () => {
        if (!finalIsPublished) return null

        // IMPORTANTE: Si el artículo ya tenía fecha de publicación, mantenerla
        // Solo cambiar si el usuario explícitamente modificó el campo de fecha
        if (article?.published_at) {
          // Verificar si el usuario modificó la fecha manualmente
          const originalDate = toLocalDateTimeInputValue(article.published_at)
          if (publishedAtLocal && publishedAtLocal !== originalDate) {
            // Usuario cambió la fecha manualmente
            const asDate = new Date(publishedAtLocal)
            if (!Number.isNaN(asDate.getTime())) return asDate.toISOString()
          }
          // Mantener la fecha original
          return article.published_at
        }

        // Para artículos nuevos o sin fecha previa
        if (publishedAtLocal) {
          const asDate = new Date(publishedAtLocal)
          if (!Number.isNaN(asDate.getTime())) return asDate.toISOString()
        }

        // Si se está publicando ahora y no se eligió fecha, usar ahora
        if (publish) return new Date().toISOString()

        return null
      }

      const bodyWithSectionIcon = (Array.isArray(body) ? body : []).map((b) => {
        if (String(b?.type || '') !== 'heading') return b
        return { ...b, icon: sectionIcon }
      })

      const normalizedTitle = toSentenceCase(finalTitle)
      const normalizedSubtitle = toSentenceCase(finalSubtitle)
      const normalizedExcerpt = toSentenceCase(excerpt)

      const articleData = {
        title: normalizedTitle,
        subtitle: normalizedSubtitle,
        excerpt: normalizedExcerpt,
        author: author.trim(),
        category: category,
        accent: accent,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        read_time: readTime,
        language: language,
        image_url: finalImageUrl,
        content: bodyWithSectionIcon,
        is_published: finalIsPublished,
        published_at: resolvePublishedAtIso(),
        slug: generateSlug(normalizedTitle),
        updated_at: new Date().toISOString()
      }

      // Si es nuevo artículo, agregar created_at
      if (!article?.id) {
        articleData.created_at = new Date().toISOString()
      }

      const saveToSupabase = async (dataToSave) => {
        if (article?.id) {
          const { data, error } = await supabase
            .from('blog_articles')
            .update(dataToSave)
            .eq('id', article.id)
            .select()
            .single()
          if (error) throw error
          return data
        }

        const { data, error } = await supabase
          .from('blog_articles')
          .insert([dataToSave])
          .select()
          .single()
        if (error) throw error
        return data
      }

      // Guardar en Supabase (compat: si la columna 'accent' no existe, reintentar sin ella)
      let result
      try {
        result = await saveToSupabase(articleData)
      } catch (err) {
        const message = String(err?.message || '')
        const isAccentSchemaCache =
          message.includes("Could not find the 'accent' column") ||
          (message.toLowerCase().includes('accent') && message.toLowerCase().includes('schema cache'))

        if (!isAccentSchemaCache) throw err

        const { accent: _accent, ...fallbackData } = articleData
        result = await saveToSupabase(fallbackData)
      }

      setMessage({ 
        type: 'success', 
        text: publish ? '✅ Artículo publicado' : '✅ Artículo guardado como borrador' 
      })

      // Mantener el estado local consistente para siguientes guardados
      if (typeof finalImageUrl === 'string') {
        setImageUrl(finalImageUrl)
        if (imagePreview?.startsWith?.('blob:')) {
          const { revokeImagePreview } = await import('../utils/imageCompression')
          revokeImagePreview(imagePreview)
        }
        setImagePreview(finalImageUrl)
        setImageFile(null)
        setCompressionStats(null)
      }

      // Notificar al componente padre
      setTimeout(() => {
        onSave?.(result)
        onClose?.()
      }, 1000)

    } catch (error) {
      console.error('Error guardando artículo:', error)
      setMessage({ type: 'error', text: 'Error al guardar: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  /**
   * Generar slug del título
   */
  const generateSlug = (text) => {
    const raw = String(text || '').trim()
    if (!raw) return ''

    const stopwords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
      'de', 'del', 'al', 'y', 'o', 'u',
      'en', 'para', 'por', 'con', 'sin', 'sobre', 'entre', 'hacia', 'desde', 'hasta',
      'que', 'como', 'a', 'e'
    ])

    const normalized = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')

    const words = normalized
      .split(/\s+/g)
      .map((w) => w.trim())
      .filter(Boolean)

    const meaningful = words
      .filter((w) => w.length > 1)
      .filter((w) => !stopwords.has(w))

    const pick = (list) => {
      const maxWords = 6
      const maxLen = 60
      const out = []
      let len = 0

      for (const w of list) {
        if (!w) continue
        if (out.length >= maxWords) break
        const nextLen = len ? (len + 1 + w.length) : w.length
        if (out.length && nextLen > maxLen) break
        out.push(w)
        len = nextLen
      }

      return out.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }

    // Prefer meaningful words; fallback to all words.
    const pretty = pick(meaningful)
    if (pretty) return pretty
    return pick(words)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
      data-lenis-prevent-wheel
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="w-full p-4 md:p-8 my-32 md:my-36">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {article?.id ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h1>
                <p className="text-sm text-gray-400">
                  {article?.id ? `Editando ${article.slug}` : 'Crea un nuevo artículo de blog'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Guardar Borrador
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    message.type === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                    message.type === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                    'bg-blue-500/10 border border-blue-500/30'
                  }`}
                >
                  {message.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" /> :
                   message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /> :
                   <Loader className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-spin" />}
                  <p className={`text-sm ${
                    message.type === 'error' ? 'text-red-300' :
                    message.type === 'success' ? 'text-green-300' :
                    'text-blue-300'
                  }`}>
                    {message.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8">
            
            {/* Imagen Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Imagen Principal
              </label>
              
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Cambiar
                    </button>
                    <button
                      onClick={async () => {
                        setImageFile(null)
                        setImagePreview(null)
                        setImageUrl(null)
                        setCompressionStats(null)
                        if (imagePreview.startsWith('blob:')) {
                          const { revokeImagePreview } = await import('../utils/imageCompression')
                          revokeImagePreview(imagePreview)
                        }
                      }}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                  
                  {/* Mostrar estadísticas de compresión */}
                  {compressionStats && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-2 text-xs">
                        <Sparkles className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">
                          {compressionStats.original} KB → {compressionStats.compressed} KB
                        </span>
                        <span className="text-green-400 font-bold">
                          (-{compressionStats.percentage}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full h-64 border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-gray-300 transition-all disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader className="w-12 h-12 animate-spin text-purple-400" />
                      <span className="text-sm">Procesando imagen...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12" />
                      <span className="text-sm font-medium">Click para subir imagen</span>
                      <span className="text-xs">JPG, PNG, WEBP (máx. 10MB)</span>
                    </>
                  )}
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Badges interactivos arriba del título */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {/* Badge de Categoría Clickeable */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown)
                      setShowColorPicker(false)
                      setShowIconPicker(false)
                    }}
                    className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-xs text-white/90 uppercase tracking-wider font-medium hover:bg-black/80 transition-all cursor-pointer"
                  >
                    {category === 'philosophy' && 'Filosofía'}
                    {category === 'metaphysics' && 'Metafísica'}
                    {category === 'ontology' && 'Ontología'}
                    {category === 'epistemology' && 'Epistemología'}
                    {category === 'ethics' && 'Ética'}
                    {category === 'phenomenology' && 'Fenomenología'}
                    {category === 'hermeneutics' && 'Hermenéutica'}
                    {category === 'aesthetics' && 'Estética'}
                    {category === 'reflections' && 'Reflexiones'}
                    {category === 'diary' && 'Diario'}
                    {category === 'psychology' && 'Psicología'}
                    {category === 'psychoanalysis' && 'Psicoanálisis'}
                    {category === 'spirituality' && 'Espiritualidad'}
                    {category === 'poetry' && 'Poesía'}
                    {category === 'consciousness' && 'Consciencia'}
                    {category === 'perception' && 'Percepción'}
                    {category === 'existence' && 'Existencia'}
                  </button>

                  {/* Dropdown de categorías */}
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 z-50 bg-zinc-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-[200px]"
                      >
                        {[
                          { value: 'philosophy', label: 'Filosofía' },
                          { value: 'metaphysics', label: 'Metafísica' },
                          { value: 'ontology', label: 'Ontología' },
                          { value: 'epistemology', label: 'Epistemología' },
                          { value: 'ethics', label: 'Ética' },
                          { value: 'phenomenology', label: 'Fenomenología' },
                          { value: 'hermeneutics', label: 'Hermenéutica' },
                          { value: 'aesthetics', label: 'Estética' },
                          { value: 'reflections', label: 'Reflexiones' },
                          { value: 'diary', label: 'Diario' },
                          { value: 'psychology', label: 'Psicología' },
                          { value: 'psychoanalysis', label: 'Psicoanálisis' },
                          { value: 'spirituality', label: 'Espiritualidad' },
                          { value: 'poetry', label: 'Poesía' },
                          { value: 'consciousness', label: 'Consciencia' },
                          { value: 'perception', label: 'Percepción' },
                          { value: 'existence', label: 'Existencia' }
                        ].map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => {
                              setCategory(cat.value)
                              setShowCategoryDropdown(false)
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                              category === cat.value ? 'bg-white/5 text-purple-400' : 'text-white/80'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Botón circular de Color */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowColorPicker(!showColorPicker)
                      setShowCategoryDropdown(false)
                      setShowIconPicker(false)
                    }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 hover:scale-110 transition-transform border-2 border-white/30"
                    style={{
                      background: accent === 'purple' ? 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(217, 70, 239))' :
                                  accent === 'red' ? 'linear-gradient(to bottom right, rgb(239, 68, 68), rgb(220, 38, 38))' :
                                  accent === 'indigo' ? 'linear-gradient(to bottom right, rgb(99, 102, 241), rgb(79, 70, 229))' :
                                  accent === 'emerald' ? 'linear-gradient(to bottom right, rgb(16, 185, 129), rgb(5, 150, 105))' :
                                  accent === 'amber' ? 'linear-gradient(to bottom right, rgb(251, 191, 36), rgb(245, 158, 11))' :
                                  accent === 'blue' ? 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(37, 99, 235))' :
                                  accent === 'cyan' ? 'linear-gradient(to bottom right, rgb(6, 182, 212), rgb(14, 165, 233))' :
                                  accent === 'pink' ? 'linear-gradient(to bottom right, rgb(236, 72, 153), rgb(219, 39, 119))' :
                                  accent === 'orange' ? 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(234, 88, 12))' :
                                  'linear-gradient(to bottom right, rgb(100, 116, 139), rgb(71, 85, 105))'
                    }}
                  />

                  {/* Picker de colores */}
                  <AnimatePresence>
                    {showColorPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 z-50 bg-zinc-900 border border-white/20 rounded-xl shadow-2xl p-5 min-w-[260px]"
                      >
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { value: 'purple', gradient: 'from-purple-500 to-fuchsia-500' },
                            { value: 'red', gradient: 'from-red-500 to-red-600' },
                            { value: 'indigo', gradient: 'from-indigo-500 to-indigo-600' },
                            { value: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
                            { value: 'amber', gradient: 'from-amber-400 to-amber-500' },
                            { value: 'blue', gradient: 'from-blue-500 to-blue-600' },
                            { value: 'cyan', gradient: 'from-cyan-500 to-sky-500' },
                            { value: 'pink', gradient: 'from-pink-500 to-pink-600' },
                            { value: 'orange', gradient: 'from-orange-500 to-orange-600' },
                            { value: 'slate', gradient: 'from-slate-500 to-slate-600' }
                          ].map((color) => (
                            <button
                              key={color.value}
                              onClick={() => {
                                setAccent(color.value)
                                setShowColorPicker(false)
                              }}
                              className={`w-12 h-12 rounded-full bg-gradient-to-br ${color.gradient} hover:scale-110 transition-transform ${
                                accent === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''
                              }`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Botón circular de Ícono */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowIconPicker(!showIconPicker)
                      setShowCategoryDropdown(false)
                      setShowColorPicker(false)
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center"
                  >
                    {sectionIcon === 'crown' && <Crown className="w-4 h-4 text-white" />}
                    {sectionIcon === 'moon' && <Moon className="w-4 h-4 text-white" />}
                    {sectionIcon === 'sparkles' && <Sparkles className="w-4 h-4 text-white" />}
                    {sectionIcon === 'diamond' && <Diamond className="w-4 h-4 text-white" />}
                    {sectionIcon === 'star' && <Star className="w-4 h-4 text-white" />}
                    {sectionIcon === 'bookmark' && <Bookmark className="w-4 h-4 text-white" />}
                  </button>

                  {/* Picker de íconos */}
                  <AnimatePresence>
                    {showIconPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 z-50 bg-zinc-900 border border-white/20 rounded-xl shadow-2xl p-5 min-w-[220px]"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: 'crown', icon: Crown },
                            { value: 'moon', icon: Moon },
                            { value: 'sparkles', icon: Sparkles },
                            { value: 'diamond', icon: Diamond },
                            { value: 'star', icon: Star },
                            { value: 'bookmark', icon: Bookmark }
                          ].map(({ value, icon: Icon }) => (
                            <button
                              key={value}
                              onClick={() => {
                                setSectionIcon(value)
                                setShowIconPicker(false)
                              }}
                              className={`w-14 h-14 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center ${
                                sectionIcon === value ? 'ring-2 ring-purple-500' : ''
                              }`}
                            >
                              <Icon className="w-7 h-7 text-white" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Metadatos principales */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const text = e.currentTarget.textContent || ''
                    setTitle(text)
                  }}
                  data-placeholder="El título principal de tu artículo"
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white text-xl font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all min-h-[3rem] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600"
                >{title}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtítulo
                </label>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const text = e.currentTarget.textContent || ''
                    setSubtitle(text)
                  }}
                  data-placeholder="Un subtítulo descriptivo (opcional)"
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all min-h-[3rem] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600"
                >{subtitle}</div>
              </div>
            </div>

            {/* Divisor */}
            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Tag className="w-6 h-6 text-purple-400" />
                Configuración del Artículo
              </h3>
              
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Extracto/Descripción
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    onBlur={() => {
                      const next = toSentenceCase(excerpt)
                      if (next !== excerpt) setExcerpt(next)
                    }}
                    placeholder="Breve descripción que aparecerá en la vista previa"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Contenido del Artículo
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Pega tu contenido de GPT o escribe directamente. El editor detectará automáticamente títulos y estructura.
              </p>
              
              <RichTextEditor
                initialContent={content}
                onChange={handleContentChange}
                showAddBlockButton={false}
                mode="document"
                accent={accent}
                sectionIcon={sectionIcon}
              />

              {/* Acciones al final (para no tener que volver arriba) */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Guardar Borrador
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  )
}
