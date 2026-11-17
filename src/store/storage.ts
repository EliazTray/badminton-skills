import { del, get, set } from 'idb-keyval';
import type { StateStorage } from 'zustand/middleware';

export type StorageMode = 'indexeddb' | 'memory';

let storageMode: StorageMode = 'indexeddb';
const memoryStore = new Map<string, string>();

function enableMemoryFallback() {
  storageMode = 'memory';
}

export const appStorage: StateStorage = {
  getItem: async (name) => {
    if (storageMode === 'indexeddb') {
      try {
        return (await get<string>(name)) ?? null;
      } catch {
        enableMemoryFallback();
      }
    }
    return memoryStore.get(name) ?? null;
  },
  setItem: async (name, value) => {
    if (storageMode === 'indexeddb') {
      try {
        await set(name, value);
        return;
      } catch {
        enableMemoryFallback();
      }
    }
    memoryStore.set(name, value);
  },
  removeItem: async (name) => {
    if (storageMode === 'indexeddb') {
      try {
        await del(name);
      } catch {
        enableMemoryFallback();
      }
    }
    memoryStore.delete(name);
  },
};

export function getStorageMode(): StorageMode {
  return storageMode;
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) {
    return false;
  }

  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
