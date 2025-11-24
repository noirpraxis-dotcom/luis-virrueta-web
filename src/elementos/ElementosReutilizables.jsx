import { motion } from 'framer-motion'

/**
 * Efecto de backdrop blur con fondo semi-transparente
 * Úsalo para textos sobre imágenes o videos
 */
export const BackdropBlurCard = ({ children, className = "" }) => {
  return (
    <div className={`backdrop-blur-sm bg-black/10 p-6 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

/**
 * Botón elegante con borde y efecto hover
 */
export const GlassButton = ({ 
  children, 
  href = "#", 
  className = "",
  onClick = null 
}) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white text-sm tracking-[0.2em] uppercase font-light hover:bg-white/20 transition-all duration-300 shadow-2xl ${className}`}
      style={{ fontFamily: 'Gotham, sans-serif' }}
    >
      {children}
    </motion.a>
  )
}

/**
 * Línea decorativa con gradiente
 */
export const GradientLine = ({ 
  width = "w-64", 
  color = "white", 
  opacity = "60",
  className = "" 
}) => {
  const colorClass = color === "amber" 
    ? `via-amber-600/${opacity}` 
    : `via-${color}/${opacity}`
  
  return (
    <div className={`h-px bg-gradient-to-r from-transparent ${colorClass} to-transparent mx-auto ${width} ${className}`} />
  )
}

/**
 * Título cinematográfico con animación
 */
export const CinematicTitle = ({ 
  children, 
  size = "large", 
  delay = 0,
  className = "" 
}) => {
  const sizeClasses = {
    small: "text-4xl lg:text-5xl",
    medium: "text-5xl lg:text-6xl",
    large: "text-6xl lg:text-8xl"
  }
  
  return (
    <motion.h1
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }}
      className={`text-white ${sizeClasses[size]} font-light tracking-[0.2em] ${className}`}
      style={{ fontFamily: 'Gotham, sans-serif' }}
    >
      {children}
    </motion.h1>
  )
}

/**
 * Overlay oscuro con gradiente para videos/imágenes
 */
export const DarkOverlay = ({ 
  direction = "bottom", 
  intensity = "strong",
  className = "" 
}) => {
  const directions = {
    top: "bg-gradient-to-b",
    bottom: "bg-gradient-to-t",
    full: "bg-gradient-to-b"
  }
  
  const intensities = {
    light: "from-black/20 via-black/10 to-transparent",
    medium: "from-black/40 via-black/20 to-transparent",
    strong: "from-black/60 via-black/30 to-transparent"
  }
  
  return (
    <div className={`absolute inset-0 ${directions[direction]} ${intensities[intensity]} ${className}`} />
  )
}

/**
 * Flecha animada para botones "Ver más"
 */
export const AnimatedArrow = ({ direction = "down" }) => {
  const rotation = {
    down: 0,
    up: 180,
    right: -90,
    left: 90
  }
  
  const animation = direction === "down" || direction === "up"
    ? { y: [0, 5, 0] }
    : { x: [0, 5, 0] }
  
  return (
    <motion.svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      animate={animation}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transform: `rotate(${rotation[direction]}deg)` }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </motion.svg>
  )
}

/**
 * Indicador de scroll animado
 */
export const ScrollIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
    >
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-1.5 h-1.5 bg-white/60 rounded-full"
      />
    </motion.div>
  )
}

/**
 * Efecto decorativo de fondo con blur
 */
export const DecorativeBlur = ({ 
  position = "top-right", 
  color = "amber",
  size = "medium" 
}) => {
  const positions = {
    "top-right": "top-1/4 right-1/4",
    "top-left": "-top-40 -left-40",
    "bottom-right": "-bottom-40 -right-40",
    "bottom-left": "bottom-1/4 left-1/4"
  }
  
  const sizes = {
    small: "w-64 h-64",
    medium: "w-96 h-96",
    large: "w-[600px] h-[600px]"
  }
  
  const colors = {
    amber: "bg-amber-600",
    white: "bg-white",
    stone: "bg-stone-400"
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.02, scale: 1 }}
      transition={{ duration: 2 }}
      className={`absolute ${positions[position]} ${sizes[size]} ${colors[color]} rounded-full blur-3xl`}
    />
  )
}
