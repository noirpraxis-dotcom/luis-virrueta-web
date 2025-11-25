import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const PersonalCreationPage = () => {
  const { t } = useLanguage()
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
      {/* Hero Header - Elegant Introduction */}
      <section className="relative py-32 lg:py-40 px-6 lg:px-20 bg-white">
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
              className="text-stone-800 font-light tracking-[0.2em] mb-8"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              <div className="text-3xl lg:text-4xl mb-2 opacity-60">PERSONAL</div>
              <div className="text-6xl lg:text-8xl">CREATION</div>
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mb-12"
            />
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-stone-900 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed mb-8 font-normal"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              {t('personalCreation.intro')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="max-w-4xl mx-auto space-y-6 mb-12"
            >
              <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
                {t('personalCreation.paragraph1')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="relative max-w-3xl mx-auto"
            >
              <div className="border-l-2 border-amber-600/30 pl-6 py-4">
                <p className="text-lg lg:text-xl text-stone-600 leading-relaxed italic mb-3">
                  "{t('personalCreation.quote')}"
                </p>
                <p 
                  className="text-sm text-amber-700 font-light tracking-wider"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  — {t('personalCreation.quoteAuthor')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Books Section */}
      <section id="books" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <BooksSection />
      </section>

      {/* Music Section */}
      <section id="music" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-white to-stone-50">
        <MusicSection />
      </section>
    </div>
  )
}

// Books Section - RESTORED ORIGINAL LAYOUT
const BooksSection = () => {
  const { t } = useLanguage()
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        className="text-center mb-20 lg:mb-24"
      >
        {/* Decorative element above title */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
        />

        <h2 
          className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 tracking-[0.15em]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          My <span className="italic text-amber-700">Books</span>
        </h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-stone-700 text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed"
        >
          Words that illuminate the path to healing and self-discovery.
          <br className="hidden lg:block" />
          Each book is a gift, freely shared with those who seek wisdom.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-12"
        />
      </motion.div>

      {/* Books Grid */}
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="space-y-8 lg:space-y-10">
          {books.map((book) => (
            <motion.div
              key={book.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-stone-200/50 hover:border-[#8dc1ab]/30 transition-all duration-700 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-0">
                  {/* Book Cover */}
                  <div className="h-64 md:h-full bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <svg className="w-16 h-16 text-amber-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-amber-600 font-medium text-sm" style={{ fontFamily: 'Gotham, sans-serif' }}>Book Cover</p>
                      </div>
                    </div>

                    {book.featured && (
                      <div className="absolute top-4 right-4 bg-[#8dc1ab] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg" style={{ fontFamily: 'Gotham, sans-serif' }}>
                        {t('books.featured')}
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <h3 className="text-3xl lg:text-4xl font-light text-stone-800 mb-3 tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {book.title}
                    </h3>
                    
                    <p className="text-amber-700 text-lg font-light italic mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {book.subtitle}
                    </p>

                    <div className="h-px bg-gradient-to-r from-[#8dc1ab]/30 via-[#8dc1ab]/20 to-transparent w-24 mb-5" />

                    <p className="text-stone-700 text-base lg:text-lg leading-relaxed mb-6" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      {book.description}
                    </p>

                    {/* Book Details */}
                    <div className="flex items-center gap-6 text-sm text-stone-600 mb-6">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#8dc1ab]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span style={{ fontFamily: 'Gotham, sans-serif' }}>{book.pages} pages</span>
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
                      className="w-full bg-gradient-to-r from-[#8dc1ab] to-[#7ab09a] text-white py-4 rounded-2xl font-medium hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-2 shadow-xl tracking-wider"
                      style={{ fontFamily: 'Gotham, sans-serif', letterSpacing: '0.1em' }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t('books.readMoreSupport')}
                    </motion.button>
                  </div>
                </div>
              </div>
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

// Music Section - YouTube Videos Integration - PREMIUM DESIGN
const MusicSection = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  // Featured videos from your YouTube channel
  const videos = [
    {
      id: 'mc2cOVnPBIY',
      title: 'Soul Journey',
      description: 'An intimate vocal expression channeling healing frequencies through sacred sound and intention.'
    },
    {
      id: '9d1ALXBay_w',
      title: 'Celestial Harmonies',
      description: 'Ethereal melodies woven with light codes, designed to elevate consciousness and restore inner balance.'
    },
    {
      id: 'U-yQzUeB-4s',
      title: 'Healing Resonance',
      description: 'Vibrational sound medicine that penetrates the heart space, releasing blockages and inviting peace.'
    },
    {
      id: 'lLJji7_W1ZU',
      title: 'Voice of Light',
      description: 'Pure vocal transmission carrying ancient wisdom and transformative energy for the awakened soul.'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section - PREMIUM */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        className="text-center mb-20 lg:mb-24"
      >
        {/* Decorative element above title */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
        />

        <h2 
          className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 tracking-[0.15em]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Musical <span className="italic text-amber-700">Offerings</span>
        </h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-stone-700 text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed"
        >
          Sacred sounds and vocal transmissions crafted to touch the soul,
          <br className="hidden lg:block" />
          heal the heart, and elevate the spirit through divine frequencies.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-12"
        />
      </motion.div>

      {/* Videos Grid - Horizontal Premium Design */}
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="space-y-8 lg:space-y-10"
      >
        {videos.map((video, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="group"
          >
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-stone-200/50 hover:border-[#8dc1ab]/30 transition-all duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-0">
                {/* YouTube Video Embed */}
                <div className="relative aspect-video lg:aspect-[4/3] bg-gradient-to-br from-stone-100 to-[#8dc1ab]/5 overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Video Info - Horizontal Layout */}
                <div className="relative p-8 lg:p-10 flex flex-col justify-center">
                  <div className="h-px bg-gradient-to-r from-[#8dc1ab]/40 via-[#8dc1ab]/20 to-transparent w-20 mb-6" />

                  <h3 
                    className="text-2xl lg:text-3xl font-light text-stone-800 mb-5 tracking-wide group-hover:text-[#8dc1ab] transition-colors duration-500 leading-tight"
                    style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.02em' }}
                  >
                    {video.title}
                  </h3>
                  
                  <p className="text-stone-700 leading-relaxed text-base lg:text-lg" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    {video.description}
                  </p>

                  {/* Decorative dots */}
                  <div className="flex gap-1.5 mt-6 opacity-40">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-[#8dc1ab] rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Subtle glow effect on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-t from-[#8dc1ab]/5 to-transparent pointer-events-none"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Link to Full YouTube Channel - PREMIUM */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 lg:mt-24 text-center"
      >
        {/* Decorative element above button */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-48 mb-12"
        />

        <motion.a
          href="https://www.youtube.com/@lasun7929/videos"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-full font-light text-lg tracking-wide hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 group"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>Explore Full Collection</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="text-stone-500 text-lg font-light max-w-2xl mx-auto leading-relaxed mt-10"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Subscribe to receive new musical transmissions and continue
          <br className="hidden lg:block" />
          your journey through the realm of healing sound.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default PersonalCreationPage
