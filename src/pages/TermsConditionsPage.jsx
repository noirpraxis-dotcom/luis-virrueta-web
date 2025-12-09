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
              Bienvenido a <span className="font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">LUXMANIA</span>. 
              Al acceder o usar nuestro sitio web y servicios, aceptas estar vinculado por estos Términos y Condiciones. 
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
            <p className="mb-3">LUXMANIA proporciona:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Branding psicológico y estrategia de marca</li>
              <li>Arquetipos de marca y storytelling</li>
              <li>Avatares IA personalizados</li>
              <li>Diseño UX/UI</li>
              <li>Consultoría de identidad de marca</li>
              <li>Sesiones de sanación (Emotion Code, Body Code, Belief Code)</li>
              <li>Contenido educativo del blog</li>
              <li>Productos digitales y tienda online (próximamente)</li>
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
          <Section title="4. Purchases and Payments">
            <Subsection title="4.1 Pricing">
              <p>
                All prices are displayed in USD and are subject to change without notice. We reserve the right to 
                modify prices at any time.
              </p>
            </Subsection>

            <Subsection title="4.2 Payment">
              <p>
                Payment is processed securely through third-party payment processors (Stripe, PayPal). By providing 
                payment information, you represent that you are authorized to use the payment method.
              </p>
            </Subsection>

            <Subsection title="4.3 Refunds and Cancellations">
              <p>
                <strong>Healing Sessions:</strong> Cancellations must be made at least 24 hours before the scheduled session. 
                No refunds for missed appointments without 24-hour notice.
              </p>
              <p className="mt-3">
                <strong>Digital Products:</strong> Due to the nature of digital products, all sales are final once access is granted.
              </p>
              <p className="mt-3">
                <strong>Physical Products:</strong> Returns accepted within 14 days of delivery if items are unused and in original condition.
              </p>
              <p className="mt-3">
                <strong>Courses:</strong> Refunds available within 7 days of purchase if less than 20% of course content has been accessed.
              </p>
            </Subsection>
          </Section>

          {/* Healing Sessions */}
          <Section title="5. Healing Sessions">
            <Subsection title="5.1 Nature of Services">
              <p>
                Our healing services are complementary and alternative wellness practices. They are not a substitute 
                for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or 
                other qualified health provider.
              </p>
            </Subsection>

            <Subsection title="5.2 No Guarantees">
              <p>
                While we strive to provide beneficial healing experiences, results vary by individual. We make no 
                guarantees regarding specific outcomes.
              </p>
            </Subsection>

            <Subsection title="5.3 Session Packages">
              <p>
                Session packages do not expire but must be used by the original purchaser. Packages are non-transferable 
                and non-refundable once the first session is completed.
              </p>
            </Subsection>
          </Section>

          {/* Intellectual Property */}
          <Section title="6. Intellectual Property">
            <p>
              All content on this website, including text, graphics, logos, images, videos, and course materials, is 
              the property of Greenleaf Lightworks and is protected by copyright laws. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Reproduce, distribute, or display our content without permission</li>
              <li>Share course login credentials with others</li>
              <li>Record, screenshot, or redistribute course materials</li>
              <li>Use our trademarks or branding without authorization</li>
            </ul>
          </Section>

          {/* Online Courses (Future) */}
          <Section title="7. Online Courses">
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 space-y-3">
              <p className="italic text-stone-500">
                This section will be activated when course offerings launch.
              </p>
              
              <Subsection title="7.1 Course Access">
                <p>Upon purchase, you receive a personal, non-transferable license to access course materials for:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>One-time courses: Lifetime access</li>
                  <li>Subscription courses: Duration of active subscription</li>
                </ul>
              </Subsection>

              <Subsection title="7.2 Course Completion">
                <p>
                  Certificates of completion are issued only upon finishing all required course modules and assessments. 
                  Certificates are for personal use only and do not constitute professional licensing.
                </p>
              </Subsection>
            </div>
          </Section>

          {/* Privacy and Data */}
          <Section title="8. Privacy">
            <p>
              Your privacy is important to us. Please review our{' '}
              <a href="/privacy-policy" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">Privacy Policy</a> 
              {' '}to understand how we collect, use, and protect your information.
            </p>
          </Section>

          {/* Limitation of Liability */}
          <Section title="9. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Greenleaf Lightworks shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of our services.
            </p>
          </Section>

          {/* Disclaimers */}
          <Section title="10. Disclaimers">
            <p>
              Our services and website are provided "as is" without warranties of any kind, either express or implied. 
              We do not guarantee that our services will be uninterrupted, error-free, or secure.
            </p>
          </Section>

          {/* Governing Law */}
          <Section title="11. Governing Law">
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of [Your State/Country], 
              without regard to its conflict of law provisions.
            </p>
          </Section>

          {/* Changes to Terms */}
          <Section title="12. Changes to Terms">
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes. 
              Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </Section>

          {/* Contact Us */}
          <Section title="13. Contact Information">
            <p>For questions about these Terms and Conditions, contact us:</p>
            <div className="mt-4 space-y-2 text-stone-600">
              <p>Email: <a href="mailto:support@greenleaflightworks.com" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">support@greenleaflightworks.com</a></p>
              <p>Website: <a href="https://greenleaflightworks.com" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">www.greenleaflightworks.com</a></p>
            </div>
          </Section>
        </motion.div>
      </section>
    </div>
  )
}

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 
      className="text-stone-800 text-2xl font-light tracking-wide"
      style={{ fontFamily: 'Gotham, sans-serif' }}
    >
      {title}
    </h2>
    <div className="text-stone-600 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
)

const Subsection = ({ title, children }) => (
  <div className="mt-4 space-y-3">
    <h3 className="text-stone-700 text-lg font-normal">{title}</h3>
    <div className="text-stone-600 leading-relaxed space-y-3">
      {children}
    </div>
  </div>
)

export default TermsConditionsPage
