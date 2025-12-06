import { useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

const WorkSamplesCarousel = () => {
  const swiperRef = useRef(null)
  const [samples, setSamples] = useState([])

  // Cargar imágenes comprimidas en orden alfabético según los archivos originales
  useEffect(() => {
    const loadSamples = () => {
      // Nombres de archivo originales en orden alfabético
      const fileNames = [
        '1.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg',
        'descarga (31).jpg', 'descarga (33).jpg', 'descarga (34).jpg', 'descarga (37).jpg', 'descarga (40).jpg', 'descarga (41).jpg',
        'descarga (46).jpg', 'descarga (50).jpg', 'descarga (51).jpg', 'descarga (53).jpg', 'descarga (55).jpg', 'descarga (56).jpg',
        'descarga (57).jpg', 'descarga (59).jpg', 'descarga (61).jpg', 'descarga (63).jpg', 'descarga (67).jpg', 'descarga (70).jpg',
        'descarga (72).jpg', 'descarga (74).jpg', 'descarga (76).jpg', 'descarga (80).jpg', 'descarga (82).jpg', 'descarga (85).jpg',
        'descarga (87).jpg', 'descarga (94).jpg', 'descarga (99).jpg',
        'descarga - 2025-12-05T120429.873.jpg', 'descarga - 2025-12-05T120612.036.jpg', 'descarga - 2025-12-05T120818.595.jpg',
        'descarga - 2025-12-05T120934.074.jpg', 'descarga - 2025-12-05T120955.862.jpg', 'descarga - 2025-12-05T121220.480.jpg',
        'descarga - 2025-12-05T121240.035.jpg', 'descarga - 2025-12-05T121416.864.jpg', 'descarga - 2025-12-05T121453.123.jpg',
        'descarga - 2025-12-05T121509.594.jpg', 'descarga - 2025-12-05T121523.401.jpg', 'descarga - 2025-12-05T122136.197.jpg',
        'descarga - 2025-12-05T122231.950.jpg'
      ]
      
      // Mapear a las imágenes comprimidas numeradas (muestra-1.webp corresponde a 1.jpg, etc.)
      const sampleFiles = fileNames.map((fileName, index) => ({
        id: index + 1,
        image: `/muestras-compressed/muestra-${index + 1}.webp`,
        name: fileName
      }))
      
      setSamples(sampleFiles)
    }
    loadSamples()
  }, [])

  return (
    <section className="relative pt-4 pb-16 lg:pt-6 lg:pb-20 px-6 lg:px-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header elegante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Subtítulo superior */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.3em] text-white/40 font-light mb-6"
          >
            UX • UI • Branding
          </motion.p>

          {/* Título principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold mb-6 font-display text-white"
            style={{ 
              letterSpacing: '0.05em',
              fontWeight: 300
            }}
          >
            Identidades <span className="italic font-extralight">Visuales</span>
          </motion.h2>

          {/* Subtítulo inferior - pregunta provocativa */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base lg:text-lg text-white/50 font-light italic max-w-2xl mx-auto"
            style={{ letterSpacing: '0.02em' }}
          >
            ¿Hasta dónde podemos llevar tu marca?
          </motion.p>
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
            {samples.map((sample) => (
              <SwiperSlide key={sample.id} className="!w-[90vw] lg:!w-[900px]">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  {/* Card horizontal */}
                  <div className="card-border-horizontal relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl">
                    {/* Imagen como fondo completo */}
                    <img 
                      src={sample.image} 
                      alt={`Muestra ${sample.id}`}
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
            Una muestra de nuestro trabajo
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkSamplesCarousel
