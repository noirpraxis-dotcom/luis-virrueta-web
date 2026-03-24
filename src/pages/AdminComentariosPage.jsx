import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllBlogComments, moderateBlogComment, deleteBlogComment } from '../lib/supabase'
import { MessageSquare, Check, X, Trash2, ArrowLeft, Star, Filter } from 'lucide-react'

export default function AdminComentariosPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    loadComments()
  }, [isAdmin, filter])

  const loadComments = async () => {
    setLoading(true)
    const data = await getAllBlogComments(filter === 'all' ? null : filter)
    setComments(data)
    setLoading(false)
  }

  const handleModerate = async (commentId, status) => {
    setActionLoading(commentId)
    await moderateBlogComment(commentId, status)
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, status } : c))
    setActionLoading(null)
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('¿Eliminar este comentario permanentemente?')) return
    setActionLoading(commentId)
    await deleteBlogComment(commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
    setActionLoading(null)
  }

  if (!isAdmin) return null

  const filters = [
    { key: 'pending', label: 'Pendientes', color: 'amber' },
    { key: 'approved', label: 'Aprobados', color: 'green' },
    { key: 'rejected', label: 'Rechazados', color: 'red' },
    { key: 'all', label: 'Todos', color: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Comentarios del Blog</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? f.color === 'amber' ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50'
                  : f.color === 'green' ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/50'
                  : f.color === 'red' ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/50'
                  : 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                <div className="h-3 bg-white/10 rounded w-full mb-2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay comentarios {filter !== 'all' ? `con estado "${filters.find(f => f.key === filter)?.label}"` : ''}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div
                key={comment.id}
                className={`bg-white/5 rounded-xl p-5 border transition-all ${
                  comment.status === 'pending' ? 'border-amber-500/30'
                  : comment.status === 'rejected' ? 'border-red-500/30 opacity-60'
                  : 'border-white/10'
                }`}
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {comment.user_photo ? (
                      <img src={comment.user_photo} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-sm text-purple-300">
                        {comment.user_name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">{comment.user_name}</p>
                      <p className="text-gray-500 text-xs">
                        {comment.created_at?.toDate?.()
                          ? comment.created_at.toDate().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Status badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      comment.status === 'pending' ? 'bg-amber-500/20 text-amber-300'
                      : comment.status === 'approved' ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                    }`}>
                      {comment.status === 'pending' ? 'Pendiente' : comment.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                    </span>
                  </div>
                </div>

                {/* Article link */}
                {comment.slug && (
                  <Link to={`/blog/${comment.slug}`} className="text-purple-400 text-xs hover:underline mb-2 block">
                    /blog/{comment.slug}
                  </Link>
                )}

                {/* Rating */}
                {comment.rating > 0 && (
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= comment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                )}

                {/* Content */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{comment.content}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => handleModerate(comment.id, 'approved')}
                      disabled={actionLoading === comment.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> Aprobar
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerate(comment.id, 'rejected')}
                      disabled={actionLoading === comment.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" /> Rechazar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={actionLoading === comment.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 text-xs transition-colors disabled:opacity-50 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
