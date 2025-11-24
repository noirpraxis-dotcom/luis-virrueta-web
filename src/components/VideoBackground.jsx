import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const VideoBackground = () => {
  const [isVideo, setIsVideo] = useState(false)

  // Aquí detectaremos si existe un video, por ahora usamos la imagen
  useEffect(() => {
    // Cuando subas el video, cambia esta lógica
    // Por ejemplo: verificar si existe /video.mp4
    setIsVideo(false)
  }, [])

  return (
    <>
      {isVideo ? (
        // Video Background
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-screen lg:h-auto object-cover lg:object-contain"
          style={{ 
            objectPosition: 'center center',
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </motion.video>
      ) : (
        // Image Background - Móvil/Tablet: pantalla completa con centro visible. Desktop: imagen completa
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          src="/portada.jpg"
          alt="Portada"
          className="w-full h-screen lg:h-auto object-cover lg:object-contain block"
          style={{ 
            objectPosition: 'center center',
          }}
        />
      )}
    </>
  )
}

export default VideoBackground
