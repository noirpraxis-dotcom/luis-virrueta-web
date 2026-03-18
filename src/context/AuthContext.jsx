import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext()

const ADMIN_EMAIL = 'luis.virrueta.contacto@gmail.com'
const googleProvider = new GoogleAuthProvider()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Handle Google redirect result on page load
  useEffect(() => {
    getRedirectResult(auth).catch(() => {})
  }, [])

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        setIsAdmin(firebaseUser.email === ADMIN_EMAIL)
        // Upsert user doc in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(userRef).catch(() => null)
        if (!snap?.exists()) {
          await setDoc(userRef, {
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email,
            role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
            createdAt: serverTimestamp()
          }).catch(() => {})
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Google Sign-In (redirect flow — avoids COOP popup issues)
  const loginWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider)
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.message || 'Error al iniciar sesión con Google' }
    }
  }

  // Email/Password Sign-Up
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      return { success: true, user: result.user }
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Este correo ya está registrado'
        : err.code === 'auth/weak-password' ? 'La contraseña debe tener al menos 6 caracteres'
        : err?.message || 'Error al crear cuenta'
      return { success: false, error: msg }
    }
  }

  // Email/Password Sign-In
  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' ? 'No existe una cuenta con ese correo'
        : err.code === 'auth/wrong-password' ? 'Contraseña incorrecta'
        : err.code === 'auth/invalid-credential' ? 'Credenciales inválidas'
        : err?.message || 'Error al iniciar sesión'
      return { success: false, error: msg }
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
    } finally {
      setUser(null)
      setIsAdmin(false)
    }
  }

  // Delete account + all Firestore data
  const deleteAccount = async (password) => {
    const currentUser = auth.currentUser
    if (!currentUser) return { success: false, error: 'No hay sesión activa' }
    try {
      // Re-authenticate before deletion
      const providerData = currentUser.providerData[0]
      if (providerData?.providerId === 'google.com') {
        await reauthenticateWithPopup(currentUser, googleProvider)
      } else if (password) {
        const credential = EmailAuthProvider.credential(currentUser.email, password)
        await reauthenticateWithCredential(currentUser, credential)
      }
      // Delete Firestore sub-collections (purchases)
      const purchasesSnap = await getDocs(collection(db, 'users', currentUser.uid, 'purchases'))
      for (const d of purchasesSnap.docs) {
        await deleteDoc(d.ref)
      }
      // Delete user doc
      await deleteDoc(doc(db, 'users', currentUser.uid)).catch(() => {})
      // Delete Firebase Auth user
      await deleteUser(currentUser)
      setUser(null)
      setIsAdmin(false)
      return { success: true }
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' ? 'Contraseña incorrecta'
        : err.code === 'auth/requires-recent-login' ? 'Necesitas volver a iniciar sesión para eliminar tu cuenta'
        : err?.message || 'Error al eliminar cuenta'
      return { success: false, error: msg }
    }
  }

  const value = {
    user,
    isAdmin,
    loading,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    logout,
    deleteAccount
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
