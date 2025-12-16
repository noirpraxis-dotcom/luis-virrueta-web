import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Sparkles, ArrowRight } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const MetodoPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const questionCards = [
    {
      emoji: '🧬',
      question: '¿Cómo puede una enfermedad construirse desde la mente?',
      answer: 'Los estudios más rigurosos en epigenética demuestran que tus pensamientos alteran la expresión genética y construyen o destruyen tu salud.',
      delay: 0.3
    },
    {
      emoji: '💰',
      question: '¿Mi dinero depende de mi mente?',
      answer: 'La psicología económica explica que el mercado, la bolsa de valores y tu situación financiera se mueven por patrones inconscientes, no por números.',
      delay: 0.5
    },
    {
      emoji: '❤️',
      question: '¿Mis relaciones son un reflejo interno?',
      answer: 'La neurociencia afectiva confirma que repites los mismos vínculos porque tu cerebro busca lo familiar, no lo sano.',
      delay: 0.7
    }
  ]

  return (
    <>
      <SEOHead 
        title="El Método Aión | Luis Virrueta"
        description="Descubre el método que transforma los filtros inconscientes que construyen tu realidad: salud, relaciones, dinero y emociones."
        image="/og-metodo.jpg"
        url="/metodo"
        type="website"
      />

      <div ref={ref} className="min-h-screen bg-black pt-24 lg:pt-32 pb-20 overflow-hidden">
        {/* Orbs de fondo */}
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
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
          {/* Badge de entrada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
              <Sparkles className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
              <span className="text-xs sm:text-sm text-white/80 font-light tracking-wide uppercase">
                El Método
              </span>
            </div>
          </motion.div>

          {/* Pregunta reflexiva inicial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center mb-16 lg:mb-20"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light text-white/90 mb-8 leading-tight">
              ¿Qué pasaría si te dijera que
              <br />
              <span className="text-white">tu salud, tus relaciones, tu dinero...</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-2xl lg:text-4xl font-light text-white/70 mb-6"
            >
              <span className="line-through text-white/40">No son tu realidad</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-3xl lg:text-5xl font-normal bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent"
            >
              Son solo tus <span className="italic">filtros operando</span>
            </motion.p>
          </motion.div>

          {/* Divisor elegante */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-16 lg:mb-20"
          />

          {/* Preguntas escépticas con respuestas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-8 lg:space-y-10 mb-20"
          >
            {questionCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: card.delay }}
                className="group relative"
              >
                {/* Card de pregunta */}
                <div className="relative p-8 lg:p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl hover:border-purple-500/40 transition-all duration-500">
                  {/* Glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/5 group-hover:to-fuchsia-500/5 rounded-3xl transition-all duration-500"
                  />
                  
                  <div className="relative space-y-4">
                    {/* Pregunta */}
                    <div className="flex items-start gap-4">
                      <span className="text-3xl lg:text-4xl flex-shrink-0">{card.emoji}</span>
                      <p className="text-xl lg:text-2xl font-light text-white/80 italic leading-relaxed">
                        {card.question}
                      </p>
                    </div>
                    
                    {/* Divisor */}
                    <div className="h-px bg-gradient-to-r from-purple-400/20 via-fuchsia-400/20 to-transparent ml-16" />
                    
                    {/* Respuesta */}
                    <div className="ml-16">
                      <div className="flex items-start gap-2 mb-2">
                        <ArrowRight className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" strokeWidth={1.5} />
                        <p className="text-base lg:text-lg font-light text-white/60 leading-relaxed">
                          {card.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Cierre antes de AIÓN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-center mb-16"
          >
            <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed mb-8">
              Cada área de tu vida refleja el <span className="text-white">filtro</span> con el que la miras.
              <br />
              <span className="text-white/90">Cuando cambias el filtro...</span>
            </p>
          </motion.div>

          {/* AIÓN - Título grande */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-center mb-12"
          >
            <motion.h2
              animate={{
                textShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                  '0 0 40px rgba(217, 70, 239, 0.6)',
                  '0 0 20px rgba(168, 85, 247, 0.4)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl lg:text-8xl font-light tracking-wider text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text mb-8"
            >
              AIÓN
            </motion.h2>
            
            <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed max-w-3xl mx-auto">
              Es el método que creé para{' '}
              <span className="text-purple-300">identificar</span> qué filtros inconscientes están construyendo tu experiencia actual, y cómo{' '}
              <span className="text-fuchsia-300 font-normal">transformarlos</span> para que{' '}
              <span className="text-white">todo cambie</span>.
            </p>
          </motion.div>

          {/* Box premium con shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.6 }}
            className="relative p-10 lg:p-14 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 backdrop-blur-2xl border-2 border-purple-500/40 rounded-[2rem] overflow-hidden mb-16"
          >
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-[2rem]"
            />
            
            <motion.div
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ width: '50%' }}
            />
            
            <div className="relative space-y-6">
              <p className="text-2xl lg:text-4xl font-light text-white/90 leading-relaxed">
                Tu <span className="font-normal text-white">realidad</span> son tus{' '}
                <span className="font-normal bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  filtros operando
                </span>
              </p>
              
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
              
              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                La <span className="text-purple-300">salud</span>, las <span className="text-fuchsia-300">relaciones</span>,
                las <span className="text-violet-300">emociones</span>, la <span className="text-purple-300">economía</span>...
                <br className="hidden lg:block" />
                <span className="text-white/90">Solo corresponden al filtro actual que sostienes</span>
                <span className="text-white/50"> sin que te des cuenta</span>
              </p>
            </div>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-center"
          >
            <a
              href={`https://wa.me/420776711575?text=${encodeURIComponent('Hola Luis, quiero conocer Aión')}`}
              target="_blank"
              rel="noopener noreferrer"
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
              
              <span className="relative z-10">Hablemos de Tu Situación</span>
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
            </a>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default MetodoPage
