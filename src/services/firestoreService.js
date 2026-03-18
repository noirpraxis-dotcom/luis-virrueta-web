import {
  doc, setDoc, getDoc, getDocs, updateDoc, deleteField,
  collection, query, where, orderBy, serverTimestamp, limit
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
  // Search all users for a purchase that has this email as partnerEmail
  const usersSnap = await getDocs(collection(db, 'users'))
  for (const userDoc of usersSnap.docs) {
    const purchasesSnap = await getDocs(
      query(
        collection(db, 'users', userDoc.id, 'purchases'),
        where('partnerEmail', '==', email),
        limit(1)
      )
    )
    if (!purchasesSnap.empty) {
      const purchase = purchasesSnap.docs[0]
      return {
        buyerUid: userDoc.id,
        buyerName: userDoc.data().displayName || '',
        purchaseId: purchase.id,
        ...purchase.data()
      }
    }
  }
  return null
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
