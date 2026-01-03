import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Save, Eye, Image as ImageIcon, Upload, Loader, 
  Calendar, Clock, Tag, Globe, Sparkles, ArrowLeft,
  AlertCircle, CheckCircle, Trash2, User
} from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import { compressImage, isValidImage, getImagePreview, revokeImagePreview } from '../utils/imageCompression'
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
  
  // Metadatos del artículo
  const [title, setTitle] = useState(article?.title || '')
  const [subtitle, setSubtitle] = useState(article?.subtitle || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [author, setAuthor] = useState(article?.author || 'Luis Virrueta')
  const [category, setCategory] = useState(article?.category || 'philosophy')
  const [tags, setTags] = useState(article?.tags?.join(', ') || '')
  const [readTime, setReadTime] = useState(article?.readTime || '15 min')
  const [language, setLanguage] = useState(article?.language || 'es')
  
  // Imagen
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(article?.image || null)
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Contenido (bloques del editor)
  const [content, setContent] = useState(article?.content || [])
  
  // Estado de publicación
  const [isPublished, setIsPublished] = useState(article?.isPublished ?? true)
  
  const fileInputRef = useRef(null)

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

  // Actualizar tiempo de lectura cuando cambia el contenido
  const handleContentChange = (newContent) => {
    setContent(newContent)
    const calculatedTime = calculateReadTime(newContent)
    setReadTime(calculatedTime)
  }

  /**
   * Manejar selección de imagen
   */
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar imagen
    const validation = isValidImage(file)
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.error })
      return
    }

    setUploadingImage(true)
    setMessage({ type: 'info', text: 'Comprimiendo imagen...' })

    try {
      // Comprimir imagen
      const compressed = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        type: 'image/webp'
      })

      setImageFile(compressed)
      setImagePreview(getImagePreview(compressed))
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
    // Validaciones
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'El título es obligatorio' })
      return
    }

    if (!excerpt.trim()) {
      setMessage({ type: 'error', text: 'El extracto es obligatorio' })
      return
    }

    if (content.length === 0) {
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
      const articleData = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        excerpt: excerpt.trim(),
        author: author.trim(),
        category: category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        read_time: readTime,
        language: language,
        image_url: finalImageUrl,
        content: content,
        is_published: publish ? true : isPublished,
        slug: generateSlug(title),
        updated_at: new Date().toISOString()
      }

      // Si es nuevo artículo, agregar created_at
      if (!article?.id) {
        articleData.created_at = new Date().toISOString()
        articleData.published_at = publish ? new Date().toISOString() : null
      }

      // Guardar en Supabase
      let result
      if (article?.id) {
        // Actualizar artículo existente
        const { data, error } = await supabase
          .from('blog_articles')
          .update(articleData)
          .eq('id', article.id)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // Crear nuevo artículo
        const { data, error } = await supabase
          .from('blog_articles')
          .insert([articleData])
          .select()
          .single()

        if (error) throw error
        result = data
      }

      setMessage({ 
        type: 'success', 
        text: publish ? '✅ Artículo publicado' : '✅ Artículo guardado como borrador' 
      })

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
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .trim()
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto"
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-6 shadow-2xl">
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
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                        if (imagePreview.startsWith('blob:')) {
                          revokeImagePreview(imagePreview)
                        }
                      }}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
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

            {/* Metadatos principales */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="El título principal de tu artículo"
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white text-xl font-bold placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Un subtítulo descriptivo (opcional)"
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Extracto/Descripción *
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descripción que aparecerá en la vista previa"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
              </div>

              {/* Grid de metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Autor
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Tiempo de Lectura <span className="text-xs text-purple-400">(Automático)</span>
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    readOnly
                    placeholder="Se calcula automáticamente"
                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-600 cursor-not-allowed opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="philosophy">Filosofía</option>
                    <option value="psychology">Psicología</option>
                    <option value="psychoanalysis">Psicoanálisis</option>
                    <option value="spirituality">Espiritualidad</option>
                    <option value="consciousness">Consciencia</option>
                    <option value="perception">Percepción</option>
                    <option value="ai">Inteligencia Artificial</option>
                    <option value="neuroscience">Neurociencia</option>
                    <option value="branding">Branding</option>
                    <option value="personal-development">Desarrollo Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Idioma
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (separados por comas)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="filosofía, mente, consciencia"
                  className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                />
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
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
