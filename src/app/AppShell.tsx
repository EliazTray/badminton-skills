import { useEffect } from 'react';
import {
  ClipboardList,
  HardDrive,
  LayoutDashboard,
  Network,
  Settings,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/cn';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../features/auth/AuthProvider';
import { ShuttleMark } from '../components/ShuttleMark';

const navItems = [
  { to: '/', label: '概览', icon: LayoutDashboard, end: true },
  { to: '/map', label: '技能图谱', icon: Network, end: false },
  { to: '/log', label: '训练记录', icon: ClipboardList, end: true },
  { to: '/settings', label: '设置', icon: Settings, end: true },
];

function navClassName(isActive: boolean, mobile = false): string {
  return cn(
    'group flex items-center transition-colors',
    mobile
      ? 'flex-col justify-center gap-1 px-1 py-2 text-[11px] font-medium'
      : 'gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
    isActive
      ? mobile
        ? 'text-court'
        : 'bg-court-soft text-court'
      : mobile
        ? 'text-muted'
        : 'text-muted hover:bg-surface2 hover:text-ink',
  );
}

export function AppShell() {
  const location = useLocation();
  const storageWarning = useAppStore((state) => state.storageWarning);
  const { configured: authConfigured, user } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-court px-4 py-2 text-sm font-semibold text-[var(--court-contrast)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        跳到主要内容
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface/80 px-5 py-6 backdrop-blur-xl md:flex">
        <NavLink to="/" className="flex items-center gap-3" aria-label="回到概览">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-court text-[var(--court-contrast)]">
            <ShuttleMark className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-base font-bold tracking-tight">羽球图谱</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
              Training Atlas
            </span>
          </span>
        </NavLink>

        <nav className="mt-10 space-y-1" aria-label="主导航">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navClassName(isActive)}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <Link
            to="/account"
            className="group block rounded-2xl border border-line bg-bg/60 p-3.5 transition-colors hover:border-court/35 hover:bg-surface2/50"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <UserRound className="h-3.5 w-3.5" />
                {user ? '已登录' : authConfigured ? '登录' : '账号'}
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-court">
                {user ? '云同步' : '开启'}
              </span>
            </div>
            <p className="mt-1.5 break-all text-xs leading-5 text-faint">
              {user?.email ?? '登录后可跨设备同步技能进度。'}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-surface2 px-2 py-1 text-[10px] font-semibold tracking-wide text-muted">
              {user ? 'Account · 已连接' : 'Account · 本地优先'}
            </span>
          </Link>
          <div className="rounded-2xl border border-line bg-bg/60 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted">
              <HardDrive className="h-3.5 w-3.5" />
              本地优先
            </div>
            <p className="mt-1.5 text-xs leading-5 text-faint">
              数据默认保存在这台设备；登录后自动同步到云端，教练查看分享不需要登录。
            </p>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5" aria-label="回到概览">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-court text-[var(--court-contrast)]">
              <ShuttleMark className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-tight">羽球图谱</span>
          </NavLink>
          <NavLink
            to="/account"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted"
          >
            <UserRound className="h-3.5 w-3.5" />
            {user ? '账号' : '登录'}
          </NavLink>
        </div>
      </header>

      <main id="main-content" className="pb-24 md:pl-64 md:pb-10">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-6 md:px-8 md:py-8">
          {storageWarning ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber-soft px-4 py-3 text-sm text-amber">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{storageWarning}</p>
            </div>
          ) : null}
          <Outlet />
        </div>
      </main>

      <nav
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 px-2 pt-1 backdrop-blur-xl md:hidden"
        aria-label="移动端主导航"
      >
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navClassName(isActive, true)}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
