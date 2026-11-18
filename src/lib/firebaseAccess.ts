import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { firebaseAuth } from './firebase';
import { requireFirebaseDb } from './firebase';

export type AccessRole = 'admin' | 'member';

export interface AccessResult {
  allowed: boolean;
  role: AccessRole | null;
}

export interface AllowlistEntry {
  email: string;
  role: AccessRole;
  createdAt?: string;
  createdBy?: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function parseRole(value: unknown): AccessRole {
  return value === 'admin' ? 'admin' : 'member';
}

function timestampToIso(value: unknown): string | undefined {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: unknown }).toDate === 'function'
  ) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export async function checkAccess(email: string): Promise<AccessResult> {
  const db = requireFirebaseDb();
  const normalized = normalizeEmail(email);
  if (!normalized) return { allowed: false, role: null };

  const snapshot = await getDoc(doc(db, 'allowlist', normalized));
  if (!snapshot.exists()) return { allowed: false, role: null };

  return {
    allowed: true,
    role: parseRole(snapshot.data().role),
  };
}

export async function listAllowlist(): Promise<AllowlistEntry[]> {
  const db = requireFirebaseDb();
  const snapshot = await getDocs(collection(db, 'allowlist'));
  return snapshot.docs
    .map((item) => {
      const raw = item.data();
      return {
        email: typeof raw.email === 'string' ? normalizeEmail(raw.email) : item.id,
        role: parseRole(raw.role),
        createdAt: timestampToIso(raw.createdAt),
        createdBy: typeof raw.createdBy === 'string' ? raw.createdBy : undefined,
      };
    })
    .sort((a, b) => a.email.localeCompare(b.email));
}

export async function addAllowlistEmail(email: string, role: AccessRole): Promise<void> {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    throw new Error('请输入有效的邮箱地址。');
  }

  const db = requireFirebaseDb();
  await setDoc(doc(db, 'allowlist', normalized), {
    email: normalized,
    role,
    createdAt: serverTimestamp(),
    createdBy: firebaseAuth?.currentUser?.uid ?? null,
  });
}

export async function removeAllowlistEmail(email: string): Promise<void> {
  const db = requireFirebaseDb();
  await deleteDoc(doc(db, 'allowlist', normalizeEmail(email)));
}
