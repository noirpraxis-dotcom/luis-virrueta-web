import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, TrendingUp, Activity, Smile, Sparkles, Brain } from 'lucide-react'

const AionSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  // Estados para palabras rotativas
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const rotatingWords = [
    { word: 'económica', icon: TrendingUp, color: 'from-green-400 to-emerald-500' },
    { word: 'de salud', icon: Activity, color: 'from-red-400 to-rose-500' },
    { word: 'amorosa', icon: Heart, color: 'from-pink-400 to-rose-500' },
    { word: 'emocional', icon: Smile, color: 'from-purple-400 to-fuchsia-500' },
    { word: 'profesional', icon: Brain, color: 'from-indigo-400 to-purple-500' },
    { word: 'de vida', icon: Sparkles, color: 'from-cyan-400 to-blue-500' }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Tarjetas elegantes de áreas de transformación
  const transformationAreas = [
    {
      icon: TrendingUp,
      title: 'Económica',
      description: 'Cuando el filtro cambia, el dinero deja de ser escasez',
      points: ['Relación inconsciente con la abundancia', 'Mandatos familiares sobre el dinero', 'Goce en la privación'],
      gradient: 'from-green-500/20 to-emerald-600/20',
      borderColor: 'border-green-500/30 hover:border-green-400/60',
      iconColor: 'text-green-400',
      delay: 0.2
    },
    {
      icon: Activity,
      title: 'De salud',
      description: 'El cuerpo habla lo que la palabra no puede decir',
      points: ['Síntoma como mensaje del inconsciente', 'Ganancia secundaria de la enfermedad', 'Conversión somática del conflicto'],
      gradient: 'from-red-500/20 to-rose-600/20',
      borderColor: 'border-red-500/30 hover:border-red-400/60',
      iconColor: 'text-red-400',
      delay: 0.3
    },
    {
      icon: Heart,
      title: 'Amorosa',
      description: 'Repites porque algo no ha sido simbolizado',
      points: ['Elección de objeto inconsciente', 'Repetición del fantasma primordial', 'Transferencia en vínculo amoroso'],
      gradient: 'from-pink-500/20 to-rose-600/20',
      borderColor: 'border-pink-500/30 hover:border-pink-400/60',
      iconColor: 'text-pink-400',
      delay: 0.4
    },
    {
      icon: Smile,
      title: 'Emocional',
      description: 'Lo que cargas no es tuyo, es de quien no pudo procesarlo',
      points: ['Trauma transgeneracional', 'Identificación inconsciente con el síntoma', 'Duelo no elaborado'],
      gradient: 'from-purple-500/20 to-fuchsia-600/20',
      borderColor: 'border-purple-500/30 hover:border-purple-400/60',
      iconColor: 'text-purple-400',
      delay: 0.5
    },
    {
      icon: Brain,
      title: 'Profesional',
      description: 'Tu bloqueo protege algo que ya no necesita protección',
      points: ['Inhibición del deseo de saber', 'Sabotaje inconsciente del éxito', 'Identificación con el fracaso'],
      gradient: 'from-indigo-500/20 to-purple-600/20',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400/60',
      iconColor: 'text-indigo-400',
      delay: 0.6
    },
    {
      icon: Sparkles,
      title: 'De vida',
      description: 'La transformación no es cambiar, es dejar de sostener lo falso',
      points: ['Desidentificación del síntoma', 'Atravesamiento del fantasma', 'Apropiación del deseo'],
      gradient: 'from-cyan-500/20 to-blue-600/20',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400/60',
      iconColor: 'text-cyan-400',
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

          {/* Título con palabras rotativas integradas - Tipografía Blog */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8"
            style={{ letterSpacing: '0.02em', fontWeight: 300 }}
          >
            ¿Es posible cambiar mi situación?
          </motion.h2>

          {/* Palabra rotativa con animación e ícono - debajo del título */}
          <div className="flex justify-center items-center min-h-[80px] mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWordIndex}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="flex items-center gap-4"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${rotatingWords[currentWordIndex].color} backdrop-blur-xl`}
                >
                  {(() => {
                    const Icon = rotatingWords[currentWordIndex].icon
                    return <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  })()}
                </motion.div>
                <span className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${rotatingWords[currentWordIndex].color} bg-clip-text text-transparent`}>
                  {rotatingWords[currentWordIndex].word}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Grid de áreas de transformación - Tarjetas elegantes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-16 lg:mb-20 max-w-7xl mx-auto px-2 md:px-4"
        >
          {transformationAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: area.delay,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={`group relative p-4 md:p-7 bg-gradient-to-br ${area.gradient} backdrop-blur-xl border ${area.borderColor} rounded-xl md:rounded-2xl transition-all duration-500 overflow-hidden flex flex-col h-full shadow-lg hover:shadow-2xl`}
            >
              {/* Efecto de brillo en hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500"
              />
              
              {/* Orb decorativo */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
              />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Ícono arriba */}
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  <div className="inline-flex p-3 bg-black/40 backdrop-blur-sm rounded-xl border border-white/20">
                    <area.icon className={`w-7 h-7 ${area.iconColor}`} strokeWidth={2.5} />
                  </div>
                </motion.div>
                
                {/* Título pegado al ícono */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight" style={{ letterSpacing: '-0.01em' }}>
                  {area.title}
                </h3>
                
                {/* Descripción */}
                <p className="text-white/80 text-sm leading-relaxed font-light mb-5 italic">
                  {area.description}
                </p>

                {/* Puntos esenciales */}
                <ul className="space-y-2.5 mt-auto">
                  {area.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-white/60 text-xs leading-relaxed">
                      <span className={`${area.iconColor} mt-0.5 font-bold`}>•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
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
            Si todo lo que experimentas es el resultado de{' '}
            <span className="text-white/90">filtros inconscientes</span>,{' '}
            entonces este filtro puede ser cambiado.{' '}
            <span className="text-white/90">Es lo que me propongo a explicarte.</span>
          </motion.p>

          {/* CTA Premium - Ver el método */}
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
              
              <span className="relative z-10">Ver el método</span>
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
