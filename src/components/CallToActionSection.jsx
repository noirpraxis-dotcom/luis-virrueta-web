import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Calendar } from 'lucide-react'

const CallToActionSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative py-24 lg:py-32 px-6 lg:px-12 bg-gradient-to-br from-stone-50 via-white to-amber-50/30 overflow-hidden"
    >
      {/* Decorative blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[#8dc1ab] rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.02, scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-amber-300 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl lg:text-6xl font-light tracking-wide text-stone-800 mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Find the Perfect Session for You
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-[#8dc1ab] to-transparent mx-auto w-64 mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-stone-600 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're seeking emotional healing, spiritual growth, or clarity in your life's path, 
            I'm here to guide you.
          </motion.p>
        </motion.div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Work With Me */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative group h-full">
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-stone-50 rounded-2xl border border-stone-200/50 
                            shadow-xl group-hover:shadow-2xl transition-all duration-500" />
              
              {/* Card Content */}
              <div className="relative p-8 lg:p-10 h-full flex flex-col">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-16 h-16 mb-6 bg-gradient-to-br from-[#8dc1ab] to-[#7ab09a] rounded-2xl 
                           flex items-center justify-center shadow-lg"
                >
                  <Calendar className="w-8 h-8 text-white" strokeWidth={1.5} />
                </motion.div>

                {/* Title */}
                <h3 
                  className="text-2xl lg:text-3xl font-light text-stone-800 mb-4 tracking-wide"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  Ready to Begin?
                </h3>

                {/* Description */}
                <p className="text-stone-600 leading-relaxed mb-8 flex-grow">
                  Explore our healing sessions, courses, and personalized guidance. 
                  Choose what resonates with your journey and take the first step toward transformation.
                </p>

                {/* Button */}
                <Link to="/healing-sessions">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-[#8dc1ab] to-[#7ab09a] text-white rounded-full 
                             font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300
                             flex items-center justify-center gap-3 group/btn"
                    style={{ fontFamily: 'Gotham, sans-serif' }}
                  >
                    <span>Work With Me</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 2: WhatsApp Contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="relative group h-full">
              {/* Card Background with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200/50 
                            shadow-xl group-hover:shadow-2xl transition-all duration-500" />
              
              {/* Card Content */}
              <div className="relative p-8 lg:p-10 h-full flex flex-col">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  className="w-16 h-16 mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl 
                           flex items-center justify-center shadow-lg"
                >
                  <MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
                </motion.div>

                {/* Title */}
                <h3 
                  className="text-2xl lg:text-3xl font-light text-stone-800 mb-4 tracking-wide"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  Not Sure Where to Start?
                </h3>

                {/* Description */}
                <p className="text-stone-600 leading-relaxed mb-8 flex-grow">
                  Let's have a conversation. Reach out via WhatsApp and I'll help you 
                  find the perfect healing path tailored to your unique needs.
                </p>

                {/* Button */}
                <a 
                  href="https://wa.me/1234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full 
                             font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300
                             flex items-center justify-center gap-3 group/btn"
                    style={{ fontFamily: 'Gotham, sans-serif' }}
                  >
                    <MessageCircle className="w-5 h-5" strokeWidth={2} />
                    <span>Contact Me on WhatsApp</span>
                  </motion.button>
                </a>

                {/* Subtext */}
                <p className="text-stone-400 text-sm text-center mt-4">
                  Available Mon-Fri, 9am-6pm EST
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom decorative text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center mt-16"
        >
          <p className="text-stone-400 text-sm tracking-wide">
            Your journey to healing begins with a single step
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToActionSection
