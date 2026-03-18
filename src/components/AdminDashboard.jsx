import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllUsers } from '../services/firestoreService'
import { Users, Package, Download, ChevronDown, ChevronUp, Eye, Mail, Calendar, Search } from 'lucide-react'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data)
      } catch (err) {
        console.error('Error loading admin data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPurchases = users.reduce((sum, u) => sum + (u.purchases?.length || 0), 0)
  const completedPurchases = users.reduce((sum, u) => sum + (u.purchases?.filter(p => p.status === 'completed').length || 0), 0)

  const downloadUserData = (user) => {
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

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar usuario por nombre o email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none"
        />
      </div>

      {/* Users list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredUsers.map(u => {
          const isExpanded = expandedUser === u.id
          return (
            <div key={u.id} className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
              >
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

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 pb-4 border-t border-white/5"
                >
                  <div className="flex items-center gap-2 mt-3 mb-2">
                    <p className="text-xs text-gray-500">UID: {u.id}</p>
                    <button
                      onClick={() => downloadUserData(u)}
                      className="ml-auto flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Descargar datos
                    </button>
                  </div>

                  {u.purchases?.length > 0 ? (
                    <div className="space-y-2">
                      {u.purchases.map(p => (
                        <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-white">{p.product} — {p.packageType}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                              p.status === 'paid' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>{p.status}</span>
                          </div>
                          {p.currentQuestion > 0 && (
                            <p className="text-[10px] text-gray-500">Progreso: {p.currentQuestion}/40</p>
                          )}
                          {p.responses && Object.keys(p.responses).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-[10px] text-amber-400 cursor-pointer hover:text-amber-300">
                                Ver respuestas ({Object.keys(p.responses).length})
                              </summary>
                              <pre className="mt-1 text-[9px] text-gray-500 max-h-40 overflow-auto bg-black/30 rounded p-2">
                                {JSON.stringify(p.responses, null, 2)}
                              </pre>
                            </details>
                          )}
                          {p.analysis && (
                            <p className="text-[10px] text-emerald-400 mt-1">✓ Análisis generado</p>
                          )}
                          {p.crossAnalysis && (
                            <p className="text-[10px] text-pink-400 mt-1">✓ Análisis cruzado generado</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 py-2">Sin compras</p>
                  )}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
