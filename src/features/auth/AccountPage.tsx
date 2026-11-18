import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Cloud,
  CloudOff,
  Copy,
  ExternalLink,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Share2,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { AuthForm } from './AuthForm';
import { useCloudSync, formatSyncTime, SYNC_PHASE_LABELS } from '../sync/CloudSyncProvider';
import { useAppStore } from '../../store/appStore';
import { buildShareSnapshot, buildShareUrl } from '../../lib/share';
import {
  addAllowlistEmail,
  listAllowlist,
  normalizeEmail,
  removeAllowlistEmail,
  type AccessRole,
  type AllowlistEntry,
} from '../../lib/firebaseAccess';
import {
  createShare,
  deleteShare,
  listShares,
  updateShare,
  type ShareRecord,
} from '../../lib/firebaseShares';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { cn } from '../../lib/cn';

export function AccountPage() {
  const { configured, loading, user, accessRole, signOut } = useAuth();
  const { phase, lastSyncedAt, error: syncError, syncNow } = useCloudSync();

  if (!configured) {
    return <FirebaseSetup />;
  }

  if (loading) {
    return (
      <div className="app-card mx-auto flex min-h-[280px] max-w-2xl items-center justify-center p-8">
        <LoaderCircle className="h-5 w-5 animate-spin text-court" />
        <span className="ml-2 text-sm text-muted">正在检查登录状态…</span>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">Account</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">账号与云同步</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          登录后，当前浏览器的技能数据会同步到 Firebase；换设备登录同一账号即可继续。教练查看分享链接不需要登录。
        </p>
      </header>

      <section className="app-card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-court-soft text-court">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold">当前账号</h2>
              <p className="mt-1 break-all text-xs leading-5 text-muted">{user.email}</p>
              <p className="mt-0.5 text-[10px] text-faint">UID {user.uid.slice(0, 12)}…</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className={buttonClassName('secondary', 'shrink-0')}
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
        <p className="mt-3 border-t border-line pt-3 text-[11px] leading-5 text-faint">
          退出登录只会停止同步，不会删除这台设备上的本地数据。如果这是共用设备，请在退出前先清理浏览器站点数据。
        </p>
      </section>

      <SyncCard
        phase={phase}
        lastSyncedAt={lastSyncedAt}
        error={syncError}
        onSync={() => void syncNow()}
        disabled={phase === 'conflict'}
      />

      <ShareCard userId={user.uid} />

      {accessRole === 'admin' ? <WhitelistCard /> : null}
    </div>
  );
}

function SyncCard({
  phase,
  lastSyncedAt,
  error,
  onSync,
  disabled,
}: {
  phase: ReturnType<typeof useCloudSync>['phase'];
  lastSyncedAt?: string;
  error?: string;
  onSync: () => void;
  disabled: boolean;
}) {
  const isError = phase === 'error' || phase === 'conflict';
  const isBusy = phase === 'checking' || phase === 'syncing';
  const Icon = phase === 'offline' ? CloudOff : Cloud;

  return (
    <section className="app-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-2xl',
              isError ? 'bg-amber-soft text-amber' : 'bg-court-soft text-court',
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">云同步</h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs leading-5 text-muted">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  isError
                    ? 'bg-amber-soft text-amber'
                    : phase === 'ready'
                      ? 'bg-court-soft text-court'
                      : 'bg-surface2 text-muted',
                )}
              >
                {isBusy ? <LoaderCircle className="h-3 w-3 animate-spin" /> : null}
                {SYNC_PHASE_LABELS[phase]}
              </span>
              <span>{lastSyncedAt ? `最近同步：${formatSyncTime(lastSyncedAt)}` : ''}</span>
            </p>
            <p className="mt-1 text-[11px] leading-5 text-faint">
              本地优先：离线时仍可记录，联网后会自动同步。
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={disabled || isBusy}
          onClick={onSync}
          className={buttonClassName('secondary', 'shrink-0')}
        >
          <RefreshCw className={cn('h-4 w-4', isBusy && 'animate-spin')} />
          立即同步
        </button>
      </div>
      {error ? (
        <p className="mt-3 rounded-xl bg-amber-soft/60 px-3 py-2 text-xs leading-5 text-amber">
          {error}
        </p>
      ) : null}
    </section>
  );
}

function ShareCard({ userId }: { userId: string }) {
  const data = useAppStore((state) => state.data);
  const [displayName, setDisplayName] = useState('');
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadShares = async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await listShares(userId);
      setShares(loaded);
      if (loaded[0]?.snapshot.displayName) {
        setDisplayName((current) => current || loaded[0].snapshot.displayName || '');
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '读取分享列表失败。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    void listShares(userId)
      .then((loaded) => {
        if (cancelled) return;
        setShares(loaded);
        if (loaded[0]?.snapshot.displayName) {
          setDisplayName((current) => current || loaded[0].snapshot.displayName || '');
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : '读取分享列表失败。');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const primaryShare = shares[0];
  const trackedCount = Object.values(data.progress).filter((item) => item.level > 0).length;

  const handleCreateOrUpdate = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const snapshot = buildShareSnapshot(data, displayName);
      if (primaryShare) {
        await updateShare(primaryShare.id, snapshot);
        setMessage('分享已更新，教练刷新链接即可看到最新等级。');
      } else {
        await createShare(userId, snapshot);
        setMessage('分享链接已生成，复制后发给教练即可。');
      }
      await loadShares();
    } catch (shareError) {
      setError(shareError instanceof Error ? shareError.message : '生成分享失败。');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (shareId: string) => {
    if (!window.confirm('撤销后这个链接会立即失效，确定删除分享吗？')) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await deleteShare(shareId);
      await loadShares();
      setMessage('分享已撤销。');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '撤销分享失败。');
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async (shareId: string) => {
    const url = buildShareUrl(shareId);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(shareId);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      window.prompt('复制分享链接', url);
    }
  };

  return (
    <section className="app-card p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
          <Share2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-bold">分享给教练</h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            生成只读快照，教练打开链接就能看到你的技能分布，不需要登录。只包含等级，不包含备注、评估历史或训练记录。
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-bg/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold">当前快照</p>
            <p className="mt-1 text-[11px] text-muted">
              {trackedCount} 个已标记技能 · 训练记录不会分享
            </p>
          </div>
        </div>
        <label className="mt-3 block">
          <span className="text-[11px] font-semibold text-muted">显示名称（可选）</span>
          <input
            type="text"
            maxLength={40}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="例如：阿哲"
            className="mt-1.5 min-h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-court"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleCreateOrUpdate()}
          className={buttonClassName('primary', 'mt-3 w-full sm:w-auto')}
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          {primaryShare ? '更新分享' : '生成分享链接'}
        </button>
        {message ? (
          <p className="mt-3 rounded-xl bg-court-soft/60 px-3 py-2 text-xs leading-5 text-court" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-xl bg-amber-soft/60 px-3 py-2 text-xs leading-5 text-amber" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-muted">我的分享</h3>
          {loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-faint" /> : null}
        </div>
        {shares.length === 0 && !loading ? (
          <p className="mt-2 text-xs leading-5 text-faint">还没有分享链接。</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {shares.map((share) => {
              const url = buildShareUrl(share.id);
              return (
                <li key={share.id} className="rounded-2xl border border-line bg-bg/40 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">
                        {share.snapshot.displayName || '未命名分享'}
                      </p>
                      <p className="mt-0.5 text-[10px] text-faint">
                        更新于 {formatSyncTime(share.snapshot.updatedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => void copyLink(share.id)}
                        className={buttonClassName('secondary', 'min-h-9 px-3 text-xs')}
                      >
                        {copiedId === share.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === share.id ? '已复制' : '复制链接'}
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonClassName('secondary', 'min-h-9 px-3 text-xs')}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        预览
                      </a>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDelete(share.id)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-semibold text-muted transition-colors hover:border-amber/40 hover:text-amber disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        撤销
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 break-all rounded-lg bg-surface2/60 px-2 py-1.5 text-[10px] leading-4 text-faint">
                    {url}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function WhitelistCard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<AllowlistEntry[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AccessRole>('member');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentEmail = normalizeEmail(user?.email ?? '');

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await listAllowlist());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '读取白名单失败。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const loaded = await listAllowlist();
        if (!cancelled) setEntries(loaded);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : '读取白名单失败。');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (normalizeEmail(email) === currentEmail) {
      setError('不能在这里修改自己的管理员角色；请让另一位管理员操作，或使用 Firebase Console。');
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await addAllowlistEmail(email, role);
      setEmail('');
      setMessage(role === 'admin' ? '已加入管理员白名单。' : '已加入白名单。');
      await loadEntries();
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : '加入白名单失败。');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (entry: AllowlistEntry) => {
    if (entry.email === currentEmail) {
      setError('不能在这里移除自己的管理员权限；请由另一位管理员操作，或使用 Firebase Console。');
      return;
    }
    if (!window.confirm(`从白名单移除 ${entry.email}？对方将无法再加载应用和云端数据。`)) {
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await removeAllowlistEmail(entry.email);
      setMessage(`已移除 ${entry.email}。`);
      await loadEntries();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : '移除白名单失败。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="app-card p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-soft text-amber">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold">白名单管理</h2>
            <span className="rounded-full bg-amber-soft px-2 py-1 text-[10px] font-semibold text-amber">
              Admin only
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">
            只有这里的邮箱可以登录并加载应用数据。教练通过分享链接查看只读页面时不需要加入白名单。
          </p>
        </div>
      </div>

      <form className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_auto]" onSubmit={(event) => void handleAdd(event)}>
        <label className="block">
          <span className="sr-only">用户邮箱</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@example.com"
            className="min-h-11 w-full rounded-xl border border-line bg-bg/60 px-3 text-sm outline-none focus:border-court"
          />
        </label>
        <label className="block">
          <span className="sr-only">角色</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value === 'admin' ? 'admin' : 'member')}
            className="min-h-11 w-full rounded-xl border border-line bg-bg/60 px-3 text-sm outline-none focus:border-court"
          >
            <option value="member">成员</option>
            <option value="admin">管理员</option>
          </select>
        </label>
        <button type="submit" disabled={busy} className={buttonClassName('primary', 'min-h-11')}>
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          加入
        </button>
      </form>

      {message ? (
        <p className="mt-3 rounded-xl bg-court-soft/60 px-3 py-2 text-xs leading-5 text-court" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-xl bg-amber-soft/60 px-3 py-2 text-xs leading-5 text-amber" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-muted">已授权邮箱</h3>
          {loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-faint" /> : null}
        </div>
        {entries.length === 0 && !loading ? (
          <p className="mt-2 text-xs leading-5 text-faint">白名单为空。</p>
        ) : (
          <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {entries.map((entry) => (
              <li key={entry.email} className="flex flex-wrap items-center justify-between gap-3 bg-bg/40 px-3 py-3">
                <div className="min-w-0">
                  <p className="break-all text-xs font-semibold">{entry.email}</p>
                  <p className="mt-0.5 text-[10px] text-faint">
                    {entry.role === 'admin' ? '管理员' : '成员'}
                    {entry.createdAt ? ` · ${formatSyncTime(entry.createdAt)}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy || entry.email === currentEmail}
                  onClick={() => void handleRemove(entry)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-semibold text-muted transition-colors hover:border-amber/40 hover:text-amber disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {entry.email === currentEmail ? '当前账号' : '移除'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-3 text-[10px] leading-4 text-faint">
        第一个管理员需要在 Firebase Console 手动创建：集合 `allowlist`，文档 ID 为管理员邮箱（小写），字段
        `role: "admin"`。之后可以在这里维护白名单。
      </p>
    </section>
  );
}

function FirebaseSetup() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber">Setup needed</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">云同步还没有配置</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          这个版本启用了白名单登录：没有 Firebase 配置时，应用不会加载技能数据。请先创建 Firebase
          项目、启用登录和 Firestore，并发布安全规则。
        </p>
      </header>

      <section className="app-card p-5 md:p-6">
        <h2 className="text-sm font-bold">需要填写的前端配置</h2>
        <p className="mt-1 text-xs leading-5 text-muted">
          这些是 Firebase 的公开 Web 配置，不是密码；请不要填 service account 私钥。
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-ink p-4 text-[11px] leading-6 text-surface">
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...`}
        </pre>
        <p className="mt-4 text-xs leading-5 text-muted">
          本地开发复制 `.env.example` 为 `.env.local`；GitHub Pages 在仓库的 Actions
          variables 里配置同名变量。还需要启用 Email/Password 和 Google 登录、创建 Firestore
          数据库，并发布仓库中的 `firestore.rules`。
        </p>
      </section>

      <Link to="/" className={buttonClassName('secondary')}>
        <ArrowLeft className="h-4 w-4" />
        返回登录页
      </Link>
    </div>
  );
}
