import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { applyActionCode } from 'firebase/auth'
import { auth } from '../config/firebase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function FirebaseAuthActionPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // 'processing' | 'success' | 'error'
  const [error, setError] = useState('')

  const mode = searchParams.get('mode')
  const oobCode = searchParams.get('oobCode')

  useEffect(() => {
    if (mode === 'verifyEmail' && oobCode) {
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus('success')
          // Reload the current user to update emailVerified
          auth.currentUser?.reload().catch(() => {})
          // Redirect after a brief delay
          setTimeout(() => navigate('/perfil'), 2500)
        })
        .catch((err) => {
          console.error('Verification error:', err)
          setStatus('error')
          setError(
            err.code === 'auth/invalid-action-code' ? 'El enlace ha expirado o ya fue usado.'
            : err.code === 'auth/expired-action-code' ? 'El enlace ha expirado. Solicita uno nuevo.'
            : 'Error al verificar tu correo.'
          )
        })
    } else {
      // Unknown action or missing code
      navigate('/')
    }
  }, [mode, oobCode, navigate])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {status === 'processing' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
            <p className="text-white text-lg font-light">Verificando tu correo...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl text-white font-light">¡Correo verificado!</h2>
            <p className="text-gray-400 text-sm">Tu cuenta ha sido verificada exitosamente. Redirigiendo...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl text-white font-light">Error de verificación</h2>
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => navigate('/registro')}
              className="mt-4 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm transition-colors"
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
