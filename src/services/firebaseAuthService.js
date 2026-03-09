import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'

// ─── MAGIC LINK AUTH ────────────────────────────────────────────

const ACTION_CODE_SETTINGS = {
  url: `${window.location.origin}/tienda/diagnostico-relacional?email_verified=true`,
  handleCodeInApp: true
}

export async function sendMagicLink(email) {
  await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS)
  window.localStorage.setItem('emailForSignIn', email)
}

export async function completeMagicLinkSignIn() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null
  let email = window.localStorage.getItem('emailForSignIn')
  if (!email) {
    email = window.prompt('Confirma tu email para completar el inicio de sesión:')
  }
  if (!email) return null
  const result = await signInWithEmailLink(auth, email, window.location.href)
  window.localStorage.removeItem('emailForSignIn')
  return result.user
}

// ─── EMAIL/PASSWORD AUTH (fallback) ─────────────────────────────

export async function signUpWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function logOut() {
  await signOut(auth)
}

// ─── AUTH STATE LISTENER ────────────────────────────────────────

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

// ─── FIRESTORE: PURCHASE RECORDS ────────────────────────────────

export async function savePurchase(userId, { type, email, stripeSessionId }) {
  await setDoc(doc(db, 'purchases', userId), {
    type,
    email,
    stripeSessionId: stripeSessionId || null,
    purchasedAt: serverTimestamp(),
    completedAt: null
  }, { merge: true })
}

export async function getPurchase(userId) {
  const snap = await getDoc(doc(db, 'purchases', userId))
  return snap.exists() ? snap.data() : null
}

// ─── FIRESTORE: PROGRESS / DRAFT ────────────────────────────────

export async function saveProgress(userId, { currentQuestion, responses, email }) {
  await setDoc(doc(db, 'progress', userId), {
    currentQuestion,
    responses,
    email,
    updatedAt: serverTimestamp()
  }, { merge: true })
}

export async function getProgress(userId) {
  const snap = await getDoc(doc(db, 'progress', userId))
  return snap.exists() ? snap.data() : null
}

export async function clearProgress(userId) {
  await updateDoc(doc(db, 'progress', userId), {
    currentQuestion: 0,
    responses: {},
    updatedAt: serverTimestamp()
  })
}

// ─── FIRESTORE: SAVE RESULTS ────────────────────────────────────

export async function saveResults(userId, analysisData) {
  await setDoc(doc(db, 'results', userId), {
    analysis: analysisData,
    completedAt: serverTimestamp()
  }, { merge: true })
}

export async function getResults(userId) {
  const snap = await getDoc(doc(db, 'results', userId))
  return snap.exists() ? snap.data() : null
}
