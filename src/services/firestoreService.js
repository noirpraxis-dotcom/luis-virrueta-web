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

export async function createPurchase(uid, { product, packageType, stripeSessionId, partnerEmail, partnerName, kvToken, partnerRef }) {
  // Dedup: if a purchase with same stripeSessionId already exists, return it
  if (stripeSessionId) {
    const existing = await getDocs(
      query(collection(db, 'users', uid, 'purchases'), where('stripeSessionId', '==', stripeSessionId), limit(1))
    )
    if (!existing.empty) return existing.docs[0].id
  }
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
    kvToken: kvToken || null,
    partnerRef: partnerRef || null,
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

// ─── PARTNER CROSS-ANALYSIS (Firestore-based) ───────────────────

// Get the partner's purchase using partnerRef stored on this purchase
export async function getPartnerPurchase(myUid, myPurchaseId) {
  const myPurchase = await getPurchase(myUid, myPurchaseId)
  if (!myPurchase?.partnerRef) return null
  const { uid: partnerUid, purchaseId: partnerPurchaseId } = myPurchase.partnerRef
  if (!partnerUid || !partnerPurchaseId) return null
  const partnerPurchase = await getPurchase(partnerUid, partnerPurchaseId)
  return partnerPurchase ? { ...partnerPurchase, uid: partnerUid } : null
}

// Check if cross-analysis is ready (partner also completed their analysis)
export async function checkCrossAnalysisReady(myUid, myPurchaseId) {
  const myPurchase = await getPurchase(myUid, myPurchaseId)
  if (!myPurchase?.partnerRef) return { ready: false, reason: 'no-partner-linked' }
  const { uid: partnerUid, purchaseId: partnerPurchaseId } = myPurchase.partnerRef
  if (!partnerUid || !partnerPurchaseId) return { ready: false, reason: 'no-partner-linked' }
  const partnerPurchase = await getPurchase(partnerUid, partnerPurchaseId)
  if (!partnerPurchase) return { ready: false, reason: 'partner-purchase-not-found' }
  if (!partnerPurchase.analysis) return { ready: false, reason: 'partner-not-done' }
  // Try to get partner's email — may fail due to cross-user permission rules
  let partnerEmail = ''
  try {
    const partnerProfile = await getUserProfile(partnerUid)
    partnerEmail = partnerProfile?.email || ''
  } catch {}
  // Fall back to email stored in purchase data
  if (!partnerEmail) partnerEmail = partnerPurchase.partnerEmail || myPurchase.partnerEmail || ''
  return {
    ready: true,
    partnerAnalysis: partnerPurchase.analysis,
    partnerProfileData: partnerPurchase.profileData,
    partnerUid,
    partnerPurchaseId: partnerPurchase.id,
    partnerEmail,
  }
}

// Save cross-analysis to BOTH purchases (buyer + partner)
export async function saveCrossAnalysisToBoth(uid1, purchaseId1, uid2, purchaseId2, crossAnalysis) {
  const crossData = { crossAnalysis, crossAnalysisAddedAt: serverTimestamp() }
  await Promise.all([
    updateDoc(doc(db, 'users', uid1, 'purchases', purchaseId1), crossData),
    updateDoc(doc(db, 'users', uid2, 'purchases', purchaseId2), crossData),
  ])
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
    partnerRef: { uid: buyerUid, purchaseId: buyerPurchaseId },
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

export async function deletePurchaseCascade(uid, purchaseId) {
  const purchase = await getPurchase(uid, purchaseId)
  if (!purchase) { await deleteDoc(doc(db, 'users', uid, 'purchases', purchaseId)); return }

  // Clean up partner linkage
  if (purchase.partnerRef?.uid && purchase.partnerRef?.purchaseId) {
    try {
      await updateDoc(doc(db, 'users', purchase.partnerRef.uid, 'purchases', purchase.partnerRef.purchaseId), {
        partnerRef: null, linkedBuyerUid: null, linkedBuyerPurchaseId: null, crossAnalysis: null, crossAnalysisAddedAt: null
      })
    } catch (e) { /* partner purchase may not exist */ }
  }
  // Clean up if this is a partner's mirrored purchase (clean buyer side)
  if (purchase.linkedBuyerUid && purchase.linkedBuyerPurchaseId) {
    try {
      await updateDoc(doc(db, 'users', purchase.linkedBuyerUid, 'purchases', purchase.linkedBuyerPurchaseId), {
        partnerRef: null, partnerUid: null, crossAnalysis: null, crossAnalysisAddedAt: null
      })
    } catch (e) { /* buyer purchase may not exist */ }
  }
  // Clean up partner_invites if this purchase has a partnerEmail
  if (purchase.partnerEmail) {
    try { await deleteDoc(doc(db, 'partner_invites', purchase.partnerEmail.toLowerCase())) } catch (e) { /* ok */ }
  }
  await deleteDoc(doc(db, 'users', uid, 'purchases', purchaseId))
}

export async function deleteUserAdmin(uid) {
  // Get user doc for email (to clean partner_invites by buyer email)
  const userDoc = await getDoc(doc(db, 'users', uid))
  const userEmail = userDoc.exists() ? userDoc.data().email : null

  // Delete all purchases with cascade cleanup
  const purchasesSnap = await getDocs(collection(db, 'users', uid, 'purchases'))
  for (const purchaseDoc of purchasesSnap.docs) {
    await deletePurchaseCascade(uid, purchaseDoc.id)
  }

  // Clean up any partner_invites where this user was the buyer
  if (userEmail) {
    const invitesSnap = await getDocs(query(collection(db, 'partner_invites'), where('buyerUid', '==', uid)))
    for (const inviteDoc of invitesSnap.docs) {
      await deleteDoc(doc(db, 'partner_invites', inviteDoc.id))
    }
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

// ─── SUBSCRIBE TO PURCHASE (onSnapshot) ─────────────────

export function subscribeToPurchase(uid, purchaseId, callback) {
  return onSnapshot(doc(db, 'users', uid, 'purchases', purchaseId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  })
}
