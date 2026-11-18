import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { ShareSnapshot } from '../data/schema';
import { ShareSnapshotSchema } from '../data/schema';
import { requireFirebaseDb } from './firebase';

export interface ShareRecord {
  id: string;
  snapshot: ShareSnapshot;
  ownerUid: string;
}

function parseShareDocument(id: string, raw: Record<string, unknown>): ShareRecord {
  const snapshot = ShareSnapshotSchema.parse({
    schemaVersion: raw.schemaVersion ?? 1,
    contentVersion: raw.contentVersion,
    displayName:
      typeof raw.displayName === 'string' && raw.displayName.trim()
        ? raw.displayName
        : undefined,
    levels: raw.levels,
    updatedAt:
      typeof raw.clientUpdatedAt === 'string' ? raw.clientUpdatedAt : new Date(0).toISOString(),
  });

  return {
    id,
    snapshot,
    ownerUid: typeof raw.ownerUid === 'string' ? raw.ownerUid : '',
  };
}

export async function createShare(uid: string, snapshot: ShareSnapshot): Promise<string> {
  const db = requireFirebaseDb();
  const ref = await addDoc(collection(db, 'shares'), {
    ownerUid: uid,
    schemaVersion: snapshot.schemaVersion,
    contentVersion: snapshot.contentVersion,
    displayName: snapshot.displayName ?? null,
    levels: snapshot.levels,
    clientUpdatedAt: snapshot.updatedAt,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateShare(shareId: string, snapshot: ShareSnapshot): Promise<void> {
  const db = requireFirebaseDb();
  await updateDoc(doc(db, 'shares', shareId), {
    schemaVersion: snapshot.schemaVersion,
    contentVersion: snapshot.contentVersion,
    displayName: snapshot.displayName ?? null,
    levels: snapshot.levels,
    clientUpdatedAt: snapshot.updatedAt,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteShare(shareId: string): Promise<void> {
  const db = requireFirebaseDb();
  await deleteDoc(doc(db, 'shares', shareId));
}

export async function getShare(shareId: string): Promise<ShareRecord | null> {
  const db = requireFirebaseDb();
  const snapshot = await getDoc(doc(db, 'shares', shareId));
  if (!snapshot.exists()) return null;
  return parseShareDocument(snapshot.id, snapshot.data());
}

export async function listShares(uid: string): Promise<ShareRecord[]> {
  const db = requireFirebaseDb();
  const result = await getDocs(query(collection(db, 'shares'), where('ownerUid', '==', uid)));
  return result.docs
    .map((item) => parseShareDocument(item.id, item.data()))
    .sort((a, b) => b.snapshot.updatedAt.localeCompare(a.snapshot.updatedAt));
}
