import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const CookiePolicyPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const lastUpdated = "November 25, 2025"

  const handleCookieSettings = () => {
    localStorage.removeItem('cookieConsent')
    window.location.reload()
  }

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
              COOKIE POLICY
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
              This Cookie Policy explains how Greenleaf Lightworks uses cookies and similar technologies when you visit our website. 
              By continuing to use our website, you consent to our use of cookies as described in this policy.
            </p>
          </div>

          {/* What Are Cookies */}
          <Section title="1. What Are Cookies?">
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They help websites 
              remember your preferences and improve your browsing experience.
            </p>
          </Section>

          {/* Types of Cookies We Use */}
          <Section title="2. Types of Cookies We Use">
            
            <CookieType 
              title="2.1 Necessary Cookies" 
              required={true}
              description="These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas."
              examples={[
                "Session cookies for maintaining login status",
                "Security cookies for authentication",
                "Shopping cart cookies for eCommerce functionality"
              ]}
            />

            <CookieType 
              title="2.2 Analytics Cookies" 
              required={false}
              description="These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously."
              examples={[
                "Google Analytics - tracks page views, session duration, and user behavior",
                "Visitor tracking for site improvements"
              ]}
            />

            <CookieType 
              title="2.3 Marketing Cookies" 
              required={false}
              description="These cookies track your browsing habits to deliver personalized advertisements across different websites."
              examples={[
                "Facebook Pixel - for retargeting campaigns (currently not active)",
                "Google Ads - for advertising purposes (currently not active)"
              ]}
            />
          </Section>

          {/* Specific Cookies */}
          <Section title="3. Specific Cookies We Use">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 border-b border-stone-200">Cookie Name</th>
                    <th className="px-4 py-3 border-b border-stone-200">Purpose</th>
                    <th className="px-4 py-3 border-b border-stone-200">Duration</th>
                    <th className="px-4 py-3 border-b border-stone-200">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="px-4 py-3">cookieConsent</td>
                    <td className="px-4 py-3">Stores your cookie preferences</td>
                    <td className="px-4 py-3">1 year</td>
                    <td className="px-4 py-3">Necessary</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">_ga</td>
                    <td className="px-4 py-3">Google Analytics - distinguishes users</td>
                    <td className="px-4 py-3">2 years</td>
                    <td className="px-4 py-3">Analytics</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">_gid</td>
                    <td className="px-4 py-3">Google Analytics - distinguishes users</td>
                    <td className="px-4 py-3">24 hours</td>
                    <td className="px-4 py-3">Analytics</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">session_id</td>
                    <td className="px-4 py-3">Maintains user session</td>
                    <td className="px-4 py-3">Session</td>
                    <td className="px-4 py-3">Necessary</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Managing Cookies */}
          <Section title="4. Managing Your Cookie Preferences">
            <p>You have several options to manage cookies:</p>

            <Subsection title="4.1 Cookie Banner">
              <p>
                When you first visit our website, you'll see a cookie banner allowing you to accept, reject, or 
                customize your cookie preferences.
              </p>
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCookieSettings}
                  className="px-6 py-3 bg-[#8dc1ab] text-black rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:bg-[#7ab09a]"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  Change Cookie Settings
                </motion.button>
              </div>
            </Subsection>

            <Subsection title="4.2 Browser Settings">
              <p>You can also manage cookies through your browser settings:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
              </ul>
              <p className="mt-3 text-amber-600">
                Note: Blocking necessary cookies may affect website functionality.
              </p>
            </Subsection>
          </Section>

          {/* Third-Party Cookies */}
          <Section title="5. Third-Party Cookies">
            <p>
              Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. 
              Please refer to the third parties' privacy policies:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Google Analytics:</strong>{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Stripe:</strong>{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8dc1ab] hover:text-[#7ab09a] underline">
                  Stripe Privacy Policy
                </a>
              </li>
            </ul>
          </Section>

          {/* Updates to Policy */}
          <Section title="6. Changes to This Cookie Policy">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. 
              We will notify you of any significant changes by updating the "Last Updated" date at the top of this page.
            </p>
          </Section>

          {/* Contact */}
          <Section title="7. Contact Us">
            <p>If you have questions about our use of cookies, please contact us:</p>
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

const CookieType = ({ title, required, description, examples }) => (
  <div className="mt-6 p-6 bg-stone-50 rounded-lg border border-stone-200">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-stone-800 text-lg font-normal">{title}</h3>
      {required ? (
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Required</span>
      ) : (
        <span className="px-3 py-1 bg-stone-200 text-stone-600 text-xs rounded-full">Optional</span>
      )}
    </div>
    <p className="text-stone-600 leading-relaxed mb-3">{description}</p>
    <div className="text-stone-600 text-sm">
      <strong>Examples:</strong>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        {examples.map((example, index) => (
          <li key={index}>{example}</li>
        ))}
      </ul>
    </div>
  </div>
)

export default CookiePolicyPage
