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

  const products = [
    {
      id: 1,
      name: 'Online Session - Single',
      category: 'Emotion, Body & Belief Code',
      price: '$80',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=800&fit=crop',
      description: 'Release trapped emotions, correct body imbalances, and transform limiting beliefs in a comprehensive online healing session.',
      benefits: [
        'Release emotional baggage',
        'Balance energy systems',
        'Transform limiting beliefs',
        'Holistic healing approach'
      ]
    },
    {
      id: 2,
      name: 'Online Session - 3 Pack',
      category: 'Emotion, Body & Belief Code',
      price: '$216',
      duration: '60 min per session',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=800&fit=crop',
      description: 'Save 10% with this package of three comprehensive online healing sessions for deeper transformation.',
      benefits: [
        'Save 10% on sessions',
        'Deeper healing journey',
        'Consistent progress',
        'Flexible scheduling'
      ]
    },
    {
      id: 3,
      name: 'Email Session - Single',
      category: 'Remote Healing',
      price: '$63',
      duration: 'Asynchronous',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=800&fit=crop',
      description: 'Receive healing work via email at your convenience. Perfect for those with busy schedules or time zone differences.',
      benefits: [
        'Work at your own pace',
        'No scheduling needed',
        'Detailed written report',
        'Privacy and convenience'
      ]
    },
    {
      id: 4,
      name: 'Past Life Regression',
      category: 'Deep Soul Work',
      price: '$120',
      duration: '90 min',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=800&fit=crop',
      description: 'Explore past lives to understand current patterns, relationships, and challenges. Gain profound insights and healing.',
      benefits: [
        'Understand life patterns',
        'Heal deep-rooted issues',
        'Gain spiritual insights',
        'Release karmic patterns'
      ]
    },
    {
      id: 5,
      name: 'Ilyari Channeled Session',
      category: 'Light Code Transmission',
      price: '$44',
      duration: '20-30 min',
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
      category: 'Pet Healing',
      price: '$56',
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
          
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              onClick={() => navigate(`/store/${product.id}`)}
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
    </section>
  )
}

export default Store
