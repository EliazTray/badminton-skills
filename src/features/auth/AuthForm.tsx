import { useState, type FormEvent } from 'react';
import { LoaderCircle, Mail } from 'lucide-react';
import { useAuth, authErrorMessage } from './AuthProvider';
import { buttonClassName } from '../../components/ui/buttonStyles';

type AuthMode = 'signin' | 'register';

export function AuthForm() {
  const { signInWithEmail, registerWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (password.length < 6) {
      setError('密码至少需要 6 位。');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('两次输入的密码不一致。');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (submitError) {
      setError(authErrorMessage(submitError));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setError('请先填写邮箱，再发送重置邮件。');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await resetPassword(email);
      setNotice('重置邮件已发送，请检查邮箱。');
    } catch (resetError) {
      setError(authErrorMessage(resetError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">Members only</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">登录后使用</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          只有白名单内的邮箱可以进入。教练查看只读分享链接不需要登录。
        </p>
      </header>

      <section className="app-card p-5 md:p-6">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className={buttonClassName('secondary', 'w-full')}
            disabled={busy}
            onClick={async () => {
              setError(null);
              setBusy(true);
              try {
                await signInWithGoogle();
              } catch (googleError) {
                setError(authErrorMessage(googleError));
              } finally {
                setBusy(false);
              }
            }}
          >
            <span className="font-bold">G</span>
            使用 Google 登录
          </button>
          <button
            type="button"
            className={buttonClassName('secondary', 'w-full')}
            disabled={busy}
            onClick={() => {
              setMode(mode === 'signin' ? 'register' : 'signin');
              setError(null);
              setNotice(null);
            }}
          >
            {mode === 'signin' ? '创建邮箱账号' : '已有账号，去登录'}
          </button>
        </div>

        <div className="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-faint">
          <span className="h-px flex-1 bg-line" />
          或使用邮箱
          <span className="h-px flex-1 bg-line" />
        </div>

        <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
          <label className="block">
            <span className="text-xs font-semibold text-muted">邮箱</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line bg-bg/60 px-3">
              <Mail className="h-4 w-4 text-faint" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-11 w-full bg-transparent text-sm outline-none"
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-muted">密码</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-line bg-bg/60 px-3 text-sm outline-none focus:border-court"
              placeholder="至少 6 位"
            />
          </label>

          {mode === 'register' ? (
            <label className="block">
              <span className="text-xs font-semibold text-muted">确认密码</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-line bg-bg/60 px-3 text-sm outline-none focus:border-court"
                placeholder="再输入一次"
              />
            </label>
          ) : null}

          {error ? (
            <p className="rounded-xl bg-amber-soft/70 px-3 py-2 text-xs leading-5 text-amber" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-xl bg-court-soft/60 px-3 py-2 text-xs leading-5 text-court" role="status">
              {notice}
            </p>
          ) : null}

          <button type="submit" disabled={busy} className={buttonClassName('primary', 'w-full')}>
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {mode === 'signin' ? '登录' : '创建账号'}
          </button>
        </form>

        {mode === 'signin' ? (
          <button
            type="button"
            onClick={() => void handleReset()}
            disabled={busy}
            className="mt-3 text-xs font-semibold text-court hover:underline disabled:opacity-50"
          >
            忘记密码？
          </button>
        ) : null}

        <p className="mt-5 text-[11px] leading-5 text-faint">
          第一次使用请点「创建邮箱账号」；新邮箱需要完成邮箱验证。
        </p>
      </section>
    </div>
  );
}
