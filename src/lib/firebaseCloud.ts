import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  type DocumentSnapshot,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';
import { AppDataSchema, type AppData } from '../data/schema';
import {
  appDataByteSize,
  CloudConflictError,
  MAX_CLOUD_DATA_BYTES,
  type CloudState,
} from './cloudData';
import { requireFirebaseDb } from './firebase';

function stateRef(db: Firestore, uid: string) {
  return doc(db, 'users', uid, 'state', 'current');
}

function firestoreSafeData(data: AppData): AppData {
  return JSON.parse(JSON.stringify(data)) as AppData;
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

function parseCloudState(snapshot: DocumentSnapshot): CloudState | null {
  if (!snapshot.exists()) return null;
  const raw = snapshot.data();
  const parsed = AppDataSchema.safeParse(raw.data);
  if (!parsed.success) {
    throw new Error('云端数据结构无法读取，请检查 Firestore 文档或联系管理员。');
  }

  const revision = typeof raw.revision === 'number' ? raw.revision : 1;
  return {
    data: parsed.data,
    revision,
    clientUpdatedAt:
      typeof raw.clientUpdatedAt === 'string'
        ? raw.clientUpdatedAt
        : (timestampToIso(raw.updatedAt) ?? new Date().toISOString()),
    clientId: typeof raw.clientId === 'string' ? raw.clientId : 'unknown',
    updatedAt: timestampToIso(raw.updatedAt),
  };
}

function assertPayloadSize(data: AppData) {
  const size = appDataByteSize(data);
  if (size > MAX_CLOUD_DATA_BYTES) {
    throw new Error(
      `数据约 ${(size / 1024).toFixed(0)} KB，已接近 Firestore 单文档 1 MiB 上限。请先导出备份，并考虑拆分训练记录。`,
    );
  }
}

export async function readCloudState(uid: string): Promise<CloudState | null> {
  const db = requireFirebaseDb();
  const snapshot = await getDoc(stateRef(db, uid));
  return parseCloudState(snapshot);
}

export async function createCloudState(
  uid: string,
  data: AppData,
  clientId: string,
): Promise<number> {
  assertPayloadSize(data);
  const db = requireFirebaseDb();
  const ref = stateRef(db, uid);

  return runTransaction(db, async (transaction) => {
    const existing = await transaction.get(ref);
    if (existing.exists()) throw new CloudConflictError();

    const revision = 1;
    transaction.set(ref, {
      data: firestoreSafeData(data),
      revision,
      clientId,
      clientUpdatedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
    return revision;
  });
}

export async function writeCloudState(
  uid: string,
  data: AppData,
  expectedRevision: number,
  clientId: string,
): Promise<number> {
  assertPayloadSize(data);
  const db = requireFirebaseDb();
  const ref = stateRef(db, uid);

  return runTransaction(db, async (transaction) => {
    const existing = await transaction.get(ref);
    if (!existing.exists()) {
      if (expectedRevision !== 0) throw new CloudConflictError();
      transaction.set(ref, {
        data: firestoreSafeData(data),
        revision: 1,
        clientId,
        clientUpdatedAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
      return 1;
    }

    const remoteRevision = Number(existing.data().revision ?? 0);
    if (remoteRevision !== expectedRevision) {
      throw new CloudConflictError();
    }

    const nextRevision = remoteRevision + 1;
    transaction.update(ref, {
      data: firestoreSafeData(data),
      revision: nextRevision,
      clientId,
      clientUpdatedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
    return nextRevision;
  });
}

export function subscribeCloudState(
  uid: string,
  onChange: (state: CloudState) => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  const db = requireFirebaseDb();
  return onSnapshot(
    stateRef(db, uid),
    (snapshot) => {
      const state = parseCloudState(snapshot);
      if (state) onChange(state);
    },
    (error) => onError(error),
  );
}
