import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CinematicTitle, GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'

const BooksPage = () => {
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
            <CinematicTitle>My Books</CinematicTitle>
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
                  <div className="relative aspect-[2/3] bg-gradient-to-br from-emerald-400/20 to-amber-400/20 overflow-hidden">
                    {/* Placeholder para imagen - reemplazar con <img> cuando tengas la portada */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">📖</div>
                        <p className="text-stone-400 text-sm">Cover coming soon</p>
                      </div>
                    </div>
                    
                    {book.featured && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
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
                      <span className="flex items-center gap-1">
                        📄 {book.pages} pages
                      </span>
                      <span className="flex items-center gap-1">
                        🌍 {book.language}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      onClick={() => navigate(`/books/${book.id}`)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-lg font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                    >
                      Get Your Free Copy + Support 🌱
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
                More books coming soon...
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  )
}

export default BooksPage
