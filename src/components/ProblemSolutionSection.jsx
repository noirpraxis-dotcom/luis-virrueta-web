import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { CircleDot, Zap, RefreshCw } from 'lucide-react'

const ProblemSolutionSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section 
      ref={ref}
      className="relative bg-black py-32 lg:py-40 overflow-hidden"
    >
      {/* Orbs sutiles de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-fuchsia-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
        {/* Contenedor principal con bordes elegantes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Decoración superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-12" />

          {/* Ícono central superior */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl backdrop-blur-sm">
              <CircleDot className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Texto principal 1 - Problema es la solución */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-6">
              Aquello que llamas{' '}
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text font-normal">
                problema
              </span>
              <br />
              suele ser la{' '}
              <span className="text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text font-normal">
                solución
              </span>
              {' '}que sostiene tu realidad.
            </h2>
          </motion.div>

          {/* Tarjetas con íconos - El cuerpo, emoción, economía, vínculos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16"
          >
            {[
              { label: 'El cuerpo', delay: 0.6 },
              { label: 'La emoción', delay: 0.7 },
              { label: 'La economía', delay: 0.8 },
              { label: 'Los vínculos', delay: 0.9 }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: item.delay }}
                className="group relative p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/40 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/5 group-hover:to-fuchsia-500/5 rounded-2xl transition-all duration-500" />
                <p className="relative text-white/80 text-sm lg:text-base font-light text-center">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Texto de continuación */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl lg:text-2xl text-white/70 font-light text-center leading-relaxed mb-8"
          >
            cargan con ese equilibrio para que nada esencial cambie.
          </motion.p>

          {/* Separador con ícono */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex items-center justify-center gap-4 my-12"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30" />
            <RefreshCw className="w-5 h-5 text-purple-400/60" strokeWidth={1.5} />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30" />
          </motion.div>

          {/* Texto final - Reorganización */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-center mb-16"
          >
            <p className="text-xl lg:text-2xl text-white/70 font-light leading-relaxed mb-4">
              Cuando ese sistema cae,{' '}
              <span className="text-white/90 font-normal">no se mejora una parte:</span>
            </p>
            <p className="text-2xl lg:text-3xl text-white font-light leading-tight">
              se reorganiza{' '}
              <span className="text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text font-normal">
                toda la experiencia de vida
              </span>
              .
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex justify-center"
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
              
              <span className="relative z-10">Ver el Método</span>
              <Zap className="relative z-10 w-5 h-5" strokeWidth={2} />
            </Link>
          </motion.div>

          {/* Decoración inferior */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mt-12" />
        </motion.div>
      </div>
    </section>
  )
}

export default ProblemSolutionSection
