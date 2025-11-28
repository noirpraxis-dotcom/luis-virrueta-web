import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Video, Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ContenidoDigitalPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-32 px-6 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Video className="w-16 h-16 mx-auto text-cyan-400 mb-6" strokeWidth={1.5} />
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 font-display">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
                Contenido Digital
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto">
              [AGREGAR DESCRIPCIÓN PRINCIPAL DEL SERVICIO]
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent w-80 mx-auto mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="px-6 lg:px-20 pb-20">
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* ¿Qué es? */}
          <Section title="¿Qué es Contenido Digital?" icon={Video}>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              [AGREGAR EXPLICACIÓN DETALLADA DEL SERVICIO]
            </p>
            <p className="text-white/70 text-lg leading-relaxed">
              [AGREGAR MÁS CONTEXTO Y BENEFICIOS]
            </p>
          </Section>

          {/* ¿Qué incluye? */}
          <Section title="¿Qué Incluye el Servicio?">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '[Item 1 - Ejemplo: Videos promocionales]',
                '[Item 2 - Ejemplo: Motion graphics]',
                '[Item 3 - Ejemplo: Edición profesional]',
                '[Item 4 - Ejemplo: Efectos visuales]',
                '[Item 5 - Ejemplo: Animaciones 2D/3D]',
                '[Item 6 - Ejemplo: Contenido redes sociales]',
                '[Item 7 - Ejemplo: Música y sonido]',
                '[Item 8 - Ejemplo: Corrección de color]'
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all"
                >
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{item}</span>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Formatos */}
          <Section title="Formatos de Contenido">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                '[Formato 1 - Ej: Reels Instagram]',
                '[Formato 2 - Ej: Videos YouTube]',
                '[Formato 3 - Ej: Stories]',
                '[Formato 4 - Ej: Ads cortos]',
                '[Formato 5 - Ej: Explainer videos]',
                '[Formato 6 - Ej: Product demos]'
              ].map((format, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl text-center hover:border-cyan-500/50 transition-all"
                >
                  <span className="text-white font-semibold">{format}</span>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Proceso */}
          <Section title="Proceso de Producción">
            <div className="space-y-6">
              {[
                { step: '01', title: '[Paso 1]', desc: '[Descripción del paso 1]' },
                { step: '02', title: '[Paso 2]', desc: '[Descripción del paso 2]' },
                { step: '03', title: '[Paso 3]', desc: '[Descripción del paso 3]' },
                { step: '04', title: '[Paso 4]', desc: '[Descripción del paso 4]' },
                { step: '05', title: '[Paso 5]', desc: '[Descripción del paso 5]' },
                { step: '06', title: '[Paso 6]', desc: '[Descripción del paso 6]' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 font-display">{item.title}</h4>
                    <p className="text-white/70">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Inversión y Duración */}
          <Section title="Inversión y Tiempos">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 rounded-2xl p-8">
                <h4 className="text-sm uppercase tracking-wider text-cyan-400 mb-2 font-mono">Inversión</h4>
                <p className="text-4xl font-bold text-white mb-4 font-display">
                  [$ PRECIO]
                </p>
                <p className="text-white/60">[Detalles del precio o planes de pago]</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 rounded-2xl p-8">
                <h4 className="text-sm uppercase tracking-wider text-cyan-400 mb-2 font-mono">Duración</h4>
                <p className="text-4xl font-bold text-white mb-4 font-display">
                  [X semanas]
                </p>
                <p className="text-white/60">[Detalles del timeline]</p>
              </div>
            </div>
          </Section>

          {/* CTA */}
          <div className="text-center py-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-display">
              ¿Listo para crear contenido que impacta?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              [AGREGAR MENSAJE MOTIVACIONAL PARA CONTACTAR]
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              Empezar Proyecto
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

const Section = ({ title, icon: Icon, children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-4 mb-8">
        {Icon && <Icon className="w-8 h-8 text-cyan-400" strokeWidth={1.5} />}
        <h2 className="text-3xl lg:text-4xl font-bold text-white font-display">
          {title}
        </h2>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-10">
        {children}
      </div>
    </motion.section>
  )
}

export default ContenidoDigitalPage
