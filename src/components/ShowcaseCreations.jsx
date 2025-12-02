import { motion } from 'framer-motion'
import { useState } from 'react'
import { Play, Pause } from 'lucide-react'

const showcaseItems = [
  {
    id: 'logos',
    title: 'Logotipos',
    videoUrl: '/videos/logos-showcase.mp4', // Placeholder - usuario debe agregar videos
    thumbnail: '/images/logos-thumb.jpg'
  },
  {
    id: 'identidad',
    title: 'Identidad Visual',
    videoUrl: '/videos/identidad-showcase.mp4',
    thumbnail: '/images/identidad-thumb.jpg'
  },
  {
    id: 'web',
    title: 'Páginas Web',
    videoUrl: '/videos/web-showcase.mp4',
    thumbnail: '/images/web-thumb.jpg'
  },
  {
    id: 'apps',
    title: 'Aplicaciones',
    videoUrl: '/videos/apps-showcase.mp4',
    thumbnail: '/images/apps-thumb.jpg'
  }
]

const ShowcaseCreations = () => {
  const [playingVideo, setPlayingVideo] = useState(null)

  const handleVideoClick = (id) => {
    setPlayingVideo(playingVideo === id ? null : id)
  }

  return (
    <section className="relative bg-black py-20 lg:py-28 overflow-hidden">
      {/* Top transition gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />

      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#a855f7]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#d946ef]/15 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#d946ef] animate-pulse" />
            <span className="text-white/70 text-xs uppercase tracking-wider font-light">Creación de</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Nuestro <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">Trabajo</span>
          </h2>
          <p className="text-white/60 text-base lg:text-lg font-light max-w-2xl mx-auto">
            Explora ejemplos de nuestras creaciones diseñadas con precisión y propósito
          </p>
        </motion.div>

        {/* Grid de videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Video container */}
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black/50 border border-white/10 hover:border-[#a855f7]/50 transition-all duration-300">
                {/* Video or thumbnail */}
                {playingVideo === item.id ? (
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/20 to-[#d946ef]/20"
                    style={{
                      backgroundImage: `url(${item.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                )}

                {/* Play/Pause button overlay */}
                <motion.button
                  onClick={() => handleVideoClick(item.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#a855f7] to-[#d946ef] flex items-center justify-center shadow-lg shadow-[#a855f7]/50">
                    {playingVideo === item.id ? (
                      <Pause className="w-6 h-6 text-white" fill="white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    )}
                  </div>
                </motion.button>

                {/* Gradient overlay bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
              </div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="mt-4 text-lg lg:text-xl font-semibold text-white text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#a855f7] group-hover:to-[#d946ef] group-hover:bg-clip-text transition-all duration-300"
              >
                {item.title}
              </motion.h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom transition gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
    </section>
  )
}

export default ShowcaseCreations
