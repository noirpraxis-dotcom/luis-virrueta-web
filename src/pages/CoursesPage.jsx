import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { ExternalLink } from 'lucide-react'

const CoursesPage = () => {
  const { t } = useLanguage()

  const courseLinks = {
    en: [
      {
        language: 'English',
        url: 'https://discoverhealing.com/product/the-emotion-code-certification-program/ref/p65hl/',
        flag: '🇬🇧'
      },
      {
        language: 'Spanish',
        url: 'https://discoverhealing.com/es/product/the-emotion-code-certification-program/ref/p65hl/',
        flag: '🇪🇸'
      },
      {
        language: 'Czech',
        url: 'https://myablefy.com/epl/SpJyVrJhMzhWVF_V5jxx',
        flag: '🇨🇿'
      }
    ],
    es: [
      {
        language: 'Español',
        url: 'https://discoverhealing.com/es/product/the-emotion-code-certification-program/ref/p65hl/',
        flag: '🇪🇸'
      },
      {
        language: 'Inglés',
        url: 'https://discoverhealing.com/product/the-emotion-code-certification-program/ref/p65hl/',
        flag: '🇬🇧'
      },
      {
        language: 'Checo',
        url: 'https://myablefy.com/epl/SpJyVrJhMzhWVF_V5jxx',
        flag: '🇨🇿'
      }
    ],
    cz: [
      {
        language: 'Čeština',
        url: 'https://myablefy.com/epl/SpJyVrJhMzhWVF_V5jxx',
        flag: '🇨🇿'
      },
      {
        language: 'Angličtina',
        url: 'https://discoverhealing.com/product/the-emotion-code-certification-program/ref/p65hl/',
        flag: '🇬🇧'
      },
      {
        language: 'Španělština',
        url: 'https://discoverhealing.com/es/product/the-emotion-code-certification-program/ref/p65hl/',
        flag: '🇪🇸'
      }
    ]
  }

  const getCurrentLanguage = () => {
    const lang = t('lang') || 'en'
    return lang === 'es' ? 'es' : lang === 'cz' ? 'cz' : 'en'
  }

  const currentLinks = courseLinks[getCurrentLanguage()]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-stone-50 to-white">
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
              className="text-stone-800 font-light tracking-[0.2em] mb-8"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              <div className="text-3xl lg:text-4xl mb-2 opacity-60">{t('courses.heroSmall')}</div>
              <div className="text-6xl lg:text-8xl">{t('courses.heroLarge')}</div>
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-[#8dc1ab]/40 to-transparent mx-auto w-80 mb-12"
            />
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-stone-900 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed mb-8 font-normal"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              {t('courses.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Moved higher and simplified */}
      <section className="py-12 lg:py-20 px-6 lg:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Emotion Code Certification Section - Now more prominent */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/50 overflow-hidden">
              <div className="p-10 lg:p-16">
                <h2 
                  className="text-4xl lg:text-5xl font-light text-stone-800 mb-6 text-center"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {t('courses.emotionCode.title')}
                </h2>
                
                <div className="h-px bg-gradient-to-r from-transparent via-[#8dc1ab]/30 to-transparent w-32 mx-auto mb-8" />
                
                <div className="space-y-6 text-stone-700 text-lg leading-relaxed" style={{ fontFamily: 'Gotham, sans-serif' }}>
                  <p>{t('courses.emotionCode.intro')}</p>
                  
                  <div className="bg-[#8dc1ab]/5 rounded-2xl p-8 border border-[#8dc1ab]/20">
                    <p className="text-center text-xl font-medium text-stone-800 mb-4">
                      {t('courses.emotionCode.callout')}
                    </p>
                  </div>
                  
                  <p>{t('courses.emotionCode.description1')}</p>
                  <p>{t('courses.emotionCode.description2')}</p>
                  <p className="text-[#8dc1ab] font-medium">{t('courses.emotionCode.cta')}</p>
                  
                  <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
                    <p className="text-stone-800 font-medium mb-4">{t('courses.emotionCode.bonus.title')}</p>
                    <p>{t('courses.emotionCode.bonus.description')}</p>
                  </div>

                  {/* Single CTA Button */}
                  <div className="pt-8 text-center">
                    <p className="text-stone-600 font-medium mb-6" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      Ready to begin your journey as a certified healer?
                    </p>
                    <motion.a
                      href="https://discoverhealing.com/product/the-emotion-code-certification-program/ref/p65hl/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8dc1ab] to-[#7ab09a] text-white rounded-2xl font-medium tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300"
                      style={{ letterSpacing: '0.1em', fontFamily: 'Gotham, sans-serif' }}
                    >
                      <span>Enroll in the Certification Program</span>
                      <ExternalLink className="w-5 h-5" />
                    </motion.a>
                    <p className="text-sm text-stone-500 mt-4" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      Course is taught in English
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ / Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-[#8dc1ab]/10 to-stone-50 rounded-3xl p-10 lg:p-16 border border-[#8dc1ab]/20 text-center">
              <h3 
                className="text-3xl lg:text-4xl font-light text-stone-800 mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {t('courses.contact.title')}
              </h3>
              <p 
                className="text-lg text-stone-700 leading-relaxed mb-8"
                style={{ fontFamily: 'Gotham, sans-serif' }}
              >
                {t('courses.contact.description')}
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block py-4 px-10 bg-gradient-to-r from-[#8dc1ab] to-[#7ab09a] text-white rounded-2xl font-medium tracking-wider shadow-xl hover:shadow-2xl transition-all duration-500"
                style={{ fontFamily: 'Gotham, sans-serif', letterSpacing: '0.1em' }}
              >
                {t('courses.contact.button')}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CoursesPage
