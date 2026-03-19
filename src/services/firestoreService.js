import {
  doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, deleteField,
  collection, query, where, orderBy, serverTimestamp, limit, onSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'

// ─── USER PROFILE ────────────────────────────────────────────────

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

// ─── PURCHASES ───────────────────────────────────────────────────

export async function createPurchase(uid, { product, packageType, stripeSessionId, partnerEmail, partnerName }) {
  const purchaseRef = doc(collection(db, 'users', uid, 'purchases'))
  const data = {
    product,
    packageType,
    stripeSessionId: stripeSessionId || null,
    status: 'paid',
    partnerEmail: partnerEmail || null,
    partnerName: partnerName || null,
    partnerUid: null,
    pairId: null,
    voiceSelection: null,
    profileData: null,
    currentQuestion: 0,
    responses: {},
    analysis: null,
    crossAnalysis: null,
    createdAt: serverTimestamp(),
    completedAt: null
  }
  await setDoc(purchaseRef, data)
  return purchaseRef.id
}

export async function getPurchases(uid) {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'purchases'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getPurchase(uid, purchaseId) {
  const snap = await getDoc(doc(db, 'users', uid, 'purchases', purchaseId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updatePurchase(uid, purchaseId, data) {
  await updateDoc(doc(db, 'users', uid, 'purchases', purchaseId), data)
}

// ─── PROGRESS (save/load test progress) ──────────────────────────

export async function saveTestProgress(uid, purchaseId, { currentQuestion, responses, profileData, voiceSelection }) {
  const updates = { currentQuestion, responses, updatedAt: serverTimestamp() }
  if (profileData) updates.profileData = profileData
  if (voiceSelection) updates.voiceSelection = voiceSelection
  await updateDoc(doc(db, 'users', uid, 'purchases', purchaseId), updates)
}

export async function saveAnalysisResult(uid, purchaseId, analysis) {
  await updateDoc(doc(db, 'users', uid, 'purchases', purchaseId), {
    analysis,
    status: 'completed',
    completedAt: serverTimestamp()
  })
}

export async function saveCrossAnalysisResult(uid, purchaseId, crossAnalysis) {
  await updateDoc(doc(db, 'users', uid, 'purchases', purchaseId), { crossAnalysis })
}

// ─── PARTNER INVITE LOOKUP ───────────────────────────────────────

export async function findPurchaseByPartnerEmail(email) {
  // Look up the partner_invites collection (top-level, readable by any auth user)
  const snap = await getDoc(doc(db, 'partner_invites', email.toLowerCase()))
  if (snap.exists()) return { id: snap.id, ...snap.data() }
  return null
}

// Save a partner invite when buyer sends invitation (losdos flow)
export async function savePartnerInvite(partnerEmail, { buyerUid, buyerPurchaseId, buyerName, product, packageType, pairId }) {
  await setDoc(doc(db, 'partner_invites', partnerEmail.toLowerCase()), {
    buyerUid,
    buyerPurchaseId,
    buyerName: buyerName || '',
    product: product || 'radiografia-pareja',
    packageType: packageType || 'losdos',
    pairId: pairId || null,
    partnerEmail: partnerEmail.toLowerCase(),
    createdAt: serverTimestamp(),
    claimed: false,
  })
}

// Mark invite as claimed after partner links
export async function claimPartnerInvite(partnerEmail) {
  await updateDoc(doc(db, 'partner_invites', partnerEmail.toLowerCase()), { claimed: true })
}

export async function linkPartnerToPurchase(buyerUid, purchaseId, partnerUid) {
  await updateDoc(doc(db, 'users', buyerUid, 'purchases', purchaseId), {
    partnerUid: partnerUid
  })
}

// Create a mirrored purchase for the partner (no payment needed)
export async function createPartnerPurchase(partnerUid, { product, packageType, buyerUid, buyerPurchaseId, pairId }) {
  const purchaseRef = doc(collection(db, 'users', partnerUid, 'purchases'))
  await setDoc(purchaseRef, {
    product,
    packageType,
    stripeSessionId: null,
    status: 'paid',
    linkedBuyerUid: buyerUid,
    linkedBuyerPurchaseId: buyerPurchaseId,
    pairId: pairId || null,
    voiceSelection: null,
    profileData: null,
    currentQuestion: 0,
    responses: {},
    analysis: null,
    crossAnalysis: null,
    createdAt: serverTimestamp(),
    completedAt: null
  })
  return purchaseRef.id
}

// ─── ADMIN: LIST ALL USERS + PURCHASES ───────────────────────────

export async function getAllUsers() {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
  const users = []
  for (const userDoc of snap.docs) {
    const purchasesSnap = await getDocs(collection(db, 'users', userDoc.id, 'purchases'))
    users.push({
      id: userDoc.id,
      ...userDoc.data(),
      purchases: purchasesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    })
  }
  return users
}

export function subscribeToUsers(callback) {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, async (snap) => {
    const users = []
    for (const userDoc of snap.docs) {
      const purchasesSnap = await getDocs(collection(db, 'users', userDoc.id, 'purchases'))
      users.push({
        id: userDoc.id,
        ...userDoc.data(),
        purchases: purchasesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      })
    }
    callback(users)
  })
}

export async function getAdminUserDetail(uid) {
  const userSnap = await getDoc(doc(db, 'users', uid))
  if (!userSnap.exists()) return null
  const purchasesSnap = await getDocs(collection(db, 'users', uid, 'purchases'))
  return {
    id: userSnap.id,
    ...userSnap.data(),
    purchases: purchasesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  }
}

// ─── ADMIN: GIFT / REMOVE PRODUCTS ──────────────────────────────

export async function giftProduct(email, product, packageType) {
  // Find user by email
  const usersSnap = await getDocs(
    query(collection(db, 'users'), where('email', '==', email), limit(1))
  )
  let uid
  if (!usersSnap.empty) {
    uid = usersSnap.docs[0].id
  } else {
    // Create placeholder user doc keyed by email hash so it merges when they sign up
    // We'll use a deterministic ID based on email
    uid = 'pending_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)
    await setDoc(doc(db, 'users', uid), {
      email,
      displayName: null,
      pendingGift: true,
      createdAt: serverTimestamp()
    })
  }

  const purchaseRef = doc(collection(db, 'users', uid, 'purchases'))
  await setDoc(purchaseRef, {
    product,
    packageType,
    stripeSessionId: null,
    status: 'paid',
    source: 'gift',
    voiceSelection: null,
    profileData: null,
    currentQuestion: 0,
    responses: {},
    analysis: null,
    crossAnalysis: null,
    createdAt: serverTimestamp(),
    completedAt: null
  })
  return purchaseRef.id
}

export async function removeProduct(uid, purchaseId) {
  await deleteDoc(doc(db, 'users', uid, 'purchases', purchaseId))
}

// ─── ADMIN: DELETE USER ─────────────────────────────────

export async function deleteUserAdmin(uid) {
  // Delete all purchases subcollection first
  const purchasesSnap = await getDocs(collection(db, 'users', uid, 'purchases'))
  for (const purchaseDoc of purchasesSnap.docs) {
    await deleteDoc(doc(db, 'users', uid, 'purchases', purchaseDoc.id))
  }
  // Delete user document
  await deleteDoc(doc(db, 'users', uid))
  // Delete from Firebase Auth via Worker
  try {
    await fetch('https://radiografia-worker.noirpraxis.workers.dev/api/delete-auth-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, adminSecret: import.meta.env.VITE_ADMIN_SECRET })
    })
  } catch (e) {
    console.error('Error deleting auth user:', e)
  }
}

// ─── ADMIN: SET TEST MODE ───────────────────────────────

export async function setUserTestMode(uid, enabled) {
  await setDoc(doc(db, 'users', uid), { testMode: enabled }, { merge: true })
}
