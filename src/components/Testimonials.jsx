import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

const Testimonials = () => {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoPlayRef = useRef(null)

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.testimonial1.name'),
      location: t('testimonials.testimonial1.location'),
      text: t('testimonials.testimonial1.text'),
      image: '/testimonial-1.jpg',
      service: t('testimonials.testimonial1.service')
    },
    {
      id: 2,
      name: t('testimonials.testimonial2.name'),
      location: t('testimonials.testimonial2.location'),
      text: t('testimonials.testimonial2.text'),
      image: '/testimonial-2.jpg',
      service: t('testimonials.testimonial2.service')
    },
    {
      id: 3,
      name: t('testimonials.testimonial3.name'),
      location: t('testimonials.testimonial3.location'),
      text: t('testimonials.testimonial3.text'),
      image: '/testimonial-3.jpg',
      service: t('testimonials.testimonial3.service')
    }
  ]

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity
  }

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(() => {
      if (!isTransitioning) {
        paginate(1)
      }
    }, 6000)
  }

  const paginate = (newDirection) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return (prevIndex + 1) % testimonials.length
      }
      return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    })
    resetAutoPlay()
    
    setTimeout(() => setIsTransitioning(false), 400)
  }

  // Auto-advance carousel
  useEffect(() => {
    resetAutoPlay()
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  return (
    <section className="relative py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-br from-stone-50 via-[#8dc1ab]/8 to-stone-100 overflow-hidden">
      {/* Decorative blur effects - soft green tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#8dc1ab]/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.02, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#7ab09a]/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Title - Elegant Style matching CallToActionSection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.h2
            className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('testimonials.title')}
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mb-10"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-stone-600 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative min-h-[700px] lg:min-h-[600px] flex items-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.4, ease: "easeInOut" },
                opacity: { duration: 0.3 },
                scale: { duration: 0.4, ease: "easeInOut" }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              className="absolute inset-0 w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start lg:items-center h-full px-4 lg:px-0">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-1 max-w-md mx-auto lg:mx-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8dc1ab]/20 via-[#8dc1ab]/10 to-stone-100 flex items-center justify-center">
                    <div className="text-center p-12">
                      <svg className="w-24 h-24 text-stone-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-stone-500 text-sm">Photo placeholder</p>
                      <p className="text-stone-400 text-xs mt-1">{testimonials[currentIndex].name}</p>
                    </div>
                  </div>
                  
                  {/* Service Badge */}
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full border border-[#8dc1ab]/30">
                    <p className="text-[#7ab09a] text-sm font-medium tracking-wide">
                      {testimonials[currentIndex].service}
                    </p>
                  </div>
                </motion.div>

                {/* Testimonial Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="order-2 lg:order-2"
                >
                  {/* Quote Icon */}
                  <svg className="w-12 h-12 text-[#8dc1ab] mb-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  {/* Testimonial Text */}
                  <p className="text-stone-700 text-base lg:text-lg leading-relaxed mb-8" style={{ fontFamily: 'Gotham, sans-serif', fontWeight: '300' }}>
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Author Info */}
                  <div className="border-l-4 border-[#8dc1ab] pl-6">
                    <p className="text-stone-800 font-medium text-lg mb-1" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-stone-500 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows - Desktop & Mobile */}
        <div className="flex absolute top-1/2 -translate-y-1/2 left-2 right-2 lg:left-0 lg:right-0 justify-between pointer-events-none z-10 max-w-7xl mx-auto px-0 lg:px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            disabled={isTransitioning}
            className="pointer-events-auto w-12 h-12 lg:w-14 lg:h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-[#8dc1ab]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#8dc1ab]/20"
          >
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-[#7ab09a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              disabled={isTransitioning}
              className="pointer-events-auto w-12 h-12 lg:w-14 lg:h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-[#8dc1ab]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#8dc1ab]/20"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-[#7ab09a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setDirection(index > currentIndex ? 1 : -1)
                  setIsTransitioning(true)
                  setCurrentIndex(index)
                  resetAutoPlay()
                  setTimeout(() => setIsTransitioning(false), 400)
                }
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-[#8dc1ab]'
                  : 'w-2 h-2 bg-stone-300 hover:bg-[#7ab09a]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
