import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ─── FIREBASE CONFIG ────────────────────────────────────────────
// Replace these values with your Firebase project credentials
// Get them from: Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'TU_API_KEY_AQUI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tu-proyecto.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tu-proyecto',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tu-proyecto.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:xxxxxxxxxxxxxxxxxx'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
