import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Heart } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { findPurchaseByPartnerEmail, createPartnerPurchase, linkPartnerToPurchase } from '../services/firestoreService'

export default function RegistroPage() {
  const { user, loginWithGoogle, signUpWithEmail, loginWithEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const inviteEmail = searchParams.get('email') || ''
  const inviteToken = searchParams.get('invite') || ''
  const selectedPackage = searchParams.get('package') || ''
  const selectedProduct = searchParams.get('product') || 'radiografia-pareja'

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState(inviteEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isInvite = Boolean(inviteEmail && inviteToken)
  const showPartnerFields = selectedPackage === 'losdos' && !isInvite

  // If already logged in, redirect to profile
  useEffect(() => {
    if (user) {
      if (isInvite) {
        handlePartnerLink(user)
      } else if (selectedPackage) {
        navigate(`/perfil?startPurchase=${selectedProduct}&package=${selectedPackage}`)
      } else {
        navigate('/perfil')
      }
    }
  }, [user])

  const handlePartnerLink = async (loggedUser) => {
    try {
      const invite = await findPurchaseByPartnerEmail(loggedUser.email)
      if (invite) {
        await linkPartnerToPurchase(invite.buyerUid, invite.purchaseId, loggedUser.uid)
        const partnerPurchaseId = await createPartnerPurchase(loggedUser.uid, {
          product: invite.product,
          packageType: invite.packageType,
          buyerUid: invite.buyerUid,
          buyerPurchaseId: invite.purchaseId,
          pairId: invite.pairId,
        })
        navigate(`/perfil?activePurchase=${partnerPurchaseId}`)
      } else {
        navigate('/perfil')
      }
    } catch {
      navigate('/perfil')
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    // loginWithGoogle triggers a full-page redirect to Google
    // When user comes back, onAuthStateChanged fires and useEffect redirects
    const result = await loginWithGoogle()
    if (!result.success) {
      setError(result.error || 'Error al conectar con Google')
      setLoading(false)
    }
    // If success: the page will redirect to Google and come back — no further action needed
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    let result
    if (mode === 'register') {
      if (!name.trim()) {
        setError('Ingresa tu nombre')
        setLoading(false)
        return
      }
      result = await signUpWithEmail(email, password, name.trim())
    } else {
      result = await loginWithEmail(email, password)
    }

    if (!result.success) {
      setError(result.error)
      setLoading(false)
    }
    // useEffect handles redirect
  }

  if (user) return null // redirecting...

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-20">
      <SEOHead title="Crear cuenta — Luis Virrueta" description="Crea tu cuenta para acceder a tus productos" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          {isInvite ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-4">
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
              <h1 className="text-2xl font-light text-white mb-2">Te han invitado</h1>
              <p className="text-gray-400 text-sm">Crea tu cuenta para comenzar tu Radiografía de Pareja</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-light text-white mb-2">
                {mode === 'register' ? 'Crea tu cuenta' : 'Inicia sesión'}
              </h1>
              <p className="text-gray-400 text-sm">
                {mode === 'register'
                  ? 'Aquí se guardará todo tu progreso y resultados'
                  : 'Accede a tu perfil y productos'}
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all text-white text-sm font-light mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">o con email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                readOnly={isInvite}
                required
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors ${isInvite ? 'opacity-60' : ''}`}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Partner fields for "losdos" package */}
            {showPartnerFields && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-purple-300 mb-3">Datos de tu pareja (le enviaremos un correo)</p>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Nombre de tu pareja"
                      value={partnerName}
                      onChange={e => setPartnerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email de tu pareja"
                      value={partnerEmail}
                      onChange={e => setPartnerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError('') }}
              className="text-xs text-gray-400 hover:text-purple-300 transition-colors"
            >
              {mode === 'register' ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
