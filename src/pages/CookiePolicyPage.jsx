import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Cookie, Settings, Shield, Globe, Eye, FileCheck } from 'lucide-react'

const CookiePolicyPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const lastUpdated = "9 de Diciembre, 2024"

  const handleCookieSettings = () => {
    localStorage.removeItem('cookieConsent')
    window.location.reload()
  }

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
                <Cookie className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            
            <h1 className="text-gray-900 text-5xl lg:text-7xl font-light tracking-tight mb-6">
              Política de <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent font-normal">Cookies</span>
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
              Esta Política de Cookies explica cómo <span className="font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Luis Virrueta</span> utiliza 
              cookies y tecnologías similares cuando visitas mi sitio web. Al continuar usando mi sitio web, 
              consientes el uso de cookies como se describe en esta política.
            </p>
          </div>

          {/* What Are Cookies */}
          <Section title="1. ¿Qué son las Cookies?" icon={Cookie}>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
              Ayudan a los sitios web a recordar tus preferencias y mejorar tu experiencia de navegación.
            </p>
          </Section>

          {/* Types of Cookies We Use */}
          <Section title="2. Tipos de Cookies que Usamos" icon={Settings}>
            
            <CookieType 
              title="2.1 Cookies Necesarias" 
              required={true}
              description="Estas cookies son esenciales para que el sitio web funcione correctamente. Permiten funciones básicas como navegación de páginas y acceso a áreas seguras."
              examples={[
                "Cookies de sesión para mantener el estado de inicio de sesión",
                "Cookies de seguridad para autenticación",
                "Cookies de preferencias (idioma, temas visuales)"
              ]}
            />

            <CookieType 
              title="2.2 Cookies de Análisis" 
              required={false}
              description="Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando y reportando información de manera anónima."
              examples={[
                "Google Analytics - rastrea vistas de página, duración de sesión y comportamiento del usuario",
                "Seguimiento de visitantes para mejoras del sitio",
                "Métricas de engagement del blog y contenido"
              ]}
            />

            <CookieType 
              title="2.3 Cookies de Marketing" 
              required={false}
              description="Estas cookies rastrean tus hábitos de navegación para entregar publicidad personalizada en diferentes sitios web."
              examples={[
                "Facebook Pixel - para campañas de retargeting (actualmente no activo)",
                "Google Ads - para propósitos publicitarios (actualmente no activo)",
                "Cookies de afiliados para rastrear referencias"
              ]}
            />
          </Section>

          {/* Specific Cookies */}
          <Section title="3. Cookies Específicas que Usamos" icon={FileCheck}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-purple-200 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
                  <tr>
                    <th className="px-4 py-3 border-b border-purple-200 text-gray-900 font-semibold">Nombre de Cookie</th>
                    <th className="px-4 py-3 border-b border-purple-200 text-gray-900 font-semibold">Propósito</th>
                    <th className="px-4 py-3 border-b border-purple-200 text-gray-900 font-semibold">Duración</th>
                    <th className="px-4 py-3 border-b border-purple-200 text-gray-900 font-semibold">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">cookieConsent</td>
                    <td className="px-4 py-3 text-gray-600">Almacena tus preferencias de cookies</td>
                    <td className="px-4 py-3 text-gray-600">1 año</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Necesaria</span></td>
                  </tr>
                  <tr className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">_ga</td>
                    <td className="px-4 py-3 text-gray-600">Google Analytics - distingue usuarios</td>
                    <td className="px-4 py-3 text-gray-600">2 años</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Análisis</span></td>
                  </tr>
                  <tr className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">_gid</td>
                    <td className="px-4 py-3 text-gray-600">Google Analytics - distingue usuarios</td>
                    <td className="px-4 py-3 text-gray-600">24 horas</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Análisis</span></td>
                  </tr>
                  <tr className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">session_id</td>
                    <td className="px-4 py-3 text-gray-600">Mantiene sesión del usuario</td>
                    <td className="px-4 py-3 text-gray-600">Sesión</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Necesaria</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Managing Cookies */}
          <Section title="4. Gestiona tus Preferencias de Cookies" icon={Settings}>
            <p>Tienes varias opciones para gestionar cookies:</p>

            <Subsection title="4.1 Banner de Cookies">
              <p>
                Cuando visitas nuestro sitio web por primera vez, verás un banner de cookies que te permite aceptar, rechazar o 
                personalizar tus preferencias de cookies.
              </p>
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCookieSettings}
                  className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl text-sm font-semibold tracking-wide overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <span className="relative z-10">Cambiar Configuración de Cookies</span>
                </motion.button>
              </div>
            </Subsection>

            <Subsection title="4.2 Configuración del Navegador">
              <p>También puedes gestionar cookies a través de la configuración de tu navegador:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos del sitio</li>
                <li><strong>Firefox:</strong> Preferencias → Privacidad y Seguridad → Cookies y Datos del Sitio</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Administrar Datos del Sitio Web</li>
                <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies y permisos del sitio</li>
              </ul>
              <p className="mt-3 text-amber-600 font-medium">
                Nota: Bloquear cookies necesarias puede afectar la funcionalidad del sitio web.
              </p>
            </Subsection>
          </Section>

          {/* Third-Party Cookies */}
          <Section title="5. Cookies de Terceros" icon={Globe}>
            <p>
              Algunas cookies son colocadas por servicios de terceros que aparecen en nuestras páginas. No controlamos estas cookies. 
              Por favor, consulta las políticas de privacidad de terceros:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
              <li>
                <strong>Google Analytics:</strong>{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-fuchsia-600 underline font-medium transition-colors">
                  Política de Privacidad de Google
                </a>
              </li>
              <li>
                <strong>Stripe:</strong>{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-fuchsia-600 underline font-medium transition-colors">
                  Política de Privacidad de Stripe
                </a>
              </li>
            </ul>
          </Section>

          {/* Updates to Policy */}
          <Section title="6. Cambios a Esta Política de Cookies" icon={Eye}>
            <p>
              Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en tecnología o requisitos legales. 
              Te notificaremos de cualquier cambio significativo actualizando la fecha de "Última actualización" en la parte superior de esta página.
            </p>
          </Section>

          {/* Contact */}
          <Section title="7. Contacto">
            <p className="mb-4">Si tienes preguntas sobre nuestro uso de cookies, contáctanos:</p>
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 border border-purple-100">
              <p className="font-semibold text-gray-900 mb-2">Luis Virrueta</p>
              <p className="text-gray-600">Email: <a href="mailto:contacto@luisvirrueta.com" className="text-purple-600 hover:text-fuchsia-600 underline">contacto@luisvirrueta.com</a></p>
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

// CookieType Component
const CookieType = ({ title, required, description, examples }) => (
  <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl border border-purple-100">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-gray-900 text-lg font-semibold">{title}</h3>
      {required ? (
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Requerida</span>
      ) : (
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Opcional</span>
      )}
    </div>
    <p className="text-gray-600 leading-relaxed mb-3">{description}</p>
    <div className="text-gray-600 text-sm">
      <strong className="text-gray-900">Ejemplos:</strong>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        {examples.map((example, index) => (
          <li key={index}>{example}</li>
        ))}
      </ul>
    </div>
  </div>
)

export default CookiePolicyPage
