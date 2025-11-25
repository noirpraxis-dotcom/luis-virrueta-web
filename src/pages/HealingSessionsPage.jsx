import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'

const HealingSessionsPage = () => {
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
        <SessionNavigator />
      </section>

      {/* Emotion, Body & Belief Code Section */}
      <section id="emotion-body-belief" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <EmotionBodyBeliefSection />
      </section>

      {/* Past Life Regressions Section */}
      <section id="past-life-regressions" className="py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <PastLifeSection />
      </section>

      {/* Ilyari Somatic Section */}
      <section id="ilyari-somatic" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <IlyariSection />
      </section>

      {/* Healing for Animals Section */}
      <section id="healing-animals" className="py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <AnimalsSection />
      </section>

      {/* Session Prices Section */}
      <section id="session-prices" className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <SessionPricesSection />
      </section>
    </div>
  )
}

// Emotion, Body & Belief Code Section - RESTORED ORIGINAL LAYOUT
const EmotionBodyBeliefSection = () => {
  const introRef = useRef(null)
  const codesRef = useRef(null)
  const isIntroInView = useInView(introRef, { once: true, amount: 0.3 })
  const isCodesInView = useInView(codesRef, { once: true, amount: 0.2 })

  const codes = [
    {
      title: 'EMOTION CODE',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-rose-400 to-pink-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      description: 'The EMOTION CODE performs a deep cleansing of the repressed emotions you unconsciously carry with you. This emotional baggage comes from old or recent wounds and traumas, it can be inherited or absorbed from others, and it continuously affects your mental state and physical health.',
      statistic: '80% of energetic imbalances in human beings are caused by unprocessed emotions.',
      metaphor: "Receiving an Emotion Code session is like finally releasing a heavy backpack you've been carrying for a long time, allowing your whole being to straighten, breathe, and heal."
    },
    {
      title: 'BODY CODE',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-emerald-400 to-teal-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'The BODY CODE corrects a multitude of energetic imbalances in your body and mind, promoting overall harmonization of your organism at all levels. A balanced, energetically clean body is capable of performing powerful healing processes and regeneration.',
      metaphor: 'A Body Code session is like thoroughly cleaning and organizing a room, allowing fresh air to circulate again!'
    },
    {
      title: 'BELIEF CODE',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'from-amber-400 to-orange-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'The BELIEF CODE reprograms negative subconscious beliefs that limit your thoughts, feelings, and actions. When these mental programs are neutralized together with the trauma that created them, subconscious blocks dissolve and a new path opens in your life.',
      insight: 'Once you align your subconscious truth (the inner programming) with your conscious will (what you truly want in life), you can finally guide your life in the right direction.',
      metaphor: 'A Belief Code session is like weeding the garden of your mind and allowing healthy thought patterns to take root, which then reflect naturally in your daily feelings and actions.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-16"
      >
        <h2 
          className="text-4xl lg:text-5xl font-light text-stone-800 mb-6 tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
        >
          Emotion, Body & Belief Code
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed italic"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Globally established energy healing methods developed since the 1990s by Dr. Bradley Nelson
        </motion.p>
        <GradientLine className="mt-8" />
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
              Deep Healing at the Energetic Level
            </h3>

            <p className="text-stone-700 leading-relaxed text-lg">
              The Codes allow us to work with the deepest layers of your being — those that know they need help and, above all, <span className="font-medium text-emerald-600">what kind of help they require</span>.
            </p>

            <p className="text-stone-700 leading-relaxed text-lg">
              My role is to ask the right questions, receive the answers, and act according to the guidance that comes through, releasing from your field, body, and mind whatever is creating imbalance. In this way, we address and heal <span className="font-medium text-emerald-600">the root cause of your issue</span>.
            </p>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 lg:p-8">
              <p className="text-stone-800 text-lg leading-relaxed italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                "When your energetic blueprint comes into alignment, your physical body naturally heals."
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
          What Can The Codes Do For You?
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
              Ready to Begin Your Healing Journey?
            </h4>
            <p className="text-stone-600 text-lg mb-8">
              Experience the transformative power of the Codes and unlock your body's natural ability to heal.
            </p>
            <motion.a
              href="/store"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-medium tracking-wide text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book Your Session
            </motion.a>
          </div>
        </BackdropBlurCard>
      </motion.div>
    </div>
  )
}

// Past Life Regressions Section
const PastLifeSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div className="max-w-6xl mx-auto">
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
          Past Life Regressions
        </h2>
        <GradientLine />
      </motion.div>

      <BackdropBlurCard className="border-2 border-purple-200">
        <div className="p-8 lg:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-purple-400 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center text-white">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <p className="text-stone-700 text-lg leading-relaxed mb-6 text-center max-w-3xl mx-auto">
            Journey through time to explore your soul's history. Past life regression therapy helps you understand current patterns, relationships, and challenges by revealing their origins in previous incarnations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-stone-800 mb-3">What to Expect</h3>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Deep relaxation and guided meditation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Vivid memories and emotional insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Understanding of current life patterns</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Benefits</h3>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Release karmic patterns and blockages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Heal relationships and phobias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Connect with your soul's purpose</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </BackdropBlurCard>
    </div>
  )
}

// Ilyari Somatic Section
const IlyariSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div className="max-w-6xl mx-auto">
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
          Ilyari Somatic Therapy
        </h2>
        <GradientLine />
      </motion.div>

      <BackdropBlurCard className="border-2 border-blue-200">
        <div className="p-8 lg:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-600 w-20 h-20 rounded-full flex items-center justify-center text-white">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <p className="text-stone-700 text-lg leading-relaxed mb-6 text-center max-w-3xl mx-auto">
            Ilyari is a holistic somatic therapy that integrates body awareness, emotional release, and energetic healing. Through gentle touch and conscious breathing, we unlock stored trauma and restore your body's natural flow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-3xl mb-2">🌊</div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Body Wisdom</h3>
              <p className="text-stone-600 text-sm">Listen to what your body is telling you</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-3xl mb-2">💫</div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Energy Flow</h3>
              <p className="text-stone-600 text-sm">Restore natural circulation and vitality</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-3xl mb-2">🌸</div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Gentle Release</h3>
              <p className="text-stone-600 text-sm">Safe space for emotional processing</p>
            </div>
          </div>
        </div>
      </BackdropBlurCard>
    </div>
  )
}

// Healing for Animals Section
const AnimalsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div className="max-w-6xl mx-auto">
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
          Healing for Animals
        </h2>
        <GradientLine />
      </motion.div>

      <BackdropBlurCard className="border-2 border-green-200">
        <div className="p-8 lg:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-green-400 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center text-white">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          
          <p className="text-stone-700 text-lg leading-relaxed mb-6 text-center max-w-3xl mx-auto">
            Animals are incredibly sensitive to energy and emotions. Energy healing can help your beloved pets release trauma, reduce anxiety, heal physical ailments, and restore their natural joy and vitality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">Common Issues Addressed</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-stone-600">Behavioral problems and anxiety</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-stone-600">Physical pain and chronic conditions</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-stone-600">Trauma from abuse or abandonment</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-stone-600">Loss of energy and vitality</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-stone-800 mb-4">How It Works</h3>
              <p className="text-stone-600 leading-relaxed mb-4">
                Sessions can be conducted remotely - I don't need to be physically present with your animal. Through energy connection, I can identify and release trapped emotions, correct imbalances, and restore harmony.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Most animals show noticeable improvements within days of their session, becoming more peaceful, playful, and healthy.
              </p>
            </div>
          </div>
        </div>
      </BackdropBlurCard>
    </div>
  )
}

// Session Prices Section
const SessionPricesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const prices = [
    {
      title: 'Single Session',
      price: '$80',
      duration: '60-90 minutes',
      features: [
        'Energy healing session',
        'Detailed report of findings',
        'Personalized recommendations',
        'Email support for questions'
      ],
      color: 'from-emerald-400 to-teal-600',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Package of 3 Sessions',
      price: '$210',
      duration: 'Save $30',
      features: [
        'Three complete sessions',
        'Priority scheduling',
        'Extended follow-up support',
        'Progress tracking between sessions'
      ],
      color: 'from-amber-400 to-orange-600',
      borderColor: 'border-amber-200',
      popular: true
    },
    {
      title: 'Package of 5 Sessions',
      price: '$320',
      duration: 'Save $80',
      features: [
        'Five complete sessions',
        'Priority scheduling',
        'Ongoing email support',
        'Comprehensive healing journey'
      ],
      color: 'from-purple-400 to-indigo-600',
      borderColor: 'border-purple-200'
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
          Session Prices
        </h2>
        <GradientLine />
        <p className="text-stone-600 text-lg mt-6 max-w-2xl mx-auto">
          Invest in your healing journey with flexible options designed to support deep transformation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {prices.map((option, index) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative"
          >
            {option.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            <BackdropBlurCard className={`h-full ${option.borderColor} border-2 ${option.popular ? 'shadow-2xl' : ''}`}>
              <div className="p-8">
                <div className={`bg-gradient-to-br ${option.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-semibold text-stone-800 text-center mb-2">
                  {option.title}
                </h3>
                
                <div className="text-center mb-2">
                  <span className="text-4xl font-bold text-stone-800">{option.price}</span>
                </div>
                
                <p className="text-center text-stone-500 mb-6 text-sm">{option.duration}</p>
                
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-600">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${option.color} text-white py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300`}
                >
                  Book Now
                </motion.button>
              </div>
            </BackdropBlurCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-stone-500 text-sm">
          All sessions can be conducted remotely. Payment plans available upon request.
        </p>
      </div>
    </div>
  )
}

// Session Navigator - Interactive Intelligent Guide (Home-style elegance)
const SessionNavigator = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  const sessions = [
    {
      id: 'emotion-body-belief',
      title: 'Emotion, Body & Belief Code',
      questions: [
        'Feeling stuck with recurring emotional patterns?',
        'Physical discomfort with no medical explanation?',
        'Limiting beliefs holding you back?'
      ],
      action: 'Energy Healing',
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
      title: 'Past Life Regression',
      questions: [
        'Unexplainable fears or phobias?',
        'Déjà vu or strong connections to certain places?',
        'Curious about your soul\'s journey?'
      ],
      action: 'Explore Past Lives',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-[#faf8f5]',
      borderColor: 'border-[#d4c5b0]',
      hoverBorder: 'hover:border-[#b8a88d]',
      accentColor: '#b8a88d',
      buttonBg: 'bg-[#b8a88d]',
      buttonHover: 'hover:bg-[#a39478]'
    },
    {
      id: 'ilyari-somatic',
      title: 'Ilyari Somatic Transmission',
      questions: [
        'Seeking spiritual awakening?',
        'Ready for DNA activation and light codes?',
        'Want to connect with higher frequencies?'
      ],
      action: 'Receive Light Codes',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBorder: 'hover:border-orange-500',
      accentColor: '#ea580c',
      buttonBg: 'bg-orange-600',
      buttonHover: 'hover:bg-orange-700'
    },
    {
      id: 'healing-animals',
      title: 'Healing for Animals',
      questions: [
        'Is your pet showing behavioral changes?',
        'Health issues affecting your companion?',
        'Want to support their wellbeing energetically?'
      ],
      action: 'Help Your Pet',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-[#f8f6f3]',
      borderColor: 'border-[#d9cfc3]',
      hoverBorder: 'hover:border-[#c4b5a4]',
      accentColor: '#c4b5a4',
      buttonBg: 'bg-[#c4b5a4]',
      buttonHover: 'hover:bg-[#afa08f]'
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
          Which Session <br className="lg:hidden" />
          <span className="italic text-amber-700">Calls to You?</span>
        </h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-stone-600 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Answer these questions to discover your ideal healing path
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
