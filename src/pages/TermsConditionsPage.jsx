import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const TermsConditionsPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const lastUpdated = "November 25, 2025"

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 px-6 lg:px-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 
              className="text-stone-800 text-5xl lg:text-7xl font-light tracking-[0.2em] mb-6"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              TERMS & CONDITIONS
            </h1>
            
            <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto w-64 mb-6" />
            
            <p className="text-stone-500 text-sm tracking-wide">
              Last Updated: {lastUpdated}
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
          <div>
            <p className="text-stone-600 leading-relaxed mb-4">
              Welcome to Greenleaf Lightworks. By accessing or using our website and services, you agree to be bound 
              by these Terms and Conditions. Please read them carefully.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these terms, please do not use our website or services.
            </p>
          </Section>

          {/* Services Description */}
          <Section title="2. Services">
            <p>Greenleaf Lightworks provides:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Energy healing sessions (Emotion Code, Body Code, Belief Code)</li>
              <li>Past life regression sessions</li>
              <li>Ilyari somatic healing</li>
              <li>Healing services for animals</li>
              <li>Digital products and books</li>
              <li>Online courses and educational content (coming soon)</li>
              <li>Physical and digital products through our store</li>
            </ul>
          </Section>

          {/* User Accounts */}
          <Section title="3. User Accounts">
            <Subsection title="3.1 Account Registration">
              <p>To access certain features, you may need to create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Provide accurate and complete information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </Subsection>

            <Subsection title="3.2 Account Termination">
              <p>
                We reserve the right to suspend or terminate your account if you violate these terms or engage in 
                fraudulent, abusive, or illegal activity.
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
