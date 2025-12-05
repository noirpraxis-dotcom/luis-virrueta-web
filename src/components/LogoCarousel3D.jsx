import { useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

const LogoCarousel3D = () => {
  const swiperRef = useRef(null)
  const [logos, setLogos] = useState([])

  // Gradientes que se asignan cíclicamente
  const gradients = [
    'from-purple-600 via-fuchsia-500 to-pink-500',
    'from-cyan-500 via-blue-500 to-indigo-600',
    'from-rose-500 via-pink-500 to-purple-600',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-amber-500 via-orange-500 to-red-500',
    'from-slate-600 via-zinc-700 to-neutral-800',
    'from-yellow-500 via-amber-500 to-orange-600',
    'from-blue-600 via-indigo-600 to-violet-600',
    'from-purple-500 via-pink-500 to-rose-500',
    'from-teal-500 via-cyan-500 to-blue-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-indigo-500 via-purple-500 to-fuchsia-500',
    'from-lime-500 via-emerald-500 to-teal-500',
    'from-amber-500 via-yellow-500 to-lime-500',
    'from-violet-500 via-purple-500 to-pink-500',
    'from-cyan-500 via-teal-500 to-emerald-500',
    'from-fuchsia-500 via-pink-500 to-rose-500'
  ]

  // Detectar automáticamente los logos de la carpeta comprimida
  useEffect(() => {
    const loadLogos = async () => {
      try {
        // Cargar todos los logos numerados en orden
        const logoFiles = []
        for (let i = 1; i <= 50; i++) { // Intentar hasta 50 logos
          try {
            const img = new Image()
            img.src = `/logos-compressed/logo-${i}.webp`
            await new Promise((resolve, reject) => {
              img.onload = resolve
              img.onerror = reject
            })
            logoFiles.push({
              id: i,
              image: `/logos-compressed/logo-${i}.webp`,
              gradient: gradients[(i - 1) % gradients.length]
            })
          } catch {
            break // Si no existe, detenerse
          }
        }
        setLogos(logoFiles)
      } catch (error) {
        console.error('Error cargando logos:', error)
      }
    }
    loadLogos()
  }, [])

  return (
    <section className="relative pt-0 pb-6 lg:pt-0 lg:pb-8 px-6 lg:px-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Carousel Container - Sin encabezado */}
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
            slideActiveClass="swiper-slide-active"
          >
            {logos.map((logo) => (
              <SwiperSlide key={logo.id} className="!w-64 lg:!w-80">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative group logo-card"
                >
                  {/* Card - Imagen cubre TODO sin bordes de color */}
                  <div className="card-border relative h-[320px] lg:h-[400px] rounded-2xl overflow-hidden bg-zinc-950">
                    {/* Imagen como fondo completo */}
                    <img 
                      src={logo.image} 
                      alt={`Logo ${logo.id}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay oscuro sutil para contraste */}
                    <div className="absolute inset-0 bg-black/20" />
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
                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-fuchsia-400 transition-colors" strokeWidth={2} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => swiperRef.current?.swiper?.slideNext()}
                className="pointer-events-auto w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-fuchsia-400 transition-colors" strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Texto premium debajo del carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
            <p className="text-white/50 text-sm font-light tracking-wider uppercase">
              Muestra Selecta de Identidades Visuales
            </p>
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="flex items-center justify-center gap-4 text-white/30 text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Premium</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>🧠</span>
              <span>Psicología Aplicada</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>✨</span>
              <span>Diseño Estratégico</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default LogoCarousel3D
