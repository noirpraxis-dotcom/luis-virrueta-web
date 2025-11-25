import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const PrivacyPolicyPage = () => {
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
              PRIVACY POLICY
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
              At Greenleaf Lightworks, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </div>

          {/* Information We Collect */}
          <Section title="1. Information We Collect">
            <Subsection title="1.1 Personal Information">
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Register for an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us via email or contact forms</li>
                <li>Enroll in our courses</li>
              </ul>
              <p className="mt-3">This information may include:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Name and contact information (email address, phone number)</li>
                <li>Billing and shipping address</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Account credentials</li>
              </ul>
            </Subsection>

            <Subsection title="1.2 Automatically Collected Information">
              <p>When you visit our website, we automatically collect certain information about your device, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Operating system</li>
              </ul>
            </Subsection>

            <Subsection title="1.3 Cookies and Tracking Technologies">
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control cookies 
                through your browser settings. For more information, see our{' '}
                <a href="/cookie-policy" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">Cookie Policy</a>.
              </p>
            </Subsection>
          </Section>

          {/* How We Use Your Information */}
          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Process and fulfill your orders</li>
              <li>Provide access to purchased courses and content</li>
              <li>Send order confirmations and updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send promotional emails and newsletters (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          {/* Sharing Your Information */}
          <Section title="3. Sharing Your Information">
            <p>We do not sell your personal information. We may share your information with:</p>
            
            <Subsection title="3.1 Service Providers">
              <p>Third-party vendors who perform services on our behalf, such as:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Email service providers</li>
                <li>Website hosting and analytics providers</li>
                <li>Course platform providers</li>
              </ul>
            </Subsection>

            <Subsection title="3.2 Legal Requirements">
              <p>
                We may disclose your information if required by law or if we believe such action is necessary to 
                comply with legal obligations or protect our rights.
              </p>
            </Subsection>
          </Section>

          {/* Data Security */}
          <Section title="4. Data Security">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
              over the internet is 100% secure.
            </p>
          </Section>

          {/* Your Rights (GDPR/CCPA) */}
          <Section title="5. Your Privacy Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request transfer of your data</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@greenleaflightworks.com" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">
                privacy@greenleaflightworks.com
              </a>
            </p>
          </Section>

          {/* Children's Privacy */}
          <Section title="6. Children's Privacy">
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
              personal information from children.
            </p>
          </Section>

          {/* International Users */}
          <Section title="7. International Users">
            <p>
              If you are accessing our website from outside the United States, please note that your information 
              may be transferred to and processed in the United States.
            </p>
          </Section>

          {/* Changes to This Policy */}
          <Section title="8. Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new policy on this page and updating the "Last Updated" date.
            </p>
          </Section>

          {/* Contact Us */}
          <Section title="9. Contact Us">
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="mt-4 space-y-2 text-stone-600">
              <p>Email: <a href="mailto:privacy@greenleaflightworks.com" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">privacy@greenleaflightworks.com</a></p>
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

export default PrivacyPolicyPage
