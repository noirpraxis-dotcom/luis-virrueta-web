import { motion } from 'framer-motion'
import { Share2, MessageCircle, Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react'
import { useState } from 'react'

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false)
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
  const shareTitle = encodeURIComponent(title)
  const shareUrl = encodeURIComponent(fullUrl)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareButtons = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      gradient: 'from-green-500 to-emerald-600',
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
    },
    {
      name: 'X',
      icon: Twitter,
      gradient: 'from-gray-800 to-black',
      url: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      gradient: 'from-blue-600 to-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      gradient: 'from-blue-500 to-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
  ]

  return (
    <section className="relative py-12 px-6 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12"
        >
          {/* Background gradient orb */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {/* Heading */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">
                Comparte este artículo
              </h3>
            </div>
            
            <p className="text-white/60 mb-8 leading-relaxed">
              Si este contenido te resultó valioso, compártelo con alguien que también pueda beneficiarse. El conocimiento crece cuando se comparte.
            </p>

            {/* Share buttons grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {shareButtons.map((button, i) => {
                const Icon = button.icon
                return (
                  <motion.a
                    key={button.name}
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${button.gradient} overflow-hidden`}
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                    
                    <Icon className="w-6 h-6 text-white relative z-10" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-white relative z-10">{button.name}</span>
                  </motion.a>
                )
              })}
            </div>

            {/* Copy link button */}
            <motion.button
              onClick={handleCopyLink}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={copied ? "Enlace copiado" : "Copiar enlace del artículo"}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white transition-all duration-300"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Copiar enlace</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ShareButtons
