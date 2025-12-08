import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, TrendingUp } from 'lucide-react'

const RelatedArticles = ({ currentSlug, allArticles }) => {
  // Filtrar artículos relacionados (excluir el actual y mostrar máximo 3)
  const related = allArticles
    .filter(article => article.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="relative py-16 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-white">
              Sigue Leyendo
            </h3>
          </div>
          <p className="text-white/60 text-sm">
            Más contenido que te puede interesar
          </p>
        </motion.div>

        {/* Articles grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((article, index) => (
            <Link key={article.slug} to={`/blog/${article.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 h-full flex flex-col"
              >
                {/* Image */}
                <div className={`aspect-video bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                  {article.image && (
                    <img 
                      src={article.image} 
                      alt={article.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {/* Overlay oscuro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-md rounded-full border border-yellow-500/30 z-10">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-bold text-white">{article.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-purple-400 transition-all leading-tight line-clamp-2">
                    {article.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                    <span className="text-xs font-medium">Leer más</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Gradient line on hover */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${article.borderGradient} origin-left`}
                />
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedArticles
