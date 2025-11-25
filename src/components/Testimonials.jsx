import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoPlayRef = useRef(null)

  const testimonials = [
    {
      id: 1,
      name: 'Rodrigo J.',
      location: 'Santiago de Chile',
      text: 'I gave myself completely to the past life experience. Zuzana inspired me a lot of confidence, I felt at all times her professionalism and the love she gives. The experience is so real - I could see in great detail the stages of a previous life and feel the contact with my spiritual guide. At the end I was very ecstatic with the experience, I just wanted it to have an impact on me. To this day I still reflect on what I experienced. I am able to understand many aspects of my current life, my purpose, and I converse with my spirit guide on a daily basis. I only have words of gratitude.',
      image: '/testimonial-1.jpg', // Placeholder
      service: 'Past Life Regression'
    },
    {
      id: 2,
      name: 'Marie D.',
      location: 'Vancouver, Canada',
      text: 'With great attention, Zuzana investigated until she reached the very roots of my inner imbalance. It was surprising for me to feel the energy of the imbalances leaving my body! The ramifications were so complex that one could get lost, but Zuzana was asking all the right questions and seeing the underlying links with great insight. For certain issues, the result was immediate, while others took several weeks to manifest. It is incredible to witness all the changes that entered my life after the sessions. My past cleared and new paths were opened. I am grateful to Zuzana for her empathy, passion and professional approach that makes everything possible.',
      image: '/testimonial-2.jpg', // Placeholder
      service: 'Body Code Session'
    },
    {
      id: 3,
      name: 'Daniela and Sid',
      location: 'Olomouc, Czech Republic',
      text: 'I am the owner of Sid, a 9 year old Jack Russell terrier. He is very active and playful despite his age, but suddenly, he lost interest in fetching the ball and going for walks. He would just lie around, indifferent to his surroundings. It was breaking my heart to see him like this, so I contacted Zuzana. It was amazing to watch her work with Sid and it was even more incredible to see the results several days later. Sid\'s condition gradually returned to normal: his energy was back. If Sid needs help in the future, I would love to have Zuzana working on him again. I even requested a session for myself!',
      image: '/testimonial-3.jpg', // Placeholder
      service: 'Animal Healing'
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
    <section className="relative py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 
            className="text-5xl lg:text-6xl font-light text-stone-800 mb-6 tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
          >
            Testimonials
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />
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
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-amber-200 flex items-center justify-center">
                    <div className="text-center p-12">
                      <svg className="w-24 h-24 text-stone-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-stone-500 text-sm">Photo placeholder</p>
                      <p className="text-stone-400 text-xs mt-1">{testimonials[currentIndex].name}</p>
                    </div>
                  </div>
                  
                  {/* Service Badge */}
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <p className="text-emerald-600 text-sm font-medium tracking-wide">
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
                  <svg className="w-12 h-12 text-emerald-400 mb-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  {/* Testimonial Text */}
                  <p className="text-stone-700 text-lg lg:text-xl leading-relaxed mb-8 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Author Info */}
                  <div className="border-l-4 border-emerald-500 pl-6">
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

        {/* Navigation Arrows - Desktop */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            disabled={isTransitioning}
            className="pointer-events-auto -ml-6 w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-stone-100"
          >
              <svg className="w-7 h-7 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              disabled={isTransitioning}
              className="pointer-events-auto -mr-6 w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-stone-100"
            >
              <svg className="w-7 h-7 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  ? 'w-8 h-2 bg-emerald-500'
                  : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
