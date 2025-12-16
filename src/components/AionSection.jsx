import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Brain, Users, DollarSign, Activity, Wine } from 'lucide-react'

const AionSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const problems = [
    {
      icon: Heart,
      text: 'Las mismas relaciones, diferentes personas',
      delay: 0.2
    },
    {
      icon: Brain,
      text: 'Ansiedad y depresión que no ceden',
      delay: 0.3
    },
    {
      icon: Users,
      text: 'Conflictos que nunca se resuelven',
      delay: 0.4
    },
    {
      icon: DollarSign,
      text: 'Dinero que llega y se va sin control',
      delay: 0.5
    },
    {
      icon: Activity,
      text: 'Síntomas físicos sin causa aparente',
      delay: 0.6
    },
    {
      icon: Wine,
      text: 'Adicciones que prometes superar',
      delay: 0.7
    }
  ]

  return (
    <section 
      ref={ref}
      className="relative bg-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Orbs premium con más profundidad */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            x: [0, -40, 0],
            y: [0, -20, 0],
            opacity: [0.12, 0.2, 0.12]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-fuchsia-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 mb-8"
          >
            <Brain className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm text-white/80 font-light tracking-wide uppercase">
              El Problema Real
            </span>
          </motion.div>

          {/* Pregunta directa */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-6xl font-light text-white mb-6 leading-tight"
          >
            ¿Te Has Preguntado Por Qué
            <br />
            <motion.span 
              className="font-normal bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ['0%', '100%', '0%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 100%'
              }}
            >
              Nada Cambia?
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Grid de problemas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-16 lg:mb-20"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: problem.delay }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative p-6 lg:p-7 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/10 group-hover:to-fuchsia-500/10 rounded-3xl transition-all duration-500"
              />
              
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors duration-300">
                  <problem.icon className="w-5 h-5 text-purple-300 group-hover:text-fuchsia-300 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <p className="text-white/70 text-base lg:text-[17px] font-light leading-relaxed group-hover:text-white/95 transition-colors duration-300">
                  {problem.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revelación */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Texto breve */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-white/60 text-lg lg:text-xl font-light mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Todo lo que experimentas es el resultado de{' '}
            <span className="text-white/90">filtros inconscientes</span> que puedes transformar.
          </motion.p>

          {/* CTA Premium - Ver el Método */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link
              to="/metodo"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white rounded-full font-light text-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/50"
              style={{ backgroundSize: '200% 100%' }}
            >
              <motion.div
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ width: '50%' }}
              />
              
              <span className="relative z-10">Ver Mi Método</span>
              <motion.svg 
                className="relative z-10 w-5 h-5"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AionSection
