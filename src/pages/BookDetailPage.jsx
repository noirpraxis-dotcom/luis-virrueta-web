import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CinematicTitle, GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const BookDetailPage = () => {
  const { t } = useLanguage()
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  // Datos del libro - en producción vendría de una API o contexto
  const book = {
    id: 'the-journey-within',
    title: 'The Journey Within',
    subtitle: 'A Guide to Self-Discovery and Healing',
    author: 'Zuzana Erdösová',
    description: 'A profound exploration into the depths of consciousness, this book guides you through transformative practices and ancient wisdom. Discover tools for emotional healing, spiritual growth, and self-realization.',
    fullDescription: `This comprehensive guide takes you on a journey through the landscapes of your inner world. Through carefully crafted exercises, meditations, and reflections, you'll learn to:\n\n• Release emotional blockages and limiting beliefs\n• Connect with your authentic self\n• Discover your life's purpose\n• Heal past traumas with compassion\n• Cultivate inner peace and joy\n\nDrawing from years of experience in energy healing and spiritual guidance, this book offers practical wisdom that you can apply immediately to transform your life.`,
    coverImage: '/book-cover-1.jpg',
    pages: 240,
    language: 'English',
    format: 'PDF',
    fileSize: '2.5 MB',
    chapters: 12,
    supportersCount: 547
  }

  // Montos sugeridos con copy persuasivo
  const suggestedAmounts = [
    { 
      value: 5, 
      label: '$5',
      description: t('bookDetail.coffee'),
      popular: false
    },
    { 
      value: 15, 
      label: '$15',
      description: t('bookDetail.supportWork'),
      popular: true // Este es el más popular
    },
    { 
      value: 30, 
      label: '$30',
      description: t('bookDetail.generousSupporter'),
      popular: false
    }
  ]

  const handleDownload = (withDonation = false) => {
    if (withDonation && selectedAmount === null && !customAmount) {
      // Si intentan con donación pero no seleccionaron monto
      return
    }

    if (withDonation) {
      // Aquí iría la integración con el sistema de pago
      console.log('Processing donation:', selectedAmount || customAmount)
      setShowThankYou(true)
      setTimeout(() => {
        // Simular descarga del libro
        alert('Thank you! Your book is downloading...')
        setShowThankYou(false)
      }, 2000)
    } else {
      // Descarga gratuita
      alert('Your book is downloading...')
    }
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
          onClick={() => navigate('/books')}
          className="flex items-center gap-2 text-stone-600 hover:text-emerald-600 transition-colors duration-300"
        >
          <span className="text-xl">←</span>
          <span className="tracking-wide">{t('bookDetail.backToBooks')}</span>
        </button>
      </motion.div>

      <div className="pb-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Book Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 mb-20"
          >
            {/* Book Cover - 2 columnas */}
            <div className="lg:col-span-2">
              <BackdropBlurCard className="sticky top-40">
                <div className="aspect-[2/3] bg-gradient-to-br from-emerald-400/20 to-amber-400/20 rounded-lg overflow-hidden">
                  {/* Placeholder - reemplazar con imagen real */}
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-12">
                      <div className="text-9xl mb-6">📖</div>
                      <p className="text-stone-400">{t('bookDetail.coverComingSoon')}</p>
                    </div>
                  </div>
                </div>

                {/* Book Stats */}
                <div className="mt-6 p-6 bg-white/50 rounded-lg space-y-3 text-sm text-stone-600">
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span className="font-medium">{book.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{book.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="font-medium">{book.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chapters:</span>
                    <span className="font-medium">{book.chapters}</span>
                  </div>
                </div>
              </BackdropBlurCard>
            </div>

            {/* Book Description - 3 columnas */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl lg:text-5xl font-light text-stone-800 mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {book.title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-emerald-600 mb-2 font-medium"
                >
                  {book.subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-stone-600"
                >
                  by {book.author}
                </motion.p>
              </div>

              <GradientLine />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="prose prose-lg max-w-none"
              >
                <p className="text-stone-700 leading-relaxed mb-6">
                  {book.description}
                </p>
                
                <div className="whitespace-pre-line text-stone-600 leading-relaxed">
                  {book.fullDescription}
                </div>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-6"
              >
                <p className="text-emerald-800 text-center">
                  <span className="font-semibold text-2xl">{book.supportersCount}+</span> readers have supported this work
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Donation Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <BackdropBlurCard className="max-w-4xl mx-auto">
              <div className="p-8 lg:p-12">
                <h2 
                  className="text-3xl lg:text-4xl font-light text-stone-800 text-center mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {t('bookDetail.chooseContribution')}
                </h2>
                
                <p className="text-stone-600 text-center mb-8 max-w-2xl mx-auto">
                  {t('bookDetail.contributionText')}
                </p>

                {/* Suggested Amounts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {suggestedAmounts.map((amount) => (
                    <motion.button
                      key={amount.value}
                      onClick={() => {
                        setSelectedAmount(amount.value)
                        setCustomAmount('')
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
                        selectedAmount === amount.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-stone-200 bg-white hover:border-emerald-300'
                      }`}
                    >
                      {amount.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {t('bookDetail.mostPopular')}
                        </div>
                      )}
                      
                      <div className="text-3xl font-light mb-2 text-stone-800">
                        {amount.label}
                      </div>
                      <div className="text-sm text-stone-600">
                        {amount.description}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-8">
                  <label className="block text-stone-700 mb-2 text-center">
                    Or enter a custom amount
                  </label>
                  <div className="max-w-xs mx-auto relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 text-lg">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(null)
                      }}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-center text-lg"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Primary CTA - Donation */}
                  <motion.button
                    onClick={() => handleDownload(true)}
                    disabled={selectedAmount === null && !customAmount}
                    whileHover={{ scale: selectedAmount || customAmount ? 1.02 : 1 }}
                    whileTap={{ scale: selectedAmount || customAmount ? 0.98 : 1 }}
                    className={`w-full py-4 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                      selectedAmount || customAmount
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedAmount || customAmount 
                      ? `${t('bookDetail.supportAndDownload').replace('{amount}', selectedAmount || customAmount)} 🌱`
                      : t('bookDetail.selectAmount')
                    }
                  </motion.button>

                  {/* Secondary CTA - Free Download (menos prominente) */}
                  <motion.button
                    onClick={() => handleDownload(false)}
                    whileHover={{ scale: 1.01 }}
                    className="w-full py-3 text-stone-500 hover:text-stone-700 text-sm transition-colors duration-300"
                  >
                    {t('bookDetail.continueWithout')}
                  </motion.button>
                </div>

                {/* Small Persuasive Text */}
                <p className="text-xs text-stone-400 text-center mt-6">
                  {t('bookDetail.supportHelps')}
                </p>
              </div>
            </BackdropBlurCard>
          </motion.div>
        </div>
      </div>

      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-12 max-w-md text-center"
            >
              <svg className="w-20 h-20 text-emerald-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <h3 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t('bookDetail.thankYou')}
              </h3>
              <p className="text-stone-600">
                {t('bookDetail.thankYouMessage')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookDetailPage
