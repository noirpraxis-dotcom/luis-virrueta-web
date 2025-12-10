import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Compass, BookOpen, Sword, Flame, Wand2, Users, Heart, Smile, Shield, Lightbulb, Target, Sparkles, TrendingUp, MessageCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useState } from 'react'

const ARCHETYPES = [
  {
    id: 'ruler',
    icon: Crown,
    color: 'from-[#8b5cf6] to-[#6366f1]',
    borderColor: 'border-[#8b5cf6]/50',
    bgGradient: 'from-[#8b5cf6]/10 to-[#6366f1]/5',
  },
  {
    id: 'explorer',
    icon: Compass,
    color: 'from-[#a855f7] to-[#7c3aed]',
    borderColor: 'border-[#a855f7]/50',
    bgGradient: 'from-[#a855f7]/10 to-[#7c3aed]/5',
  },
  {
    id: 'sage',
    icon: BookOpen,
    color: 'from-[#6366f1] to-[#8b5cf6]',
    borderColor: 'border-[#6366f1]/50',
    bgGradient: 'from-[#6366f1]/10 to-[#8b5cf6]/5',
  },
  {
    id: 'hero',
    icon: Sword,
    color: 'from-[#d946ef] to-[#a855f7]',
    borderColor: 'border-[#d946ef]/50',
    bgGradient: 'from-[#d946ef]/10 to-[#a855f7]/5',
  },
  {
    id: 'outlaw',
    icon: Flame,
    color: 'from-[#e879f9] to-[#d946ef]',
    borderColor: 'border-[#e879f9]/50',
    bgGradient: 'from-[#e879f9]/10 to-[#d946ef]/5',
  },
  {
    id: 'magician',
    icon: Wand2,
    color: 'from-[#a855f7] to-[#d946ef]',
    borderColor: 'border-[#a855f7]/50',
    bgGradient: 'from-[#a855f7]/10 to-[#d946ef]/5',
  },
  {
    id: 'everyman',
    icon: Users,
    color: 'from-[#7c3aed] to-[#6366f1]',
    borderColor: 'border-[#7c3aed]/50',
    bgGradient: 'from-[#7c3aed]/10 to-[#6366f1]/5',
  },
  {
    id: 'lover',
    icon: Heart,
    color: 'from-[#f0abfc] to-[#e879f9]',
    borderColor: 'border-[#f0abfc]/50',
    bgGradient: 'from-[#f0abfc]/10 to-[#e879f9]/5',
  },
  {
    id: 'jester',
    icon: Smile,
    color: 'from-[#d946ef] to-[#e879f9]',
    borderColor: 'border-[#d946ef]/50',
    bgGradient: 'from-[#d946ef]/10 to-[#e879f9]/5',
  },
  {
    id: 'caregiver',
    icon: Shield,
    color: 'from-[#8b5cf6] to-[#a855f7]',
    borderColor: 'border-[#8b5cf6]/50',
    bgGradient: 'from-[#8b5cf6]/10 to-[#a855f7]/5',
  },
  {
    id: 'creator',
    icon: Lightbulb,
    color: 'from-[#a855f7] to-[#e879f9]',
    borderColor: 'border-[#a855f7]/50',
    bgGradient: 'from-[#a855f7]/10 to-[#e879f9]/5',
  },
  {
    id: 'innocent',
    icon: Target,
    color: 'from-[#e879f9] to-[#f0abfc]',
    borderColor: 'border-[#e879f9]/50',
    bgGradient: 'from-[#e879f9]/10 to-[#f0abfc]/5',
  },
]

const ArchetypesModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage()
  const [selectedArchetype, setSelectedArchetype] = useState(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fullscreen overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 overflow-y-auto"
          >
            {/* Background gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#a855f7]/20 via-[#d946ef]/10 to-transparent blur-3xl" />
              <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-[#d946ef]/15 to-transparent blur-3xl" />
              <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-[#6366f1]/15 to-transparent blur-3xl" />
            </div>

            {/* Header - Fixed top */}
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
                      <span className="text-white/70 text-xs uppercase tracking-wider font-light">Psicología de Marca</span>
                    </motion.div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {t('archetypes.title') || 'Arquetipos de Marca'}
                    </h2>
                    <p className="text-white/60 text-sm lg:text-base font-light max-w-2xl">
                      {t('archetypes.subtitle') || 'Descubre la personalidad que define tu marca y conecta profundamente con tu audiencia'}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    aria-label="Cerrar modal de arquetipos"
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <X className="w-6 h-6 text-white/70" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {ARCHETYPES.map((archetype, index) => {
                  const Icon = archetype.icon
                  const isSelected = selectedArchetype === archetype.id
                  return (
                    <motion.div
                      key={archetype.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                      onClick={() => setSelectedArchetype(isSelected ? null : archetype.id)}
                      className={`group relative bg-gradient-to-br ${archetype.bgGradient} backdrop-blur-sm border ${archetype.borderColor} rounded-2xl p-6 lg:p-8 cursor-pointer transition-all duration-500 ${
                        isSelected 
                          ? 'ring-2 ring-[#a855f7] shadow-2xl shadow-[#a855f7]/30' 
                          : 'hover:shadow-xl hover:shadow-[#a855f7]/20'
                      }`}
                    >
                      {/* Icon with glow */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${archetype.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl lg:text-2xl font-bold bg-gradient-to-r ${archetype.color} bg-clip-text text-transparent mb-3`}>
                        {t(`archetypes.${archetype.id}.name`) || archetype.id}
                      </h3>

                      {/* Desire - Destacado */}
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-[#a855f7]" />
                        <p className="text-white/70 text-sm font-medium">
                          {t(`archetypes.${archetype.id}.desire`) || 'Descripción del deseo'}
                        </p>
                      </div>

                      {/* Description */}
                      <p className={`text-white/50 text-sm leading-relaxed mb-4 ${isSelected ? '' : 'line-clamp-3'}`}>
                        {t(`archetypes.${archetype.id}.description`) || 'Descripción del arquetipo y su personalidad de marca.'}
                      </p>

                      {/* Expand indicator */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                        <span className="text-xs text-white/40 uppercase tracking-wider font-light">
                          {isSelected ? 'Haz clic para cerrar' : 'Haz clic para expandir'}
                        </span>
                        <motion.div
                          animate={{ rotate: isSelected ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${archetype.color} flex items-center justify-center`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      </div>

                      {/* Selected overlay */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 to-[#d946ef]/5 rounded-2xl pointer-events-none"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* CTA Section - Más grande y prominente */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-16 p-8 lg:p-12 bg-gradient-to-br from-[#a855f7]/15 to-[#d946ef]/10 border border-[#a855f7]/40 rounded-3xl text-center relative overflow-hidden"
              >
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
                  >
                    <Sparkles className="w-4 h-4 text-[#a855f7]" />
                    <span className="text-white/80 text-sm uppercase tracking-wider font-medium">Próximo Paso</span>
                  </motion.div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    {t('archetypes.cta.title') || '¿Identificaste tu arquetipo?'}
                  </h3>
                  <p className="text-white/70 text-base lg:text-lg font-light mb-8 max-w-3xl mx-auto leading-relaxed">
                    {t('archetypes.cta.subtitle') || 'Trabajemos juntos para construir una marca que resuene con tu audiencia y active sus emociones más profundas'}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.a
                      href="https://wa.me/5215586953032"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white rounded-full font-semibold text-base shadow-lg shadow-[#a855f7]/50 hover:shadow-xl hover:shadow-[#a855f7]/60 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Agendar Consulta Gratuita
                    </motion.a>

                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white/90 rounded-full font-medium text-base hover:bg-white/10 transition-all"
                    >
                      Seguir Explorando
                    </motion.button>
                  </div>

                  {/* Trust indicators */}
                  <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/50 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
                      <span>Consulta gratuita 30 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#d946ef]" />
                      <span>Sin compromiso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#e879f9]" />
                      <span>Respuesta en 24h</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ArchetypesModal
