import { motion } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, Heart, Reply, MoreHorizontal } from 'lucide-react'

// Comentarios temporales realistas
const tempComments = [
  {
    id: 1,
    author: 'María González',
    avatar: 'MG',
    date: 'Hace 2 días',
    comment: 'Excelente artículo, Luis. La forma en que explicas los conceptos de neurociencia aplicados al diseño es simplemente brillante. Ya estoy implementando algunas de estas estrategias en mi agencia.',
    likes: 24,
    gradient: 'from-purple-500 to-fuchsia-500'
  },
  {
    id: 2,
    author: 'Carlos Mendoza',
    avatar: 'CM',
    date: 'Hace 5 días',
    comment: 'Como psicólogo especializado en branding, puedo confirmar que todo lo que mencionas está respaldado por investigación sólida. El punto sobre la amígdala y la activación emocional es clave. ¿Tienes algún paper que recomiendos sobre esto?',
    likes: 18,
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 3,
    author: 'Ana Sofía Reyes',
    avatar: 'AR',
    date: 'Hace 1 semana',
    comment: 'Me encanta este enfoque Psych × Design × Tech. Es exactamente lo que hace falta en la industria. La mayoría de diseñadores ignoran completamente la psicología y se quedan en lo superficial.',
    likes: 31,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    id: 4,
    author: 'Roberto Jiménez',
    avatar: 'RJ',
    date: 'Hace 1 semana',
    comment: 'Contenido de alto nivel. La explicación del córtex visual y el procesamiento de imágenes vs texto me voló la mente. Definitivamente voy a aplicar la "prueba de los 3 segundos" con mis clientes.',
    likes: 15,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 5,
    author: 'Daniela Torres',
    avatar: 'DT',
    date: 'Hace 2 semanas',
    comment: 'Luis, tus artículos son oro puro. He estado siguiendo tu trabajo desde hace meses y cada publicación eleva mi comprensión del diseño. ¿Cuándo lanzas ese curso que mencionaste en Instagram?',
    likes: 27,
    gradient: 'from-rose-500 to-pink-500'
  }
]

const CommentsSection = ({ articleTitle }) => {
  const [comments] = useState(tempComments)
  const [likedComments, setLikedComments] = useState([])

  const handleLike = (commentId) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter(id => id !== commentId))
    } else {
      setLikedComments([...likedComments, commentId])
    }
  }

  return (
    <section className="relative py-16 px-6 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-white">
              Comentarios
            </h3>
          </div>
          <p className="text-white/60 text-sm">
            {comments.length} personas están participando en esta conversación
          </p>
        </motion.div>

        {/* Comments list */}
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
            >
              {/* Gradient accent on hover */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${comment.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl`} />
              
              <div className="flex gap-4">
                {/* Avatar */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${comment.gradient} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{comment.avatar}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Author & Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-semibold text-sm">{comment.author}</h4>
                      <span className="text-white/40 text-xs">{comment.date}</span>
                    </div>
                    <button className="text-white/40 hover:text-white/60 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Comment text */}
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {comment.comment}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={() => handleLike(comment.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                        likedComments.includes(comment.id)
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-white/5 text-white/60 hover:text-white/80 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        fill={likedComments.includes(comment.id) ? 'currentColor' : 'none'}
                      />
                      <span className="text-xs font-medium">
                        {comment.likes + (likedComments.includes(comment.id) ? 1 : 0)}
                      </span>
                    </motion.button>

                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <Reply className="w-4 h-4" />
                      <span className="text-xs font-medium">Responder</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add comment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
        >
          <p className="text-white/70 text-center mb-4">
            ¿Tienes algo que agregar a la conversación?
          </p>
          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-purple-500/20">
            Unirse a la Discusión
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default CommentsSection
