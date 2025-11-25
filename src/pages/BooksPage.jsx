import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const BooksPage = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  // Datos de libros - aquí puedes agregar más libros
  const books = [
    {
      id: 'the-journey-within',
      title: 'The Journey Within',
      subtitle: 'A Guide to Self-Discovery',
      description: 'Explore the depths of your consciousness and unlock your inner potential through guided practices and profound insights.',
      coverImage: '/book-cover-1.jpg', // Placeholder - reemplazar con imagen real
      featured: true,
      pages: 240,
      language: 'English'
    },
    // Agregar más libros aquí según necesites
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative pt-32 pb-20 px-6 lg:px-20"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-6xl font-light text-stone-800 mb-6 tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              My Books
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Words that illuminate the path to healing and self-discovery. 
            Each book is a gift, freely shared with those who seek wisdom.
          </motion.p>

          <GradientLine className="mt-12" />
        </div>
      </motion.section>

      {/* Books Grid */}
      <motion.section
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="pb-32 px-6 lg:px-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {books.map((book) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <BackdropBlurCard className="h-full overflow-hidden">
                  {/* Book Cover */}
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-emerald-400/20 to-amber-400/20 overflow-hidden">
                    {/* Placeholder para imagen - reemplazar con <img> cuando tengas la portada */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <svg className="w-16 h-16 text-stone-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-stone-400 text-sm">{t('books.coverComingSoon')}</p>
                      </div>
                    </div>
                    
                    {book.featured && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {t('books.featured')}
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-6 lg:p-8">
                    <h3 
                      className="text-2xl lg:text-3xl font-light text-stone-800 mb-2"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {book.title}
                    </h3>
                    
                    {book.subtitle && (
                      <p className="text-sm text-emerald-600 mb-4 font-medium tracking-wide">
                        {book.subtitle}
                      </p>
                    )}

                    <p className="text-stone-600 mb-6 leading-relaxed">
                      {book.description}
                    </p>

                    {/* Book Details */}
                    <div className="flex gap-4 mb-6 text-xs text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {book.pages} pages
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {book.language}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      onClick={() => navigate(`/books/${book.id}`)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-lg font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t('books.ctaButton')}
                    </motion.button>
                  </div>
                </BackdropBlurCard>
              </motion.div>
            ))}
          </div>

          {/* Empty State Message if no books */}
          {books.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-20"
            >
              <p className="text-stone-400 text-lg">
                {t('books.comingSoon')}
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  )
}

export default BooksPage
