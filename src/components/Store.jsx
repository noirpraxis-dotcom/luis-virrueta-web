import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CinematicTitle, GradientLine } from '../elementos/ElementosReutilizables'
import { useLanguage } from '../context/LanguageContext'

const Store = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const navigate = useNavigate()
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedProduct, setSelectedProduct] = useState(null)

  const products = [
    {
      id: 1,
      name: 'Emotion Code Session',
      category: 'Healing Session',
      price: '$120',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=800&fit=crop',
      description: 'Release trapped emotions that may be creating physical and emotional problems. The Emotion Code is a powerful method for identifying and releasing trapped emotions.',
      benefits: [
        'Release emotional baggage',
        'Reduce physical discomfort',
        'Improve relationships',
        'Enhance overall well-being'
      ]
    },
    {
      id: 2,
      name: 'Body Code Session',
      category: 'Healing Session',
      price: '$130',
      duration: '75 min',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=800&fit=crop',
      description: 'Discover and correct imbalances in the body that may be causing physical and emotional issues. A comprehensive approach to healing.',
      benefits: [
        'Balance energy systems',
        'Address root causes',
        'Holistic healing approach',
        'Personalized treatment'
      ]
    },
    {
      id: 3,
      name: 'Belief Code Session',
      category: 'Healing Session',
      price: '$130',
      duration: '75 min',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=800&fit=crop',
      description: 'Identify and release limiting beliefs and negative thought patterns that hold you back from achieving your full potential.',
      benefits: [
        'Transform limiting beliefs',
        'Clear mental blocks',
        'Enhance personal growth',
        'Achieve your goals'
      ]
    },
    {
      id: 4,
      name: 'Past Life Regression',
      category: 'Healing Session',
      price: '$150',
      duration: '90 min',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=800&fit=crop',
      description: 'Explore past lives to understand current life patterns, relationships, and challenges. Gain profound insights and healing.',
      benefits: [
        'Understand life patterns',
        'Heal deep-rooted issues',
        'Gain spiritual insights',
        'Release karmic patterns'
      ]
    },
    {
      id: 5,
      name: 'Ilyari Somatic Transmission',
      category: 'Healing Session',
      price: '$140',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      description: 'Experience channeled light codes transmitted through the body for deep cellular healing and transformation.',
      benefits: [
        'Cellular level healing',
        'Light code activation',
        'Deep transformation',
        'Spiritual alignment'
      ]
    },
    {
      id: 6,
      name: 'Healing for Animals',
      category: 'Healing Session',
      price: '$100',
      duration: '45 min',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=800&fit=crop',
      description: 'Energy healing sessions specifically designed for your beloved animal companions to support their health and well-being.',
      benefits: [
        'Reduce animal stress',
        'Support physical healing',
        'Emotional balance',
        'Strengthen bond'
      ]
    }
  ]

  return (
    <section 
      id="store"
      ref={ref}
      className="relative min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 py-32 lg:py-40 overflow-hidden"
    >
      {/* Efectos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.04, scale: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Título */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-stone-800 text-6xl lg:text-8xl font-light tracking-[0.2em] mb-8"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            {t('store.title').toUpperCase()}
          </motion.h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-stone-600 text-lg lg:text-xl font-light tracking-wide mt-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            {t('store.subtitle')}
          </motion.p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              onClick={() => setSelectedProduct(product)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-amber-600/10"
            >
              {/* Imagen */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-stone-200" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="relative h-full flex items-center justify-center"
                >
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-3 bg-amber-600/10 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-stone-500 text-sm tracking-wider" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      {product.category}
                    </p>
                  </div>
                </motion.div>

                {/* Overlay en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Badge de duración */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-stone-700 text-sm font-light tracking-wide" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    {product.duration}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-stone-800 text-xl lg:text-2xl font-light tracking-wide mb-3" style={{ fontFamily: 'Gotham, sans-serif' }}>
                  {product.name}
                </h3>
                
                <p className="text-stone-600 text-sm leading-relaxed mb-4 font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                  {product.description.substring(0, 100)}...
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <span className="text-amber-700 text-2xl font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    {product.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="text-stone-700 hover:text-amber-700 text-sm tracking-wider uppercase font-light flex items-center gap-2 transition-colors"
                    style={{ fontFamily: 'Gotham, sans-serif' }}
                  >
                    {t('store.learnMore')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de producto */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
            >
              <svg className="w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Contenido del modal */}
            <div className="p-8 lg:p-12">
              <span className="text-amber-600 text-sm tracking-wider uppercase font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                {selectedProduct.category}
              </span>
              
              <h2 className="text-stone-800 text-4xl lg:text-5xl font-light tracking-wide mt-2 mb-6" style={{ fontFamily: 'Gotham, sans-serif' }}>
                {selectedProduct.name}
              </h2>

              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-stone-200">
                <div>
                  <span className="text-amber-700 text-4xl font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    {selectedProduct.price}
                  </span>
                </div>
                <div className="text-stone-600">
                  <span className="text-sm tracking-wide font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                    Duration: {selectedProduct.duration}
                  </span>
                </div>
              </div>

              <p className="text-stone-700 text-lg leading-relaxed mb-8 font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                {selectedProduct.description}
              </p>

              <h3 className="text-stone-800 text-xl font-light tracking-wide mb-4" style={{ fontFamily: 'Gotham, sans-serif' }}>
                Benefits
              </h3>
              <ul className="space-y-3 mb-10">
                {selectedProduct.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-600 mt-1">✓</span>
                    <span className="text-stone-600 font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <motion.button
                  onClick={() => {
                    setSelectedProduct(null)
                    navigate(`/store/${selectedProduct.id}`)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full text-lg tracking-[0.2em] uppercase font-light transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  View Full Details & Book
                </motion.button>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full py-3 text-stone-500 hover:text-stone-700 text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default Store
