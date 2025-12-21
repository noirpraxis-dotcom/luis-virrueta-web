import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { FileText, Shield, DollarSign, Palette, BookOpen, Scale } from 'lucide-react'

const TermsConditionsPage = () => {
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
                <FileText className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            
            <h1 className="text-gray-900 text-5xl lg:text-7xl font-light tracking-tight mb-6">
              Términos y <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent font-normal">Condiciones</span>
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
              Bienvenido a <span className="font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Luis Virrueta</span>. 
              Al acceder o usar mi sitio web y servicios, aceptas estar vinculado por estos Términos y Condiciones. 
              Por favor, léelos cuidadosamente.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <Section title="1. Aceptación de Términos" icon={Shield}>
            <p>
              Al acceder y usar este sitio web, aceptas y te comprometes a cumplir con los términos y disposiciones de este acuerdo. 
              Si no estás de acuerdo con estos términos, por favor no uses nuestro sitio web o servicios.
            </p>
          </Section>

          {/* Services Description */}
          <Section title="2. Servicios" icon={Palette}>
            <p className="mb-3">Luis Virrueta proporciona:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Psicoterapia y consultoría psicológica profesional</li>
              <li>Método AION© - Transformación personal y desarrollo</li>
              <li>Sesiones individuales de terapia y coaching</li>
              <li>Talleres y programas de desarrollo personal</li>
              <li>Contenido educativo del blog</li>
              <li>Recursos y materiales de psicología aplicada</li>
            </ul>
          </Section>

          {/* User Accounts */}
          <Section title="3. Cuentas de Usuario" icon={Shield}>
            <Subsection title="3.1 Registro">
              <p>Para acceder a ciertas funciones, puedes necesitar crear una cuenta. Te comprometes a:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
                <li>Proporcionar información precisa y completa</li>
                <li>Mantener tu contraseña segura y confidencial</li>
                <li>Notificarnos inmediatamente de cualquier acceso no autorizado</li>
                <li>Ser responsable de todas las actividades bajo tu cuenta</li>
              </ul>
            </Subsection>

            <Subsection title="3.2 Terminación de Cuenta">
              <p>
                Nos reservamos el derecho de suspender o terminar tu cuenta si violas estos términos o participas en 
                actividades fraudulentas, abusivas o ilegales.
              </p>
            </Subsection>
          </Section>

          {/* Purchases and Payments */}
          <Section title="4. Compras y Pagos" icon={DollarSign}>
            <Subsection title="4.1 Precios">
              <p>
                Todos los precios se muestran en la moneda indicada y están sujetos a cambios sin previo aviso. 
                Nos reservamos el derecho de modificar precios en cualquier momento.
              </p>
            </Subsection>

            <Subsection title="4.2 Pago">
              <p>
                El pago se procesa de forma segura a través de procesadores de pago externos (Stripe, PayPal, transferencias bancarias). 
                Al proporcionar información de pago, declaras que estás autorizado para usar el método de pago.
              </p>
            </Subsection>

            <Subsection title="4.3 Reembolsos y Cancelaciones">
              <p>
                <strong>Sesiones de Terapia/Consultoría:</strong> Las cancelaciones deben hacerse al menos 24 horas antes de la sesión programada. 
                No se reembolsan citas perdidas sin aviso de 24 horas.
              </p>
              <p className="mt-3">
                <strong>Programas y Talleres:</strong> Reembolsos disponibles solo si el programa no ha comenzado. Una vez iniciado, no se otorgan reembolsos.
              </p>
              <p className="mt-3">
                <strong>Materiales Digitales:</strong> Debido a la naturaleza de los productos digitales, todas las ventas son finales una vez que se otorga el acceso.
              </p>
            </Subsection>
          </Section>

          {/* Branding & Healing Services */}
          <Section title="5. Servicios Profesionales de Psicología" icon={Palette}>
            <Subsection title="5.1 Naturaleza de los Servicios">
              <p>
                Mis servicios de psicoterapia y desarrollo personal son servicios profesionales regulados. 
                Opero bajo los códigos deontológicos y éticos de la profesión de psicología. 
                Los resultados dependen del compromiso del cliente y su proceso personal. No garantizo resultados específicos.
              </p>
            </Subsection>

            <Subsection title="5.2 Confidencialidad Profesional">
              <p>
                Toda información compartida en las sesiones está protegida por secreto profesional según las normas 
                del Código Ético del Psicólogo. Solo se revelará información en casos exigidos por ley o con tu consentimiento expreso.
              </p>
            </Subsection>

            <Subsection title="5.3 Límites del Servicio">
              <p>
                Los servicios de terapia online no son adecuados para crisis o emergencias. Si experimentas una crisis, 
                contacta servicios de emergencia locales inmediatamente.
              </p>
            </Subsection>

            <Subsection title="5.4 Paquetes de Sesiones">
              <p>
                Los paquetes de sesiones no expiran pero deben ser utilizados por el comprador original. Los paquetes no son transferibles 
                ni reembolsables una vez completada la primera sesión.
              </p>
            </Subsection>
          </Section>

          {/* Intellectual Property */}
          <Section title="6. Propiedad Intelectual" icon={Shield}>
            <p>
              Todo el contenido en este sitio web, incluyendo textos, gráficos, logos, imágenes, videos, diseños y materiales del blog, es 
              propiedad de LUXMANIA y está protegido por leyes de derechos de autor. No puedes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
              <li>Reproducir, distribuir o mostrar nuestro contenido sin permiso</li>
              <li>Usar trabajos de branding creados por LUXMANIA sin acreditar</li>
              <li>Compartir materiales de consultoría con terceros</li>
              <li>Usar nuestras marcas registradas o branding sin autorización</li>
              <li>Copiar o redistribuir contenido del blog sin atribución</li>
            </ul>
            <p className="mt-4 text-gray-600">
              Los proyectos de branding creados específicamente para ti son de tu propiedad una vez pagados en su totalidad, 
              pero LUXMANIA retiene el derecho de usar el trabajo en su portafolio.
            </p>
          </Section>

          {/* Blog Content */}
          <Section title="7. Contenido del Blog" icon={BookOpen}>
            <p>
              El contenido de nuestro blog es de libre acceso y está diseñado para educar e inspirar. Puedes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-600">
              <li>Compartir enlaces a nuestros artículos en redes sociales</li>
              <li>Citar hasta 200 palabras con atribución adecuada y enlace</li>
              <li>Usar información para uso educativo personal</li>
            </ul>
            <p className="mt-4 text-gray-600">
              No puedes republicar artículos completos, vender el contenido, o presentarlo como propio sin permiso explícito.
            </p>
          </Section>

          {/* Privacy and Data */}
          <Section title="8. Privacidad" icon={Shield}>
            <p>
              Tu privacidad es importante para nosotros. Por favor revisa nuestra{' '}
              <a href="/politica-privacidad" className="text-purple-600 hover:text-fuchsia-600 underline font-medium transition-colors">Política de Privacidad</a> 
              {' '}para entender cómo recopilamos, usamos y protegemos tu información.
            </p>
          </Section>

          {/* Limitation of Liability */}
          <Section title="9. Limitación de Responsabilidad" icon={Scale}>
            <p>
              En la medida máxima permitida por la ley, LUXMANIA no será responsable de daños indirectos, 
              incidentales, especiales, consecuentes o punitivos que surjan del uso de nuestros servicios.
            </p>
          </Section>

          {/* Disclaimers */}
          <Section title="10. Descargos de Responsabilidad">
            <p>
              Nuestros servicios y sitio web se proporcionan "tal cual" sin garantías de ningún tipo, ya sean expresas o implícitas. 
              No garantizamos que nuestros servicios serán ininterrumpidos, libres de errores o seguros.
            </p>
          </Section>

          {/* Governing Law */}
          <Section title="11. Ley Aplicable" icon={Scale}>
            <p>
              Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes de México, 
              sin tener en cuenta sus disposiciones sobre conflictos de leyes.
            </p>
          </Section>

          {/* Changes to Terms */}
          <Section title="12. Cambios a los Términos">
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos a los usuarios de cualquier cambio material. 
              El uso continuado de nuestros servicios después de los cambios constituye la aceptación de los nuevos términos.
            </p>
          </Section>

          {/* Contact Us */}
          <Section title="13. Información de Contacto">
            <p className="mb-4">Para preguntas sobre estos Términos y Condiciones, contáctanos:</p>
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

export default TermsConditionsPage
