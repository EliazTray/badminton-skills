import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CircleDot,
  ClipboardList,
  Layers,
  Network,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { getAllDomainStats, getOverallStats, getSkillLevel } from '../../lib/progress';
import {
  buildRecommendations,
  type RecommendationSlot,
} from '../../lib/recommendations';
import { getRecentSessions, getStaleSkills, getWeekSessionStats } from '../../lib/sessions';
import { getWeeklyTrainingTrend } from '../../lib/trends';
import { formatChineseDate, startOfCurrentWeek, todayISO } from '../../lib/dates';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { DomainDot } from '../../components/ui/DomainBadge';
import { LevelPips } from '../../components/ui/LevelPips';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { cn } from '../../lib/cn';
import { getDomain } from '../../data/domains';
import { BASE_SKILLS, VARIANT_SKILLS } from '../../data';
import type { Skill } from '../../data/schema';

const SLOT_LABELS: Record<RecommendationSlot, string> = {
  main: '主练',
  balance: '补短',
  review: '复习',
  extra: '补充',
};

export function DashboardPage() {
  const progress = useAppStore((state) => state.data.progress);
  const sessions = useAppStore((state) => state.data.sessions);
  const profile = useAppStore((state) => state.data.profile);
  const settings = useAppStore((state) => state.data.settings);
  const snoozeRecommendation = useAppStore((state) => state.snoozeRecommendation);

  const overall = useMemo(() => getOverallStats(progress), [progress]);
  const domains = useMemo(() => getAllDomainStats(progress), [progress]);
  const recommendations = useMemo(
    () => buildRecommendations({ progress, sessions, profile, settings, now: new Date() }),
    [progress, sessions, profile, settings],
  );
  const recentSessions = useMemo(() => getRecentSessions(sessions, 3), [sessions]);
  const staleSkills = useMemo(
    () => getStaleSkills(progress, sessions, settings.staleDays),
    [progress, sessions, settings.staleDays],
  );
  const weekStats = useMemo(
    () => getWeekSessionStats(sessions, todayISO(startOfCurrentWeek())),
    [sessions],
  );
  const trainingTrend = useMemo(() => getWeeklyTrainingTrend(sessions, 12), [sessions]);
  const trendMax = Math.max(...trainingTrend.map((week) => week.minutes), 1);
  const trendCount = trainingTrend.reduce((total, week) => total + week.count, 0);
  const trendMinutes = trainingTrend.reduce((total, week) => total + week.minutes, 0);
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

      <section aria-label="总览数据" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
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
        <StatCard
          icon={ClipboardList}
          label="本周训练"
          value={`${weekStats.count}`}
          suffix="次"
          hint={`${weekStats.minutes} 分钟 · 目标 ${profile.weeklyTargetSessions} 次`}
        />
      </section>

      <section className="app-card p-5" aria-labelledby="trend-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">Trend</p>
            <h2 id="trend-title" className="mt-1 text-base font-bold tracking-tight">
              最近 12 周训练趋势
            </h2>
          </div>
          <p className="text-[11px] text-muted">
            {trendCount} 次 · {Math.round(trendMinutes / 60)} 小时
          </p>
        </div>
        <div
          className="mt-4 flex h-28 items-end gap-1.5"
          role="img"
          aria-label={`最近 12 周共训练 ${trendCount} 次，${trendMinutes} 分钟`}
        >
          {trainingTrend.map((week) => (
            <div key={week.weekStart} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span className="h-3 text-[9px] font-semibold tabular-nums text-faint">
                {week.count > 0 ? week.count : ''}
              </span>
              <div
                className="w-full rounded-t-md bg-court/80 transition-colors hover:bg-court"
                style={{
                  height: `${Math.max(week.minutes / trendMax * 72, week.count > 0 ? 6 : 2)}px`,
                  opacity: week.count > 0 ? 1 : 0.35,
                }}
                title={`${week.weekStart} · ${week.count} 次 · ${week.minutes} 分钟`}
              />
              <span className="max-w-full truncate text-[8px] text-faint">{week.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-4 text-faint">
          柱高按每周训练分钟数计算；数字是每周训练次数。
        </p>
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
          {recommendations.length > 0 ? (
            recommendations.map(({ skill, reason, slot }) => (
              <article
                key={skill.id}
                className="app-card group flex flex-col p-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Link to={`/map/${skill.id}`} className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
                      <DomainDot domainId={skill.domainId} />
                      {getDomainName(skill)}
                    </span>
                    <span className="rounded-full bg-court-soft px-2 py-1 text-[10px] font-bold text-court">
                      {SLOT_LABELS[slot]}
                    </span>
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
                <button
                  type="button"
                  onClick={() => snoozeRecommendation(skill.id)}
                  className="mt-2 self-end text-[10px] font-medium text-faint transition-colors hover:text-ink"
                >
                  3 天内不再提示
                </button>
              </article>
            ))
          ) : (
            <div className="app-card col-span-full p-6 text-sm leading-6 text-muted">
              暂时没有新的可推进技能。可以在图谱里复习已达到 L3 / L4 的技能，或记录一次训练后查看待复习提示。
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="app-card p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">Recent</p>
              <h2 className="mt-1 text-base font-bold tracking-tight">最近训练</h2>
            </div>
            <Link to="/log" className="text-xs font-semibold text-court hover:underline">
              全部记录
            </Link>
          </div>

          {recentSessions.length > 0 ? (
            <ul className="mt-4 divide-y divide-line">
              {recentSessions.map((session) => (
                <li key={session.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-muted">
                      {formatChineseDate(session.date)} · {session.type}
                    </span>
                    <span className="text-[10px] text-faint">
                      {session.durationMin} 分钟
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{session.content}</p>
                  {session.focus.length > 0 ? (
                    <p className="mt-1 text-[10px] text-faint">
                      练到 {session.focus.length} 个技能
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-line p-4 text-xs leading-5 text-muted">
              还没有训练记录。记下一次训练后，这里会显示最近的练习。
              <Link to="/log" className={buttonClassName('secondary', 'mt-3 w-full')}>
                <ClipboardList className="h-4 w-4" />
                记第一次训练
              </Link>
            </div>
          )}
        </div>

        <div className="app-card p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">Review</p>
              <h2 className="mt-1 text-base font-bold tracking-tight">待复习</h2>
            </div>
            <span className="text-[10px] text-faint">超过 {settings.staleDays} 天未练</span>
          </div>

          {staleSkills.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {staleSkills.slice(0, 3).map((item) => (
                <li key={item.skill.id}>
                  <Link
                    to={`/map/${item.skill.id}?domain=${item.skill.domainId}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg/40 px-3 py-2.5 transition-colors hover:border-court/40"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold">{item.skill.name}</span>
                      <span className="mt-0.5 block text-[10px] text-faint">
                        {item.days} 天未练 · {getDomain(item.skill.domainId).shortName}
                      </span>
                    </span>
                    <LevelPips level={item.level} size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-line p-4 text-xs leading-5 text-muted">
              还没有需要复习的技能。记录训练后，长期未练的 L2+ 技能会出现在这里。
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
            <h2 className="text-sm font-bold">账号与云同步已接入</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
              当前可以浏览 {BASE_SKILLS.length} 个主技术、{VARIANT_SKILLS.length} 个细分，按标准评估等级，并导出 JSON。登录后可把完整进度同步到 Firebase，生成不含备注和训练记录的教练只读分享链接；训练记录和推荐仍会在下一阶段接入。
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
