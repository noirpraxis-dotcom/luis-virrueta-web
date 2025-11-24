import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'

const PersonalCreationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Scroll to section on mount if hash is present
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Same style as STORE */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="text-stone-800 text-6xl lg:text-8xl font-light tracking-[0.2em] mb-8"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              PERSONAL CREATION
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mb-8"
            />
            
            <p className="text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Explore my books, writings, and creative projects that share wisdom and inspiration for your spiritual journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Books Section */}
      <section id="books" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <BooksSection />
      </section>
    </div>
  )
}

// Books Section - RESTORED ORIGINAL LAYOUT
const BooksSection = () => {
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  const books = [
    {
      id: 'the-journey-within',
      title: 'The Journey Within',
      subtitle: 'A Guide to Self-Discovery',
      description: 'Explore the depths of your consciousness and unlock your inner potential through guided practices and profound insights.',
      coverImage: '/book-cover-1.jpg',
      featured: true,
      pages: 240,
      language: 'English'
    },
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
    <div className="max-w-7xl mx-auto">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-16"
      >
        <h2 
          className="text-4xl lg:text-5xl font-light text-stone-800 mb-6 tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
        >
          My Books
        </h2>
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
      </motion.div>

      {/* Books Grid */}
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
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
                <div className="h-96 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-hidden">
                  {/* Placeholder for book cover */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <svg className="w-20 h-20 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-amber-600 font-medium text-sm">Book Cover Placeholder</p>
                      <p className="text-amber-500 text-xs mt-1">Add your book cover image</p>
                    </div>
                  </div>

                  {book.featured && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-stone-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {book.title}
                  </h3>
                  
                  <p className="text-amber-600 text-sm font-medium italic mb-4">
                    {book.subtitle}
                  </p>

                  <p className="text-stone-600 leading-relaxed mb-6">
                    {book.description}
                  </p>

                  {/* Book Details */}
                  <div className="flex items-center gap-4 text-sm text-stone-500 mb-6 pb-6 border-b border-stone-200">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{book.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{book.language}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => navigate(`/books/${book.id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Read More & Support
                  </motion.button>
                </div>
              </BackdropBlurCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Note about donations */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-stone-500 italic max-w-2xl mx-auto leading-relaxed">
          These books are offered with love and trust in your generosity. Pay what feels right for you.
        </p>
      </motion.div>
    </div>
  )
}

export default PersonalCreationPage
