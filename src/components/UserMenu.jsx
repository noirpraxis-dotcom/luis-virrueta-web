import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { User, LogOut, LayoutDashboard, Shield, MessageSquare, BarChart3, Globe } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const UserMenu = () => {
  const { user, isAdmin, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
    navigate('/')
  }

  // Not logged in — navigate to registro page
  if (!user) {
    return (
      <motion.button
        onClick={() => navigate('/registro')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:border-purple-400/40 hover:bg-white/10 transition-all duration-300"
        aria-label="Iniciar sesión"
        title="Iniciar sesión"
      >
        <User className="w-4 h-4 text-white/70" strokeWidth={1.5} />
      </motion.button>
    )
  }

  // Logged in — show avatar dropdown
  const initials = (user.displayName || user.email || '?').charAt(0).toUpperCase()
  const photoURL = user.photoURL

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm hover:border-purple-400/50 hover:bg-purple-500/20 transition-all duration-300 overflow-hidden"
        aria-label="Tu perfil"
      >
        {photoURL ? (
          <img src={photoURL} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-sm font-medium text-purple-300">{initials}</span>
        )}
        {isAdmin && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-black flex items-center justify-center">
            <Shield className="w-2 h-2 text-black" strokeWidth={3} />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm text-white font-medium truncate">{user.displayName || 'Usuario'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Shield className="w-2.5 h-2.5" /> Admin
                </span>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                to={isAdmin ? "/perfil" : "/perfil"}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                  isAdmin
                    ? 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {isAdmin ? (
                  <Shield className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
                )}
                <span className="text-sm font-light">{isAdmin ? 'Panel Admin' : 'Mi perfil'}</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/seo"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/5"
                >
                  <Globe className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm font-light">SEO</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/comentarios"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-purple-400/80 hover:text-purple-300 hover:bg-purple-500/5"
                >
                  <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm font-light">Comentarios Blog</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/analytics"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-500/5"
                >
                  <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm font-light">Analytics</span>
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-white/5 py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/70 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-light">Cerrar sesión</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserMenu
