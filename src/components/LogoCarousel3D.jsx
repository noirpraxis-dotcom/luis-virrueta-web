import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

const LogoCarousel3D = () => {
  const swiperRef = useRef(null)

  // Logos reales comprimidos
  const logos = [
    {
      id: 1,
      image: '/logos-compressed/logo-1.webp',
      gradient: 'from-purple-600 via-fuchsia-500 to-pink-500'
    },
    {
      id: 2,
      image: '/logos-compressed/logo-2.webp',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600'
    },
    {
      id: 3,
      image: '/logos-compressed/logo-3.webp',
      gradient: 'from-rose-500 via-pink-500 to-purple-600'
    },
    {
      id: 4,
      image: '/logos-compressed/logo-4.webp',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    },
    {
      id: 5,
      image: '/logos-compressed/logo-5.webp',
      gradient: 'from-amber-500 via-orange-500 to-red-500'
    },
    {
      id: 6,
      image: '/logos-compressed/logo-6.webp',
      gradient: 'from-slate-600 via-zinc-700 to-neutral-800'
    },
    {
      id: 7,
      image: '/logos-compressed/logo-7.webp',
      gradient: 'from-yellow-500 via-amber-500 to-orange-600'
    },
    {
      id: 8,
      image: '/logos-compressed/logo-8.webp',
      gradient: 'from-blue-600 via-indigo-600 to-violet-600'
    },
    {
      id: 9,
      image: '/logos-compressed/logo-9.webp',
      gradient: 'from-purple-500 via-pink-500 to-rose-500'
    },
    {
      id: 10,
      image: '/logos-compressed/logo-10.webp',
      gradient: 'from-teal-500 via-cyan-500 to-blue-500'
    },
    {
      id: 11,
      image: '/logos-compressed/logo-11.webp',
      gradient: 'from-orange-500 via-red-500 to-pink-500'
    },
    {
      id: 12,
      image: '/logos-compressed/logo-12.webp',
      gradient: 'from-indigo-500 via-purple-500 to-fuchsia-500'
    },
    {
      id: 13,
      image: '/logos-compressed/logo-13.webp',
      gradient: 'from-lime-500 via-emerald-500 to-teal-500'
    },
    {
      id: 14,
      image: '/logos-compressed/logo-14.webp',
      gradient: 'from-amber-500 via-yellow-500 to-lime-500'
    },
    {
      id: 15,
      image: '/logos-compressed/logo-15.webp',
      gradient: 'from-violet-500 via-purple-500 to-pink-500'
    },
    {
      id: 16,
      image: '/logos-compressed/logo-16.webp',
      gradient: 'from-cyan-500 via-teal-500 to-emerald-500'
    },
    {
      id: 17,
      image: '/logos-compressed/logo-17.webp',
      gradient: 'from-fuchsia-500 via-pink-500 to-rose-500'
    }
  ]

  return (
    <div className="relative py-32 px-6 lg:px-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-7xl font-bold mb-6 font-display">
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-400 bg-clip-text text-transparent">
              Identidades Creadas
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
            Logotipos premium diseñados con psicología aplicada
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Swiper Carousel */}
          <Swiper
            ref={swiperRef}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="py-12"
          >
            {logos.map((logo) => (
              <SwiperSlide key={logo.id} className="!w-80 lg:!w-96">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className={`relative h-[400px] lg:h-[500px] rounded-3xl bg-gradient-to-br ${logo.gradient} p-0.5 overflow-hidden`}>
                    {/* Inner card */}
                    <div className="h-full w-full bg-zinc-950/95 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${logo.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      {/* Content - Logo Image */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                        <img 
                          src={logo.image} 
                          alt={`Logo ${logo.id}`}
                          className="max-w-full max-h-full object-contain filter drop-shadow-2xl"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Premium glow effect on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                        <div className={`absolute -inset-12 bg-gradient-to-r ${logo.gradient} blur-[80px] opacity-30`} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Shadow */}
                  <div className={`absolute -inset-4 bg-gradient-to-r ${logo.gradient} opacity-0 group-hover:opacity-20 blur-3xl -z-10 transition-opacity duration-500`} />
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
                className="pointer-events-auto w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:text-fuchsia-400 transition-colors" strokeWidth={2} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => swiperRef.current?.swiper?.slideNext()}
                className="pointer-events-auto w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:text-fuchsia-400 transition-colors" strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-white/60 text-lg mb-2">
            17 identidades de marca únicas
          </p>
          <p className="text-white/40 text-sm font-mono">
            Optimizadas para carga rápida • ~30 KB por logo
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default LogoCarousel3D
