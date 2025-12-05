import { useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

const WebsitesCarousel = () => {
  const swiperRef = useRef(null)
  const [websites, setWebsites] = useState([])

  // Cargar imágenes de sitios web
  useEffect(() => {
    const loadWebsites = async () => {
      try {
        const websiteFiles = []
        // Intentar cargar hasta 50 imágenes
        for (let i = 1; i <= 50; i++) {
          try {
            const img = new Image()
            img.src = `/sitios-compressed/sitio-${i}.webp`
            await new Promise((resolve, reject) => {
              img.onload = resolve
              img.onerror = reject
              setTimeout(reject, 1000)
            })
            websiteFiles.push({
              id: i,
              image: `/sitios-compressed/sitio-${i}.webp`
            })
          } catch {
            break
          }
        }
        setWebsites(websiteFiles)
      } catch (error) {
        console.error('Error cargando sitios web:', error)
      }
    }
    loadWebsites()
  }, [])

  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 px-6 lg:px-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header elegante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          {/* Título principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold mb-4 font-display text-white"
            style={{ 
              letterSpacing: '0.05em',
              fontWeight: 300,
              textTransform: 'uppercase'
            }}
          >
            Sitios Web Que Se Sienten
          </motion.h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Swiper Carousel - Horizontal */}
          <Swiper
            ref={swiperRef}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="py-12"
            slideActiveClass="swiper-slide-active"
          >
            {websites.map((website) => (
              <SwiperSlide key={website.id} className="!w-[90vw] lg:!w-[900px]">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  {/* Card horizontal */}
                  <div className="card-border-horizontal relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl">
                    {/* Imagen como fondo completo */}
                    <img 
                      src={website.image} 
                      alt={`Sitio Web ${website.id}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 pointer-events-none">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => swiperRef.current?.swiper?.slidePrev()}
                className="pointer-events-auto w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-400 transition-colors" strokeWidth={2} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => swiperRef.current?.swiper?.slideNext()}
                className="pointer-events-auto w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-400 transition-colors" strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Texto elegante debajo del carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm font-light tracking-wider uppercase">
            Experiencias digitales que conectan emocionalmente
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default WebsitesCarousel
