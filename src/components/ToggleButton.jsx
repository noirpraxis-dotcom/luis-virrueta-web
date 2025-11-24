import { motion } from 'framer-motion'

const ToggleButton = ({ isOpen, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[60] lg:hidden group"
      aria-label="Toggle Menu"
    >
      {/* Contenedor principal */}
      <div className="relative">
        {/* Círculo principal - diseño minimalista elegante */}
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="relative w-16 h-16 rounded-full bg-black/95 backdrop-blur-xl shadow-2xl flex items-center justify-center border border-white/10"
        >
          {/* Gradiente sutil de brillo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 via-transparent to-transparent" />
          
          {/* Borde interno decorativo */}
          <div className="absolute inset-[3px] rounded-full border border-white/5" />

          {/* Hamburger Icon - Centrado perfectamente */}
          <div className="relative flex flex-col items-center justify-center w-7 h-5">
            {/* Línea superior */}
            <motion.span
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 8 : 0,
                scaleX: isOpen ? 1 : 0.85,
              }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 w-full h-[2px] bg-white rounded-full origin-center"
            />
            
            {/* Línea media */}
            <motion.span
              animate={{
                opacity: isOpen ? 0 : 1,
                scaleX: isOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-white rounded-full"
            />
            
            {/* Línea inferior */}
            <motion.span
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -8 : 0,
                scaleX: isOpen ? 1 : 0.85,
              }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute bottom-0 w-full h-[2px] bg-white rounded-full origin-center"
            />
          </div>

          {/* Indicador de estado cuando está cerrado */}
          <motion.div
            animate={{
              opacity: isOpen ? 0 : 1,
              scale: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50"
          />
        </motion.div>

        {/* Anillo exterior animado - efecto pulsante sutil */}
        <motion.div
          animate={{
            scale: isOpen ? 0 : [1, 1.2, 1],
            opacity: isOpen ? 0 : [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: isOpen ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full border border-white pointer-events-none"
        />
      </div>
    </motion.button>
  )
}

export default ToggleButton
