import { motion } from 'framer-motion'
import { Brain, Code, Palette, Heart, Users, Sparkles, Award, BookOpen, Lightbulb, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  const journey = [
    {
      icon: Brain,
      title: "Formación Clínica",
      description: "Mi experiencia en el área clínica me dio una habilidad única: leer entre líneas lo que las personas realmente necesitan, incluso cuando no lo dicen explícitamente.",
      color: "from-[#a855f7] to-[#7c3aed]"
    },
    {
      icon: Code,
      title: "Primeros Pasos",
      description: "Empecé programando aplicaciones educativas para niños, combinando psicología del aprendizaje con tecnología interactiva.",
      color: "from-[#6366f1] to-[#4f46e5]"
    },
    {
      icon: Lightbulb,
      title: "El Descubrimiento",
      description: "Pronto me di cuenta de que el verdadero impacto estaba en ayudar a emprendedores a comunicar su visión. No solo crear apps, sino construir marcas con alma.",
      color: "from-[#d946ef] to-[#c026d3]"
    },
    {
      icon: Sparkles,
      title: "Luxmania Nace",
      description: "Fundé Luxmania para fusionar psicología, diseño y tecnología en un solo sistema: marcas que conectan emocionalmente y convierten.",
      color: "from-[#0ea5e9] to-[#0284c7]"
    }
  ]

  const expertise = [
    { icon: Brain, label: "Psicología", description: "Decisiones inconscientes" },
    { icon: Palette, label: "Diseño", description: "Identidades visuales" },
    { icon: Code, label: "Tecnología", description: "Desarrollo full-stack" },
    { icon: Heart, label: "UX Psychology", description: "Experiencias emocionales" },
    { icon: Users, label: "Consultoría", description: "Estrategia de marca" },
    { icon: Target, label: "Conversión", description: "Diseño persuasivo" }
  ]

  return (
    <div className="relative bg-black min-h-screen">
      {/* Hero Section - Similar al home pero expandido */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Gradient background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] right-[20%] w-[700px] h-[700px] bg-gradient-to-br from-[#d946ef]/25 via-[#a855f7]/20 to-[#7c3aed]/15 rounded-full blur-3xl" />
          <div className="absolute top-[35%] right-[28%] w-[550px] h-[550px] bg-gradient-to-bl from-[#6366f1]/20 via-[#8b5cf6]/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-180px] right-[22%] w-[850px] h-[850px] bg-gradient-to-t from-[#d946ef]/20 via-[#c026d3]/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-[#a855f7]/15 via-[#e879f9]/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="order-2 lg:order-1"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <Brain className="w-5 h-5 text-[#a855f7]" strokeWidth={1.5} />
                <p className="text-[#d946ef]/70 text-xs font-mono uppercase tracking-[0.3em]">
                  Mi Historia
                </p>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl lg:text-6xl font-extralight text-white mb-6 tracking-tight leading-[1.1]"
              >
                Luis <span className="italic font-serif text-white font-extralight" style={{ fontFamily: 'Georgia, serif', fontWeight: 200 }}>Virrueta</span>
              </motion.h1>

              {/* Subtitle con Luxmania animado */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white/70 text-lg lg:text-xl font-light leading-relaxed mb-10 max-w-lg"
              >
                Psicólogo y Diseñador. Fundé{' '}
                <motion.span
                  className="bg-gradient-to-r from-[#a855f7] via-[#0ea5e9] to-[#d946ef] bg-clip-text text-transparent font-normal"
                  style={{
                    backgroundSize: '200% 100%',
                    backgroundPosition: '0% 50%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Luxmania
                </motion.span>{' '}
                para crear marcas que fusionen lo mejor de la psicología, diseño y tecnología.
              </motion.p>

              {/* Badges - Similar al home */}
              <div className="flex flex-wrap gap-3 mb-10">
                {expertise.slice(0, 3).map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="group relative px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#a855f7] group-hover:text-[#d946ef] transition-colors" strokeWidth={1.5} />
                        <span className="text-white/70 text-sm font-light">{item.label}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Right: Photo with video style frame */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">
                {/* Sombras animadas */}
                <motion.div
                  className="absolute -inset-12 rounded-3xl blur-[80px]"
                  animate={{
                    background: [
                      'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)',
                      'radial-gradient(ellipse at 50% 75%, rgba(217,70,239,0.6), rgba(232,121,249,0.4), rgba(168,85,247,0.25), transparent)',
                      'radial-gradient(ellipse at 50% 85%, rgba(232,121,249,0.55), rgba(192,38,211,0.4), rgba(217,70,239,0.22), transparent)',
                      'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.5), rgba(217,70,239,0.35), rgba(124,58,237,0.2), transparent)'
                    ],
                    opacity: [0.4, 0.6, 0.5, 0.4]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Photo container */}
                <div className="relative rounded-3xl overflow-hidden border border-[#d946ef]/30">
                  <img 
                    src="/about ligera.jpg" 
                    alt="Luis Virrueta"
                    className="w-full aspect-[16/11] object-cover"
                  />
                  
                  {/* Badge overlay */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20">
                      <Brain className="w-4 h-4 text-[#a855f7]" />
                      <Palette className="w-4 h-4 text-[#d946ef]" />
                      <Code className="w-4 h-4 text-[#6366f1]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
      </section>

      {/* Journey Section - Timeline elegante */}
      <section className="relative bg-black py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-4">
              Mi <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">Trayectoria</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Cómo la psicología clínica me llevó a crear experiencias digitales con alma
            </p>
          </motion.div>

          <div className="space-y-12">
            {journey.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="flex gap-6 items-start">
                    {/* Icon */}
                    <motion.div
                      className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8 hover:border-[#a855f7]/30 transition-all duration-500">
                      <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-white/70 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Expertise Grid - Todos los badges */}
      <section className="relative bg-black py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-4">
              Áreas de <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">Expertise</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group relative bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d] border border-white/10 rounded-2xl p-8 hover:border-[#a855f7]/30 transition-all duration-500"
                >
                  <Icon className="w-10 h-10 text-[#a855f7] group-hover:text-[#d946ef] mb-4 transition-colors" strokeWidth={1.5} />
                  <h3 className="text-white text-lg font-bold mb-2">{item.label}</h3>
                  <p className="text-white/50 text-sm">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative bg-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-white">
              ¿Listo para crear algo <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent">extraordinario</span>?
            </h2>
            
            <Link to="/contacto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[#a855f7]/30 transition-all duration-300"
              >
                Hablemos de tu Proyecto
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
