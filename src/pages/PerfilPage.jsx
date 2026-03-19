import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPurchases, createPurchase, updatePurchase, removeProduct } from '../services/firestoreService'
import { LogOut, Package, ArrowRight, Clock, CheckCircle, Play, Eye, Shield, ChevronDown, Download, Users, Loader2, Trash2, AlertTriangle, Lock } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdminDashboard from '../components/AdminDashboard'

const STATUS_MAP = {
  pending: { label: 'Pendiente de pago', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock },
  paid: { label: 'Listo para comenzar', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Play },
  'in-progress': { label: 'En progreso', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Loader2 },
  analyzing: { label: 'Generando análisis...', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Loader2 },
  completed: { label: 'Completado', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
}

const PRODUCT_NAMES = {
  'radiografia-pareja': 'Radiografía de Pareja'
}

const PACKAGE_NAMES = {
  descubre: 'Descubre ($499)',
  solo: 'Solo ($499)',
  losdos: 'Los Dos ($999)'
}

export default function PerfilPage() {
  const { user, isAdmin, logout, deleteAccount, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [purchases, setPurchases] = useState([])
  const [loadingPurchases, setLoadingPurchases] = useState(true)
  const [showAdmin, setShowAdmin] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/registro')
    }
  }, [user, authLoading])

  // Load purchases
  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        // Recover any pending purchase that was never saved to Firestore (race condition fallback)
        const pendingStr = sessionStorage.getItem('pending_firestore_purchase')
        if (pendingStr) {
          try {
            const pendingData = JSON.parse(pendingStr)
            const docId = await createPurchase(user.uid, pendingData)
            sessionStorage.removeItem('pending_firestore_purchase')
            sessionStorage.setItem('firestore_purchase_id', docId)
          } catch (e) { console.error('Pending purchase recovery error:', e) }
        }
        const data = await getPurchases(user.uid)
        setPurchases(data)
      } catch (err) {
        console.error('Error loading purchases:', err)
      } finally {
        setLoadingPurchases(false)
      }
    }
    load()
  }, [user])

  // Handle redirect from Stripe with purchase params
  useEffect(() => {
    const startPurchase = searchParams.get('startPurchase')
    const pkg = searchParams.get('package')
    if (startPurchase && pkg && user) {
      // Check if we already have this purchase to avoid duplicates
      const existing = purchases.find(p => p.product === startPurchase && p.packageType === pkg && p.status !== 'completed')
      if (!existing && !loadingPurchases) {
        // This is handled by the Stripe success flow
      }
    }
  }, [searchParams, user, purchases, loadingPurchases])

  const handleStartTest = (purchase) => {
    // Navigate to radiografia with purchase context
    const params = new URLSearchParams({
      purchaseId: purchase.id,
      type: purchase.packageType,
      fromProfile: 'true'
    })
    navigate(`/tienda/radiografia-premium?${params.toString()}`)
  }

  const handleViewResults = (purchase) => {
    const params = new URLSearchParams({
      purchaseId: purchase.id,
      type: purchase.packageType,
      viewResults: 'true',
      fromProfile: 'true'
    })
    navigate(`/tienda/radiografia-premium?${params.toString()}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    setDeleting(true)
    const isGoogle = user.providerData?.[0]?.providerId === 'google.com'
    const result = await deleteAccount(isGoogle ? null : deletePassword)
    if (result.success) {
      navigate('/')
    } else {
      setDeleteError(result.error)
      setDeleting(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-20 px-4">
      <SEOHead title="Mi perfil — Luis Virrueta" description="Tu dashboard personal" />

      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-14 h-14 rounded-full border-2 border-purple-500/30" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center">
                <span className="text-xl text-purple-300 font-medium">
                  {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl text-white font-light flex items-center gap-2">
                {user.displayName || 'Mi perfil'}
                {isAdmin && <span title="Administrador" className="text-lg">👑</span>}
              </h1>
              <p className="text-sm text-gray-400">{user.email}</p>
              {isAdmin && <p className="text-xs text-amber-400/70 font-medium mt-0.5">Administrador</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-300 hover:border-red-500/20 text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </motion.div>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="mb-8">
            <AdminDashboard />
          </div>
        )}

        {/* Admin Quick Test Section */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-violet-500/[0.06] to-fuchsia-500/[0.04] border border-violet-500/15 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm text-violet-300 font-medium uppercase tracking-wider">Test — Accesos r&aacute;pidos</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Radiograf&iacute;a de Pareja</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: 'Landing', href: '/tienda/radiografia-pareja', icon: '🏠' },
                      { label: 'Demo resultados', href: '/tienda/radiografia-premium?demo=ventas', icon: '📊' },
                      { label: 'Test Descubre', href: '/tienda/radiografia-premium?free=true&type=descubre&fromProfile=true', icon: '🔍' },
                      { label: 'Test Solo', href: '/tienda/radiografia-premium?free=true&type=solo&fromProfile=true', icon: '👤' },
                      { label: 'Test Los Dos', href: '/tienda/radiografia-premium?free=true&type=losdos&fromProfile=true', icon: '👥' },
                      { label: 'Compra test mode', href: '/tienda/radiografia-pareja?test=true', icon: '🧪' },
                    ].map(link => (
                      <a key={link.href} href={link.href}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-black/30 border border-white/8 text-white/70 text-xs hover:text-white hover:border-violet-500/30 hover:bg-violet-500/[0.06] transition-all">
                        <span className="text-sm">{link.icon}</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">C&oacute;digos de prueba</p>
                  <div className="flex flex-wrap gap-3 text-xs text-white/50">
                    <span>🎟️ <span className="font-mono text-amber-300">BETA100</span> — 100% desc.</span>
                    <span>🎟️ <span className="font-mono text-amber-300">LANZAMIENTO50</span> — 50% desc.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Mantenimiento</p>
                  <button
                    onClick={async () => {
                      if (!confirm('¿Eliminar todas tus compras de prueba?')) return
                      try {
                        const myPurchases = await getPurchases(user.uid)
                        for (const p of myPurchases) {
                          await removeProduct(user.uid, p.id)
                        }
                        setPurchases([])
                        alert('Compras eliminadas')
                      } catch (e) { console.error(e); alert('Error: ' + e.message) }
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300/70 text-xs hover:text-red-200 hover:border-red-500/30 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpiar mis compras de prueba
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Purchases — hidden for admin */}
        {!isAdmin && (<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm text-white font-medium uppercase tracking-wider">Mis productos</h2>
          </div>

          {loadingPurchases ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : purchases.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
              <Package className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">Aún no tienes productos</p>
              <Link
                to="/tienda"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all"
              >
                Ir a la tienda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => {
                const status = STATUS_MAP[purchase.status] || STATUS_MAP.pending
                const StatusIcon = status.icon
                const progress = purchase.currentQuestion || 0
                const total = 40
                const hasAnalysis = Boolean(purchase.analysis)
                const hasCross = Boolean(purchase.crossAnalysis)

                return (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white text-sm font-medium">
                          {PRODUCT_NAMES[purchase.product] || purchase.product}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {PACKAGE_NAMES[purchase.packageType] || purchase.packageType}
                          {purchase.partnerEmail && (
                            <span className="ml-2 text-pink-400/60">
                              <Users className="w-3 h-3 inline mr-1" />
                              {purchase.partnerEmail}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${status.bg} ${status.border} border ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {purchase.status === 'in-progress' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Pregunta {progress} de {total}</span>
                          <span>{Math.round((progress / total) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all"
                            style={{ width: `${(progress / total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {purchase.status === 'paid' && (
                        <button
                          onClick={() => handleStartTest(purchase)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Comenzar test
                        </button>
                      )}
                      {purchase.status === 'in-progress' && (
                        <button
                          onClick={() => handleStartTest(purchase)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          Continuar test
                        </button>
                      )}
                      {hasAnalysis && (
                        <button
                          onClick={() => handleViewResults(purchase)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs hover:bg-emerald-500/20 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver resultados
                        </button>
                      )}
                      {hasCross && (
                        <button
                          onClick={() => handleViewResults(purchase)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs hover:bg-pink-500/20 transition-all"
                        >
                          <Users className="w-3.5 h-3.5" />
                          Cruzado
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>)}

        {/* Delete Account — hidden for admin */}
        {!isAdmin && (<motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-8 border-t border-white/5"
        >
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="bg-red-500/[0.04] border border-red-500/15 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-300 text-sm font-medium mb-1">¿Eliminar tu cuenta?</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Se borrarán permanentemente todos tus datos, historial de compras y resultados. Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              {user.providerData?.[0]?.providerId !== 'google.com' && (
                <div className="relative mb-3">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={deletePassword}
                    onChange={e => { setDeletePassword(e.target.value); setDeleteError('') }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-red-500/40 focus:outline-none transition-colors"
                  />
                </div>
              )}

              {deleteError && (
                <p className="text-red-400 text-xs mb-3">{deleteError}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || (user.providerData?.[0]?.providerId !== 'google.com' && !deletePassword)}
                  className="px-4 py-2 rounded-xl bg-red-600/80 text-white text-xs font-medium hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Sí, eliminar mi cuenta'}
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError('') }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs hover:text-white transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </motion.div>)}
      </div>
    </div>
  )
}
