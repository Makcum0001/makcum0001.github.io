import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { GiftItem } from '../types';

export type NewGiftData = {
  name: string;
  description: string;
  category: string;
};

export function subscribeToGifts(onChange: (items: GiftItem[]) => void, onInitialized?: () => void) {
  const q = query(collection(db, 'gifts'), orderBy('createdAt', 'desc'));
  let initialized = false;
  const unsub = onSnapshot(q, async (snapshot) => {
    try {
      console.debug('subscribeToGifts snapshot size:', snapshot.size);
      try {
        const ids = snapshot.docs.map(d => d.id);
        const titles = snapshot.docs.map(d => (d.data() as any).name || '<no-name>');
        console.debug('subscribeToGifts snapshot ids:', ids);
        console.debug('subscribeToGifts snapshot titles:', titles);
      } catch (e) {
        console.debug('subscribeToGifts: failed to enumerate docs', e);
      }
      const arr = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }) as GiftItem);
      onChange(arr);
      if (!initialized) {
        initialized = true;
        try {
          onInitialized?.();
        } catch (e) {
          console.debug('subscribeToGifts onInitialized threw', e);
        }
      }
      // if empty, try fallback without ordering to detect documents without createdAt
      if (snapshot.empty) {
        const raw = await getDocs(collection(db, 'gifts'));
        if (!raw.empty) {
          console.warn('subscribeToGifts: ordered query returned empty, but unordered query returned docs. This may indicate missing createdAt fields.');
          const arr2 = raw.docs.map(d => ({ id: d.id, ...(d.data() as any) }) as GiftItem);
          onChange(arr2);
        }
      }
    } catch (err) {
      console.error('subscribeToGifts processing error', err);
    }
  }, (err) => {
    console.error('subscribeToGifts onSnapshot error', err);
  });
  return unsub;
}

export async function addGift(data: NewGiftData) {
  return addDoc(collection(db, 'gifts'), {
    ...data,
    isBooked: false,
    bookedBy: null,
    createdAt: serverTimestamp(),
  });
}

export async function updateBooking(id: string, bookedBy?: string | null) {
  const ref = doc(db, 'gifts', id);
  return updateDoc(ref, {
    isBooked: bookedBy !== undefined && bookedBy !== null ? true : false,
    bookedBy: bookedBy ?? null,
  });
}

export async function deleteGift(id: string) {
  return deleteDoc(doc(db, 'gifts', id));
}

export async function seedIfEmpty() {
  // No-op in production: removed test/sample data seeding.
  // Keep function exported for compatibility, but do not write sample docs.
  return;
}

export async function migrateMissingCreatedAt() {
  try {
    const snap = await getDocs(collection(db, 'gifts'));
    const missing: { id: string; ref: any }[] = [];
    snap.docs.forEach(d => {
      const data = d.data() as any;
      if (data.createdAt === undefined || data.createdAt === null) {
        missing.push({ id: d.id, ref: doc(db, 'gifts', d.id) });
      }
    });
    if (missing.length === 0) {
      console.info('migrateMissingCreatedAt: no documents missing createdAt');
      return;
    }
    console.info(`migrateMissingCreatedAt: updating ${missing.length} documents`);
    for (const m of missing) {
      // set client timestamp so document becomes visible in ordered queries immediately
      await updateDoc(m.ref, { createdAt: new Date() });
    }
    console.info('migrateMissingCreatedAt: done');
  } catch (err) {
    console.error('migrateMissingCreatedAt error', err);
  }
}
