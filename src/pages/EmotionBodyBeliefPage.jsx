import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'

const EmotionBodyBeliefPage = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative pt-32 pb-20 px-6 lg:px-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-light text-stone-800 mb-6 tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Emotion, Body & Belief Code
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Globally established energy healing methods developed since the 1990s by Dr. Bradley Nelson
            </motion.p>
          </motion.div>

          <GradientLine />
        </div>
      </motion.section>

      {/* Introduction Section with Image Space */}
      <motion.section
        ref={introRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isIntroInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="pb-20 px-6 lg:px-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isIntroInView ? 1 : 0, x: isIntroInView ? 0 : -30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <h2 
                className="text-3xl lg:text-4xl font-light text-stone-800 mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Deep Healing at the Energetic Level
              </h2>

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
                  <svg className="w-24 h-24 text-stone-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-stone-500 text-lg">Photo Space</p>
                  <p className="text-stone-400 text-sm mt-2">Replace with your image</p>
                </div>
              </BackdropBlurCard>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* What Can The Codes Do Section */}
      <motion.section
        className="py-20 px-6 lg:px-20 bg-gradient-to-b from-white/50 to-transparent"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl font-light text-stone-800 mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            What Can The Codes Do For You?
          </motion.h2>
          <GradientLine className="mx-auto" />
        </div>
      </motion.section>

      {/* The Three Codes */}
      <motion.section
        ref={codesRef}
        className="pb-32 px-6 lg:px-20"
      >
        <div className="max-w-7xl mx-auto space-y-20">
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
                    <h3 
                      className="text-3xl lg:text-4xl font-light text-stone-800"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {code.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-stone-700 text-lg leading-relaxed mb-6">
                    {code.description}
                  </p>

                  {/* Statistic (if exists) */}
                  {code.statistic && (
                    <div className="bg-white/70 border-l-4 border-rose-400 rounded-r-lg p-6 mb-6">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-stone-800 font-medium text-lg">
                          {code.statistic}
                        </p>
                      </div>
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
                      <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pb-32 px-6 lg:px-20"
      >
        <div className="max-w-4xl mx-auto">
          <BackdropBlurCard className="bg-gradient-to-br from-emerald-50 to-amber-50 border-2 border-emerald-200">
            <div className="p-12 text-center">
              <h3 
                className="text-3xl lg:text-4xl font-light text-stone-800 mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Ready to Begin Your Healing Journey?
              </h3>
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
        </div>
      </motion.section>
    </div>
  )
}

export default EmotionBodyBeliefPage
