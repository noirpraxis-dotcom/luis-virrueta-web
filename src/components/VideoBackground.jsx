import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const VideoBackground = () => {
  const [mediaType, setMediaType] = useState('image') // 'image' | 'video'
  const [showMedia, setShowMedia] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    // Intentar cargar el video
    const video = document.createElement('video')
    video.src = '/video portada.mp4'
    video.preload = 'metadata'
    
    // Timeout de 3 segundos - si no carga, usar imagen
    const timeout = setTimeout(() => {
      if (mediaType !== 'video') {
        setMediaType('image')
        setShowMedia(true)
      }
    }, 3000)

    // Si el video carga correctamente
    video.onloadeddata = () => {
      clearTimeout(timeout)
      setMediaType('video')
      setShowMedia(true)
    }

    // Si hay error, usar imagen
    video.onerror = () => {
      clearTimeout(timeout)
      setMediaType('image')
      setShowMedia(true)
    }

    // Mostrar la imagen inmediatamente como fallback
    setShowMedia(true)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {mediaType === 'video' ? (
        // Video Background - mismo tamaño que la imagen
        <motion.video
          ref={videoRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: showMedia ? 1 : 0 }}
          transition={{ duration: 1 }}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-screen object-cover block"
          style={{ 
            objectPosition: 'center center',
            objectFit: 'cover',
          }}
        >
          <source src="/video portada.mp4" type="video/mp4" />
        </motion.video>
      ) : (
        // Image Background - Pantalla completa en todos los dispositivos, centro siempre visible
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: showMedia ? 1 : 0 }}
          transition={{ duration: 1 }}
          src="/portada.jpg"
          alt="Portada"
          className="w-full h-screen object-cover block"
          style={{ 
            objectPosition: 'center center',
            objectFit: 'cover',
          }}
        />
      )}
    </>
  )
}

export default VideoBackground
