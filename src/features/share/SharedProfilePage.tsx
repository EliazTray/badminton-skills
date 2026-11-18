import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Clock3,
  Layers,
  LockKeyhole,
  TriangleAlert,
} from 'lucide-react';
import { ShuttleMark } from '../../components/ShuttleMark';
import { BASE_SKILLS, CONTENT_VERSION, VARIANT_SKILLS, getVariantsForSkill } from '../../data';
import type { ShareSnapshot } from '../../data/schema';
import { getShare } from '../../lib/firebaseShares';
import { isFirebaseConfigured } from '../../lib/firebase';
import {
  getUnknownSharedSkillIds,
  progressFromShare,
} from '../../lib/share';
import {
  getAllDomainStats,
  getOverallStats,
  getSkillLevel,
  getStatusLabel,
} from '../../lib/progress';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { DomainDot } from '../../components/ui/DomainBadge';
import { LevelPips } from '../../components/ui/LevelPips';
import { StatusBadge } from '../../components/ui/StatusBadge';

type LoadState = 'loading' | 'ready' | 'not-found' | 'error';

export function SharedProfilePage() {
  const { shareId } = useParams();
  const [state, setState] = useState<LoadState>(isFirebaseConfigured ? 'loading' : 'error');
  const [snapshot, setSnapshot] = useState<ShareSnapshot | null>(null);
  const [error, setError] = useState<string | null>(
    isFirebaseConfigured ? null : '这个分享页需要 Firebase 配置。',
  );

  useEffect(() => {
    let cancelled = false;
    if (!shareId || !isFirebaseConfigured) {
      return;
    }

    void getShare(shareId)
      .then((record) => {
        if (cancelled) return;
        if (!record) {
          setState('not-found');
          return;
        }
        setSnapshot(record.snapshot);
        setState('ready');
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : '读取分享失败。');
        setState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [shareId]);

  if (state === 'loading') {
    return (
      <ShareShell>
        <div className="app-card flex min-h-[260px] items-center justify-center p-8 text-sm text-muted">
          正在读取分享…
        </div>
      </ShareShell>
    );
  }

  if (state === 'not-found') {
    return (
      <ShareShell>
        <div className="app-card p-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faint">Not found</p>
          <h1 className="mt-2 text-2xl font-bold">这个分享不存在</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            链接可能已被撤销，或者分享 ID 不正确。请向分享者确认。
          </p>
          <Link to="/" className={buttonClassName('primary', 'mt-5')}>
            打开羽球图谱
          </Link>
        </div>
      </ShareShell>
    );
  }

  if (state === 'error' || !snapshot) {
    return (
      <ShareShell>
        <div className="app-card p-8 text-center">
          <TriangleAlert className="mx-auto h-6 w-6 text-amber" />
          <h1 className="mt-2 text-2xl font-bold">分享暂时无法打开</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{error ?? '请稍后重试。'}</p>
          <Link to="/" className={buttonClassName('primary', 'mt-5')}>
            打开羽球图谱
          </Link>
        </div>
      </ShareShell>
    );
  }

  return <SharedProfile snapshot={snapshot} />;
}

function SharedProfile({ snapshot }: { snapshot: ShareSnapshot }) {
  const progress = useMemo(() => progressFromShare(snapshot), [snapshot]);
  const overall = useMemo(() => getOverallStats(progress), [progress]);
  const domains = useMemo(() => getAllDomainStats(progress), [progress]);
  const unknown = useMemo(() => getUnknownSharedSkillIds(snapshot), [snapshot]);
  const displayName = snapshot.displayName?.trim() || '羽毛球技能档案';
  const updatedAt = new Date(snapshot.updatedAt);
  const updatedLabel = Number.isNaN(updatedAt.getTime())
    ? '未知时间'
    : updatedAt.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
  const isOldContent = snapshot.contentVersion !== CONTENT_VERSION;
  const trackedVariants = VARIANT_SKILLS.filter(
    (skill) => getSkillLevel(progress, skill.id) > 0,
  );

  return (
    <ShareShell>
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-court/20"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-court-soft px-2.5 py-1 text-[10px] font-bold tracking-wide text-court">
                <LockKeyhole className="h-3 w-3" />
                只读技能分布
              </span>
              <span className="text-[11px] text-faint">由羽球图谱生成</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{displayName}</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              这是一份技能等级快照。教练可以查看各领域的分布和具体技术等级，但不能在这里修改数据。
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-faint">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                快照更新于 {updatedLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                内容版本 {snapshot.contentVersion}
              </span>
            </div>
          </div>
        </header>

        <section aria-label="分享统计" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="主技术点亮" value={`${overall.started}`} suffix={`/ ${overall.total}`} />
          <Stat label="细分点亮" value={`${overall.variantStarted}`} suffix={`/ ${overall.variantTotal}`} />
          <Stat label="稳定及以上" value={`${overall.stable}`} suffix="项" />
          <Stat label="平均等级" value={overall.averageLevel.toFixed(1)} suffix="/ 4" />
        </section>

        {isOldContent || unknown.length > 0 ? (
          <div className="rounded-2xl border border-amber/30 bg-amber-soft/60 px-4 py-3 text-xs leading-5 text-amber">
            {isOldContent
              ? `这份分享生成于内容版本 ${snapshot.contentVersion}，当前版本是 ${CONTENT_VERSION}；部分技能对应关系可能已经变化。`
              : `有 ${unknown.length} 个技能 ID 不在当前内容版本中，已忽略。`}
          </div>
        ) : null}

        <section aria-labelledby="shared-domains-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faint">Domains</p>
              <h2 id="shared-domains-title" className="mt-1 text-xl font-bold tracking-tight">
                领域分布
              </h2>
            </div>
            <span className="text-xs text-muted">主技术平均等级</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {domains.map((domain) => (
              <div key={domain.domainId} data-domain={domain.domainId} className="app-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <DomainDot domainId={domain.domainId} />
                      <h3 className="text-sm font-bold">{domain.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {domain.started} / {domain.total} 个主技术有等级 · 稳定 {domain.stable}
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-ink">
                    {domain.averageLevel.toFixed(1)}
                    <span className="text-[10px] font-medium text-faint"> / 4</span>
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(domain.percent, domain.started > 0 ? 4 : 0)}%`,
                      backgroundColor: 'var(--domain)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="shared-skills-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faint">Skills</p>
              <h2 id="shared-skills-title" className="mt-1 text-xl font-bold tracking-tight">
                技能等级
              </h2>
            </div>
            <span className="text-xs text-muted">
              {trackedVariants.length > 0 ? `含 ${trackedVariants.length} 个细分` : '主技术 + 细分'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {domains.map((domain) => {
              const baseSkills = BASE_SKILLS.filter((skill) => skill.domainId === domain.domainId);
              return (
                <section key={domain.domainId} className="app-card overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                    <div className="flex items-center gap-2">
                      <DomainDot domainId={domain.domainId} />
                      <h3 className="text-sm font-bold">{domain.name}</h3>
                    </div>
                    <span className="text-[11px] text-faint">
                      {domain.started} / {domain.total} 已点亮
                    </span>
                  </div>
                  <ul className="divide-y divide-line">
                    {baseSkills.map((skill) => {
                      const level = getSkillLevel(progress, skill.id);
                      const variants = getVariantsForSkill(skill.id).filter(
                        (variant) => getSkillLevel(progress, variant.id) > 0,
                      );
                      return (
                        <li key={skill.id} className="px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{skill.name}</p>
                              <p className="mt-0.5 line-clamp-1 text-[11px] text-faint">
                                {skill.summary}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <LevelPips level={level} size="sm" />
                              <StatusBadge level={level} />
                            </div>
                          </div>
                          {variants.length > 0 ? (
                            <ul className="mt-2 space-y-1 border-l border-line pl-3">
                              {variants.map((variant) => {
                                const variantLevel = getSkillLevel(progress, variant.id);
                                return (
                                  <li
                                    key={variant.id}
                                    className="flex items-center justify-between gap-3 text-xs"
                                  >
                                    <span className="inline-flex items-center gap-1.5 text-muted">
                                      <Layers className="h-3 w-3 text-faint" />
                                      {variant.name}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                      <LevelPips level={variantLevel} size="sm" />
                                      <span className="w-10 text-right text-[10px] text-faint">
                                        {getStatusLabel(variantLevel)}
                                      </span>
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
              <ShuttleMark className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">这是只读分享</p>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
                只包含技能等级，不包含备注、评估历史、训练内容或视频。数据快照不会自动更新；分享者更新分享后，刷新链接即可看到最新版本。
              </p>
            </div>
          </div>
          <Link to="/" className={buttonClassName('secondary', 'shrink-0')}>
            打开羽球图谱
            <ArrowRight className="h-4 w-4" />
          </Link>
        </footer>
      </div>
    </ShareShell>
  );
}

function ShareShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface/80 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label="打开羽球图谱">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-court text-[var(--court-contrast)]">
              <ShuttleMark className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-tight">羽球图谱</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold text-muted">
            <LockKeyhole className="h-3 w-3" />
            Read only
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="app-card p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">
        {value}
        <span className="ml-1 text-xs font-medium text-faint">{` ${suffix}`}</span>
      </p>
    </div>
  );
}
