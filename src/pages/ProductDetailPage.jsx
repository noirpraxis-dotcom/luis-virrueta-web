import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { CinematicTitle, GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const ProductDetailPage = () => {
  const { t } = useLanguage()
  const { productId } = useParams()
  const navigate = useNavigate()

  // Datos de productos - en producción vendría de una API
  const products = {
    '1': {
      id: 1,
      name: 'Emotion Code Session',
      category: 'Healing Session',
      price: 120,
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=800&fit=crop',
      shortDescription: 'Release trapped emotions that may be creating physical and emotional problems.',
      fullDescription: 'The Emotion Code is a powerful and simple method developed by Dr. Bradley Nelson to identify and release trapped emotions. These trapped emotions are made of energy, and they can create pain, malfunction, and disease. They can also block you from love, happiness and success.',
      benefits: [
        'Release emotional baggage from past events',
        'Reduce physical discomfort and pain',
        'Improve relationships and communication',
        'Enhance overall emotional well-being',
        'Clear mental fog and confusion',
        'Boost energy levels'
      ],
      whatToExpect: [
        'Initial consultation to understand your concerns',
        'Muscle testing to identify trapped emotions',
        'Gentle release of trapped emotions using magnets',
        'Discussion of findings and recommendations',
        'Follow-up guidance for integration'
      ],
      ideal: [
        'Anyone experiencing emotional overwhelm',
        'Those with unexplained physical discomfort',
        'People seeking to improve relationships',
        'Individuals on a path of self-discovery',
        'Anyone ready to release the past'
      ],
      faq: [
        {
          question: 'How many sessions will I need?',
          answer: 'This varies by individual. Some people experience significant shifts in one session, while others benefit from a series of sessions. We\'ll discuss your progress and needs during each session.'
        },
        {
          question: 'Is this done in person or remotely?',
          answer: 'Sessions can be done both in person and remotely via video call. Energy work is not limited by distance, and remote sessions are equally effective.'
        },
        {
          question: 'What should I do to prepare?',
          answer: 'Come with an open mind and heart. Stay hydrated before and after the session. It\'s helpful to have specific issues or concerns you\'d like to address.'
        }
      ]
    },
    '2': {
      id: 2,
      name: 'Body Code Session',
      category: 'Healing Session',
      price: 130,
      duration: '75 min',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=800&fit=crop',
      shortDescription: 'Discover and correct imbalances in the body.',
      fullDescription: 'The Body Code is a sophisticated and comprehensive energy healing technique designed to identify and correct imbalances in six key areas: Energies, Circuits & Systems, Toxins, Pathogens, Misalignments, and Nutrition & Lifestyle.',
      benefits: [
        'Balance energy systems throughout the body',
        'Address root causes of physical issues',
        'Holistic healing approach',
        'Personalized treatment for your needs',
        'Improve overall body function',
        'Enhance vitality and wellness'
      ],
      whatToExpect: [
        'Comprehensive assessment of body systems',
        'Identification of specific imbalances',
        'Targeted correction of issues found',
        'Detailed explanation of findings',
        'Personalized recommendations for ongoing wellness'
      ],
      ideal: [
        'Those with chronic physical issues',
        'People seeking comprehensive healing',
        'Anyone wanting to optimize health',
        'Individuals with mysterious symptoms',
        'Those committed to deep healing work'
      ],
      faq: [
        {
          question: 'How is this different from Emotion Code?',
          answer: 'While Emotion Code focuses specifically on trapped emotions, Body Code addresses six different types of imbalances including emotions, structural issues, toxins, pathogens, and more. It\'s a more comprehensive system.'
        },
        {
          question: 'Can this replace medical treatment?',
          answer: 'Body Code is a complementary healing modality and should not replace medical care. Always consult with your healthcare provider for medical concerns.'
        }
      ]
    },
    '3': {
      id: 3,
      name: 'Belief Code Session',
      category: 'Healing Session',
      price: 130,
      duration: '75 min',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=800&fit=crop',
      shortDescription: 'Transform limiting beliefs and negative thought patterns.',
      fullDescription: 'The Belief Code helps identify and release limiting beliefs and negative thought patterns that operate at a subconscious level. These beliefs shape your reality and can hold you back from achieving your full potential.',
      benefits: [
        'Transform limiting beliefs',
        'Clear mental blocks',
        'Enhance personal growth',
        'Achieve your goals faster',
        'Improve self-confidence',
        'Create lasting positive change'
      ],
      whatToExpect: [
        'Exploration of limiting beliefs',
        'Identification of belief systems',
        'Release of negative programming',
        'Installation of empowering beliefs',
        'Integration support'
      ],
      ideal: [
        'Those feeling stuck in life',
        'People with self-sabotaging patterns',
        'Anyone wanting to achieve big goals',
        'Individuals seeking transformation',
        'Those ready for deep mindset work'
      ],
      faq: [
        {
          question: 'Will I know what beliefs are being released?',
          answer: 'Yes, we\'ll discuss the beliefs we identify and you\'ll be fully aware of what we\'re working on throughout the session.'
        },
        {
          question: 'How long do results take?',
          answer: 'Some people notice shifts immediately, while others experience gradual changes over days or weeks as new beliefs integrate.'
        }
      ]
    },
    '4': {
      id: 4,
      name: 'Past Life Regression',
      category: 'Healing Session',
      price: 150,
      duration: '90 min',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=800&fit=crop',
      shortDescription: 'Explore past lives to understand current patterns.',
      fullDescription: 'Past Life Regression is a therapeutic technique that allows you to explore memories and experiences from past lives. This can provide profound insights into current life patterns, relationships, fears, and life purpose.',
      benefits: [
        'Understand recurring life patterns',
        'Heal deep-rooted issues',
        'Gain spiritual insights',
        'Release karmic patterns',
        'Connect with your soul\'s journey',
        'Find peace and resolution'
      ],
      whatToExpect: [
        'Guided relaxation into a theta state',
        'Exploration of one or more past lives',
        'Understanding connections to current life',
        'Healing and release work',
        'Integration and discussion'
      ],
      ideal: [
        'Spiritually curious individuals',
        'Those with unexplained fears or phobias',
        'People seeking life purpose clarity',
        'Anyone interested in soul exploration',
        'Those ready for deep healing'
      ],
      faq: [
        {
          question: 'What if I don\'t believe in past lives?',
          answer: 'You don\'t need to believe in past lives for this work to be beneficial. You can view it as accessing the subconscious mind or archetypal experiences. The healing happens regardless of your beliefs.'
        },
        {
          question: 'Will I remember everything?',
          answer: 'Most people remember the experience clearly, as you remain conscious and aware throughout. We also record the session if you\'d like to review it later.'
        }
      ]
    },
    '5': {
      id: 5,
      name: 'Ilyari Somatic Transmission',
      category: 'Healing Session',
      price: 140,
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      shortDescription: 'Experience channeled light codes for cellular healing.',
      fullDescription: 'Ilyari Somatic Transmission is a unique healing modality that channels high-frequency light codes directly through the body for deep cellular healing and consciousness expansion. This work operates beyond the mind, directly at the cellular and energetic level.',
      benefits: [
        'Deep cellular healing',
        'Consciousness expansion',
        'DNA activation',
        'Nervous system regulation',
        'Spiritual awakening support',
        'Energetic alignment'
      ],
      whatToExpect: [
        'Comfortable position (lying or sitting)',
        'Transmission of light codes',
        'Possible physical sensations',
        'Deep relaxation or altered states',
        'Integration period after session'
      ],
      ideal: [
        'Lightworkers and healers',
        'Those on awakening journey',
        'People seeking consciousness expansion',
        'Anyone called to this work',
        'Those ready for quantum shifts'
      ],
      faq: [
        {
          question: 'What are light codes?',
          answer: 'Light codes are high-frequency packets of information that carry healing, activation, and upgrades for the human energy system and consciousness.'
        },
        {
          question: 'Do I need to prepare specially?',
          answer: 'Come with an open heart and intention. Avoid heavy meals before the session. Set aside time after for rest and integration.'
        }
      ]
    },
    '6': {
      id: 6,
      name: 'Animal Healing Session',
      category: 'Healing Session',
      price: 100,
      duration: '45 min',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=800&fit=crop',
      shortDescription: 'Energy healing for your beloved animal companions.',
      fullDescription: 'Animals are incredibly receptive to energy healing. This session uses Emotion Code and Body Code techniques to help your animal companion release trapped emotions, balance their energy, and support their physical and emotional well-being.',
      benefits: [
        'Reduce anxiety and stress',
        'Support physical healing',
        'Release emotional trauma',
        'Improve behavior issues',
        'Enhance bonding',
        'Support end-of-life transition'
      ],
      whatToExpect: [
        'Discussion of your animal\'s concerns',
        'Remote or in-person energy work',
        'Identification of trapped emotions',
        'Release and balancing',
        'Follow-up recommendations'
      ],
      ideal: [
        'Anxious or stressed animals',
        'Animals with behavior issues',
        'Pets with physical ailments',
        'Rescue animals with trauma',
        'Senior animals needing support'
      ],
      faq: [
        {
          question: 'Does my animal need to be present?',
          answer: 'No, this work can be done remotely with just a photo and connection to your animal. Energy work is not limited by distance.'
        },
        {
          question: 'What animals can you work with?',
          answer: 'I work with all types of animals - dogs, cats, horses, birds, and more. All animals can benefit from energy healing.'
        }
      ]
    }
  }

  const product = products[productId] || products['1']

  const handleSubmit = () => {
    // Aquí iría la integración con el sistema de pago (Stripe, PayPal, etc.)
    console.log('Proceeding to payment for:', product)
    alert('Redirecting to secure payment gateway...\n\nProduct: ' + product.name + '\nPrice: $' + product.price)
    // navigate('/checkout') o redirigir a pasarela de pago externa
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-50">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pt-32 pb-8 px-6 lg:px-20"
      >
        <button
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 text-stone-600 hover:text-emerald-600 transition-colors duration-300"
        >
          <span className="text-xl">←</span>
          <span className="tracking-wide">{t('productDetail.backToStore')}</span>
        </button>
      </motion.div>

      <div className="pb-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Product Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="sticky top-40">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  {product.category}
                </span>
                
                <h1 
                  className="text-4xl lg:text-5xl font-light text-stone-800 mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-light text-emerald-600">
                    ${product.price}
                  </span>
                  <span className="text-stone-500">• {product.duration}</span>
                </div>

                <p className="text-lg text-stone-700 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              <GradientLine />

              <div>
                <h3 className="text-xl font-medium text-stone-800 mb-3">
                  {t('productDetail.aboutSession')}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-xl font-medium text-stone-800 mb-4">
                  {t('productDetail.benefits')}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-2 text-stone-700"
                    >
                      <span className="text-emerald-500 mt-1">✓</span>
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* What to Expect Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <BackdropBlurCard>
              <div className="p-8 lg:p-12">
                <h2 
                  className="text-3xl font-light text-stone-800 mb-8"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {t('productDetail.whatToExpect')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {product.whatToExpect.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-light">
                        {index + 1}
                      </div>
                      <p className="text-stone-600 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BackdropBlurCard>
          </motion.div>

          {/* Ideal For Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-20"
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 lg:p-12">
              <h2 
                className="text-3xl font-light text-stone-800 mb-6 text-center"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {t('productDetail.idealFor')}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {product.ideal.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-stone-700">
                    <span className="text-emerald-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-20"
          >
            <h2 
              className="text-3xl font-light text-stone-800 mb-8 text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('productDetail.faq')}
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {product.faq.map((item, index) => (
                <BackdropBlurCard key={index}>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-stone-800 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </BackdropBlurCard>
              ))}
            </div>
          </motion.div>

          {/* Payment CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-stone-200/50 overflow-hidden">
              <div className="p-10 lg:p-16 text-center">
                <h2 
                  className="text-4xl lg:text-5xl font-light text-stone-800 mb-6"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Ready to Begin Your <span className="italic text-amber-700">Journey</span>?
                </h2>
                
                <p className="text-lg text-stone-600 mb-8 leading-relaxed" style={{ fontFamily: 'Gotham, sans-serif' }}>
                  Transform your life with this powerful healing session.
                </p>

                <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl p-8 mb-8">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <p className="text-stone-600 text-sm mb-1" style={{ fontFamily: 'Gotham, sans-serif' }}>Session Investment</p>
                      <p className="text-stone-800 text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        ${product.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-600 text-sm mb-1" style={{ fontFamily: 'Gotham, sans-serif' }}>Duration</p>
                      <p className="text-stone-800 text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        {product.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-gradient-to-r from-[#8dc1ab] to-[#7ab09a] text-white rounded-2xl text-lg font-medium tracking-wider shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(141,193,171,0.4)] transition-all duration-500 flex items-center justify-center gap-3"
                  style={{ fontFamily: 'Gotham, sans-serif', letterSpacing: '0.15em' }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  PROCEED TO PAYMENT
                </motion.button>

                <p className="text-xs text-stone-500 mt-6" style={{ fontFamily: 'Gotham, sans-serif' }}>
                  Secure payment processing • 100% satisfaction guaranteed
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
