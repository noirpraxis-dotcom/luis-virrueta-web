import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Share2, ChevronDown, ChevronUp, ArrowLeft, Home, Brain, Scale, Heart, Eye, EyeOff, Sparkles, Coffee, MessageCircle, Copy, CheckCircle, User, Compass, BookOpen, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDilemaActual } from '../data/dilemmasData'

const SOCIAL_PLATFORMS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
  { id: 'facebook', name: 'Facebook', icon: Share2 },
  { id: 'linkedin', name: 'LinkedIn', icon: Share2 }
]

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
  const [shareOpen, setShareOpen] = useState(false)
  const [actionOk, setActionOk] = useState(false)
  const [lastAction, setLastAction] = useState('')
  const videoRef = useRef(null)
  const analysisRef = useRef(null)
  const donateRef = useRef(null)

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

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleShareTo = (platformId) => {
    const text = `Acabo de enfrentar un dilema ético imposible en el Laboratorio Ético. ¿Tú qué elegirías?\n\nDilema: ${dilema.titulo}`
    const url = window.location.href

    let shareUrl = ''
    switch (platformId) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer')
    setShareOpen(false)
    setActionOk(true)
    setLastAction('share')
    setTimeout(() => setActionOk(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShareOpen(false)
    setActionOk(true)
    setLastAction('share')
    setTimeout(() => setActionOk(false), 2000)
  }

  const handleDonate = (amount) => {
    const stripeLinks = {
      20: 'https://buy.stripe.com/test_enlace_20',
      50: 'https://buy.stripe.com/test_enlace_50',
      100: 'https://buy.stripe.com/test_enlace_100'
    }
    window.open(stripeLinks[amount] || stripeLinks[50], '_blank')
  }

  const handleWhatsAppDonate = () => {
    const message = '¡Hola! Me gustaría hacer una donación para apoyar el Laboratorio Ético. ¿Cómo puedo hacerlo?'
    window.open(`https://wa.me/525512345678?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleShare = () => {
    const text = `Acabo de enfrentar un dilema ético imposible en el Laboratorio Ético de Zuzana Virrueta. ¿Tú qué elegirías?`
    const url = window.location.href
    
    if (navigator.share) {
      navigator.share({ title: 'Laboratorio Ético', text, url })
    } else {
      setShareOpen(!shareOpen)
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
        {/* Video de fondo solo en el hero */}
        <div className="absolute inset-x-0 top-0 h-[60vh] md:h-[70vh] z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/dilema.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-[#0a0a0f]" />
          
          {/* Efectos de luz */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px]" />
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

        {/* Botón compartir con dropdown */}
        <div className="fixed top-6 right-6 z-50">
          <div className="relative">
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              {actionOk && lastAction === 'share' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </motion.button>

            {shareOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 right-0 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md shadow-xl overflow-hidden"
              >
                {SOCIAL_PLATFORMS.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handleShareTo(platform.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white/70 hover:text-white/90 hover:bg-white/10 transition-all"
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                      <span>{platform.name}</span>
                    </button>
                  )
                })}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white/70 hover:text-white/90 hover:bg-white/10 transition-all border-t border-white/5"
                >
                  <Copy className="w-4 h-4" strokeWidth={1.5} />
                  <span>Copiar enlace</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

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

          {/* Compartir y acciones */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-12 max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-start gap-4 flex-wrap">
              {/* Botón compartir con desplegable */}
              <div className="relative">
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white/90 transition-all"
                >
                  {actionOk && lastAction === 'share' ? (
                    <>
                      <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                      <span>Compartido</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" strokeWidth={1.5} />
                      <span>Compartir</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${shareOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                    </>
                  )}
                </button>

                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md shadow-xl z-50 overflow-hidden"
                  >
                    {SOCIAL_PLATFORMS.map((platform) => {
                      const Icon = platform.icon
                      return (
                        <button
                          key={platform.id}
                          onClick={() => handleShareTo(platform.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white/70 hover:text-white/90 hover:bg-white/10 transition-all"
                        >
                          <Icon className="w-4 h-4" strokeWidth={1.5} />
                          <span>{platform.name}</span>
                        </button>
                      )
                    })}
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white/70 hover:text-white/90 hover:bg-white/10 transition-all border-t border-white/5"
                    >
                      <Copy className="w-4 h-4" strokeWidth={1.5} />
                      <span>Copiar enlace</span>
                    </button>
                  </motion.div>
                )}
              </div>

              <button
                onClick={scrollToDonate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-xs text-emerald-200/90 transition-all"
              >
                <Coffee className="w-4 h-4" strokeWidth={1.5} />
                <span>Invítame un café</span>
              </button>
            </div>

            <div className="text-[11px] text-white/35 font-light mt-4">
              Compartir también es una forma de integrarlo.
            </div>
          </motion.div>

          {/* Invítame un café */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-10"
          >
            <div ref={donateRef} className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/25 backdrop-blur-md p-7 sm:p-10">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl font-light text-white/95 tracking-wide">Invítame un café</h3>
                <p className="mt-2 text-sm sm:text-base text-white/65 font-light leading-relaxed">
                  Si esto te sirve, puedes apoyar para que siga siendo un espacio gratuito. Funciona sin fines de lucro.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-5 max-w-3xl mx-auto">
                <button
                  onClick={() => handleDonate(20)}
                  className="group relative h-32 sm:h-40 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-[9px] sm:text-xs uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Aporte</div>
                  <div className="mt-1 sm:mt-2 text-2xl sm:text-4xl text-white/90 font-light group-hover:text-white transition-colors">$20</div>
                  <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-white/50 group-hover:text-white/70 transition-colors">MXN</div>
                </button>

                <button
                  onClick={() => handleDonate(50)}
                  className="group relative h-32 sm:h-40 flex flex-col items-center justify-center rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/60 transition-all duration-300 sm:scale-105"
                >
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[7px] sm:text-[9px] uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-200/90">
                    Popular
                  </div>
                  <div className="text-[9px] sm:text-xs uppercase tracking-widest text-emerald-200/60 group-hover:text-emerald-200/80 transition-colors">Aporte</div>
                  <div className="mt-1 sm:mt-2 text-2xl sm:text-5xl text-white/95 font-light group-hover:text-white transition-colors">$50</div>
                  <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-emerald-200/60 group-hover:text-emerald-200/80 transition-colors">MXN</div>
                </button>

                <button
                  onClick={() => handleDonate(100)}
                  className="group relative h-32 sm:h-40 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-[9px] sm:text-xs uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Aporte</div>
                  <div className="mt-1 sm:mt-2 text-2xl sm:text-4xl text-white/90 font-light group-hover:text-white transition-colors">$100</div>
                  <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-white/50 group-hover:text-white/70 transition-colors">MXN</div>
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  onClick={handleWhatsAppDonate}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-sm text-white/80 hover:text-white/95 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  <span>Otra cantidad por WhatsApp</span>
                </button>
              </div>

              <div className="mt-4 text-center text-[11px] text-white/35 font-light">
                Pagos seguros con tarjeta mediante Stripe (se abre en una nueva pestaña).
              </div>
            </div>
          </motion.div>

          {/* Únete a la comunidad */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <a
              href="https://chat.whatsapp.com/BjvBnSM6tILK6veH3mOLzv"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:from-white/[0.06] hover:to-white/[0.03] hover:border-white/[0.15] backdrop-blur-sm p-5 sm:p-6 transition-all duration-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <MessageCircle className="w-5 h-5 text-green-400/80" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-light text-white/85 group-hover:text-white tracking-wide transition-colors">
                    ¿Quieres seguir reflexionando?
                  </h4>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/45 group-hover:text-white/60 font-light transition-colors">
                    Únete a nuestra comunidad en WhatsApp
                  </p>
                </div>
                <div className="flex-shrink-0 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Sección de Enlaces Estratégicos */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-12 max-w-4xl mx-auto pb-20"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-light text-white/90 tracking-wide">Explora más</h3>
              <p className="mt-2 text-sm text-white/50 font-light">Sigue circulando por el sitio</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/sobre-mi')}
                className="group relative aspect-square flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-4"
              >
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white/70 group-hover:text-white transition-colors mb-3" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors font-light tracking-wide">Sobre mí</span>
              </button>

              <button
                onClick={() => navigate('/metodo')}
                className="group relative aspect-square flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-4"
              >
                <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-white/70 group-hover:text-white transition-colors mb-3" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors font-light tracking-wide">Mi método</span>
              </button>

              <button
                onClick={() => navigate('/blog')}
                className="group relative aspect-square flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-4"
              >
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white/70 group-hover:text-white transition-colors mb-3" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors font-light tracking-wide">Blog</span>
              </button>

              <button
                onClick={() => navigate('/frase-del-dia')}
                className="group relative aspect-square flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-4"
              >
                <Map className="w-8 h-8 sm:w-10 sm:h-10 text-white/70 group-hover:text-white transition-colors mb-3" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors font-light tracking-wide">Frase del día</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default LaboratorioEticoPage
