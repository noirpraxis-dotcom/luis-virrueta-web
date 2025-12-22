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
      name: 'Sesión Individual',
      category: 'Terapia Individual',
      price: '$750',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=800&fit=crop',
      description: 'Sesión de psicoterapia individual enfocada en transformación personal. Trabajo profundo con el inconsciente.',
      benefits: [
        'Trabajo con el inconsciente',
        'Transformación de patrones',
        'Herramientas prácticas',
        'Enfoque psicoanalítico'
      ]
    },
    {
      id: 2,
      name: 'Sesión de Pareja',
      category: 'Terapia de Pareja',
      price: '$1,500',
      duration: '90 min',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=800&fit=crop',
      description: 'Sesión terapéutica para parejas. Trabajamos los vínculos inconscientes y patrones repetitivos en la relación.',
      benefits: [
        'Comprensión de dinámicas',
        'Patrones relacionales',
        'Comunicación profunda',
        'Trabajo con transferencia'
      ]
    },
    {
      id: 3,
      name: 'Sesión Familiar',
      category: 'Terapia Familiar',
      price: '$1,700',
      duration: '90 min',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=800&fit=crop',
      description: 'Sesión familiar donde trabajamos las dinámicas transgeneracionales y los mandatos inconscientes.',
      benefits: [
        'Análisis transgeneracional',
        'Dinámicas familiares',
        'Mandatos inconscientes',
        'Transformación grupal'
      ]
    },
    {
      id: 4,
      name: 'Paquete 4 Sesiones Individuales',
      category: 'Ahorra 20%',
      price: '$2,400',
      originalPrice: '$3,000',
      duration: '4 sesiones de 60 min',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=800&fit=crop',
      description: 'Paquete de 4 sesiones individuales con 20% de descuento. Ideal para procesos de transformación que requieren continuidad.',
      benefits: [
        'Ahorro de $600',
        'Proceso continuo',
        'Seguimiento personalizado',
        'Programación flexible'
      ]
    },
    {
      id: 5,
      name: 'Paquete 4 Sesiones de Pareja',
      category: 'Ahorra 20%',
      price: '$4,800',
      originalPrice: '$6,000',
      duration: '4 sesiones de 90 min',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      description: 'Paquete de 4 sesiones de pareja con 20% de descuento. Trabajo profundo en las dinámicas relacionales.',
      benefits: [
        'Ahorro de $1,200',
        'Transformación sostenida',
        'Acompañamiento profundo',
        'Flexibilidad de horarios'
      ]
    },
    {
      id: 6,
      name: 'Paquete 4 Sesiones Familiares',
      category: 'Ahorra 20%',
      price: '$5,440',
      originalPrice: '$6,800',
      duration: '4 sesiones de 90 min',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=800&fit=crop',
      description: 'Paquete de 4 sesiones familiares con 20% de descuento. Trabajo transgeneracional profundo.',
      benefits: [
        'Ahorro de $1,360',
        'Proceso familiar continuo',
        'Análisis profundo',
        'Transformación grupal'
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
                <motion.img
                  src={product.image}
                  alt={product.name}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category badge overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full">
                    <p className="text-stone-700 text-sm font-medium tracking-wider" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      {product.category}
                    </p>
                  </div>
                </div>
                
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
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <span className="text-stone-400 text-sm line-through font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="text-amber-700 text-2xl font-light" style={{ fontFamily: 'Gotham, sans-serif' }}>
                      {product.price}
                    </span>
                  </div>
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
