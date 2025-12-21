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
      name: 'Sesión Individual de Terapia',
      category: 'Psicoterapia Online',
      price: '$80',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=800&fit=crop',
      description: 'Sesión de psicoterapia individual enfocada en transformación personal a través del método AION©. Trabajo profundo con el inconsciente.',
      benefits: [
        'Trabajo con el inconsciente',
        'Transformación de patrones limitantes',
        'Herramientas prácticas aplicables',
        'Enfoque integrativo'
      ]
    },
    {
      id: 2,
      name: 'Paquete 3 Sesiones',
      category: 'Proceso Terapéutico',
      price: '$216',
      duration: '60 min por sesión',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=800&fit=crop',
      description: 'Ahorra 10% con este paquete de tres sesiones. Ideal para procesos de transformación que requieren continuidad y profundidad.',
      benefits: [
        'Ahorro del 10%',
        'Proceso terapéutico continuo',
        'Seguimiento personalizado',
        'Programación flexible'
      ]
    },
    {
      id: 3,
      name: 'Consultoría Empresarial',
      category: 'Psicología Organizacional',
      price: '$120',
      duration: '90 min',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=800&fit=crop',
      description: 'Aplicación de psicología organizacional para equipos y empresas. Mejora el clima laboral y la productividad desde el inconsciente colectivo.',
      benefits: [
        'Análisis del clima organizacional',
        'Dinámicas de grupo',
        'Estrategias de comunicación',
        'Plan de acción personalizado'
      ]
    },
    {
      id: 4,
      name: 'Taller Método AION©',
      category: 'Desarrollo Personal',
      price: '$150',
      duration: '3 horas',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=800&fit=crop',
      description: 'Taller grupal donde aprenderás las bases del Método AION© para aplicarlo en tu vida diaria. Incluye material descargable.',
      benefits: [
        'Comprende tu realidad actual',
        'Identifica filtros limitantes',
        'Herramientas de transformación',
        'Comunidad de práctica'
      ]
    },
    {
      id: 5,
      name: 'Programa de 8 Semanas',
      category: 'Transformación Profunda',
      price: '$560',
      duration: '8 sesiones semanales',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      description: 'Programa intensivo de transformación personal. Incluye sesiones semanales, ejercicios prácticos y acompañamiento vía WhatsApp.',
      benefits: [
        'Transformación sostenida',
        'Acompañamiento continuo',
        'Ejercicios semanales',
        'Acceso a comunidad privada'
      ]
    },
    {
      id: 6,
      name: 'Asesoría para Psicólogos',
      category: 'Desarrollo Profesional',
      price: '$95',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=800&fit=crop',
      description: 'Supervisión y mentoría para psicólogos que quieren integrar el método AION© en su práctica profesional.',
      benefits: [
        'Supervisión de casos',
        'Integración del método AION©',
        'Desarrollo profesional',
        'Certificación disponible'
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
