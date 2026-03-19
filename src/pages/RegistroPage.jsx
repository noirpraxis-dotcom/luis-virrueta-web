import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Heart, CheckCircle2, MailCheck, RefreshCw } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { findPurchaseByPartnerEmail, createPartnerPurchase, linkPartnerToPurchase, claimPartnerInvite } from '../services/firestoreService'

export default function RegistroPage() {
  const { user, loginWithGoogle, signUpWithEmail, loginWithEmail, resendVerification, verifyCode, emailVerified } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const inviteEmail = searchParams.get('email') || ''
  const inviteToken = searchParams.get('invite') || ''
  const selectedPackage = searchParams.get('package') || ''
  const selectedProduct = searchParams.get('product') || 'radiografia-pareja'

  const [activeTab, setActiveTab] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState(inviteEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [codeError, setCodeError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const isInvite = Boolean(inviteEmail && inviteToken)
  const showPartnerFields = selectedPackage === 'losdos' && !isInvite

  // Force register tab for invites
  useEffect(() => {
    if (isInvite) setActiveTab('register')
  }, [isInvite])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // If already logged in, redirect
  useEffect(() => {
    if (!user) return
    // If email not verified and it's an email/password account, show verification screen
    const isEmailProvider = user.providerData?.some(p => p.providerId === 'password')
    if (isEmailProvider && !emailVerified) {
      setVerificationSent(true)
      return
    }
    if (isInvite) {
      handlePartnerLink(user)
    } else if (selectedPackage) {
      navigate(`/perfil?startPurchase=${selectedProduct}&package=${selectedPackage}`)
    } else {
      navigate('/perfil')
    }
  }, [user, emailVerified])

  const handlePartnerLink = async (loggedUser) => {
    try {
      const invite = await findPurchaseByPartnerEmail(loggedUser.email)
      if (invite && !invite.claimed) {
        // Link partner to buyer's purchase
        try {
          await linkPartnerToPurchase(invite.buyerUid, invite.buyerPurchaseId, loggedUser.uid)
        } catch (e) { console.error('Link partner error (non-fatal):', e) }
        // Create mirror purchase for partner
        const partnerPurchaseId = await createPartnerPurchase(loggedUser.uid, {
          product: invite.product,
          packageType: invite.packageType,
          buyerUid: invite.buyerUid,
          buyerPurchaseId: invite.buyerPurchaseId,
          pairId: invite.pairId,
        })
        // Mark invite as claimed
        await claimPartnerInvite(loggedUser.email).catch(() => {})
        navigate(`/tienda/radiografia-premium?purchaseId=${partnerPurchaseId}&type=${invite.packageType}&fromProfile=true`)
      } else {
        navigate('/perfil')
      }
    } catch (err) {
      console.error('handlePartnerLink error:', err)
      navigate('/perfil')
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    const result = await loginWithGoogle()
    if (!result.success) {
      setError(result.error || 'Error al conectar con Google')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    let result
    if (activeTab === 'register') {
      if (!name.trim()) {
        setError('Ingresa tu nombre')
        setLoading(false)
        return
      }
      result = await signUpWithEmail(email, password, name.trim())
      if (result.success && result.needsVerification) {
        setVerificationSent(true)
        setLoading(false)
        return
      }
    } else {
      result = await loginWithEmail(email, password)
    }

    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    const result = await resendVerification()
    if (result.success) {
      setResendCooldown(60)
      setCodeError('')
    }
  }

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1)
    setVerificationCode(newCode)
    setCodeError('')
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`)
      next?.focus()
    }
  }

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`)
      prev?.focus()
    }
  }

  const handleCodePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      e.preventDefault()
      setVerificationCode(pasted.split(''))
      setCodeError('')
      document.getElementById('code-5')?.focus()
    }
  }

  // Auto-verify when all 6 digits are filled
  useEffect(() => {
    if (verificationCode.every(d => d !== '') && !verifying) {
      handleVerifyCode()
    }
  }, [verificationCode])

  const handleVerifyCode = async () => {
    const code = verificationCode.join('')
    if (code.length !== 6) {
      setCodeError('Ingresa los 6 dígitos')
      return
    }
    setVerifying(true)
    setCodeError('')
    const result = await verifyCode(code)
    if (result.success) {
      setVerificationSent(false)
      // emailVerified state in context will trigger redirect via useEffect
    } else {
      setCodeError(result.error || 'Código incorrecto')
      setVerificationCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    }
    setVerifying(false)
  }

  // ─── Verification screen ──────────────────────────────────
  if (verificationSent && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 mb-5">
              <MailCheck className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-light text-white mb-2">Verifica tu correo</h2>
            <p className="text-gray-400 text-sm mb-1">Enviamos un código de 6 dígitos a</p>
            <p className="text-purple-300 text-sm font-medium mb-6">{user.email}</p>

            {/* 6-digit code input */}
            <div className="flex justify-center gap-2 mb-4" onPaste={handleCodePaste}>
              {verificationCode.map((digit, i) => (
                <input
                  key={i}
                  id={`code-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  className="w-11 h-13 text-center text-xl font-semibold text-white bg-white/5 border border-white/15 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 outline-none transition-all"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {codeError && (
              <p className="text-red-400 text-xs mb-3">{codeError}</p>
            )}

            <button
              onClick={handleVerifyCode}
              disabled={verifying || verificationCode.join('').length !== 6}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-4"
            >
              {verifying ? 'Verificando...' : 'Verificar código'}
            </button>

            <p className="text-gray-500 text-xs mb-4">
              Revisa tu bandeja de entrada y spam.
            </p>

            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-purple-300 transition-colors disabled:opacity-40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (user && emailVerified) return null // redirecting...

  // ─── Google sign-in button (reused) ────────────────────────
  const GoogleButton = () => (
    <button
      onClick={handleGoogle}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all text-white text-sm font-light"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Continuar con Google
    </button>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-20">
      <SEOHead title="Mi perfil — Luis Virrueta" description="Accede a tu perfil personal para ver tus productos, reportes y progreso" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
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
              <h1 className="text-2xl font-light text-white mb-2">Tu espacio personal</h1>
              <p className="text-gray-400 text-sm">Accede o crea tu cuenta para ver tus productos y resultados</p>
            </>
          )}
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
          {/* Tabs */}
          {!isInvite && (
            <div className="flex">
              <button
                onClick={() => { setActiveTab('login'); setError('') }}
                className={`flex-1 py-3.5 text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-transparent text-white/90'
                    : 'bg-gradient-to-r from-emerald-600/40 to-teal-600/40 text-white hover:from-emerald-600/50 hover:to-teal-600/50'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => { setActiveTab('register'); setError('') }}
                className={`flex-1 py-3.5 text-sm font-medium transition-all ${
                  activeTab === 'register'
                    ? 'bg-transparent text-white/90'
                    : 'bg-gradient-to-r from-emerald-600/40 to-teal-600/40 text-white hover:from-emerald-600/50 hover:to-teal-600/50'
                }`}
              >
                Crear cuenta
              </button>
            </div>
          )}

          <div className="p-6">
            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {activeTab === 'register' && (
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
                  placeholder={activeTab === 'register' ? 'Crea una contraseña (mín. 6 caracteres)' : 'Tu contraseña'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={activeTab === 'register' ? 'new-password' : 'current-password'}
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
              {showPartnerFields && activeTab === 'register' && (
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
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                    : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {activeTab === 'register' ? 'Crear mi cuenta' : 'Entrar'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">o continúa con</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Button */}
            <GoogleButton />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
