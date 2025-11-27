import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { TrendingUp, Award } from 'lucide-react'

/**
 * AnimatedStats Component
 * Números contadores animados con efecto premium
 * Usado en sitios de Stripe, Vercel, Linear
 */
const AnimatedStats = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    {
      value: 50,
      suffix: '+',
      label: 'Proyectos Completados',
      description: 'Marcas transformadas con psicoanálisis + IA',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      value: 95,
      suffix: '%',
      label: 'Tasa de Satisfacción',
      description: 'Clientes que vuelven a trabajar conmigo',
      gradient: 'from-fuchsia-500 to-fuchsia-600'
    },
    {
      value: 8,
      suffix: '+',
      label: 'Años de Experiencia',
      description: 'Diseño, desarrollo y psicología aplicada',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      value: 100,
      suffix: '%',
      label: 'Código Propio',
      description: 'Sin plantillas, todo desarrollado desde cero',
      gradient: 'from-emerald-500 to-emerald-600'
    }
  ]

  return (
    <section 
      ref={ref}
      className="relative bg-gradient-to-b from-black via-zinc-950 to-black py-20 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16 sm:mb-20 lg:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-emerald-400 mb-4" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 tracking-[0.1em] font-display">
            RESULTADOS MEDIBLES
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto w-48 sm:w-64 lg:w-80"
          />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.label} 
              stat={stat} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const StatCard = ({ stat, index, isInView }) => {
  const countRef = useRef(null)
  const count = useMotionValue(0)
  const rounded = useSpring(count, {
    damping: 50,
    stiffness: 100
  })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        count.set(stat.value)
      }, index * 200)

      return () => clearTimeout(timer)
    }
  }, [isInView, count, stat.value, index])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (countRef.current) {
        countRef.current.textContent = Math.floor(latest)
      }
    })

    return unsubscribe
  }, [rounded])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group relative"
    >
      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-white/20 transition-all duration-500 h-full overflow-hidden">
        {/* Hover glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-2xl`}
        />

        {/* Number */}
        <div className="relative mb-4 sm:mb-6">
          <div className={`text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-display`}>
            <span ref={countRef}>0</span>
            <span>{stat.suffix}</span>
          </div>
        </div>

        {/* Label */}
        <h3 className="text-lg sm:text-xl font-medium text-white mb-2 sm:mb-3 font-display">
          {stat.label}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-white/60 leading-relaxed font-light font-body">
          {stat.description}
        </p>

        {/* Bottom gradient line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} origin-left`}
        />
      </div>

      {/* External glow on hover */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}
      />
    </motion.div>
  )
}

export default AnimatedStats
