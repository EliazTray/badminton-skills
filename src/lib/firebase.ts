import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export const FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseEnv = FIREBASE_ENV_KEYS.filter((key) => !import.meta.env[key]);

export const isFirebaseConfigured = missingFirebaseEnv.length === 0;

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth: Auth | null = app ? getAuth(app) : null;
export const firebaseDb: Firestore | null = app ? getFirestore(app) : null;

export function requireFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    throw new Error('Firebase 尚未配置，请先填写 VITE_FIREBASE_* 环境变量。');
  }
  return firebaseAuth;
}

export function requireFirebaseDb(): Firestore {
  if (!firebaseDb) {
    throw new Error('Firebase 尚未配置，请先填写 VITE_FIREBASE_* 环境变量。');
  }
  return firebaseDb;
}
