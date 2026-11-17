import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  List,
  Network,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { DOMAINS, DOMAIN_BY_ID } from '../../data/domains';
import { BASE_SKILLS, VARIANT_SKILLS } from '../../data';
import type { DomainId } from '../../data/schema';
import { DOMAIN_ID_VALUES, LEVEL_NAMES } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import { getAllDomainStats, getDomainStats } from '../../lib/progress';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { LevelPips } from '../../components/ui/LevelPips';
import { DomainDot } from '../../components/ui/DomainBadge';
import { cn } from '../../lib/cn';
import { SkillGraph } from './SkillGraph';
import { SkillListView } from './SkillListView';

type ViewMode = 'graph' | 'list';

export function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const progress = useAppStore((state) => state.data.progress);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [query, setQuery] = useState('');

  const domainParam = searchParams.get('domain');
  const domain =
    domainParam && DOMAIN_ID_VALUES.has(domainParam)
      ? DOMAIN_BY_ID.get(domainParam as DomainId)
      : undefined;
  const requestedView = searchParams.get('view');
  const view: ViewMode =
    requestedView === 'list' || requestedView === 'graph'
      ? requestedView
      : isMobile
        ? 'list'
        : 'graph';

  const domainStats = useMemo(
    () => (domain ? getDomainStats(progress, domain.id) : null),
    [domain, progress],
  );
  const allDomainStats = useMemo(() => getAllDomainStats(progress), [progress]);

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function setView(nextView: ViewMode) {
    updateParam('view', nextView);
  }

  function selectDomain(domainId: DomainId) {
    setQuery('');
    const next = new URLSearchParams(searchParams);
    next.set('domain', domainId);
    setSearchParams(next, { replace: true });
  }

  function backToAtlas() {
    setQuery('');
    const next = new URLSearchParams(searchParams);
    next.delete('domain');
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">
            Skill Atlas
          </p>
          <div className="mt-2 flex items-center gap-3">
            {domain ? (
              <button
                type="button"
                onClick={backToAtlas}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink md:hidden"
                aria-label="返回领域总览"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {domain ? domain.name : '技能图谱'}
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {domain
              ? domain.description
              : '从领域总览进入一张可点亮的前置关系图。先看整体，再专注一个领域。'}
          </p>
        </div>

        {domain ? (
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">
                领域平均
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">
                {domainStats?.averageLevel.toFixed(1)}
                <span className="text-xs font-medium text-faint"> / 4</span>
              </p>
            </div>
            <div className="h-9 w-px bg-line" />
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">
                稳定及以上
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">
                {domainStats?.stable}
                <span className="text-xs font-medium text-faint"> / {domainStats?.total}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="hidden items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted md:flex">
            <Sparkles className="h-3.5 w-3.5 text-court" />
            8 个领域 · {BASE_SKILLS.length} 主技术 · {VARIANT_SKILLS.length} 细分
          </div>
        )}
      </header>

      {domain ? (
        <DomainView
          domainId={domain.id}
          view={view}
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            if (value.trim() && view === 'graph') setView('list');
          }}
          onViewChange={setView}
          onSelectDomain={selectDomain}
          onBack={backToAtlas}
        />
      ) : domainParam ? (
        <div className="app-card p-8 text-center">
          <h2 className="text-lg font-bold">没有找到这个领域</h2>
          <p className="mt-2 text-sm text-muted">链接可能已经过期，回到总览重新选择。</p>
          <button
            type="button"
            onClick={backToAtlas}
            className="mt-4 text-sm font-semibold text-court hover:underline"
          >
            返回领域总览
          </button>
        </div>
      ) : (
        <DomainAtlas stats={allDomainStats} />
      )}
    </div>
  );
}

function DomainAtlas({ stats }: { stats: ReturnType<typeof getAllDomainStats> }) {
  return (
    <div className="space-y-6">
      <section className="app-card flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
            <Network className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">如何看这张图</h2>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-muted">
              每个领域是一张有向无环图：实线代表前置已满足，虚线代表还需要补前置。虚线框是跨领域前置，点击可以跳转。手机默认列表视图，图谱作为次级视图。
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1">
            <span className="h-1.5 w-3 rounded-full bg-court" /> 已满足
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1">
            <span className="h-px w-4 border-t border-dashed border-faint" /> 待补前置
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line px-2.5 py-1">
            跨领域
          </span>
        </div>
      </section>

      <section aria-label="领域地图" className="grid gap-3 md:grid-cols-2">
        {stats.map((domain) => (
          <Link
            key={domain.domainId}
            to={`/map?domain=${domain.domainId}`}
            data-domain={domain.domainId}
            className="app-card group relative overflow-hidden p-5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span
              className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-[var(--domain)] opacity-80"
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-4 pl-1">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <DomainDot domainId={domain.domainId} className="h-2.5 w-2.5" />
                  <h2 className="text-base font-bold tracking-tight">{domain.name}</h2>
                  {domain.stable > 0 ? (
                    <span className="rounded-full bg-court-soft px-2 py-0.5 text-[10px] font-semibold text-court">
                      {domain.stable} 项稳定
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
                  {DOMAIN_BY_ID.get(domain.domainId)?.description}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-court" />
            </div>

            <div className="mt-5 pl-1">
              <div className="flex items-center justify-between text-[11px] text-faint">
                <span>
                  {domain.started} / {domain.total} 个技能已点亮
                </span>
                <span className="font-semibold text-ink">{domain.averageLevel.toFixed(1)} / 4</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${Math.max(domain.percent, domain.started > 0 ? 4 : 0)}%`,
                    backgroundColor: 'var(--domain)',
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-[11px]">
                <span className="truncate text-faint">
                  {domain.anchorName ? `锚点：${domain.anchorName}` : '领域地图'}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-muted group-hover:text-court">
                  进入领域
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="app-card flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-court" />
          <div>
            <h2 className="text-sm font-bold">现在可以做什么</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              先给 8 个锚点技能标记起点：正手握拍、上网步法、正手高远发球、正手高远球、放网、平抽挡、前后站位、四方球。其他技能的内容会在下一阶段补全。
            </p>
          </div>
        </div>
        <Link
          to="/map?domain=basics"
          className="shrink-0 text-sm font-semibold text-court hover:underline"
        >
          从基础开始
        </Link>
      </section>
    </div>
  );
}

function DomainView({
  domainId,
  view,
  query,
  onQueryChange,
  onViewChange,
  onSelectDomain,
  onBack,
}: {
  domainId: DomainId;
  view: ViewMode;
  query: string;
  onQueryChange: (value: string) => void;
  onViewChange: (view: ViewMode) => void;
  onSelectDomain: (domainId: DomainId) => void;
  onBack: () => void;
}) {
  const progress = useAppStore((state) => state.data.progress);
  const domainStats = useMemo(() => getDomainStats(progress, domainId), [domainId, progress]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          全部领域
        </button>
        <span className="text-xs text-faint">/</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
          <DomainDot domainId={domainId} />
          {domainStats.name}
        </span>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {DOMAINS.map((domain) => {
          const active = domain.id === domainId;
          return (
            <button
              key={domain.id}
              type="button"
              data-domain={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              aria-pressed={active}
              className={cn(
                'inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-colors',
                active
                  ? 'border-court bg-court text-[var(--court-contrast)]'
                  : 'border-line bg-surface text-muted hover:border-court/40 hover:text-ink',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  active ? 'bg-[var(--court-contrast)]' : 'bg-[var(--domain)]',
                )}
                aria-hidden="true"
              />
              {domain.shortName}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative flex min-h-11 flex-1 items-center md:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索本领域技能"
            aria-label="搜索本领域技能"
            className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-court"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="清空搜索"
              className="absolute right-2 grid h-8 w-8 place-items-center rounded-full text-faint hover:bg-surface2 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </label>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted">{domainStats.total} 个技能</span>
          <div className="flex rounded-full border border-line bg-surface p-1" role="group" aria-label="视图切换">
            <button
              type="button"
              onClick={() => onViewChange('graph')}
              aria-pressed={view === 'graph'}
              className={cn(
                'inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors',
                view === 'graph' ? 'bg-court text-[var(--court-contrast)]' : 'text-muted hover:text-ink',
              )}
            >
              <Network className="h-3.5 w-3.5" />
              图谱
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              aria-pressed={view === 'list'}
              className={cn(
                'inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors',
                view === 'list' ? 'bg-court text-[var(--court-contrast)]' : 'text-muted hover:text-ink',
              )}
            >
              <List className="h-3.5 w-3.5" />
              列表
            </button>
          </div>
        </div>
      </div>

      {view === 'graph' ? (
        <div className="space-y-3">
          <SkillGraph key={domainId} domainId={domainId} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full bg-court" /> 已满足前置
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-4 border-t border-dashed border-faint" /> 待补前置
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded border border-dashed border-faint" /> 跨领域前置
            </span>
            <span className="text-faint">· 点击节点查看要点与等级标准</span>
            <span className="text-faint md:hidden">· 双指缩放 / 拖动查看</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <SkillListView domainId={domainId} query={query} />
          <div className="grid grid-cols-5 gap-1.5 rounded-2xl border border-line bg-surface p-3">
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className="rounded-xl bg-surface2/60 px-2 py-2 text-center">
                <LevelPips level={level as 0 | 1 | 2 | 3 | 4} size="sm" className="justify-center" />
                <p className="mt-1.5 text-[10px] font-semibold text-muted">
                  L{level} {LEVEL_NAMES[level as 0 | 1 | 2 | 3 | 4]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
