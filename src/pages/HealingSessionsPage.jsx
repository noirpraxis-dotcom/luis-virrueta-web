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
      {/* Hero Header - Elegant white background like About */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-5xl lg:text-6xl font-light text-stone-800 mb-6 tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
            >
              Healing Sessions
            </h1>
            <GradientLine />
            <p className="text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mt-8">
              Discover transformative healing modalities that work at the energetic level to release trapped emotions, correct imbalances, and reprogram limiting beliefs.
            </p>
          </motion.div>
        </div>
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

// Emotion, Body & Belief Code Section
const EmotionBodyBeliefSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 
          className="text-4xl lg:text-5xl font-light text-stone-800 mb-6 tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
        >
          Emotion, Body & Belief Code
        </h2>
        <GradientLine />
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {codes.map((code, index) => (
          <motion.div
            key={code.title}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <BackdropBlurCard className={`h-full ${code.borderColor} border-2`}>
              <div className={`${code.bgColor} p-6 rounded-t-2xl`}>
                <div className={`bg-gradient-to-br ${code.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {code.icon}
                </div>
                <h3 className="text-2xl font-bold text-stone-800 text-center mb-2">
                  {code.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-stone-600 leading-relaxed mb-4">
                  {code.description}
                </p>
                {code.statistic && (
                  <p className="text-sm text-stone-500 italic">
                    {code.statistic}
                  </p>
                )}
              </div>
            </BackdropBlurCard>
          </motion.div>
        ))}
      </div>
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

export default HealingSessionsPage
