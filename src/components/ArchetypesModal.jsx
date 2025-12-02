import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Compass, BookOpen, Sword, Flame, Wand2, Users, Heart, Smile, Shield, Lightbulb, Target } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] sm:inset-x-8 md:left-1/2 md:-translate-x-1/2 md:max-w-6xl bg-black border border-white/10 rounded-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative border-b border-white/10 p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {t('archetypes.title') || 'Arquetipos de Marca'}
                  </h2>
                  <p className="text-white/60 text-sm lg:text-base font-light">
                    {t('archetypes.subtitle') || 'Descubre la personalidad que define tu marca'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>

              {/* Decorative gradient */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#a855f7]/20 via-[#d946ef]/10 to-transparent blur-3xl pointer-events-none" />
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100%-120px)] lg:h-[calc(100%-140px)] p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {ARCHETYPES.map((archetype, index) => {
                  const Icon = archetype.icon
                  return (
                    <motion.div
                      key={archetype.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`group relative bg-gradient-to-br ${archetype.bgGradient} backdrop-blur-sm border ${archetype.borderColor} rounded-xl p-5 lg:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[${archetype.color}]/20`}
                    >
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${archetype.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className={`text-lg lg:text-xl font-bold bg-gradient-to-r ${archetype.color} bg-clip-text text-transparent mb-2`}>
                        {t(`archetypes.${archetype.id}.name`) || archetype.id}
                      </h3>

                      {/* Desire */}
                      <p className="text-white/50 text-xs lg:text-sm font-light mb-3">
                        <span className="text-white/70 font-medium">Deseo:</span> {t(`archetypes.${archetype.id}.desire`) || 'Descripción del deseo'}
                      </p>

                      {/* Description */}
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-3">
                        {t(`archetypes.${archetype.id}.description`) || 'Descripción del arquetipo y su personalidad de marca.'}
                      </p>

                      {/* Hover indicator */}
                      <div className={`absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${archetype.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </motion.div>
                  )
                })}
              </div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-10 p-6 lg:p-8 bg-gradient-to-br from-[#a855f7]/10 to-[#d946ef]/5 border border-[#a855f7]/30 rounded-xl text-center"
              >
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                  {t('archetypes.cta.title') || '¿Identificaste tu arquetipo?'}
                </h3>
                <p className="text-white/60 text-sm lg:text-base font-light mb-6 max-w-2xl mx-auto">
                  {t('archetypes.cta.subtitle') || 'Trabajemos juntos para construir una marca que resuene con tu audiencia'}
                </p>
                <motion.a
                  href="https://wa.me/5215586953032"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white rounded-full font-medium text-sm lg:text-base hover:shadow-lg hover:shadow-[#a855f7]/50 transition-shadow"
                >
                  Agendar Consulta Gratuita
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ArchetypesModal
