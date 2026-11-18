import { useState, type ReactNode } from 'react';
import {
  CloudOff,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  MailCheck,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '../../app/AppShell';
import { ShuttleMark } from '../../components/ShuttleMark';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { CloudSyncProvider } from '../sync/CloudSyncProvider';
import { AuthForm } from './AuthForm';
import { useAuth } from './AuthProvider';

export function AccessGate() {
  const {
    configured,
    loading,
    user,
    accessStatus,
    accessError,
    refreshAccess,
    signOut,
  } = useAuth();

  if (!configured) {
    return (
      <AccessShell>
        <StatusCard
          icon={<CloudOff className="h-5 w-5" />}
          title="应用尚未配置 Firebase"
          tone="amber"
        >
          <p>
            这个版本启用了白名单登录模式。没有 Firebase 配置时，应用不会加载任何技能数据。请先完成
            Firebase 项目、Authentication、Firestore 和 `firestore.rules` 配置。
          </p>
          <p className="mt-2 text-[11px] text-faint">
            需要配置 VITE_FIREBASE_API_KEY、VITE_FIREBASE_AUTH_DOMAIN、
            VITE_FIREBASE_PROJECT_ID、VITE_FIREBASE_APP_ID。
          </p>
        </StatusCard>
      </AccessShell>
    );
  }

  if (loading) {
    return (
      <AccessShell>
        <StatusCard
          icon={<LoaderCircle className="h-5 w-5 animate-spin" />}
          title="正在检查登录状态"
          tone="court"
        >
          <p>正在连接 Firebase Authentication。</p>
        </StatusCard>
      </AccessShell>
    );
  }

  if (!user) {
    return (
      <AccessShell>
        <AuthForm />
      </AccessShell>
    );
  }

  if (accessStatus === 'unverified') {
    return (
      <AccessShell>
        <VerifyEmailPage />
      </AccessShell>
    );
  }

  if (accessStatus === 'denied') {
    return (
      <AccessShell>
        <StatusCard
          icon={<ShieldAlert className="h-5 w-5" />}
          title="这个账号不在白名单"
          tone="amber"
        >
          <p>
            当前登录邮箱：<strong className="break-all">{user.email ?? '（无邮箱）'}</strong>
          </p>
          <p className="mt-2">
            应用只允许管理员添加的邮箱使用。请联系管理员把你的邮箱加入白名单，然后重新登录；教练查看分享链接不需要白名单。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void signOut()}
              className={buttonClassName('primary')}
            >
              <LogOut className="h-4 w-4" />
              换个账号
            </button>
          </div>
        </StatusCard>
      </AccessShell>
    );
  }

  if (accessStatus === 'error') {
    return (
      <AccessShell>
        <StatusCard
          icon={<ShieldAlert className="h-5 w-5" />}
          title="无法验证白名单"
          tone="amber"
        >
          <p>{accessError ?? '请检查网络、Firebase 配置或 Firestore 规则。'}</p>
          <p className="mt-2 text-[11px] text-faint">
            出于安全考虑，验证失败时不会加载应用数据。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={refreshAccess} className={buttonClassName('primary')}>
              <RefreshCw className="h-4 w-4" />
              重试验证
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className={buttonClassName('secondary')}
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </div>
        </StatusCard>
      </AccessShell>
    );
  }

  if (accessStatus === 'checking' || accessStatus === 'unchecked') {
    return (
      <AccessShell>
        <StatusCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="正在验证白名单"
          tone="court"
        >
          <p>正在确认 {user.email ?? '当前账号'} 是否可以使用这个应用。</p>
        </StatusCard>
      </AccessShell>
    );
  }

  if (accessStatus === 'allowed') {
    return (
      <CloudSyncProvider>
        <AppShell />
      </CloudSyncProvider>
    );
  }

  return null;
}

function VerifyEmailPage() {
  const { user, sendVerificationEmail, refreshUser, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resend = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await sendVerificationEmail();
      setMessage('验证邮件已发送，请检查收件箱和垃圾邮件。');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : '发送验证邮件失败。');
    } finally {
      setBusy(false);
    }
  };

  const checkAgain = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await refreshUser();
      setMessage('已重新检查邮箱状态；如果仍未通过，请点击邮件里的验证链接。');
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : '检查邮箱状态失败。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <StatusCard
      icon={<MailCheck className="h-5 w-5" />}
      title="请先验证邮箱"
      tone="court"
    >
      <p>
        当前账号：<strong className="break-all">{user?.email ?? '（无邮箱）'}</strong>
      </p>
      <p className="mt-2">
        为了防止有人用未验证的邮箱抢占白名单，邮箱账号必须完成验证后才能加载应用。Google
        登录的邮箱通常已经验证。
      </p>
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
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => void resend()} className={buttonClassName('primary')}>
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
          重新发送验证邮件
        </button>
        <button type="button" disabled={busy} onClick={() => void checkAgain()} className={buttonClassName('secondary')}>
          我已完成验证
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void signOut()}
          className={buttonClassName('secondary')}
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </StatusCard>
  );
}

function AccessShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface/80 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-court text-[var(--court-contrast)]">
              <ShuttleMark className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-tight">羽球图谱</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold text-muted">
            <LockKeyhole className="h-3 w-3" />
            Members only
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  tone,
  children,
}: {
  icon: ReactNode;
  title: string;
  tone: 'court' | 'amber';
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-xl">
      <div className="app-card p-6 md:p-8">
        <span
          className={
            tone === 'court'
              ? 'grid h-11 w-11 place-items-center rounded-2xl bg-court-soft text-court'
              : 'grid h-11 w-11 place-items-center rounded-2xl bg-amber-soft text-amber'
          }
        >
          {icon}
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{title}</h1>
        <div className="mt-2 text-sm leading-6 text-muted">{children}</div>
      </div>
    </section>
  );
}
