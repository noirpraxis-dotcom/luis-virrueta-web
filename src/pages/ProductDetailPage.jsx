import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CinematicTitle, GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const ProductDetailPage = () => {
  const { t } = useLanguage()
  const { productId } = useParams()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la integración con el sistema de pago/reserva
    console.log('Booking:', { product, selectedDate, selectedTime, formData })
    alert('Thank you for booking! We\'ll contact you shortly to confirm your session.')
    navigate('/store')
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

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <BackdropBlurCard className="max-w-3xl mx-auto">
              <div className="p-8 lg:p-12">
                <h2 
                  className="text-3xl font-light text-stone-800 mb-8 text-center"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {t('productDetail.bookSession')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">
                        {t('productDetail.fullName')} {t('productDetail.required')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">
                        {t('productDetail.email')} {t('productDetail.required')}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">
                        {t('productDetail.phone')} {t('productDetail.required')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">
                        {t('productDetail.preferredDate')} {t('productDetail.required')}
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-stone-700 mb-2 font-medium">
                      {t('productDetail.preferredTime')} {t('productDetail.required')}
                    </label>
                    <select
                      required
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                      <option value="">{t('productDetail.selectTime')}</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:30 PM">3:30 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-stone-700 mb-2 font-medium">
                      {t('productDetail.additionalNotes')}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                      placeholder={t('productDetail.notesPlaceholder')}
                    />
                  </div>

                  {/* Total */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-stone-700">{t('productDetail.total')}:</span>
                      <span className="text-3xl font-light text-emerald-600">
                        ${product.price}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 mt-2">
                      {t('productDetail.paymentSecure')}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-lg font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    {t('productDetail.completeBooking')}
                  </motion.button>

                  <p className="text-xs text-stone-500 text-center">
                    {t('productDetail.termsText')}
                  </p>
                </form>
              </div>
            </BackdropBlurCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
