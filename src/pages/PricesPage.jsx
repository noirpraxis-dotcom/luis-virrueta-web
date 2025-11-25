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
      bgColor: 'bg-[#8dc1ab]',
      hoverBg: 'hover:bg-[#7ab09a]',
      borderColor: 'border-stone-200',
      iconBg: 'bg-[#8dc1ab]/20',
      iconColor: 'text-[#8dc1ab]'
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
      bgColor: 'bg-amber-600',
      hoverBg: 'hover:bg-amber-700',
      borderColor: 'border-stone-200',
      iconBg: 'bg-amber-600/20',
      iconColor: 'text-amber-600',
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
      bgColor: 'bg-stone-700',
      hoverBg: 'hover:bg-stone-800',
      borderColor: 'border-stone-200',
      iconBg: 'bg-stone-700/20',
      iconColor: 'text-stone-700'
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
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium z-10 shadow-lg">
                    Most Popular
                  </div>
                )}
                <BackdropBlurCard className={`h-full ${option.borderColor} border-2 ${option.popular ? 'shadow-2xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
                  <div className="p-8 lg:p-10">
                    <div className={`${option.iconBg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 ${option.borderColor} shadow-md`}>
                      <svg className={`w-10 h-10 ${option.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    
                    <h3 
                      className="text-2xl lg:text-3xl font-light text-stone-800 text-center mb-4 tracking-wide"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {option.title}
                    </h3>
                    
                    <div className="text-center mb-2">
                      <span className="text-5xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{option.price}</span>
                    </div>
                    
                    <p className="text-center text-stone-500 mb-8 text-base font-light italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{option.duration}</p>
                    
                    {/* Decorative divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-8"
                    />
                    
                    <ul className="space-y-4 mb-10">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-stone-600">
                          <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${option.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-base font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full ${option.bgColor} ${option.hoverBg} text-white py-4 rounded-full font-light text-lg tracking-wide shadow-lg hover:shadow-xl transition-all duration-300`}
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
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
