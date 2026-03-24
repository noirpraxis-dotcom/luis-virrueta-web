import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithRedirect, signInWithPopup, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext()

const ADMIN_EMAIL = 'luis.virrueta.contacto@gmail.com'
const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
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
  const [emailVerified, setEmailVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  // Handle Google redirect result on page load
  useEffect(() => {
    if (auth) getRedirectResult(auth).catch(() => {})
  }, [])

  // Listen to Firebase auth state
  useEffect(() => {
    if (!auth) { setLoading(false); return }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        setIsAdmin(firebaseUser.email === ADMIN_EMAIL)
        // Upsert user doc in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(userRef).catch(() => null)
        const provider = firebaseUser.providerData?.[0]?.providerId || 'unknown'
        const isGoogle = provider === 'google.com'
        if (!snap?.exists()) {
          const verified = isGoogle || firebaseUser.emailVerified
          await setDoc(userRef, {
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email,
            role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
            provider,
            emailVerified: verified,
            createdAt: serverTimestamp()
          }).catch(() => {})
          setEmailVerified(verified)
        } else {
          // Update provider/verified status on every login
          const updates = {}
          if (!snap.data().provider) updates.provider = provider
          if ((isGoogle || firebaseUser.emailVerified) && !snap.data().emailVerified) updates.emailVerified = true
          if (firebaseUser.displayName && !snap.data().displayName) updates.displayName = firebaseUser.displayName
          if (Object.keys(updates).length > 0) {
            await setDoc(userRef, updates, { merge: true }).catch(() => {})
          }
          setEmailVerified(snap.data().emailVerified || isGoogle || firebaseUser.emailVerified)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
        setEmailVerified(false)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Google Sign-In — popup on localhost, redirect on production
  const loginWithGoogle = async () => {
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (isLocalhost) {
        await signInWithPopup(auth, googleProvider)
      } else {
        await signInWithRedirect(auth, googleProvider)
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.message || 'Error al iniciar sesión con Google' }
    }
  }

  // Email/Password Sign-Up (sends verification code via Resend)
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      // Send verification code via Worker/Resend
      try {
        await fetch(`${WORKER_URL}/api/send-verification-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: displayName || '' })
        })
      } catch (verifyErr) {
        console.error('Error sending verification code:', verifyErr)
      }
      return { success: true, user: result.user, needsVerification: true }
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Este correo ya está registrado'
        : err.code === 'auth/weak-password' ? 'La contraseña debe tener al menos 6 caracteres'
        : err?.message || 'Error al crear cuenta'
      return { success: false, error: msg }
    }
  }

  // Resend verification code via Worker/Resend
  const resendVerification = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) return { success: false }
    try {
      const res = await fetch(`${WORKER_URL}/api/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email })
      })
      if (!res.ok) throw new Error('Error sending code')
      return { success: true }
    } catch (err) {
      console.error('Error resending verification code:', err)
      return { success: false, error: err?.message }
    }
  }

  // Verify the 6-digit code via Worker
  const verifyCode = async (code) => {
    const currentUser = auth.currentUser
    if (!currentUser) return { success: false, error: 'No hay sesión activa' }
    try {
      const res = await fetch(`${WORKER_URL}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, code })
      })
      const data = await res.json()
      if (data.valid) {
        // Mark emailVerified in Firestore
        const userRef = doc(db, 'users', currentUser.uid)
        await setDoc(userRef, { emailVerified: true }, { merge: true })
        setEmailVerified(true)
        return { success: true }
      }
      return { success: false, error: data.error || 'Código incorrecto' }
    } catch (err) {
      return { success: false, error: err?.message || 'Error al verificar código' }
    }
  }

  // Email/Password Sign-In
  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential'
        ? 'Correo o contraseña incorrectos'
        : err.code === 'auth/wrong-password' ? 'Contraseña incorrecta'
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
    emailVerified,
    loading,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    resendVerification,
    verifyCode,
    logout,
    deleteAccount
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
