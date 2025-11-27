import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { DollarSign, Check, X, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const InversionPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const plans = [
    {
      name: 'Starter',
      subtitle: 'Para emprendedores',
      price: '$2,500',
      priceDetail: 'USD - Pago único',
      gradient: 'from-purple-500 to-purple-600',
      borderGradient: 'from-purple-500/50 to-purple-600/50',
      popular: false,
      features: [
        { text: 'Identidad de marca básica', included: true },
        { text: 'Logo + 2 variantes', included: true },
        { text: 'Paleta de colores', included: true },
        { text: 'Tipografía brand', included: true },
        { text: '2 redes sociales templates', included: true },
        { text: 'Manual de marca PDF', included: true },
        { text: '2 rondas de revisiones', included: true },
        { text: 'Consultoría psicoanalítica', included: false },
        { text: 'App development', included: false },
        { text: 'Avatar IA', included: false },
      ],
      duration: '3-4 semanas',
      delivery: 'Archivos digitales + Manual PDF'
    },
    {
      name: 'Professional',
      subtitle: 'Más demandado',
      price: '$5,000',
      priceDetail: 'USD - Pago único o 2 cuotas',
      gradient: 'from-fuchsia-500 to-fuchsia-600',
      borderGradient: 'from-fuchsia-500 to-fuchsia-600',
      popular: true,
      features: [
        { text: 'Identidad de marca premium', included: true },
        { text: 'Logo + 5 variantes', included: true },
        { text: 'Sistema de colores completo', included: true },
        { text: 'Tipografía brand + web', included: true },
        { text: 'Papelería completa', included: true },
        { text: '20+ templates redes sociales', included: true },
        { text: 'Manual de marca interactivo', included: true },
        { text: 'Consultoría psicoanalítica (2 sesiones)', included: true },
        { text: 'App MVP o Landing premium', included: true },
        { text: '4 rondas de revisiones', included: true },
      ],
      duration: '6-8 semanas',
      delivery: 'Todo lo anterior + App funcional'
    },
    {
      name: 'Enterprise',
      subtitle: 'Solución completa',
      price: '$12,000+',
      priceDetail: 'USD - Plan de pagos disponible',
      gradient: 'from-cyan-500 to-cyan-600',
      borderGradient: 'from-cyan-500/50 to-cyan-600/50',
      popular: false,
      features: [
        { text: 'Todo de Professional', included: true },
        { text: 'App completa Full-Stack', included: true },
        { text: 'Avatar IA con voice clone', included: true },
        { text: 'Contenido video premium (3 piezas)', included: true },
        { text: 'Consultoría mensual (3 meses)', included: true },
        { text: 'SEO + Analytics setup', included: true },
        { text: 'Soporte prioritario 24/7', included: true },
        { text: 'Revisiones ilimitadas', included: true },
        { text: 'Derechos de código fuente', included: true },
        { text: 'Training equipo interno', included: true },
      ],
      duration: '10-16 semanas',
      delivery: 'Ecosistema digital completo'
    },
  ]

  const faqs = [
    {
      q: '¿Por qué "inversión" en lugar de "precio"?',
      a: 'Porque no vendemos servicios, creamos activos que generan valor a largo plazo. Tu identidad de marca o app no es un gasto, es una inversión estratégica que impacta ventas, percepción y posicionamiento.'
    },
    {
      q: '¿Aceptan planes de pago?',
      a: 'Sí. Para Professional: 2 cuotas (50% inicio, 50% entrega final). Para Enterprise: plan personalizado en 3-4 cuotas. Sin intereses.'
    },
    {
      q: '¿Qué incluye la consultoría psicoanalítica?',
      a: 'Sesiones estratégicas donde analizamos tu marca desde la psicología: arquetipos, emociones target, narrativa inconsciente, posicionamiento mental. No es terapia, es estrategia psicológica aplicada a branding.'
    },
    {
      q: '¿Entregan código fuente de las apps?',
      a: 'En Professional entregamos la app funcional deployada. En Enterprise incluimos derechos completos del código fuente + documentación técnica.'
    },
    {
      q: '¿Qué pasa si no estoy satisfecho?',
      a: 'Trabajamos con revisiones hasta lograr tu visión. Si después de 2 rondas no conectamos, devolvemos el 50% del anticipo (no aplica si ya entregamos assets finales).'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <DollarSign className="w-16 h-16 mx-auto text-fuchsia-400 mb-6" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl lg:text-8xl font-bold text-center mb-8 font-display"
          >
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Inversión
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/70 text-center max-w-3xl mx-auto font-light mb-12"
          >
            No son gastos, son activos estratégicos que transforman tu marca
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent mx-auto w-80"
          />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-6 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            {[
              { icon: Shield, text: 'Pago seguro', desc: 'Transferencia o PayPal' },
              { icon: TrendingUp, text: '98% satisfacción', desc: 'Clientes reales' },
              { icon: Sparkles, text: 'Garantía de calidad', desc: 'O devolvemos 50%' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full"
              >
                <badge.icon className="w-5 h-5 text-fuchsia-400" strokeWidth={1.5} />
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{badge.text}</p>
                  <p className="text-white/50 text-xs">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="py-20 px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-purple-950/50 to-fuchsia-950/50 border border-fuchsia-500/30 rounded-3xl p-12"
        >
          <Sparkles className="w-12 h-12 mx-auto text-fuchsia-400 mb-6" strokeWidth={1.5} />
          <h3 className="text-3xl lg:text-5xl font-bold mb-6 font-display text-white">
            ¿Necesitas algo personalizado?
          </h3>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Cada marca es única. Creamos paquetes custom combinando servicios según tus objetivos.
          </p>
          <Link
            to="/contacto"
            className="inline-block px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-fuchsia-500/50 transition-all duration-300 hover:scale-105"
          >
            Solicitar Cotización Custom
          </Link>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-bold text-center mb-16 font-display"
          >
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Preguntas Frecuentes
            </span>
          </motion.h2>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-fuchsia-500/30 transition-all"
              >
                <h4 className="text-xl font-bold text-white mb-4 font-display">{faq.q}</h4>
                <p className="text-white/70 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const PricingCard = ({ plan, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg shadow-fuchsia-500/50 z-10">
          MÁS POPULAR
        </div>
      )}

      <div className={`relative h-full bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border-2 ${
        plan.popular ? 'border-fuchsia-500' : 'border-white/10'
      } rounded-3xl p-8 hover:border-white/30 transition-all duration-500 group`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2 font-display">{plan.name}</h3>
          <p className="text-white/60 text-sm uppercase tracking-wider font-mono">{plan.subtitle}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-8 pb-8 border-b border-white/10">
          <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
            {plan.price}
          </div>
          <p className="text-white/50 text-sm">{plan.priceDetail}</p>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              ) : (
                <X className="w-5 h-5 text-white/20 flex-shrink-0 mt-0.5" strokeWidth={2} />
              )}
              <span className={feature.included ? 'text-white/80' : 'text-white/30 line-through'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-white/50 font-mono uppercase tracking-wider">Duración</span>
            <span className="text-white font-medium">{plan.duration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50 font-mono uppercase tracking-wider">Entrega</span>
            <span className="text-white font-medium text-right max-w-[60%]">{plan.delivery}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/contacto"
          className={`mt-8 w-full block text-center py-4 rounded-full font-semibold transition-all duration-300 ${
            plan.popular
              ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-2xl hover:shadow-fuchsia-500/50 hover:scale-105'
              : 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/40'
          }`}
        >
          Empezar Proyecto
        </Link>

        {/* Gradient line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.borderGradient} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>
    </motion.div>
  )
}

export default InversionPage
