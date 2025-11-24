import { motion } from 'framer-motion'

const ToggleButton = ({ isOpen, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-0 right-0 z-[60] lg:hidden"
      aria-label="Toggle Menu"
    >
      {/* Curva orgánica en esquina inferior derecha */}
      <div className="relative">
        {/* Forma de curva - esquina inferior derecha */}
        <motion.div
          animate={{ rotate: isOpen ? 15 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative"
          style={{
            width: '110px',
            height: '110px',
          }}
        >
          {/* SVG con curva personalizada */}
          <svg
            viewBox="0 0 110 110"
            className="absolute bottom-0 right-0"
            style={{ width: '110px', height: '110px' }}
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="-2" stdDeviation="8" floodOpacity="0.5"/>
              </filter>
            </defs>
            {/* Curva orgánica */}
            <path
              d="M 110 110 L 110 35 Q 110 0, 75 0 L 0 0 L 0 110 Z"
              fill="url(#curveGradient)"
              filter="url(#shadow)"
              className="drop-shadow-2xl"
            />
            {/* Borde sutil elegante */}
            <path
              d="M 110 35 Q 110 0, 75 0"
              stroke="rgba(245, 245, 245, 0.3)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* Efecto de brillo */}
          <div 
            className="absolute bottom-0 right-0 opacity-30"
            style={{
              width: '110px',
              height: '110px',
              background: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            }}
          />
          
          {/* Hamburger Icon - posicionado en la curva */}
          <div 
            className="absolute flex flex-col justify-between"
            style={{
              bottom: '28px',
              right: '28px',
              width: '32px',
              height: '22px',
            }}
          >
            <motion.span
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 8 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="w-full h-0.5 bg-elegant-white rounded-full origin-center"
            />
            <motion.span
              animate={{
                opacity: isOpen ? 0 : 1,
                x: isOpen ? -10 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="w-full h-0.5 bg-elegant-white rounded-full"
            />
            <motion.span
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -8 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="w-full h-0.5 bg-elegant-white rounded-full origin-center"
            />
          </div>
        </motion.div>

        {/* Anillo exterior animado - solo cuando está cerrado */}
        <motion.div
          animate={{
            scale: isOpen ? 0 : [1, 1.15, 1],
            opacity: isOpen ? 0 : [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 2,
            repeat: isOpen ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-5 right-5 w-14 h-14 rounded-full border-2 border-elegant-white pointer-events-none"
        />
      </div>
    </motion.button>
  )
}

export default ToggleButton
