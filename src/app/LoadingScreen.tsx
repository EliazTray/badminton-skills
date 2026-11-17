import { ShuttleMark } from '../components/ShuttleMark';

export function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-14 w-14 animate-pulse place-items-center rounded-3xl bg-court text-[var(--court-contrast)]">
          <ShuttleMark className="h-8 w-8" />
        </span>
        <p className="mt-5 text-sm font-semibold">正在加载你的技能图谱</p>
        <p className="mt-1 text-xs text-muted">读取本地进度与训练档案…</p>
      </div>
    </div>
  );
}
