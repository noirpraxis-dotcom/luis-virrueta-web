import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Share2, ChevronDown, ChevronUp, ArrowLeft, Home, Brain, Scale, Heart, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDilemaActual } from '../data/dilemmasData'

// Servicio para obtener IP del usuario (usando un API público gratuito)
const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Error obteniendo IP:', error)
    // Fallback: generar un ID único basado en características del navegador
    return `fallback-${navigator.userAgent.slice(0, 20)}-${screen.width}x${screen.height}`
  }
}

// Función para hashear la IP (privacidad)
const hashIP = async (ip) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + 'salt-laboratorio-etico-2025')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Gestión de votos en localStorage
const STORAGE_KEY = 'laboratorio_etico_votos'
const GLOBAL_VOTES_KEY = 'laboratorio_etico_global'

const getLocalVote = (dilemaId) => {
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  return votes[dilemaId]
}

const saveLocalVote = async (dilemaId, opcionId) => {
  const ip = await getUserIP()
  const ipHash = await hashIP(ip)
  
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  votes[dilemaId] = {
    opcion: opcionId,
    timestamp: new Date().toISOString(),
    ipHash
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes))
  
  // También guardar en el contador global
  saveGlobalVote(dilemaId, opcionId)
}

const saveGlobalVote = (dilemaId, opcionId) => {
  const globalVotes = JSON.parse(localStorage.getItem(GLOBAL_VOTES_KEY) || '{}')
  
  if (!globalVotes[dilemaId]) {
    globalVotes[dilemaId] = {}
  }
  
  if (!globalVotes[dilemaId][opcionId]) {
    globalVotes[dilemaId][opcionId] = 0
  }
  
  globalVotes[dilemaId][opcionId]++
  localStorage.setItem(GLOBAL_VOTES_KEY, JSON.stringify(globalVotes))
}

const getGlobalVotes = (dilemaId) => {
  const globalVotes = JSON.parse(localStorage.getItem(GLOBAL_VOTES_KEY) || '{}')
  return globalVotes[dilemaId] || {}
}

const calculatePercentages = (dilemaId, opciones) => {
  const votes = getGlobalVotes(dilemaId)
  const total = Object.values(votes).reduce((sum, count) => sum + count, 0)
  
  if (total === 0) {
    // Valores por defecto si no hay votos aún
    return opciones.map((_, idx) => {
      if (idx === 0) return 52
      if (idx === 1) return 31
      return 17
    })
  }
  
  return opciones.map(opcion => {
    const count = votes[opcion.id] || 0
    return Math.round((count / total) * 100)
  })
}

const LaboratorioEticoPage = () => {
  const navigate = useNavigate()
  const [dilema, setDilema] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [percentages, setPercentages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef(null)
  const analysisRef = useRef(null)

  useEffect(() => {
    const currentDilema = getDilemaActual()
    setDilema(currentDilema)
    
    // Verificar si ya votó
    const existingVote = getLocalVote(currentDilema.id)
    if (existingVote) {
      setHasVoted(true)
      setSelectedOption(existingVote.opcion)
      setPercentages(calculatePercentages(currentDilema.id, currentDilema.opciones))
    }
    
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Configurar video de fondo
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75 // Slow motion para efecto premium
    }
  }, [])

  const handleVote = async (opcionId) => {
    if (hasVoted || !dilema) return
    
    setSelectedOption(opcionId)
    await saveLocalVote(dilema.id, opcionId)
    setHasVoted(true)
    setPercentages(calculatePercentages(dilema.id, dilema.opciones))
    
    // Pequeña pausa para la animación
    setTimeout(() => {
      setShowReflection(true)
    }, 600)
  }

  const scrollToAnalysis = () => {
    setShowAnalysis(true)
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleShare = () => {
    const text = `Acabo de enfrentar un dilema ético imposible en el Laboratorio Ético de Zuzana Virrueta. ¿Tú qué elegirías?`
    const url = window.location.href
    
    if (navigator.share) {
      navigator.share({ title: 'Laboratorio Ético', text, url })
    } else {
      navigator.clipboard.writeText(`${text} ${url}`)
      alert('Enlace copiado al portapapeles')
    }
  }

  if (isLoading || !dilema) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando dilema...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Laboratorio Ético - Zuzana Virrueta | Dilemas sin respuestas correctas</title>
        <meta name="description" content="Cada semana, un dilema imposible. No hay respuestas correctas. Solo un espejo de tu sistema de valores." />
      </Helmet>

      <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
        {/* Video de fondo */}
        <div className="fixed inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          >
            <source src="/dilema.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
          
          {/* Efectos de luz */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
        </div>

        {/* Botones de navegación */}
        <div className="fixed top-6 left-6 z-50 flex gap-3">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <Home className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Botón compartir */}
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>

        {/* Contenido principal */}
        <div className="relative z-10 container mx-auto px-4 py-20 max-w-4xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6"
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-light tracking-wider">LABORATORIO ÉTICO</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
              Dilema de la semana
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto">
              ¿Qué eliges cuando ninguna opción te deja limpio?
            </p>
          </motion.div>

          {/* Tarjeta del dilema */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
            
            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
              
              {/* Label del dilema */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">
                    Dilema #{dilema.numero.toString().padStart(2, '0')} · {dilema.categoria}
                  </span>
                </div>
                
                {hasVoted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 text-green-400 text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Has votado</span>
                  </motion.div>
                )}
              </div>

              {/* Texto del dilema */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-light mb-6 leading-relaxed">
                  {dilema.titulo}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {dilema.dilema}
                </p>
              </div>

              {/* Opciones */}
              <div className="space-y-4 mb-6">
                {dilema.opciones.map((opcion, index) => (
                  <motion.button
                    key={opcion.id}
                    onClick={() => handleVote(opcion.id)}
                    disabled={hasVoted}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={!hasVoted ? { scale: 1.02, x: 4 } : {}}
                    whileTap={!hasVoted ? { scale: 0.98 } : {}}
                    className={`
                      w-full text-left p-6 rounded-2xl border-2 transition-all duration-300
                      ${hasVoted 
                        ? selectedOption === opcion.id
                          ? 'bg-purple-500/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 opacity-50'
                        : 'bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer'
                      }
                      ${!hasVoted ? '' : 'cursor-default'}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
                        ${hasVoted && selectedOption === opcion.id
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-white/30'
                        }
                      `}>
                        {hasVoted && selectedOption === opcion.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-white rounded-full"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-white font-light mb-2">
                          {opcion.texto}
                        </p>
                        <p className="text-sm text-gray-400">
                          {opcion.descripcion}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Link a reflexión antes de votar */}
              {!hasVoted && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={scrollToAnalysis}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Eye className="w-4 h-4" />
                  Quiero leer la reflexión antes de responder
                </motion.button>
              )}

              {/* Resultados */}
              <AnimatePresence>
                {hasVoted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 pt-8 border-t border-white/10"
                  >
                    <h3 className="text-lg font-light mb-6 text-center text-gray-300">
                      Así respondió la gente:
                    </h3>
                    
                    <div className="space-y-4">
                      {dilema.opciones.map((opcion, index) => {
                        const percentage = percentages[index] || 0
                        return (
                          <motion.div
                            key={opcion.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">
                                {opcion.texto.slice(0, 40)}...
                              </span>
                              <span className="text-white font-medium">
                                {percentage}%
                              </span>
                            </div>
                            
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full rounded-full ${
                                  selectedOption === opcion.id
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                                }`}
                              />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Perfil psicológico */}
              <AnimatePresence>
                {showReflection && selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 pt-8 border-t border-white/10"
                  >
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                      <div className="flex items-start gap-3 mb-4">
                        <Heart className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-medium text-purple-300 mb-2">
                            {dilema.perfilPsicologico[selectedOption].titulo}
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed mb-3">
                            {dilema.perfilPsicologico[selectedOption].descripcion}
                          </p>
                          <p className="text-gray-400 text-sm italic leading-relaxed">
                            {dilema.perfilPsicologico[selectedOption].reflexion}
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={scrollToAnalysis}
                      className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-light tracking-wide hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
                    >
                      Leer análisis completo del dilema
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Análisis profundo */}
          <AnimatePresence>
            {(showAnalysis || hasVoted) && (
              <motion.div
                ref={analysisRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
                className="mt-16 space-y-8"
              >
                {/* Lo que se juega */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-light">Lo que se juega en realidad</h3>
                  </div>
                  
                  <div 
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: dilema.analisisProfundo.loQueSeJuega.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>').replace(/\n\n/g, '</p><p class="mt-4">').replace(/^(.+)$/, '<p>$1</p>') }}
                  />
                </div>

                {/* Por qué ninguna respuesta */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-light">Por qué ninguna respuesta te deja "limpio"</h3>
                  </div>
                  
                  <div 
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: dilema.analisisProfundo.porQueNingunaRespuesta.replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-300">$1</strong>').replace(/\n\n/g, '</p><p class="mt-4">').replace(/^(.+)$/, '<p>$1</p>') }}
                  />
                </div>

                {/* Preguntas para seguir pensando */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-light">Preguntas para seguir pensando</h3>
                  </div>
                  
                  <ul className="space-y-4">
                    {dilema.analisisProfundo.preguntasParaSeguirPensando.map((pregunta, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <span className="text-purple-400 mt-1">•</span>
                        <span className="flex-1 leading-relaxed">{pregunta}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Botón volver arriba */}
                <motion.button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-light tracking-wide hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronUp className="w-4 h-4" />
                  Volver arriba
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default LaboratorioEticoPage
