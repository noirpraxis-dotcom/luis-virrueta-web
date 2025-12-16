import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Sparkles, Check } from 'lucide-react'

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSubscribed(true)
    setLoading(false)
    setEmail('')
    
    // Reset después de 5 segundos
    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <section className="relative py-16 px-6 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-cyan-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-10 lg:p-16 overflow-hidden"
        >
          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl"
          />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              viewport={{ once: true }}
              className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-white/20 items-center justify-center mb-6"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            {/* Heading */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
            >
              Transformación Desde el Inconsciente
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Únete a +5,000 personas que reciben cada semana las intersecciones entre sabiduría ancestral y ciencia contemporánea. Psicología del inconsciente, neurociencia y filosofía aplicada a tu realidad.
            </motion.p>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              {!subscribed ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/15 transition-all"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Suscribiendo...
                      </span>
                    ) : (
                      'Suscribirse'
                    )}
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500/30 rounded-full"
                >
                  <Check className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-medium">¡Bienvenido a la comunidad!</span>
                </motion.div>
              )}

              <p className="text-xs text-white/40 mt-4">
                Sin spam. Solo contenido de valor. Cancela cuando quieras.
              </p>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default NewsletterSignup
