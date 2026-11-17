import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CircleDot,
  Layers,
  Network,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import {
  getAllDomainStats,
  getFrontierSkills,
  getOverallStats,
  getSkillLevel,
} from '../../lib/progress';
import { getDescendantCount } from '../../lib/graph';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { DomainDot } from '../../components/ui/DomainBadge';
import { LevelPips } from '../../components/ui/LevelPips';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { cn } from '../../lib/cn';
import { getDomain } from '../../data/domains';
import { BASE_SKILLS, VARIANT_SKILLS } from '../../data';
import type { Skill, SkillProgress } from '../../data/schema';

interface Suggestion {
  skill: Skill;
  reason: string;
  priority: number;
}

export function DashboardPage() {
  const progress = useAppStore((state) => state.data.progress);

  const overall = useMemo(() => getOverallStats(progress), [progress]);
  const domains = useMemo(() => getAllDomainStats(progress), [progress]);
  const suggestions = useMemo(() => buildSuggestions(progress), [progress]);
  const domainsStarted = domains.filter((domain) => domain.started > 0).length;

  return (
    <div className="space-y-8">
      <section className="rise-in relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-court/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 right-16 h-80 w-80 rounded-full border border-line"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">
            Personal Training Atlas
          </p>
          <h1 className="text-balance mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            把练习变成看得见的进度
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted md:text-base md:leading-7">
            用一张技能图谱定位自己会什么、缺什么；用可观察的 0–4 级标准记录成长。先把起点标出来，后面每一次训练都会更有方向。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/map" className={buttonClassName('primary')}>
              <Network className="h-4 w-4" />
              打开技能图谱
            </Link>
            <Link to="/map?view=list" className={buttonClassName('secondary')}>
              按领域浏览
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="总览数据" className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard
          icon={CircleDot}
          label="主技术点亮"
          value={`${overall.started}`}
          suffix={`/ ${overall.total}`}
          hint="至少标记过 1 级"
        />
        <StatCard
          icon={Layers}
          label="细分技术"
          value={`${overall.variantStarted}`}
          suffix={`/ ${overall.variantTotal}`}
          hint="独立评级的细分"
        />
        <StatCard
          icon={TrendingUp}
          label="稳定及以上"
          value={`${overall.stable}`}
          suffix="项"
          hint="L3 稳定 / L4 实战"
        />
        <StatCard
          icon={Target}
          label="领域覆盖"
          value={`${domainsStarted}`}
          suffix="/ 8"
          hint="有起点标记的领域"
        />
        <StatCard
          icon={Sparkles}
          label="平均等级"
          value={overall.averageLevel.toFixed(1)}
          suffix="/ 4"
          hint="主技术的平均值"
        />
      </section>

      <section aria-labelledby="next-up-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faint">Next up</p>
            <h2 id="next-up-title" className="mt-1 text-xl font-bold tracking-tight">
              接下来可以练
            </h2>
          </div>
          <Link to="/map" className="text-sm font-semibold text-court hover:underline">
            看完整图谱
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {suggestions.length > 0 ? (
            suggestions.map(({ skill, reason }, index) => (
              <Link
                key={skill.id}
                to={`/map/${skill.id}`}
                className="app-card group flex flex-col p-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
                    <DomainDot domainId={skill.domainId} />
                    {getDomainName(skill)}
                  </span>
                  <span className="text-[11px] font-bold tabular-nums text-faint">0{index + 1}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{skill.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{skill.summary}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <div className="flex items-center gap-2">
                    <LevelPips level={getSkillLevel(progress, skill.id)} size="sm" />
                    <StatusBadge level={getSkillLevel(progress, skill.id)} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-faint transition-colors group-hover:text-court" />
                </div>
                <p className="mt-3 border-t border-line pt-3 text-[11px] font-medium text-court">
                  {reason}
                </p>
              </Link>
            ))
          ) : (
            <div className="app-card col-span-full p-6 text-sm leading-6 text-muted">
              暂时没有新的可推进技能。可以在图谱里复习已达到 L3 / L4 的技能，或等待训练记录功能接入后获得复习建议。
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="domains-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faint">Domains</p>
            <h2 id="domains-title" className="mt-1 text-xl font-bold tracking-tight">
              领域进度
            </h2>
          </div>
          <span className="text-xs text-muted">按平均等级排序</span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[...domains]
            .sort((a, b) => b.averageLevel - a.averageLevel)
            .map((domain) => (
              <Link
                key={domain.domainId}
                to={`/map?domain=${domain.domainId}&view=list`}
                data-domain={domain.domainId}
                className="app-card group p-4 transition-colors hover:border-court/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <DomainDot domainId={domain.domainId} />
                      <h3 className="text-sm font-bold">{domain.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {domain.started} / {domain.total} 个技能有起点 · 稳定 {domain.stable}
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-ink">
                    {domain.averageLevel.toFixed(1)}
                    <span className="text-[10px] font-medium text-faint"> / 4</span>
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface2">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${Math.max(domain.percent, domain.started > 0 ? 4 : 0)}%`,
                      backgroundColor: 'var(--domain)',
                    }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-faint">
                  <span>{domain.anchorName ? `锚点：${domain.anchorName}` : '领域地图'}</span>
                  <span className="inline-flex items-center gap-1 text-muted group-hover:text-court">
                    查看领域
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="app-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">Phase 1 正在搭建图谱地基</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
              当前可以浏览 {BASE_SKILLS.length} 个主技术、{VARIANT_SKILLS.length} 个细分，查看前置关系，并按标准评估主技术和细分等级。训练记录和推荐会在下一阶段接入。
            </p>
          </div>
        </div>
        <Link to="/settings" className={buttonClassName('secondary', 'shrink-0')}>
          查看数据说明
        </Link>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix: string;
  hint: string;
  className?: string;
}) {
  return (
    <div className={cn('app-card p-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        <Icon className="h-4 w-4 text-faint" strokeWidth={1.8} />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">
        {value}
        <span className="ml-1 text-xs font-medium text-faint">{` ${suffix}`}</span>
      </p>
      <p className="mt-1 text-[11px] text-faint">{hint}</p>
    </div>
  );
}

function getDomainName(skill: Skill): string {
  return getDomain(skill.domainId).name;
}

function buildSuggestions(progress: Record<string, SkillProgress>): Suggestion[] {
  const frontier = getFrontierSkills(progress);
  const domainStats = new Map(
    getAllDomainStats(progress).map((domain) => [domain.domainId, domain]),
  );

  const scored = frontier.map((skill) => {
    const level = getSkillLevel(progress, skill.id);
    const domain = domainStats.get(skill.domainId);
    const descendants = getDescendantCount(skill.id);
    const domainAverage = domain?.averageLevel ?? 0;

    let reason = '前置已满足，可以开始';
    if (level > 0) reason = '正在练，继续把标准做稳';
    else if (skill.isAnchor) reason = '领域锚点，先从这里标出起点';
    else if (domainAverage < 0.5 && (domain?.total ?? 0) > 0) reason = '这个领域还有明显空位';
    else if (descendants >= 6) reason = '基础枢纽，能解锁多条后续路径';

    const priority =
      level * 8 +
      (skill.isAnchor ? 5 : 0) +
      (4 - domainAverage) * 2 +
      Math.min(descendants, 8) * 0.3;

    return { skill, reason, priority };
  });

  scored.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.skill.name.localeCompare(b.skill.name, 'zh-CN');
  });

  const picks: Suggestion[] = [];
  const usedDomains = new Set<string>();

  for (const candidate of scored) {
    if (picks.length >= 3) break;
    if (usedDomains.has(candidate.skill.domainId)) continue;
    picks.push(candidate);
    usedDomains.add(candidate.skill.domainId);
  }

  if (picks.length < 3) {
    for (const candidate of scored) {
      if (picks.length >= 3) break;
      if (picks.some((pick) => pick.skill.id === candidate.skill.id)) continue;
      picks.push(candidate);
    }
  }

  return picks;
}
