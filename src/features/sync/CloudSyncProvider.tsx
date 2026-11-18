import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Cloud, CloudOff, TriangleAlert } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useAppStore } from '../../store/appStore';
import { isFirebaseConfigured } from '../../lib/firebase';
import {
  CloudConflictError,
  decideInitialSync,
  stableStringify,
  type CloudState,
} from '../../lib/cloudData';
import {
  createCloudState,
  readCloudState,
  subscribeCloudState,
  writeCloudState,
} from '../../lib/firebaseCloud';
import { buttonClassName } from '../../components/ui/buttonStyles';

export type SyncPhase =
  | 'disabled'
  | 'signed-out'
  | 'checking'
  | 'ready'
  | 'syncing'
  | 'offline'
  | 'conflict'
  | 'error';

interface ConflictState {
  source: 'initial' | 'remote' | 'write';
  remote: CloudState;
  local: ReturnType<typeof useAppStore.getState>['data'];
}

interface CloudSyncContextValue {
  configured: boolean;
  phase: SyncPhase;
  lastSyncedAt?: string;
  error?: string;
  conflict: boolean;
  syncNow: () => Promise<void>;
  resolveConflict: (choice: 'local' | 'remote') => Promise<void>;
}

const CloudSyncContext = createContext<CloudSyncContextValue | null>(null);

export const SYNC_PHASE_LABELS: Record<SyncPhase, string> = {
  disabled: '云同步未配置',
  'signed-out': '未登录',
  checking: '正在检查云端数据',
  ready: '已同步',
  syncing: '正在同步',
  offline: '离线，等待联网',
  conflict: '需要处理冲突',
  error: '同步失败',
};

function createClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatSyncTime(value?: string): string {
  if (!value) return '还没有同步记录';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CloudSyncProvider({ children }: { children: ReactNode }) {
  const { configured: authConfigured, loading: authLoading, user } = useAuth();
  const data = useAppStore((state) => state.data);
  const hydrated = useAppStore((state) => state.hydrated);
  const [phase, setPhase] = useState<SyncPhase>(
    isFirebaseConfigured ? 'signed-out' : 'disabled',
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [conflict, setConflict] = useState<ConflictState | null>(null);

  const uidRef = useRef<string | null>(null);
  const phaseRef = useRef<SyncPhase>(phase);
  const conflictRef = useRef<ConflictState | null>(conflict);
  const unsubRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastSyncedJsonRef = useRef<string | null>(null);
  const revisionRef = useRef(0);
  const applyingRemoteRef = useRef(false);
  const clientIdRef = useRef(createClientId());
  const saveRef = useRef<() => Promise<void>>(async () => {});

  const updatePhase = useCallback((next: SyncPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const updateConflict = useCallback((next: ConflictState | null) => {
    conflictRef.current = next;
    setConflict(next);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopSubscription = useCallback(() => {
    unsubRef.current?.();
    unsubRef.current = null;
  }, []);

  const applyRemoteState = useCallback((cloud: CloudState) => {
    applyingRemoteRef.current = true;
    useAppStore.getState().importData(cloud.data);
    applyingRemoteRef.current = false;
    lastSyncedJsonRef.current = stableStringify(cloud.data);
    revisionRef.current = cloud.revision;
    setLastSyncedAt(cloud.clientUpdatedAt);
    updatePhase('ready');
    setError(undefined);
  }, [updatePhase]);

  const scheduleSync = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      void saveRef.current();
    }, 900);
  }, [clearTimer]);

  const handleRemoteSnapshot = useCallback(
    (cloud: CloudState) => {
      if (phaseRef.current === 'conflict') return;
      if (cloud.revision <= revisionRef.current) return;

      const local = useAppStore.getState().data;
      const localJson = stableStringify(local);
      const remoteJson = stableStringify(cloud.data);

      if (localJson === remoteJson) {
        revisionRef.current = cloud.revision;
        lastSyncedJsonRef.current = localJson;
        setLastSyncedAt(cloud.clientUpdatedAt);
        return;
      }

      const localDirty =
        lastSyncedJsonRef.current !== null && localJson !== lastSyncedJsonRef.current;
      if (localDirty) {
        updateConflict({ source: 'remote', remote: cloud, local });
        updatePhase('conflict');
        return;
      }

      applyRemoteState(cloud);
    },
    [applyRemoteState, updateConflict, updatePhase],
  );

  const startSubscription = useCallback(
    (uid: string) => {
      stopSubscription();
      unsubRef.current = subscribeCloudState(
        uid,
        handleRemoteSnapshot,
        (subscriptionError) => {
          setError(
            subscriptionError instanceof Error
              ? subscriptionError.message
              : '云端监听失败，请检查网络。',
          );
          if (phaseRef.current === 'ready') updatePhase('error');
        },
      );
    },
    [handleRemoteSnapshot, stopSubscription, updatePhase],
  );

  const saveNow = useCallback(async () => {
    const uid = uidRef.current;
    if (!authConfigured || !uid || !hydrated) return;
    if (
      phaseRef.current === 'conflict' ||
      phaseRef.current === 'checking' ||
      phaseRef.current === 'signed-out' ||
      phaseRef.current === 'disabled'
    ) {
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      updatePhase('offline');
      return;
    }

    const currentData = useAppStore.getState().data;
    const currentJson = stableStringify(currentData);
    if (currentJson === lastSyncedJsonRef.current) {
      if (phaseRef.current === 'offline') updatePhase('ready');
      return;
    }

    updatePhase('syncing');
    setError(undefined);

    try {
      const revision = await writeCloudState(
        uid,
        currentData,
        revisionRef.current,
        clientIdRef.current,
      );
      revisionRef.current = revision;
      lastSyncedJsonRef.current = currentJson;
      setLastSyncedAt(new Date().toISOString());
      updatePhase('ready');
      if (stableStringify(useAppStore.getState().data) !== currentJson) {
        scheduleSync();
      }
    } catch (writeError) {
      if (writeError instanceof CloudConflictError) {
        try {
          const remote = await readCloudState(uid);
          if (remote) {
            updateConflict({ source: 'write', remote, local: currentData });
            updatePhase('conflict');
            return;
          }
        } catch {
          // Fall through to the generic error below.
        }
      }

      setError(writeError instanceof Error ? writeError.message : '云同步失败。');
      updatePhase(
        typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'error',
      );
    }
  }, [authConfigured, hydrated, scheduleSync, updateConflict, updatePhase]);

  useEffect(() => {
    saveRef.current = saveNow;
  }, [saveNow]);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;
    clearTimer();

    const initialize = async () => {
      if (!authConfigured) {
        updatePhase('disabled');
        return;
      }
      if (authLoading) {
        updatePhase('checking');
        return;
      }
      if (!user) {
        stopSubscription();
        clearTimer();
        uidRef.current = null;
        lastSyncedJsonRef.current = null;
        revisionRef.current = 0;
        updateConflict(null);
        setError(undefined);
        updatePhase('signed-out');
        return;
      }

      const uid = user.uid;
      uidRef.current = uid;
      clearTimer();
      updateConflict(null);
      setError(undefined);
      updatePhase('checking');

      try {
        const cloud = await readCloudState(uid);
        if (cancelled) return;

        const local = useAppStore.getState().data;
        const decision = decideInitialSync(local, cloud);

        if (decision === 'create') {
          const revision = await createCloudState(uid, local, clientIdRef.current);
          if (cancelled) return;
          revisionRef.current = revision;
          lastSyncedJsonRef.current = stableStringify(local);
          setLastSyncedAt(new Date().toISOString());
          updatePhase('ready');
          startSubscription(uid);
          return;
        }

        if (decision === 'equal') {
          revisionRef.current = cloud?.revision ?? 1;
          lastSyncedJsonRef.current = stableStringify(local);
          setLastSyncedAt(cloud?.clientUpdatedAt);
          updatePhase('ready');
          startSubscription(uid);
          return;
        }

        if (decision === 'adopt-cloud' && cloud) {
          applyRemoteState(cloud);
          startSubscription(uid);
          return;
        }

        if (cloud) {
          updateConflict({ source: 'initial', remote: cloud, local });
          updatePhase('conflict');
        }
      } catch (initError) {
        if (cancelled) return;
        if (initError instanceof CloudConflictError) {
          setError('云端数据在初始化时发生变化，请点击“立即同步”重试。');
        } else {
          setError(
            initError instanceof Error ? initError.message : '初始化云同步失败，请稍后重试。',
          );
        }
        updatePhase('error');
      }
    };

    void initialize();

    return () => {
      cancelled = true;
      clearTimer();
      stopSubscription();
    };
  }, [
    authConfigured,
    authLoading,
    hydrated,
    user,
    applyRemoteState,
    startSubscription,
    clearTimer,
    stopSubscription,
    updateConflict,
    updatePhase,
  ]);

  useEffect(() => {
    if (!hydrated || !authConfigured || !user || phase !== 'ready') return;
    if (applyingRemoteRef.current) return;
    if (stableStringify(data) === lastSyncedJsonRef.current) return;
    scheduleSync();
  }, [authConfigured, data, hydrated, phase, scheduleSync, user]);

  useEffect(() => {
    if (!hydrated || !authConfigured || !user) return;

    const handleOnline = () => {
      if (
        phaseRef.current !== 'ready' &&
        phaseRef.current !== 'offline' &&
        phaseRef.current !== 'error'
      ) {
        return;
      }
      if (phaseRef.current === 'offline') updatePhase('ready');
      if (stableStringify(useAppStore.getState().data) !== lastSyncedJsonRef.current) {
        scheduleSync();
      }
    };
    const handleOffline = () => {
      if (phaseRef.current === 'ready' || phaseRef.current === 'syncing') {
        updatePhase('offline');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [authConfigured, hydrated, scheduleSync, user, updatePhase]);

  const syncNow = useCallback(async () => {
    if (phaseRef.current === 'conflict') return;
    updatePhase('ready');
    await saveNow();
  }, [saveNow, updatePhase]);

  const resolveConflict = useCallback(
    async (choice: 'local' | 'remote') => {
      const currentConflict = conflictRef.current;
      const uid = uidRef.current;
      if (!currentConflict || !uid) return;

      updateConflict(null);
      if (choice === 'remote') {
        applyRemoteState(currentConflict.remote);
        startSubscription(uid);
        return;
      }

      const local = useAppStore.getState().data;
      updatePhase('syncing');
      setError(undefined);
      try {
        const revision = await writeCloudState(
          uid,
          local,
          currentConflict.remote.revision,
          clientIdRef.current,
        );
        revisionRef.current = revision;
        lastSyncedJsonRef.current = stableStringify(local);
        setLastSyncedAt(new Date().toISOString());
        updatePhase('ready');
        startSubscription(uid);
      } catch (resolveError) {
        if (resolveError instanceof CloudConflictError) {
          try {
            const remote = await readCloudState(uid);
            if (remote) {
              updateConflict({ source: 'write', remote, local });
              updatePhase('conflict');
              return;
            }
          } catch {
            // Fall through to the generic error below.
          }
        }
        setError(
          resolveError instanceof Error ? resolveError.message : '覆盖云端失败，请稍后重试。',
        );
        updatePhase('error');
      }
    },
    [applyRemoteState, startSubscription, updateConflict, updatePhase],
  );

  return (
    <CloudSyncContext.Provider
      value={{
        configured: isFirebaseConfigured,
        phase,
        lastSyncedAt,
        error,
        conflict: conflict !== null,
        syncNow,
        resolveConflict,
      }}
    >
      {children}
      {conflict ? <SyncConflictDialog conflict={conflict} onResolve={resolveConflict} /> : null}
    </CloudSyncContext.Provider>
  );
}

export function useCloudSync(): CloudSyncContextValue {
  const context = useContext(CloudSyncContext);
  if (!context) {
    throw new Error('useCloudSync must be used inside CloudSyncProvider');
  }
  return context;
}

function SyncConflictDialog({
  conflict,
  onResolve,
}: {
  conflict: ConflictState;
  onResolve: (choice: 'local' | 'remote') => Promise<void>;
}) {
  const [resolving, setResolving] = useState<'local' | 'remote' | null>(null);
  const localTracked = Object.values(conflict.local.progress).filter(
    (item) => item.level > 0,
  ).length;
  const remoteTracked = Object.values(conflict.remote.data.progress).filter(
    (item) => item.level > 0,
  ).length;

  const resolve = async (choice: 'local' | 'remote') => {
    setResolving(choice);
    try {
      await onResolve(choice);
    } finally {
      setResolving(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-ink/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sync-conflict-title"
    >
      <div className="app-card w-full max-w-lg overflow-hidden p-5 shadow-2xl md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-soft text-amber">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
              Sync conflict
            </p>
            <h2 id="sync-conflict-title" className="mt-1 text-lg font-bold tracking-tight">
              本地和云端都有数据
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              这两份数据不一致。请选择保留哪一份；未选中的一份会被覆盖。
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-bg/50 p-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <CloudOff className="h-4 w-4 text-muted" />
              本地
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              {localTracked} 个已标记技能 · {conflict.local.sessions.length} 条训练记录
            </p>
          </div>
          <div className="rounded-2xl border border-court/20 bg-court-soft/40 p-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Cloud className="h-4 w-4 text-court" />
              云端
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              {remoteTracked} 个已标记技能 · {conflict.remote.data.sessions.length} 条训练记录
            </p>
            <p className="mt-1 text-[10px] text-faint">
              更新于 {formatSyncTime(conflict.remote.clientUpdatedAt)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            disabled={resolving !== null}
            onClick={() => void resolve('remote')}
            className={buttonClassName('secondary', 'w-full')}
          >
            {resolving === 'remote' ? '应用中…' : '使用云端数据'}
          </button>
          <button
            type="button"
            disabled={resolving !== null}
            onClick={() => void resolve('local')}
            className={buttonClassName('primary', 'w-full')}
          >
            {resolving === 'local' ? '上传中…' : '保留本地并覆盖云端'}
          </button>
        </div>
        <p className="mt-3 text-[10px] leading-4 text-faint">
          目前不做自动合并。建议先导出一次本地备份，再选择云端数据。
        </p>
      </div>
    </div>
  );
}

export { formatSyncTime };
