import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllUsers, giftProduct, removeProduct } from '../services/firestoreService'
import { Users, Package, Download, ChevronDown, ChevronUp, Mail, Search, Gift, Trash2, Plus, AlertTriangle, CheckCircle, FileText, BarChart3 } from 'lucide-react'

const PRODUCT_OPTIONS = [
  { value: 'radiografia-pareja', label: 'Radiografía de Pareja' },
]
const PACKAGE_OPTIONS = [
  { value: 'descubre', label: 'Descubre (Individual)' },
  { value: 'solo', label: 'Solo (Pareja — tú)' },
  { value: 'losdos', label: 'Los Dos (Pareja — ambos)' },
]

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('clients') // 'clients' | 'gift'

  // Gift form state
  const [giftEmail, setGiftEmail] = useState('')
  const [giftProduct, setGiftProductState] = useState('radiografia-pareja')
  const [giftPackage, setGiftPackage] = useState('descubre')
  const [giftLoading, setGiftLoading] = useState(false)
  const [giftMessage, setGiftMessage] = useState(null) // { type: 'success' | 'error', text }

  // Remove product state
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPurchases = users.reduce((sum, u) => sum + (u.purchases?.length || 0), 0)
  const completedPurchases = users.reduce((sum, u) => sum + (u.purchases?.filter(p => p.status === 'completed').length || 0), 0)

  const downloadPurchaseData = (user, purchase) => {
    const data = JSON.stringify({
      user: { id: user.id, displayName: user.displayName, email: user.email },
      purchase: {
        id: purchase.id,
        product: purchase.product,
        packageType: purchase.packageType,
        status: purchase.status,
        currentQuestion: purchase.currentQuestion,
        responses: purchase.responses,
        analysis: purchase.analysis,
        crossAnalysis: purchase.crossAnalysis,
        profileData: purchase.profileData,
        partnerEmail: purchase.partnerEmail,
        createdAt: purchase.createdAt,
        completedAt: purchase.completedAt,
      }
    }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${user.displayName || user.email}-${purchase.product}-${purchase.id.slice(0, 6)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllUserData = (user) => {
    const data = JSON.stringify(user, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-${user.displayName || user.email || user.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGiftProduct = async () => {
    if (!giftEmail.includes('@')) {
      setGiftMessage({ type: 'error', text: 'Ingresa un email válido' })
      return
    }
    setGiftLoading(true)
    setGiftMessage(null)
    try {
      await giftProduct(giftEmail, giftProduct, giftPackage)
      setGiftMessage({ type: 'success', text: `Producto asignado a ${giftEmail}` })
      setGiftEmail('')
      await loadUsers() // Refresh
    } catch (err) {
      setGiftMessage({ type: 'error', text: err.message || 'Error al asignar producto' })
    } finally {
      setGiftLoading(false)
    }
  }

  const handleRemoveProduct = async (uid, purchaseId) => {
    if (!confirm('¿Seguro que quieres eliminar este producto del usuario?')) return
    setRemovingId(purchaseId)
    try {
      await removeProduct(uid, purchaseId)
      await loadUsers()
    } catch (err) {
      console.error('Error removing product:', err)
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-amber-300/60 text-xs mt-3">Cargando datos de admin...</p>
      </div>
    )
  }

  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
      <h3 className="text-amber-300 text-sm font-medium mb-4 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Panel de Administrador
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <p className="text-2xl text-white font-light">{users.length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Usuarios</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <p className="text-2xl text-white font-light">{totalPurchases}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Compras</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <p className="text-2xl text-white font-light">{completedPurchases}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Completados</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            activeTab === 'clients' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/20 text-gray-500 border border-white/5 hover:text-gray-300'
          }`}>
          <Users className="w-3 h-3" /> Clientes
        </button>
        <button onClick={() => setActiveTab('gift')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            activeTab === 'gift' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/20 text-gray-500 border border-white/5 hover:text-gray-300'
          }`}>
          <Gift className="w-3 h-3" /> Regalar producto
        </button>
      </div>

      {/* ─── TAB: CLIENTS ─── */}
      {activeTab === 'clients' && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Buscar por nombre o email..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredUsers.map(u => {
              const isExpanded = expandedUser === u.id
              return (
                <div key={u.id} className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-purple-300">{(u.displayName || u.email || '?').charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{u.displayName || 'Sin nombre'}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">{u.purchases?.length || 0} compras</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/5 overflow-hidden">
                        <div className="px-4 pb-4">
                          <div className="flex items-center gap-2 mt-3 mb-3">
                            <p className="text-[10px] text-gray-600 font-mono">UID: {u.id}</p>
                            <button onClick={() => downloadAllUserData(u)}
                              className="ml-auto flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                              <Download className="w-3 h-3" /> Todo
                            </button>
                          </div>

                          {u.purchases?.length > 0 ? (
                            <div className="space-y-3">
                              {u.purchases.map(p => (
                                <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                                  {/* Header */}
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <span className="text-xs text-white font-medium">{p.product}</span>
                                      <span className="text-xs text-gray-500 ml-2">— {p.packageType}</span>
                                      {p.source === 'gift' && (
                                        <span className="text-[10px] px-1.5 py-0.5 ml-2 rounded bg-amber-500/15 text-amber-300">regalo</span>
                                      )}
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                      p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                      p.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                                      p.status === 'paid' ? 'bg-violet-500/10 text-violet-400' :
                                      'bg-gray-500/10 text-gray-400'
                                    }`}>{p.status}</span>
                                  </div>

                                  {/* Progress */}
                                  {p.currentQuestion > 0 && (
                                    <div className="mb-2">
                                      <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                                        <span>Pregunta {p.currentQuestion}/40</span>
                                        <span>{Math.round((p.currentQuestion / 40) * 100)}%</span>
                                      </div>
                                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full"
                                          style={{ width: `${(p.currentQuestion / 40) * 100}%` }} />
                                      </div>
                                    </div>
                                  )}

                                  {/* Partner info */}
                                  {p.partnerEmail && (
                                    <p className="text-[10px] text-pink-400/60 mb-1 flex items-center gap-1">
                                      <Mail className="w-3 h-3" /> Pareja: {p.partnerEmail}
                                    </p>
                                  )}

                                  {/* Responses */}
                                  {p.responses && Object.keys(p.responses).length > 0 && (
                                    <details className="mt-2">
                                      <summary className="text-[10px] text-amber-400 cursor-pointer hover:text-amber-300 flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> Ver respuestas ({Object.keys(p.responses).length})
                                      </summary>
                                      <div className="mt-1 space-y-1 max-h-48 overflow-auto bg-black/30 rounded p-2">
                                        {Object.entries(p.responses).map(([q, r]) => (
                                          <div key={q} className="text-[9px]">
                                            <span className="text-violet-300/60 font-medium">{q}:</span>
                                            <span className="text-gray-400 ml-1">{typeof r === 'string' ? r.slice(0, 200) : JSON.stringify(r).slice(0, 200)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  )}

                                  {/* Analysis */}
                                  {p.analysis && (
                                    <details className="mt-2">
                                      <summary className="text-[10px] text-emerald-400 cursor-pointer hover:text-emerald-300 flex items-center gap-1">
                                        <BarChart3 className="w-3 h-3" /> Ver análisis
                                      </summary>
                                      <pre className="mt-1 text-[9px] text-gray-500 max-h-48 overflow-auto bg-black/30 rounded p-2">
                                        {JSON.stringify(p.analysis, null, 2).slice(0, 5000)}
                                      </pre>
                                    </details>
                                  )}

                                  {p.crossAnalysis && (
                                    <p className="text-[10px] text-pink-400 mt-1">✓ Análisis cruzado</p>
                                  )}

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                    <button onClick={() => downloadPurchaseData(u, p)}
                                      className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors">
                                      <Download className="w-3 h-3" /> Descargar
                                    </button>
                                    {p.source === 'gift' && (
                                      <button onClick={() => handleRemoveProduct(u.id, p.id)}
                                        disabled={removingId === p.id}
                                        className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 transition-colors ml-auto disabled:opacity-40">
                                        <Trash2 className="w-3 h-3" /> {removingId === p.id ? 'Eliminando...' : 'Quitar'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 py-2">Sin compras</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
            {filteredUsers.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">No se encontraron usuarios</p>
            )}
          </div>
        </>
      )}

      {/* ─── TAB: GIFT PRODUCTS ─── */}
      {activeTab === 'gift' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed">
            Asigna un producto a un usuario por su email. Si el usuario ya tiene cuenta, se le añadirá al dashboard. Si no, se creará una entrada pendiente que aparecerá cuando se registre con ese email.
          </p>

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
            <div>
              <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Email del usuario</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={giftEmail} onChange={e => setGiftEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Producto</label>
                <select value={giftProduct} onChange={e => setGiftProductState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/30 focus:outline-none">
                  {PRODUCT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Paquete</label>
                <select value={giftPackage} onChange={e => setGiftPackage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/30 focus:outline-none">
                  {PACKAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleGiftProduct} disabled={giftLoading || !giftEmail.includes('@')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 text-sm font-medium hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40">
              {giftLoading ? <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" /> :
                <><Gift className="w-4 h-4" /> Asignar producto</>}
            </button>

            {giftMessage && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                giftMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' :
                'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}>
                {giftMessage.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {giftMessage.text}
              </div>
            )}
          </div>

          {/* Quick list of gifted products across all users */}
          <div>
            <p className="text-amber-300/60 text-xs uppercase tracking-wider mb-2">Productos regalados</p>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {users.flatMap(u => (u.purchases || []).filter(p => p.source === 'gift').map(p => ({ ...p, userName: u.displayName || u.email, uid: u.id }))).length === 0 ? (
                <p className="text-xs text-gray-600 py-2">Ningún producto regalado aún</p>
              ) : (
                users.flatMap(u => (u.purchases || []).filter(p => p.source === 'gift').map(p => ({ ...p, userName: u.displayName || u.email, uid: u.id }))).map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-black/20 border border-white/5 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-xs text-white">{p.userName}</span>
                      <span className="text-[10px] text-gray-500 ml-2">{p.product} — {p.packageType}</span>
                    </div>
                    <button onClick={() => handleRemoveProduct(p.uid, p.id)}
                      disabled={removingId === p.id}
                      className="text-[10px] text-red-400 hover:text-red-300 transition-colors disabled:opacity-40">
                      {removingId === p.id ? '...' : <Trash2 className="w-3 h-3" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
