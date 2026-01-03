import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        // Verificar que no haya expirado (24 horas)
        if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
          setIsAdmin(true)
        } else {
          localStorage.removeItem('admin_session')
        }
      } catch (error) {
        localStorage.removeItem('admin_session')
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    // Credenciales hardcodeadas por seguridad (solo para admin)
    // En producción, esto estaría en variables de entorno
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Zuzana2026!'

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      // Guardar sesión
      localStorage.setItem('admin_session', JSON.stringify({
        timestamp: Date.now(),
        username
      }))
      return { success: true }
    }
    
    return { success: false, error: 'Credenciales incorrectas' }
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem('admin_session')
  }

  const value = {
    isAdmin,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
