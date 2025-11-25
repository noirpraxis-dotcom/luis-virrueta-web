import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

const CallToActionSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      className="relative py-32 lg:py-40 px-6 lg:px-12 bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 overflow-hidden"
    >
      {/* Decorative blur effects - more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.04, scale: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-stone-300 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Logo elegante arriba del título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="flex justify-center mb-12"
        >
          <img 
            src="/logo.png" 
            alt="Greenleaf Lightworks" 
            className="h-20 lg:h-28 w-auto opacity-80 drop-shadow-xl"
          />
        </motion.div>

        {/* Main Heading - Centered and Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Find the Perfect
            <br />
            <span className="italic">Session for You</span>
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mb-10"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-stone-600 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Whether you're seeking emotional healing, spiritual growth, 
            or clarity in your life's path, I'm here to guide you.
          </motion.p>
        </motion.div>

        {/* CTA Buttons - Centered and Elegant */}
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Button 1: Work With Me */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link to="/healing-sessions" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
              >
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8dc1ab] to-[#7ab09a] rounded-2xl 
                              shadow-xl group-hover:shadow-2xl transition-all duration-500" />
                
                {/* Content */}
                <div className="relative px-12 py-8 text-center">
                  <h3 
                    className="text-white text-2xl lg:text-3xl font-light mb-2 tracking-wide"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    Ready to Begin?
                  </h3>
                  <p className="text-white/90 text-base lg:text-lg font-light">
                    Explore healing sessions and start your transformation
                  </p>
                  
                  {/* Arrow indicator */}
                  <motion.div
                    className="absolute right-8 top-1/2 -translate-y-1/2"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-white text-3xl">→</span>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="h-px bg-stone-300 flex-1" />
            <span className="text-stone-400 text-sm tracking-widest uppercase">or</span>
            <div className="h-px bg-stone-300 flex-1" />
          </motion.div>

          {/* Button 2: WhatsApp Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
              >
                {/* Background with border */}
                <div className="absolute inset-0 bg-white rounded-2xl border-2 border-stone-200 
                              shadow-lg group-hover:shadow-xl group-hover:border-amber-300 transition-all duration-500" />
                
                {/* Content */}
                <div className="relative px-12 py-8 text-center flex items-center justify-center gap-4">
                  <MessageCircle className="w-7 h-7 text-amber-500 flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h3 
                      className="text-stone-800 text-2xl lg:text-3xl font-light mb-1 tracking-wide"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      Not Sure Where to Start?
                    </h3>
                    <p className="text-stone-600 text-base lg:text-lg font-light">
                      Let's talk on WhatsApp — I'm here to help
                    </p>
                  </div>
                </div>
              </motion.div>
            </a>
          </motion.div>

        </div>

        {/* Bottom decorative text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.3 }}
          className="text-center mt-16"
        >
          <p 
            className="text-stone-400 text-base lg:text-lg font-light italic"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your journey to healing begins with a single step
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToActionSection
