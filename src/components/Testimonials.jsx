import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const { t } = useLanguage()

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.testimonial1.name'),
      location: t('testimonials.testimonial1.location'),
      text: t('testimonials.testimonial1.text'),
      service: t('testimonials.testimonial1.service'),
      rating: 5
    },
    {
      id: 2,
      name: t('testimonials.testimonial2.name'),
      location: t('testimonials.testimonial2.location'),
      text: t('testimonials.testimonial2.text'),
      service: t('testimonials.testimonial2.service'),
      rating: 5
    },
    {
      id: 3,
      name: t('testimonials.testimonial3.name'),
      location: t('testimonials.testimonial3.location'),
      text: t('testimonials.testimonial3.text'),
      service: t('testimonials.testimonial3.service'),
      rating: 5
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
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
    <section className="relative py-20 lg:py-32 px-6 lg:px-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-fuchsia-950 to-purple-950" />
      
      {/* Decorative blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-fuchsia-500/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.h2
            className="text-5xl lg:text-7xl font-light bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-8 leading-tight"
          >
            {t('testimonials.title')}
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mx-auto w-80 mb-10"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-gray-300 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-fuchsia-500/50 transition-all duration-500 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-fuchsia-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:via-fuchsia-500/10 group-hover:to-cyan-500/10 transition-all duration-500 rounded-2xl" />
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-fuchsia-400 mb-4" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-200 text-sm lg:text-base leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Service Badge */}
                  <div className="inline-block bg-fuchsia-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-fuchsia-500/30 mb-6">
                    <p className="text-fuchsia-400 text-xs font-medium">
                      {testimonial.service}
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-white font-semibold text-base mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
