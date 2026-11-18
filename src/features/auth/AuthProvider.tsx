import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { firebaseAuth, isFirebaseConfigured } from '../../lib/firebase';
import {
  checkAccess,
  normalizeEmail,
  type AccessRole,
} from '../../lib/firebaseAccess';

export type AccessStatus =
  | 'unchecked'
  | 'checking'
  | 'unverified'
  | 'allowed'
  | 'denied'
  | 'error';

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  accessStatus: AccessStatus;
  accessRole: AccessRole | null;
  accessError?: string;
  refreshAccess: () => void;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const ACCESS_CACHE_KEY = 'badminton-skills-access-v1';

interface CachedAccess {
  uid: string;
  email: string;
  role: AccessRole;
  checkedAt: string;
}

function parseCachedRole(value: unknown): AccessRole | null {
  return value === 'admin' || value === 'member' ? value : null;
}

function readCachedAccess(user: User): CachedAccess | null {
  try {
    const raw = localStorage.getItem(ACCESS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedAccess>;
    const role = parseCachedRole(parsed.role);
    if (
      parsed.uid !== user.uid ||
      parsed.email !== normalizeEmail(user.email ?? '') ||
      !role
    ) {
      return null;
    }
    return {
      uid: parsed.uid,
      email: parsed.email,
      role,
      checkedAt: typeof parsed.checkedAt === 'string' ? parsed.checkedAt : '',
    };
  } catch {
    return null;
  }
}

function writeCachedAccess(user: User, role: AccessRole) {
  try {
    const email = normalizeEmail(user.email ?? '');
    localStorage.setItem(
      ACCESS_CACHE_KEY,
      JSON.stringify({
        uid: user.uid,
        email,
        role,
        checkedAt: new Date().toISOString(),
      } satisfies CachedAccess),
    );
  } catch {
    // The access cache is only an offline convenience; ignore storage failures.
  }
}

function clearCachedAccess() {
  try {
    localStorage.removeItem(ACCESS_CACHE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('unchecked');
  const [accessRole, setAccessRole] = useState<AccessRole | null>(null);
  const [accessError, setAccessError] = useState<string | undefined>();
  const [accessRefresh, setAccessRefresh] = useState(0);

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setAccessStatus('unchecked');
      setAccessRole(null);
      setAccessError(undefined);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!firebaseAuth) return;

    let cancelled = false;
    void (async () => {
      if (!user) {
        setAccessStatus('unchecked');
        setAccessRole(null);
        setAccessError(undefined);
        return;
      }

      if (!user.email) {
        setAccessStatus('denied');
        setAccessRole(null);
        setAccessError('这个账号没有邮箱，无法匹配白名单。');
        return;
      }

      if (!user.emailVerified) {
        setAccessStatus('unverified');
        setAccessRole(null);
        setAccessError(undefined);
        return;
      }

      setAccessStatus('checking');
      setAccessError(undefined);

      try {
        const result = await checkAccess(user.email);
        if (cancelled) return;

        if (result.allowed) {
          setAccessStatus('allowed');
          setAccessRole(result.role);
          writeCachedAccess(user, result.role ?? 'member');
          return;
        }

        clearCachedAccess();
        setAccessStatus('denied');
        setAccessRole(null);
      } catch (error) {
        if (cancelled) return;

        const cached = readCachedAccess(user);
        if (cached) {
          // Offline users can keep using the app, but Firestore rules still
          // enforce the live allowlist for all cloud reads and writes.
          setAccessStatus('allowed');
          setAccessRole(cached.role);
          return;
        }

        setAccessStatus('error');
        setAccessRole(null);
        setAccessError(
          error instanceof Error
            ? error.message
            : '无法验证白名单，请检查网络或 Firestore 规则。',
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, accessRefresh]);

  const refreshAccess = useCallback(() => {
    setAccessRefresh((value) => value + 1);
  }, []);

  const refreshUser = useCallback(async () => {
    const current = firebaseAuth?.currentUser;
    if (!current) {
      setUser(null);
      return;
    }
    await current.reload();
    // Firestore rules read email_verified from the ID token, so force a token
    // refresh after the user clicks the verification link.
    await current.getIdToken(true);
    setUser(firebaseAuth?.currentUser ?? null);
    setAccessRefresh((value) => value + 1);
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    const current = firebaseAuth?.currentUser;
    if (!current) throw new Error('当前没有登录账号。');
    await sendEmailVerification(current);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isFirebaseConfigured,
      loading,
      user,
      accessStatus,
      accessRole,
      accessError,
      refreshAccess,
      sendVerificationEmail,
      refreshUser,
      signInWithEmail: async (email, password) => {
        if (!firebaseAuth) throw new Error('Firebase 尚未配置。');
        await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      },
      registerWithEmail: async (email, password) => {
        if (!firebaseAuth) throw new Error('Firebase 尚未配置。');
        const credential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email.trim(),
          password,
        );
        await sendEmailVerification(credential.user);
      },
      signInWithGoogle: async () => {
        if (!firebaseAuth) throw new Error('Firebase 尚未配置。');
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(firebaseAuth, provider);
      },
      resetPassword: async (email) => {
        if (!firebaseAuth) throw new Error('Firebase 尚未配置。');
        await sendPasswordResetEmail(firebaseAuth, email.trim());
      },
      signOut: async () => {
        if (!firebaseAuth) return;
        await firebaseSignOut(firebaseAuth);
      },
    }),
    [accessError, accessRole, accessStatus, loading, refreshAccess, refreshUser, sendVerificationEmail, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': '这个邮箱已经注册，请直接登录。',
  'auth/invalid-email': '邮箱格式不正确。',
  'auth/invalid-credential': '邮箱或密码不正确。',
  'auth/invalid-login-credentials': '邮箱或密码不正确。',
  'auth/missing-password': '请输入密码。',
  'auth/user-disabled': '这个账号已被禁用。',
  'auth/user-not-found': '没有找到这个账号。',
  'auth/wrong-password': '密码不正确。',
  'auth/weak-password': '密码至少需要 6 位。',
  'auth/too-many-requests': '尝试次数过多，请稍后再试。',
  'auth/popup-blocked': '登录弹窗被浏览器拦截，请允许弹窗或改用邮箱登录。',
  'auth/popup-closed-by-user': '登录窗口已关闭。',
  'auth/operation-not-allowed': '这个登录方式还没有在 Firebase 控制台启用。',
  'auth/network-request-failed': '网络请求失败，请检查网络或 Firebase 是否可访问。',
  'auth/unauthorized-domain': '当前域名还没有加入 Firebase 的授权域名。',
};

export function authErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: unknown }).code);
    return AUTH_ERROR_MESSAGES[code] ?? `登录失败（${code}）。`;
  }
  return error instanceof Error ? error.message : '登录失败，请稍后再试。';
}
