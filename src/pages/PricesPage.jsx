import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GradientLine, BackdropBlurCard } from '../elementos/ElementosReutilizables'

const PricesPage = () => {
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
      color: 'from-[#8dc1ab] to-teal-600',
      borderColor: 'border-[#8dc1ab]'
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
              className="text-stone-800 text-6xl lg:text-8xl font-light tracking-[0.2em] mb-8"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              PRICES
            </motion.h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-80 mb-8"
            />
            
            <p className="text-stone-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Invest in your healing journey with flexible options designed to support deep transformation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prices Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prices.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {option.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium z-10">
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
                          <svg className="w-5 h-5 text-[#8dc1ab] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </section>
    </div>
  )
}

export default PricesPage
