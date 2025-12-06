import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, Mail, MessageSquare, MapPin, Phone, Instagram, Linkedin, CheckCircle2, XCircle } from 'lucide-react'

const ContactoPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const [formStatus, setFormStatus] = useState(null) // 'success', 'error', null

  const services = [
    'Identidad de Marca',
    'App Premium',
    'Contenido Digital',
    'Avatar IA',
    'Consultoría Psicoanalítica',
    'Paquete Custom',
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simulación de envío (aquí integrarías con backend real o servicio como EmailJS)
    console.log('Form submitted:', formData)
    
    // Simular éxito
    setFormStatus('success')
    
    // Reset form después de 3 segundos
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      setFormStatus(null)
    }, 3000)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hola@ainimation.studio',
      link: 'mailto:hola@ainimation.studio',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+52 123 456 7890',
      link: 'https://wa.me/521234567890',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      value: 'Ciudad de México, MX',
      link: null,
      color: 'from-fuchsia-500 to-fuchsia-600',
    },
  ]

  const socialLinks = [
    { icon: Instagram, url: 'https://instagram.com/ainimation', label: 'Instagram' },
    { icon: Linkedin, url: 'https://linkedin.com/in/luisvirrueta', label: 'LinkedIn' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo cinematográfico */}
        <div className="absolute inset-0 -top-28 -bottom-16 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-50"
            style={{ minWidth: '100vw', minHeight: '100%', objectFit: 'cover', objectPosition: 'center' }}
          >
            <source src="/Hero Contacto.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Title con efecto 3D igual que Portafolio */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl lg:text-9xl font-bold text-center mb-12 font-display relative"
            style={{ 
              letterSpacing: '0.08em',
              fontWeight: 300,
              textTransform: 'uppercase'
            }}
          >
            <span className="relative inline-block">
              {/* C con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm">C</span>
                <span className="relative text-white">C</span>
              </span>
              {/* ontact */}
              <span className="text-white">ontact</span>
              {/* o con degradado */}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-tl from-cyan-400 via-white to-white bg-clip-text text-transparent blur-sm">o</span>
                <span className="relative text-white">o</span>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle con estructura elegante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            {/* Etiqueta superior con borde */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm lg:text-base text-white/80 font-light tracking-wider uppercase">
                  Conversemos
                </span>
              </div>
            </motion.div>

            {/* Pregunta provocativa */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base lg:text-lg text-white/60 text-center max-w-3xl mx-auto font-extralight italic"
              style={{ letterSpacing: '0.08em' }}
            >
              ¿Lista tu marca para una conversación que la transforme?
            </motion.p>
          </motion.div>

          {/* Línea con efecto desde el centro expandiéndose */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative h-px mx-auto w-96 overflow-hidden"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ transformOrigin: 'center' }}
            />
            {/* Punto luminoso que se mueve */}
            <motion.div
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5
              }}
              className="absolute inset-0 w-24 h-full bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
              style={{ left: '50%' }}
            />
          </motion.div>
        </div>

        {/* Degradado suave en la parte inferior para transición elegante */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black pointer-events-none z-30" />
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-6 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {method.link ? (
                  <a
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <ContactMethodCard method={method} />
                  </a>
                ) : (
                  <ContactMethodCard method={method} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-5xl font-bold mb-8 font-display text-white">
                Inicia tu proyecto
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-white/70 mb-2 text-sm uppercase tracking-wider font-mono">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white/70 mb-2 text-sm uppercase tracking-wider font-mono">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-white/70 mb-2 text-sm uppercase tracking-wider font-mono">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="+52 123 456 7890"
                  />
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className="block text-white/70 mb-2 text-sm uppercase tracking-wider font-mono">
                    Servicio de interés *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-900">Selecciona un servicio</option>
                    {services.map((service, i) => (
                      <option key={i} value={service} className="bg-zinc-900">{service}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white/70 mb-2 text-sm uppercase tracking-wider font-mono">
                    Cuéntame tu proyecto *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                    placeholder="Describe tu visión, objetivos, timeline, presupuesto..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  Enviar Mensaje
                </motion.button>

                {/* Status Messages */}
                {formStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>¡Mensaje enviado! Te responderé en menos de 24 horas.</span>
                  </motion.div>
                )}

                {formStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Error al enviar. Por favor intenta por email o WhatsApp.</span>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* Response Time */}
              <div className="bg-gradient-to-br from-purple-950/50 to-fuchsia-950/50 border border-purple-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4 font-display">Tiempo de respuesta</h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Respondo personalmente todos los mensajes en <span className="text-purple-400 font-semibold">menos de 24 horas</span> (días hábiles).
                </p>
                <p className="text-white/70 leading-relaxed">
                  Para proyectos urgentes, contacta directo por <span className="text-emerald-400 font-semibold">WhatsApp</span>.
                </p>
              </div>

              {/* What Happens Next */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white font-display">¿Qué sigue?</h3>
                <div className="space-y-4">
                  {[
                    { number: '01', text: 'Revisamos tu mensaje y respondemos en 24h' },
                    { number: '02', text: 'Agendamos videollamada para conocer tu proyecto' },
                    { number: '03', text: 'Creamos propuesta personalizada con cotización' },
                    { number: '04', text: 'Si conectamos, ¡empezamos a crear magia!' },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent font-mono">
                        {step.number}
                      </span>
                      <p className="text-white/70 leading-relaxed pt-1">{step.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-display">Sígueme</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:border-purple-500/50 transition-all"
                    >
                      <social.icon className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

const ContactMethodCard = ({ method }) => {
  return (
    <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 group cursor-pointer">
      <method.icon className="w-10 h-10 text-white/70 group-hover:text-white mb-4 transition-colors" strokeWidth={1.5} />
      <h3 className="text-white/50 uppercase tracking-wider text-xs font-mono mb-2">{method.title}</h3>
      <p className={`text-lg font-medium bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
        {method.value}
      </p>
    </div>
  )
}

export default ContactoPage
