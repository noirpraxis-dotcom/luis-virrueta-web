import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const HealingSessionsPage = () => {
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
      {/* Hero Header - Same style as STORE */}
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
              <div className="text-3xl lg:text-4xl mb-2 opacity-60">HEALING</div>
              <div className="text-6xl lg:text-8xl">SESSIONS</div>
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mb-8"
            />
            
            <p className="text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover transformative healing modalities that work at the energetic level to release trapped emotions, correct imbalances, and reprogram limiting beliefs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Session Navigator - NEW */}
      <section className="py-16 lg:py-20 px-6 lg:px-20 bg-gradient-to-b from-white to-stone-50">
        <SessionNavigator t={t} />
      </section>

      {/* Emotion, Body & Belief Code Section */}
      <section id="emotion-body-belief" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <EmotionBodyBeliefSection t={t} />
      </section>

      {/* Past Life Regressions Section */}
      <section id="past-life-regressions" className="py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <PastLifeSection t={t} />
      </section>

      {/* Ilyari Somatic Section */}
      <section id="ilyari-somatic" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <IlyariSection t={t} />
      </section>

      {/* Healing for Animals Section */}
      <section id="healing-animals" className="py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <AnimalsSection t={t} />
      </section>

      {/* Session Prices CTA */}
      <section id="session-prices" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <SessionPricesCTA t={t} />
      </section>
    </div>
  )
}

// Emotion, Body & Belief Code Section - RESTORED ORIGINAL LAYOUT
const EmotionBodyBeliefSection = ({ t }) => {
  const introRef = useRef(null)
  const codesRef = useRef(null)
  const isIntroInView = useInView(introRef, { once: true, amount: 0.3 })
  const isCodesInView = useInView(codesRef, { once: true, amount: 0.2 })

  const codes = [
    {
      title: t('healingSessions.emotionBodyBelief.emotionCode.title'),
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-rose-400 to-pink-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      description: t('healingSessions.emotionBodyBelief.emotionCode.description'),
      statistic: '80%',
      metaphor: t('healingSessions.emotionBodyBelief.emotionCode.benefit')
    },
    {
      title: t('healingSessions.emotionBodyBelief.bodyCode.title'),
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-emerald-400 to-teal-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: t('healingSessions.emotionBodyBelief.bodyCode.description'),
      metaphor: t('healingSessions.emotionBodyBelief.bodyCode.benefit')
    },
    {
      title: t('healingSessions.emotionBodyBelief.beliefCode.title'),
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'from-amber-400 to-orange-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: t('healingSessions.emotionBodyBelief.beliefCode.description'),
      insight: '',
      metaphor: t('healingSessions.emotionBodyBelief.beliefCode.benefit')
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section - Home style elegance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="text-center mb-16 lg:mb-20"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
        />

        <h2 
          className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 tracking-wide leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.emotionBodyBelief.title')}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl lg:text-2xl text-stone-600 max-w-4xl mx-auto leading-relaxed font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.emotionBodyBelief.intro')}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-10"
        />
      </motion.div>

      {/* Introduction Section with Image Space */}
      <motion.div
        ref={introRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isIntroInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isIntroInView ? 1 : 0, x: isIntroInView ? 0 : -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <h3
              className="text-3xl lg:text-4xl font-light text-stone-800 mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('healingSessions.emotionBodyBelief.subtitle')}
            </h3>

            <p className="text-stone-700 leading-relaxed text-lg">
              {t('healingSessions.emotionBodyBelief.intro2')}
            </p>

            <p className="text-stone-700 leading-relaxed text-lg">
              {t('healingSessions.emotionBodyBelief.intro3')}
            </p>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 lg:p-8">
              <p className="text-stone-800 text-lg leading-relaxed italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                "{t('healingSessions.emotionBodyBelief.intro4')}"
              </p>
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isIntroInView ? 1 : 0, x: isIntroInView ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <BackdropBlurCard className="aspect-[4/5] bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center">
              <div className="text-center p-12">
                <svg className="w-24 h-24 text-emerald-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-stone-500 text-lg">Photo Space</p>
                <p className="text-stone-400 text-sm mt-2">Replace with your image</p>
              </div>
            </BackdropBlurCard>
          </motion.div>
        </div>
      </motion.div>

      {/* What Can The Codes Do Section */}
      <div className="text-center mb-16">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-light text-stone-800 mb-6 tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
        >
          {t('healingSessions.common.whatCanCodesDoTitle')}
        </motion.h3>
        <GradientLine className="mx-auto" />
      </div>

      {/* The Three Codes - Original Full Layout */}
      <div ref={codesRef} className="space-y-20 mb-20">
        {codes.map((code, index) => (
          <motion.div
            key={code.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <BackdropBlurCard className={`${code.bgColor} border-2 ${code.borderColor}`}>
              <div className="p-8 lg:p-12">
                {/* Header with Icon */}
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-4 bg-gradient-to-br ${code.color} text-white rounded-2xl shadow-lg`}
                  >
                    {code.icon}
                  </motion.div>
                  <h4
                    className="text-3xl lg:text-4xl font-light text-stone-800"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {code.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-stone-700 text-lg leading-relaxed mb-6">
                  {code.description}
                </p>

                {/* Statistic (if exists) */}
                {code.statistic && (
                  <div className="bg-white/70 border-l-4 border-rose-400 rounded-r-lg p-6 mb-6">
                    <p className="text-stone-800 font-medium text-lg flex items-center gap-2">
                      <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {code.statistic}
                    </p>
                  </div>
                )}

                {/* Insight (if exists) */}
                {code.insight && (
                  <p className="text-stone-700 text-lg leading-relaxed mb-6">
                    {code.insight}
                  </p>
                )}

                {/* Metaphor */}
                <div className="bg-white/50 rounded-xl p-6 lg:p-8 border border-stone-200">
                  <div className="flex items-start gap-4">
                    <svg className="w-8 h-8 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-stone-700 text-lg leading-relaxed italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {code.metaphor}
                    </p>
                  </div>
                </div>
              </div>
            </BackdropBlurCard>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <BackdropBlurCard className="bg-gradient-to-br from-emerald-50 to-amber-50 border-2 border-emerald-200">
          <div className="p-12 text-center">
            <h4
              className="text-3xl lg:text-4xl font-light text-stone-800 mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('healingSessions.common.readyToBeginTitle')}
            </h4>
            <p className="text-stone-600 text-lg mb-8">
              {t('healingSessions.common.readyToBeginText')}
            </p>
            <motion.a
              href="/store"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-medium tracking-wide text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('healingSessions.common.bookYourSession')}
            </motion.a>
          </div>
        </BackdropBlurCard>
      </motion.div>
    </div>
  )
}

// Past Life Regressions Section
const PastLifeSection = ({ t }) => {
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const cardsRef = useRef(null)
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.3 })
  const isContentInView = useInView(contentRef, { once: true, amount: 0.2 })
  const isCardsInView = useInView(cardsRef, { once: true, amount: 0.2 })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section - Home style elegance */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="text-center mb-16 lg:mb-20"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
        />

        <h2 
          className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 tracking-wide leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.pastLife.title')}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl lg:text-2xl text-stone-600 max-w-4xl mx-auto leading-relaxed font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.pastLife.intro')}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-10"
        />
      </motion.div>

      {/* Main Content - Clear readable paragraphs */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isContentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="max-w-5xl mx-auto mb-20"
      >
        <div className="space-y-8 text-center">
          <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
            {t('healingSessions.pastLife.paragraph1')}
          </p>

          <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
            {t('healingSessions.pastLife.paragraph2')}
          </p>
        </div>
      </motion.div>

      {/* Online Sessions Info - Two elegant cards */}
      <motion.div
        ref={cardsRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto"
      >
        {/* Card 1: Benefits of Online Sessions */}
        <BackdropBlurCard className="border-2 border-stone-200 hover:border-amber-600/30 transition-colors duration-500">
          <div className="p-8 lg:p-10">
            {/* Decorative icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isCardsInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-16 h-16 rounded-full bg-amber-600/10 border-2 border-amber-600/30 flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </motion.div>

            <h3 
              className="text-2xl lg:text-3xl font-light text-stone-800 text-center mb-6 tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('healingSessions.common.comfortOfHomeTitle')} <span className="italic text-amber-700">{t('healingSessions.common.comfortOfHomeTitleItalic')}</span>
            </h3>

            <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-6" />

            <p className="text-base lg:text-lg text-stone-700 leading-relaxed text-center">
              {t('healingSessions.common.comfortOfHomeText')}
            </p>
          </div>
        </BackdropBlurCard>

        {/* Card 2: What You Need */}
        <BackdropBlurCard className="border-2 border-stone-200 hover:border-amber-600/30 transition-colors duration-500">
          <div className="p-8 lg:p-10">
            {/* Decorative icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isCardsInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-16 h-16 rounded-full bg-amber-600/10 border-2 border-amber-600/30 flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>

            <h3 
              className="text-2xl lg:text-3xl font-light text-stone-800 text-center mb-6 tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('healingSessions.common.equallyEffectiveTitle')} <span className="italic text-amber-700">{t('healingSessions.common.equallyEffectiveTitleItalic')}</span>
            </h3>

            <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-6" />

            <p className="text-base lg:text-lg text-stone-700 leading-relaxed text-center mb-6">
              {t('healingSessions.common.equallyEffectiveText')}
            </p>

            <ul className="space-y-3">
              {[
                t('healingSessions.common.requirement1'),
                t('healingSessions.common.requirement2'),
                t('healingSessions.common.requirement3')
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isCardsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-stone-700 leading-relaxed">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </BackdropBlurCard>
      </motion.div>
    </div>
  )
}

// Ilyari Somatic Section
const IlyariSection = ({ t }) => {
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const lineagesRef = useRef(null)
  const sessionsRef = useRef(null)
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.3 })
  const isContentInView = useInView(contentRef, { once: true, amount: 0.2 })
  const isLineagesInView = useInView(lineagesRef, { once: true, amount: 0.2 })
  const isSessionsInView = useInView(sessionsRef, { once: true, amount: 0.2 })

  const lineages = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      title: t('healingSessions.ilyari.lineage1.title'),
      description: t('healingSessions.ilyari.lineage1.description'),
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-200',
      hoverBorder: 'hover:border-rose-400'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      title: t('healingSessions.ilyari.lineage2.title'),
      description: t('healingSessions.ilyari.lineage2.description'),
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
      hoverBorder: 'hover:border-cyan-400'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: t('healingSessions.ilyari.lineage3.title'),
      description: t('healingSessions.ilyari.lineage3.description'),
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      hoverBorder: 'hover:border-indigo-400'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section - Home style elegance */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="text-center mb-16 lg:mb-20"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
        />

        <h2 
          className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 tracking-wide leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.ilyari.title')}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl lg:text-2xl text-stone-600 max-w-4xl mx-auto leading-relaxed font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.ilyari.intro')}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-10"
        />
      </motion.div>

      {/* Main Content - Clear readable text */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isContentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="max-w-5xl mx-auto mb-20 space-y-8 text-center"
      >
        <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
          As the healing lightcodes flow through my channel, the body movements distribute them where they are needed most: whether to ease your physical symptom, release emotional stagnation, or recalibrate and upgrade your entire energy field into greater harmony.
        </p>

        <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
          These transmissions are deeply felt and intuitively guided. Not choreographed, not rehearsed, but received in the moment as a direct transmission of light.
        </p>

        <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
          The healing you receive through Ilyari is woven from star lineages braided through my soul stream, expressed as a unique movement dialect. It carries the frequencies of:
        </p>
      </motion.div>

      {/* Star Lineages - Three cards */}
      <motion.div
        ref={lineagesRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isLineagesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto mb-20"
      >
        {lineages.map((lineage, index) => (
          <BackdropBlurCard key={index} className={`border-2 ${lineage.borderColor} ${lineage.hoverBorder} transition-all duration-500 hover:shadow-xl`}>
            <div className="p-8 lg:p-10">
              {/* Icon in circular frame */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isLineagesInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className={`w-20 h-20 rounded-full ${lineage.bgColor} border-2 ${lineage.borderColor} flex items-center justify-center mx-auto mb-6 shadow-md`}
              >
                <div className={lineage.iconColor}>
                  {lineage.icon}
                </div>
              </motion.div>

              {/* Title */}
              <h3 
                className="text-xl lg:text-2xl font-light text-stone-800 text-center mb-4 tracking-wide leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {lineage.title}
              </h3>

              <div className={`h-px bg-gradient-to-r from-transparent via-${lineage.borderColor.replace('border-', '')} to-transparent mb-4`} />

              {/* Description */}
              <p className="text-base text-stone-700 leading-relaxed text-center">
                {lineage.description}
              </p>
            </div>
          </BackdropBlurCard>
        ))}
      </motion.div>

      {/* Ilyari Sessions Info */}
      <motion.div
        ref={sessionsRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isSessionsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="max-w-4xl mx-auto"
      >
        <BackdropBlurCard className="border-2 border-stone-200">
          <div className="p-8 lg:p-12">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isSessionsInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-20 h-20 rounded-full bg-amber-600/10 border-2 border-amber-600/30 flex items-center justify-center mx-auto mb-8"
            >
              <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>

            <h3 
              className="text-3xl lg:text-4xl font-light text-stone-800 text-center mb-8 tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Ilyari <span className="italic text-amber-700">Sessions</span>
            </h3>

            <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-8" />

            <div className="space-y-6 text-center">
              <p className="text-base lg:text-lg text-stone-700 leading-relaxed">
                Each Ilyari session is a live, channeled transmission of healing light that unfolds in its own timing. Most sessions last 20–30 minutes and conclude naturally when the energetic work is complete.
              </p>

              <p className="text-base lg:text-lg text-stone-700 leading-relaxed">
                If more healing is called for beyond that point, I seal the field with the appropriate codes, and we'll explore next steps together (such as continuing the process in a follow-up session).
              </p>
            </div>
          </div>
        </BackdropBlurCard>
      </motion.div>
    </div>
  )
}

// Healing for Animals Section
const AnimalsSection = ({ t }) => {
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.3 })
  const isContentInView = useInView(contentRef, { once: true, amount: 0.2 })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section - Home style elegance */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="text-center mb-16 lg:mb-20"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
        />

        <h2 
          className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 tracking-wide leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.animals.title')}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl lg:text-2xl text-stone-600 max-w-4xl mx-auto leading-relaxed font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.animals.intro')}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isTitleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-10"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isContentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="max-w-5xl mx-auto"
      >
        <BackdropBlurCard className="border-2 border-stone-200 hover:border-amber-600/30 transition-colors duration-500">
          <div className="p-8 lg:p-12">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isContentInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-20 h-20 rounded-full bg-amber-600/10 border-2 border-amber-600/30 flex items-center justify-center mx-auto mb-8"
            >
              <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.div>

            <div className="space-y-8 text-center max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
                If your pet or any other domesticated animal is facing health or behavioral challenges, the Emotion Code, Body Code, and Ilyari transmissions can offer gentle and effective support.
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

              <p className="text-lg lg:text-xl text-stone-700 leading-relaxed">
                I can work with your four-legged, two-legged, or no-legged companion as long as you are their rightful owner.
              </p>
            </div>
          </div>
        </BackdropBlurCard>
      </motion.div>
    </div>
  )
}

// Session Prices Section
const SessionPricesCTA = ({ t }) => {
  const ref = useRef(null)
  const navigate = useNavigate()
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-20 lg:py-32 relative" id="prices">
      {/* Subtle background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 opacity-60" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Top decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-32 mb-10"
          />

          {/* Main Title */}
          <h2 
            className="text-5xl lg:text-7xl font-light text-stone-800 mb-8 leading-tight tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your Healing Journey <br className="hidden lg:block" />
            is an <span className="italic text-amber-700">Investment</span> in You
          </h2>

          {/* Compelling Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl lg:text-2xl text-stone-700 leading-relaxed mb-6 font-light max-w-3xl mx-auto"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Every session is designed to unlock deeper layers of healing, release what no longer serves you, and guide you toward lasting transformation.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg lg:text-xl text-stone-600 leading-relaxed mb-12 font-light italic max-w-2xl mx-auto"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Discover flexible options tailored to meet you wherever you are on your path.
          </motion.p>

          {/* Central decorative element */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-20 h-20 mx-auto mb-12"
          >
            <div className="w-full h-full rounded-full border-2 border-amber-600/30 flex items-center justify-center relative">
              <div className="absolute inset-2 rounded-full border border-amber-600/20" />
              <Sparkles className="w-8 h-8 text-amber-600" />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate('/prices')}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 1 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-[#8dc1ab] hover:bg-[#7ab09a] text-white py-5 px-12 rounded-full font-light text-xl lg:text-2xl tracking-wide shadow-xl hover:shadow-2xl transition-all duration-500 inline-flex items-center gap-4 mx-auto"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            <span>Explore Session Packages</span>
            <svg 
              className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-16"
          />
        </motion.div>
      </div>
    </section>
  )
}

// Session Navigator - Interactive Intelligent Guide (Home-style elegance)
const SessionNavigator = ({ t }) => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  const sessions = [
    {
      id: 'emotion-body-belief',
      title: t('healingSessions.navigator.emotionBodyBeliefTitle'),
      questions: [
        t('healingSessions.navigator.emotionBodyBeliefQ1'),
        t('healingSessions.navigator.emotionBodyBeliefQ2'),
        t('healingSessions.navigator.emotionBodyBeliefQ3')
      ],
      action: t('healingSessions.navigator.emotionBodyBeliefAction'),
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      bgColor: 'bg-stone-50',
      borderColor: 'border-stone-200',
      hoverBorder: 'hover:border-[#8dc1ab]',
      accentColor: '#8dc1ab',
      buttonBg: 'bg-[#8dc1ab]',
      buttonHover: 'hover:bg-[#7ab09a]'
    },
    {
      id: 'past-life-regressions',
      title: t('healingSessions.navigator.pastLifeTitle'),
      questions: [
        t('healingSessions.navigator.pastLifeQ1'),
        t('healingSessions.navigator.pastLifeQ2'),
        t('healingSessions.navigator.pastLifeQ3')
      ],
      action: t('healingSessions.navigator.pastLifeAction'),
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-stone-50',
      borderColor: 'border-stone-200',
      hoverBorder: 'hover:border-[#8dc1ab]',
      accentColor: '#8dc1ab',
      buttonBg: 'bg-[#8dc1ab]',
      buttonHover: 'hover:bg-[#7ab09a]'
    },
    {
      id: 'ilyari-somatic',
      title: t('healingSessions.navigator.ilyariTitle'),
      questions: [
        t('healingSessions.navigator.ilyariQ1'),
        t('healingSessions.navigator.ilyariQ2'),
        t('healingSessions.navigator.ilyariQ3')
      ],
      action: t('healingSessions.navigator.ilyariAction'),
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      bgColor: 'bg-stone-50',
      borderColor: 'border-stone-200',
      hoverBorder: 'hover:border-[#8dc1ab]',
      accentColor: '#8dc1ab',
      buttonBg: 'bg-[#8dc1ab]',
      buttonHover: 'hover:bg-[#7ab09a]'
    },
    {
      id: 'healing-animals',
      title: t('healingSessions.navigator.animalsTitle'),
      questions: [
        t('healingSessions.navigator.animalsQ1'),
        t('healingSessions.navigator.animalsQ2'),
        t('healingSessions.navigator.animalsQ3')
      ],
      action: t('healingSessions.navigator.animalsAction'),
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-stone-50',
      borderColor: 'border-stone-200',
      hoverBorder: 'hover:border-[#8dc1ab]',
      accentColor: '#8dc1ab',
      buttonBg: 'bg-[#8dc1ab]',
      buttonHover: 'hover:bg-[#7ab09a]'
    }
  ]

  const handleNavigate = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Title - Home style */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="text-center mb-16 lg:mb-20"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-32 mb-8"
        />

        <h2 
          className="text-5xl lg:text-6xl font-light text-stone-800 mb-8 tracking-wide leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.navigator.title')} <br className="lg:hidden" />
          <span className="italic text-amber-700">{t('healingSessions.navigator.titleItalic')}</span>
        </h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-stone-600 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {t('healingSessions.navigator.subtitle')}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mt-10"
        />
      </motion.div>

      {/* Interactive Question Cards - Premium Design */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
      >
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.8, 
              delay: 0.5 + index * 0.15,
              ease: [0.76, 0, 0.24, 1]
            }}
            className="group"
          >
            <div className={`relative ${session.bgColor} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-2 ${session.borderColor} ${session.hoverBorder} transition-all duration-500 h-full`}>
              {/* Subtle decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" style={{ color: session.accentColor }} />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" style={{ color: session.accentColor }} />
                </svg>
              </div>
              
              <div className="relative p-8 lg:p-10">
                {/* Icon - Elegant SVG in circular frame */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 shadow-md"
                  style={{ 
                    borderColor: session.accentColor,
                    color: session.accentColor 
                  }}
                >
                  {session.icon}
                </motion.div>

                {/* Title */}
                <h3 
                  className="text-2xl lg:text-3xl font-light text-stone-800 mb-8 leading-tight tracking-wide"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {session.title}
                </h3>

                {/* Questions with elegant checkmarks */}
                <div className="space-y-4 mb-10">
                  {session.questions.map((question, qIndex) => (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.7 + index * 0.15 + qIndex * 0.1 
                      }}
                      className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <div 
                        className="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border"
                        style={{ 
                          borderColor: session.accentColor,
                          backgroundColor: `${session.accentColor}15`
                        }}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: session.accentColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-stone-700 text-base lg:text-lg font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        {question}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Elegant divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-px mb-8"
                  style={{ 
                    background: `linear-gradient(to right, transparent, ${session.accentColor}40, transparent)` 
                  }}
                />

                {/* Then text and Action Button */}
                <div className="text-center">
                  <p className="text-stone-500 text-sm uppercase tracking-[0.2em] mb-6 font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    Then
                  </p>
                  
                  <motion.button
                    onClick={() => handleNavigate(session.id)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full ${session.buttonBg} ${session.buttonHover} text-white py-4 px-6 rounded-full font-light text-lg tracking-wide shadow-lg transition-all duration-500 flex items-center justify-center gap-3 group`}
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    <span>{session.action}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
        className="mt-16 text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.3 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto w-48 mb-8"
        />
        
        <p className="text-stone-500 text-lg font-light italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Each session is uniquely designed to meet you where you are
        </p>
      </motion.div>
    </div>
  )
}

export default HealingSessionsPage
