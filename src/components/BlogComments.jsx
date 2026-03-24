import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, Shield, Check, X, MessageSquare, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { addBlogComment, getBlogComments, moderateBlogComment, deleteBlogComment } from '../lib/supabase'

const BlogComments = ({ slug }) => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [slug, isAdmin])

  const loadComments = async () => {
    setLoading(true)
    const data = await getBlogComments(slug, isAdmin)
    setComments(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setSubmitting(true)
    const result = await addBlogComment({
      slug,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Anónimo',
      userPhoto: user.photoURL || null,
      content: content.trim(),
      rating
    })

    if (result) {
      setContent('')
      setRating(0)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
      await loadComments()
    }
    setSubmitting(false)
  }

  const handleModerate = async (commentId, status) => {
    await moderateBlogComment(commentId, status)
    await loadComments()
  }

  const handleDelete = async (commentId) => {
    await deleteBlogComment(commentId)
    await loadComments()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              ¿Qué te pareció este artículo?
            </h3>
            <p className="text-sm text-white/50 mt-0.5">Tu opinión nos ayuda a seguir creando contenido de valor</p>
          </div>
        </div>

        {/* Comment Form */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-medium text-purple-300">
                  {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm text-white font-medium">{user.displayName || user.email?.split('@')[0]}</p>
                <p className="text-xs text-white/40">Publicando como tú</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xs text-white/40 mr-2">Calificación:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && <span className="text-xs text-amber-400/70 ml-2">{rating}/5</span>}
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu comentario..."
                rows={3}
                maxLength={1000}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500/40 resize-none text-sm"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/30">{content.length}/1000</span>
                <button
                  type="submit"
                  disabled={!content.trim() || submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Enviando...' : 'Publicar'}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Comentario enviado — será visible una vez aprobado
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 text-center"
          >
            <p className="text-white/60 mb-4 text-sm">Inicia sesión o crea una cuenta para dejar tu comentario</p>
            <button
              onClick={() => navigate('/registro')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all"
            >
              Iniciar sesión / Registrarse
            </button>
          </motion.div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-white/[0.02] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/5" />
                  <div className="w-24 h-3 bg-white/5 rounded" />
                </div>
                <div className="w-full h-3 bg-white/5 rounded mb-2" />
                <div className="w-2/3 h-3 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/[0.02] border rounded-xl p-5 ${
                  comment.status === 'pending' ? 'border-amber-500/20 bg-amber-500/[0.02]' :
                  comment.status === 'rejected' ? 'border-red-500/20 bg-red-500/[0.02] opacity-50' :
                  'border-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {comment.user_photo ? (
                      <img src={comment.user_photo} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center text-xs font-medium text-purple-300">
                        {(comment.user_name || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-white font-medium">{comment.user_name}</p>
                      <div className="flex items-center gap-2">
                        {comment.rating > 0 && (
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3 h-3 ${s <= comment.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                            ))}
                          </div>
                        )}
                        <span className="text-[11px] text-white/30">{formatDate(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin moderation */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {comment.status === 'pending' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mr-1">
                          Pendiente
                        </span>
                      )}
                      {comment.status !== 'approved' && (
                        <button
                          onClick={() => handleModerate(comment.id, 'approved')}
                          className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="Aprobar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {comment.status !== 'rejected' && (
                        <button
                          onClick={() => handleModerate(comment.id, 'rejected')}
                          className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Rechazar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-white/70 mt-3 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Sé el primero en comentar</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogComments
