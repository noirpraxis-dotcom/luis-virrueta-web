import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Sparkles, Users, Heart, Crown, Zap, Shield, Compass, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ArquetiposPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  
  const contentRef = useRef(null)
  const isContentInView = useInView(contentRef, { once: true, amount: 0.2 })

  // Arquetipos principales
  const arquetipos = [
    {
      icon: Crown,
      name: 'El Gobernante',
      description: 'Control, liderazgo, autoridad. Marcas que representan el poder y la excelencia.',
      ejemplos: 'Mercedes-Benz, Rolex, Microsoft',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      icon: Heart,
      name: 'El Amante',
      description: 'Pasión, intimidad, belleza. Marcas que evocan deseo y conexión emocional.',
      ejemplos: 'Victoria\'s Secret, Chanel, Godiva',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Zap,
      name: 'El Héroe',
      description: 'Valentía, desafío, transformación. Marcas que inspiran a superar obstáculos.',
      ejemplos: 'Nike, Red Bull, FedEx',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Brain,
      name: 'El Sabio',
      description: 'Conocimiento, análisis, verdad. Marcas que representan inteligencia y expertise.',
      ejemplos: 'Google, BBC, Harvard',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Users,
      name: 'El Inocente',
      description: 'Pureza, simplicidad, optimismo. Marcas que transmiten confianza y honestidad.',
      ejemplos: 'Dove, Coca-Cola, McDonald\'s',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Compass,
      name: 'El Explorador',
      description: 'Libertad, aventura, descubrimiento. Marcas que invitan a explorar lo desconocido.',
      ejemplos: 'Jeep, The North Face, Patagonia',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Shield,
      name: 'El Cuidador',
      description: 'Protección, compasión, generosidad. Marcas que cuidan y protegen.',
      ejemplos: 'Johnson & Johnson, Volvo, UNICEF',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Sparkles,
      name: 'El Mago',
      description: 'Transformación, visión, carisma. Marcas que hacen realidad los sueños.',
      ejemplos: 'Disney, Apple, Tesla',
      color: 'from-purple-500 to-fuchsia-600'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      
      {/* Hero Section - Elegante como Portafolio */}
      <section ref={heroRef} className="relative py-24 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Orbs de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <p className="text-white/70 text-xs font-light uppercase tracking-[0.25em]">
                Psicología de Marca
              </p>
            </div>
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl lg:text-8xl font-light text-white mb-6 tracking-[0.15em] font-display leading-[1.05]">
              ARQUETIPOS
            </h1>
            <p className="text-white/50 text-base lg:text-lg font-light uppercase tracking-[0.3em] mb-8">
              La Identidad Profunda de tu Marca
            </p>
            
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent w-80 mx-auto" />
          </motion.div>

          {/* Descripción Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-white/70 text-xl lg:text-2xl font-extralight leading-relaxed mb-6">
              Los arquetipos son{' '}
              <motion.span
                className="text-white font-light"
                style={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
                }}
              >
                patrones universales
              </motion.span>
              {' '}que residen en el inconsciente colectivo.
            </p>
            <p className="text-white/50 text-base lg:text-lg font-light leading-relaxed">
              Cada marca exitosa encarna un arquetipo que resuena profundamente con su audiencia. 
              No vendes productos, vendes{' '}
              <span className="text-white/80">identidad, pertenencia y significado</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sección de Arquetipos - Estilo Home Premium */}
      <section ref={contentRef} className="relative py-16 lg:py-24 px-6 lg:px-12 bg-black">
        <div className="relative max-w-7xl mx-auto">
          
          {/* Título de sección */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-light text-white mb-4 tracking-[0.1em] font-display">
              LOS 12 ARQUETIPOS
            </h2>
            <p className="text-white/50 text-base lg:text-lg font-light max-w-2xl mx-auto">
              Descubre qué arquetipo define la personalidad de tu marca y cómo usarlo para conectar emocionalmente
            </p>
          </motion.div>

          {/* Grid de Arquetipos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {arquetipos.map((arquetipo, index) => {
              const Icon = arquetipo.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
                >
                  {/* Gradiente de fondo animado */}
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.2
                    }}
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${arquetipo.color.split(' ')[1]}, ${arquetipo.color.split(' ')[3]})`,
                      backgroundSize: '200% 200%'
                    }}
                  />

                  <div className="relative z-10">
                    {/* Ícono */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${arquetipo.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-full h-full text-white" strokeWidth={1.5} />
                    </div>

                    {/* Nombre */}
                    <h3 className="text-white text-xl font-light mb-3 tracking-wide">
                      {arquetipo.name}
                    </h3>

                    {/* Descripción */}
                    <p className="text-white/60 text-sm font-light leading-relaxed mb-4">
                      {arquetipo.description}
                    </p>

                    {/* Ejemplos */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/40 text-xs font-light uppercase tracking-wider mb-2">
                        Ejemplos
                      </p>
                      <p className="text-white/50 text-xs font-light">
                        {arquetipo.ejemplos}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA Section - Estilo premium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <div className="max-w-3xl mx-auto mb-12">
              <h3 className="text-3xl lg:text-5xl font-light text-white mb-6 tracking-wide">
                ¿Cuál es el arquetipo de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
                  tu marca
                </span>?
              </h3>
              <p className="text-white/60 text-lg font-light leading-relaxed">
                Descubre cómo definir la personalidad profunda de tu marca y crear una identidad que resuene emocionalmente con tu audiencia ideal.
              </p>
            </div>

            {/* Botón CTA */}
            <Link to="/identidad-de-marca">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden px-10 py-5 rounded-full backdrop-blur-sm"
              >
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                    backgroundSize: '200% 200%',
                    opacity: 0.4
                  }}
                />

                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -inset-4 rounded-full blur-3xl"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #3b82f6, #8b5cf6)',
                    opacity: 0.4
                  }}
                />

                <span className="relative flex items-center gap-3">
                  <span className="text-white font-light text-lg tracking-wide">
                    Definir mi Arquetipo
                  </span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-white transition-colors" strokeWidth={1.5} />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Sección final - Por qué importa */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-12 bg-gradient-to-b from-black via-zinc-950/50 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-12 h-12 mx-auto text-purple-400 mb-6" strokeWidth={1.5} />
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-8 tracking-wide">
              La diferencia entre una{' '}
              <span className="text-white/40">marca olvidable</span>
              <br />
              y una{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
                marca memorable
              </span>
            </h2>
            <p className="text-white/60 text-xl font-light leading-relaxed max-w-3xl mx-auto">
              Los arquetipos no son una moda, son la base psicológica de todas las marcas icónicas. 
              Cuando tu marca encarna un arquetipo auténtico, no vendes productos—{' '}
              <span className="text-white">vendes identidad, pertenencia y significado</span>.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default ArquetiposPage
