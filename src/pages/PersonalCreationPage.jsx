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
      {/* Hero Header - Elegant white background like About */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-5xl lg:text-6xl font-light text-stone-800 mb-6 tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
            >
              Personal Creation
            </h1>
            <GradientLine />
            <p className="text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mt-8">
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

// Books Section
const BooksSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const navigate = useNavigate()

  const books = [
    {
      id: 'invisible-revolutions',
      title: 'Invisible Revolutions',
      subtitle: 'A Journey of Transformation',
      description: 'Discover the power of inner change and how small shifts in consciousness can create profound transformations in your life and the world around you.',
      cover: '/book-cover-1.jpg',
      pages: 256,
      year: 2023
    },
    {
      id: 'healing-with-energy',
      title: 'Healing with Energy',
      subtitle: 'Ancient Wisdom for Modern Times',
      description: 'A comprehensive guide to understanding and working with subtle energies for healing, personal growth, and spiritual awakening.',
      cover: '/book-cover-2.jpg',
      pages: 312,
      year: 2024
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 
          className="text-4xl lg:text-5xl font-light text-stone-800 mb-6 tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
        >
          My Books
        </h2>
        <GradientLine />
        <p className="text-stone-600 text-lg mt-6 max-w-2xl mx-auto">
          Each book is an offering of knowledge, experience, and love. Choose what resonates with you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <BackdropBlurCard className="h-full border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-20 h-20 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-amber-600 font-medium">Book Cover Placeholder</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-stone-700 text-sm font-medium">{book.year}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                  {book.title}
                </h3>
                <p className="text-amber-600 text-sm font-medium mb-4 italic">
                  {book.subtitle}
                </p>
                <p className="text-stone-600 leading-relaxed mb-4">
                  {book.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-stone-500 mb-6">
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
                    <span>Available worldwide</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/books/${book.id}`)}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-600 text-white py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
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

      <div className="mt-12 text-center">
        <p className="text-stone-500 text-sm max-w-2xl mx-auto leading-relaxed">
          These books are offered with love and trust in your generosity. Pay what feels right for you - every contribution supports my work and helps these teachings reach more people.
        </p>
      </div>
    </div>
  )
}

export default PersonalCreationPage
