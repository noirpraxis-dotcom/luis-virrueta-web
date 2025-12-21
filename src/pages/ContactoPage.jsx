import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, MessageSquare, MapPin, Phone, Calendar } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SEOHead from '../components/SEOHead'

const ContactoPage = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const formRef = useRef(null)
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const whatsappMessage = `
🎯 *NUEVA SOLICITUD DE CONTACTO*

👤 *Nombre:* ${formData.name}
📧 *Email:* ${formData.email}${formData.phone ? `\n📱 *Teléfono:* ${formData.phone}` : ''}

📝 *Mensaje:*
${formData.message}
    `.trim()
    
    const whatsappURL = `https://wa.me/527228720520?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappURL, '_blank')
    
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'WhatsApp',
      value: '+52 722 872 0520',
      link: 'https://wa.me/527228720520',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: 'México',
      link: null,
      color: 'from-violet-500 to-violet-600'
    },
    {
      icon: Calendar,
      label: 'Disponibilidad',
      value: 'Lun - Vie, 9:00 - 19:00',
      link: null,
      color: 'from-cyan-500 to-cyan-600'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28">
      <SEOHead 
        title="Contacto - Luis Virrueta | Psicólogo"
        description="¿Listo para transformar tu realidad? Agenda tu primera sesión y comienza tu proceso de transformación personal con el método AION©."
        image="/conteacto luis.mp4"
        url="/contacto"
        type="website"
        tags={['contacto', 'psicología', 'terapia', 'luis virrueta', 'transformación personal']}
      />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-12 lg:pt-20 pb-40 lg:pb-56 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 -top-16 lg:-top-24 -bottom-80 lg:-bottom-96 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
            style={{
              minWidth: '100vw',
              minHeight: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            <source src="/conteacto luis.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Gradiente inferior */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <span
              className="text-6xl sm:text-7xl lg:text-9xl font-light text-white inline-block"
              style={{ 
                letterSpacing: '0.15em',
                textShadow: '0 0 60px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(168, 85, 247, 0.1)'
              }}
            >
              CONTACTO
            </span>
          </motion.h1>

          {/* Badge con icono */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
              <MessageSquare className="w-4 h-4 text-white/60" />
              <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                Inicia tu Transformación
              </span>
            </div>
          </motion.div>
          
          {/* Pregunta provocativa */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-center text-lg lg:text-xl text-white/60 max-w-3xl mx-auto font-light italic"
            style={{ letterSpacing: '0.05em' }}
          >
            ¿Qué filtros están creando tu realidad actual?
          </motion.p>
        </div>
      </section>

      {/* Form & Contact Info Section */}
      <section ref={formRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-4" style={{ letterSpacing: '0.05em' }}>
                  Hablemos
                </h2>
                <p className="text-white/60 font-light leading-relaxed">
                  Cuéntame sobre tu proceso. La primera conversación es el inicio de tu transformación.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-light text-white/70 mb-2 tracking-wide">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-white font-light placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-light text-white/70 mb-2 tracking-wide">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-white font-light placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-light text-white/70 mb-2 tracking-wide">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-white font-light placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="+52 ..."
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="message" className="block text-sm font-light text-white/70 mb-2 tracking-wide">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-white font-light placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none"
                    placeholder="Cuéntame qué te trae aquí..."
                  />
                </div>

                {/* Botón Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-light rounded-lg transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <span className="tracking-wide">Enviar por WhatsApp</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </motion.div>

            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl lg:text-3xl font-light text-white mb-6" style={{ letterSpacing: '0.05em' }}>
                  ¿Cómo trabajo?
                </h3>
                <div className="space-y-4 text-white/60 font-light leading-relaxed">
                  <p>
                    Trabajo desde el <span className="text-white font-normal">inconsciente</span>, no desde los síntomas. 
                    Si estás listo para dejar de tapar y comenzar a <span className="text-white font-normal">transformar</span>, 
                    este es el espacio.
                  </p>
                  <p>
                    Cada sesión es única. No hay protocolos fijos. Cada proceso se adapta a lo que <span className="text-white font-normal">necesitas atravesar</span>, 
                    no a lo que crees que deberías cambiar.
                  </p>
                </div>
              </div>

              {/* Cards de contacto */}
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-gradient-to-br ${item.color} rounded-lg`}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white/50 font-light mb-1">{item.label}</p>
                            <p className="text-white font-light group-hover:text-violet-300 transition-colors">{item.value}</p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-gradient-to-br ${item.color} rounded-lg`}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white/50 font-light mb-1">{item.label}</p>
                            <p className="text-white font-light">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* CTA adicional */}
              <div className="p-6 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-lg">
                <p className="text-white/80 font-light leading-relaxed">
                  <span className="text-violet-300 font-normal">Respuesta en menos de 24 horas.</span> La primera conversación 
                  es sin compromiso. Hablamos, vemos si resuena, y decidimos juntos.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactoPage
