import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Video, Mail, Clock } from 'lucide-react'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const PricesPage = () => {
  const { t } = useLanguage()
  const onlineRef = useRef(null)
  const emailRef = useRef(null)
  const regressionRef = useRef(null)
  const isOnlineInView = useInView(onlineRef, { once: true, amount: 0.2 })
  const isEmailInView = useInView(emailRef, { once: true, amount: 0.2 })
  const isRegressionInView = useInView(regressionRef, { once: true, amount: 0.3 })

  const onlineSessions = [
    {
      title: t('prices.online.single'),
      subtitle: t('prices.online.emotionBodyBelief'),
      price: '80',
      duration: t('prices.online.duration60'),
      type: t('prices.online.online')
    },
    {
      title: t('prices.online.package3'),
      subtitle: t('prices.online.emotionBodyBelief'),
      price: '216',
      originalPrice: '240',
      duration: t('prices.online.duration60PerSession'),
      type: t('prices.online.online'),
      save: t('prices.online.save10'),
      popular: true
    },
    {
      title: t('prices.online.package6'),
      subtitle: t('prices.online.emotionBodyBelief'),
      price: '408',
      originalPrice: '480',
      duration: t('prices.online.duration60PerSession'),
      type: t('prices.online.online'),
      save: t('prices.online.save15')
    },
    {
      title: t('prices.online.ilyariChanneled'),
      subtitle: '',
      price: '44',
      duration: t('prices.online.duration2030'),
      type: t('prices.online.online')
    },
    {
      title: t('prices.online.ilyariPackage3'),
      subtitle: '',
      price: '120',
      originalPrice: '132',
      duration: t('prices.online.duration2030PerSession'),
      type: t('prices.online.online'),
      save: t('prices.online.save10')
    },
    {
      title: t('prices.online.ilyariPackage6'),
      subtitle: '',
      price: '224',
      originalPrice: '264',
      duration: t('prices.online.duration2030PerSession'),
      type: t('prices.online.online'),
      save: t('prices.online.save15')
    }
  ]

  const emailSessions = [
    {
      title: t('prices.email.single'),
      subtitle: '',
      price: '63',
      type: 'email'
    },
    {
      title: t('prices.email.package3'),
      subtitle: '',
      price: '170',
      originalPrice: '189',
      type: 'email',
      save: t('prices.online.save10')
    },
    {
      title: t('prices.email.package6'),
      subtitle: '',
      price: '320',
      originalPrice: '378',
      type: 'email',
      save: t('prices.online.save15')
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
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
              className="text-stone-800 text-6xl lg:text-8xl font-light tracking-[0.2em] mb-8"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              {t('prices.title')}
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-amber-700 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed italic"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('prices.specialRates')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ONLINE SESSIONS */}
      <section ref={onlineRef} className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isOnlineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#8dc1ab]/20 border-2 border-[#8dc1ab]/30 flex items-center justify-center">
                <Video className="w-8 h-8 text-[#8dc1ab]" />
              </div>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-light text-stone-800 mb-4 tracking-wide"
              style={{ fontFamily: 'Cormoant Garamond, serif' }}
            >
              {t('prices.online.title')}
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              {t('prices.online.subtitle')}
            </p>
          </motion.div>

          {/* Online Session Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {onlineSessions.map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isOnlineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {session.save && (
                  <div className="absolute -top-3 -right-3 bg-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-medium z-10 shadow-lg">
                    {session.save}
                  </div>
                )}
                {session.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8dc1ab] text-white px-5 py-1.5 rounded-full text-sm font-medium z-10 shadow-lg">
                    Popular
                  </div>
                )}
                <BackdropBlurCard className={`h-full border-2 border-stone-200 hover:border-[#8dc1ab]/50 transition-all duration-300 ${session.popular ? 'ring-2 ring-[#8dc1ab]/20' : ''}`}>
                  <div className="p-6 lg:p-8">
                    <h3 
                      className="text-xl lg:text-2xl font-light text-stone-800 mb-2 tracking-wide"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {session.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-4">{session.subtitle}</p>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent my-4" />
                    
                    <div className="text-center mb-4">
                      {session.originalPrice && (
                        <span className="text-2xl text-stone-400 line-through mr-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                          ${session.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl lg:text-5xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        ${session.price}
                      </span>
                      <span className="text-stone-600 ml-2">USD</span>
                    </div>
                    
                    <p className="text-center text-stone-500 text-sm italic mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {session.duration}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-[#8dc1ab] hover:bg-[#7ab09a] text-white py-3 rounded-full font-light text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </BackdropBlurCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL SESSIONS */}
      <section ref={emailRef} className="py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isEmailInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-stone-700/10 border-2 border-stone-700/30 flex items-center justify-center">
                <Mail className="w-8 h-8 text-stone-700" />
              </div>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-light text-stone-800 mb-4 tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('prices.email.title')}
            </h2>
            <p className="text-stone-600 text-lg max-w-3xl mx-auto mb-4">
              {t('prices.email.subtitle')}
            </p>
            <p className="text-stone-500 text-base max-w-2xl mx-auto italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('prices.email.process')}
            </p>
          </motion.div>

          {/* Email Session Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {emailSessions.map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isEmailInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {session.save && (
                  <div className="absolute -top-3 -right-3 bg-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-medium z-10 shadow-lg">
                    {session.save}
                  </div>
                )}
                <BackdropBlurCard className="h-full border-2 border-stone-200 hover:border-stone-400/50 transition-all duration-300">
                  <div className="p-6 lg:p-8">
                    <h3 
                      className="text-xl lg:text-2xl font-light text-stone-800 mb-2 tracking-wide"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {session.title}
                    </h3>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent my-4" />
                    
                    <div className="text-center mb-6">
                      {session.originalPrice && (
                        <span className="text-2xl text-stone-400 line-through mr-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                          ${session.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl lg:text-5xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        ${session.price}
                      </span>
                      <span className="text-stone-600 ml-2">USD</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-stone-700 hover:bg-stone-800 text-white py-3 rounded-full font-light text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </BackdropBlurCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PAST LIFE REGRESSION */}
      <section ref={regressionRef} className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isRegressionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            {/* Section Title */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-600/10 border-2 border-amber-600/30 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <h2 
                className="text-4xl lg:text-6xl font-light text-stone-800 mb-4 tracking-wide"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {t('prices.pastLife.title')}
              </h2>
            </div>

            {/* Regression Card */}
            <BackdropBlurCard className="border-2 border-amber-200 hover:border-amber-400/50 transition-all duration-300">
              <div className="p-8 lg:p-12">
                <div className="text-center mb-8">
                  <span className="text-6xl lg:text-7xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    $230
                  </span>
                  <span className="text-stone-600 ml-2 text-xl">USD</span>
                </div>
                
                <p className="text-center text-stone-600 text-lg mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {t('prices.pastLife.duration')}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent my-8" />
                
                <p className="text-center text-stone-700 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                  {t('prices.pastLife.description')}
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-md mx-auto block bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-full font-light text-lg tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Book Past Life Regression
                </motion.button>
              </div>
            </BackdropBlurCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PricesPage
