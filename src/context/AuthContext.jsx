import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

  // Verificar sesión de Supabase y escuchar cambios
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setIsAdmin(Boolean(data.session))
      setLoading(false)
    }

    init()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(Boolean(session))
    })

    return () => {
      isMounted = false
      subscription?.subscription?.unsubscribe?.()
    }
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) return { success: false, error: error.message }
      if (!data?.session) return { success: false, error: 'No se pudo iniciar sesión' }

      setIsAdmin(true)
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.message || 'Error al iniciar sesión' }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      setIsAdmin(false)
    }
  }

  const value = {
    isAdmin,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
