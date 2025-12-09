import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react'

const PrivacyPolicyPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const lastUpdated = "9 de Diciembre, 2024"

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 px-6 lg:px-20 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl backdrop-blur-sm">
                <Shield className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            
            <h1 className="text-gray-900 text-5xl lg:text-7xl font-light tracking-tight mb-6">
              Política de <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent font-normal">Privacidad</span>
            </h1>
            
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto w-64 mb-6" />
            
            <p className="text-gray-500 text-sm tracking-wide">
              Última actualización: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={ref} className="relative py-12 px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* Introduction */}
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-3xl p-8 border border-purple-100">
            <p className="text-gray-700 leading-relaxed text-lg">
              En <span className="font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">LUXMANIA</span>, 
              tu privacidad es nuestra prioridad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando 
              visitas nuestro sitio web y utilizas nuestros servicios de branding psicológico, arquetipos de marca, avatares IA, y diseño UX/UI.
            </p>
          </div>

          {/* Information We Collect */}
          <Section title="1. Información que Recopilamos" icon={Database}>
            <Subsection title="1.1 Información Personal">
              <p>Recopilamos información que nos proporcionas voluntariamente cuando:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
                <li>Agendas una sesión de consultoría o sesión de sanación</li>
                <li>Te suscribes a nuestro newsletter</li>
                <li>Nos contactas vía email o formularios de contacto</li>
                <li>Realizas una compra en nuestra tienda online</li>
                <li>Interactúas con nuestro contenido del blog</li>
              </ul>
              <p className="mt-4">Esta información puede incluir:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
                <li>Nombre completo y datos de contacto (email, teléfono, WhatsApp)</li>
                <li>Información sobre tu marca o proyecto</li>
                <li>Información de facturación y envío</li>
                <li>Preferencias de comunicación</li>
              </ul>
            </Subsection>

            <Subsection title="1.2 Información Recopilada Automáticamente">
              <p>Cuando visitas nuestro sitio web, recopilamos automáticamente:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
                <li>Dirección IP y ubicación general</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Origen de la visita (referrer)</li>
                <li>Interacciones con elementos del sitio</li>
              </ul>
            </Subsection>

            <Subsection title="1.3 Cookies y Tecnologías de Seguimiento">
              <p>
                Utilizamos cookies para mejorar tu experiencia. Puedes gestionar tus preferencias de cookies a través de 
                nuestro banner de cookies. Para más información, consulta nuestra{' '}
                <a href="/politica-cookies" className="text-purple-600 hover:text-fuchsia-600 underline font-medium transition-colors">
                  Política de Cookies
                </a>.
              </p>
            </Subsection>
          </Section>

          {/* How We Use Your Information */}
          <Section title="2. Cómo Usamos Tu Información" icon={Eye}>
            <p className="mb-4">Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Proporcionar y gestionar nuestros servicios de branding, diseño, y consultoría</li>
              <li>Procesar tus solicitudes de sesiones y consultas</li>
              <li>Enviarte comunicaciones sobre tus proyectos y servicios contratados</li>
              <li>Mejorar nuestros servicios basándonos en tu feedback</li>
              <li>Enviarte contenido relevante del blog y recursos educativos (solo si te suscribiste)</li>
              <li>Procesar pagos de forma segura a través de proveedores externos</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
              <li>Prevenir fraude y garantizar la seguridad de nuestros servicios</li>
            </ul>
          </Section>

          {/* Information Sharing */}
          <Section title="3. Compartir Tu Información" icon={UserCheck}>
            <p className="mb-4">
              No vendemos ni alquilamos tu información personal a terceros. Podemos compartir tu información únicamente con:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Proveedores de servicios:</strong> Plataformas de pago, hosting, email marketing (siempre con acuerdos de confidencialidad)</li>
              <li><strong>Autoridades legales:</strong> Si es requerido por ley o para proteger nuestros derechos</li>
              <li><strong>Con tu consentimiento:</strong> En cualquier otro caso, solo con tu autorización explícita</li>
            </ul>
          </Section>

          {/* Data Security */}
          <Section title="4. Seguridad de Datos" icon={Lock}>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, 
              pérdida, alteración o divulgación. Esto incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
              <li>Encriptación SSL/TLS para todas las transmisiones de datos</li>
              <li>Acceso restringido a información personal (solo personal autorizado)</li>
              <li>Auditorías regulares de seguridad</li>
              <li>Backup automático de datos</li>
            </ul>
            <p className="mt-4 text-gray-600">
              Sin embargo, ningún método de transmisión por internet es 100% seguro. Hacemos nuestro mejor esfuerzo, 
              pero no podemos garantizar seguridad absoluta.
            </p>
          </Section>

          {/* Your Rights */}
          <Section title="5. Tus Derechos" icon={Shield}>
            <p className="mb-4">Tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Acceder:</strong> Solicitar una copia de tu información personal</li>
              <li><strong>Rectificar:</strong> Corregir información inexacta o incompleta</li>
              <li><strong>Eliminar:</strong> Solicitar la eliminación de tu información (derecho al olvido)</li>
              <li><strong>Restringir:</strong> Limitar el procesamiento de tu información</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerte al procesamiento de tu información para ciertos fines</li>
              <li><strong>Retirar consentimiento:</strong> En cualquier momento, sin afectar la legalidad del procesamiento previo</li>
            </ul>
            <p className="mt-4 text-gray-600">
              Para ejercer cualquiera de estos derechos, contáctanos en:{' '}
              <a href="mailto:contacto@luxmania.com" className="text-purple-600 hover:text-fuchsia-600 underline font-medium transition-colors">
                contacto@luxmania.com
              </a>
            </p>
          </Section>

          {/* International Transfers */}
          <Section title="6. Transferencias Internacionales" icon={Globe}>
            <p>
              LUXMANIA opera principalmente en México. Si accedes a nuestros servicios desde otras jurisdicciones, 
              tu información puede ser transferida y procesada en México. Al usar nuestros servicios, consientes estas transferencias.
            </p>
          </Section>

          {/* Data Retention */}
          <Section title="7. Retención de Datos" icon={Database}>
            <p>
              Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos 
              descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
              <li><strong>Información de clientes:</strong> 5 años después de la última interacción (obligaciones fiscales)</li>
              <li><strong>Newsletter subscribers:</strong> Hasta que canceles tu suscripción</li>
              <li><strong>Cookies:</strong> Según lo especificado en nuestra Política de Cookies</li>
            </ul>
          </Section>

          {/* Children's Privacy */}
          <Section title="8. Privacidad de Menores">
            <p>
              Nuestros servicios están dirigidos a adultos y profesionales. No recopilamos intencionalmente información 
              de menores de 18 años. Si eres padre/madre y crees que tu hijo nos ha proporcionado información, 
              contáctanos inmediatamente.
            </p>
          </Section>

          {/* Changes to Policy */}
          <Section title="9. Cambios a Esta Política">
            <p>
              Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos 
              publicando la nueva política en esta página y actualizando la fecha de "Última actualización". 
              Te recomendamos revisar esta política periódicamente.
            </p>
          </Section>

          {/* Contact */}
          <Section title="10. Contacto">
            <p className="mb-4">
              Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad, contáctanos:
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 border border-purple-100">
              <p className="font-semibold text-gray-900 mb-2">LUXMANIA</p>
              <p className="text-gray-600">Email: <a href="mailto:contacto@luxmania.com" className="text-purple-600 hover:text-fuchsia-600 underline">contacto@luxmania.com</a></p>
              <p className="text-gray-600">Ubicación: México</p>
            </div>
          </Section>
        </motion.div>
      </section>
    </div>
  )
}

// Section Component
const Section = ({ title, children, icon: Icon }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-lg">
          <Icon className="w-5 h-5 text-purple-600" />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="pl-0 space-y-4 text-gray-600 leading-relaxed">
      {children}
    </div>
  </div>
)

// Subsection Component
const Subsection = ({ title, children }) => (
  <div className="mt-6 pl-4 border-l-2 border-purple-200">
    <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
    <div className="space-y-3 text-gray-600">
      {children}
    </div>
  </div>
)

export default PrivacyPolicyPage
