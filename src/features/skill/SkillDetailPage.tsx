import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Circle,
  Dumbbell,
  History,
  Layers,
  ListChecks,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { getSkill, getVariantsForSkill } from '../../data';
import { getDomain } from '../../data/domains';
import type { Assessment, Level, Skill } from '../../data/schema';
import { LEVEL_DESCRIPTIONS, LEVEL_NAMES } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import {
  getPrerequisiteStates,
  getSkillLevel,
  getUnmetPrerequisites,
} from '../../lib/progress';
import { getDescendantCount } from '../../lib/graph';
import { formatChineseDate } from '../../lib/dates';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { DomainBadge } from '../../components/ui/DomainBadge';
import { LevelPips } from '../../components/ui/LevelPips';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { cn } from '../../lib/cn';

type TabId = 'overview' | 'rubric' | 'practice' | 'variants' | 'history';

const TABS: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: '概览', icon: BookOpen },
  { id: 'rubric', label: '升级标准', icon: ListChecks },
  { id: 'practice', label: '练习', icon: Dumbbell },
  { id: 'history', label: '历史', icon: History },
];

const TAG_LABELS: Record<string, string> = {
  singles: '单打',
  doubles: '双打',
  attack: '进攻',
  defense: '防守',
  net: '网前',
  rear: '后场',
};

const ASSESSMENT_KIND_LABELS: Record<Assessment['kind'], string> = {
  baseline: '起点估值',
  rubric: '完整评估',
  correction: '等级校正',
};

export function SkillDetailPage() {
  const { skillId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const progress = useAppStore((state) => state.data.progress);
  const setQuickLevel = useAppStore((state) => state.setQuickLevel);
  const [tab, setTab] = useState<TabId>('overview');

  const skill = skillId ? getSkill(skillId) : undefined;
  const backDomain = searchParams.get('domain');

  if (!skill) {
    return (
      <div className="app-card mx-auto max-w-xl p-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faint">Not found</p>
        <h1 className="mt-2 text-2xl font-bold">没有找到这个技能</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          链接可能已经过期，或者技能 ID 不存在。回到图谱重新选择。
        </p>
        <Link
          to={backDomain ? `/map?domain=${backDomain}` : '/map'}
          className={buttonClassName('primary', 'mt-5')}
        >
          返回技能图谱
        </Link>
      </div>
    );
  }

  const domain = getDomain(skill.domainId);
  const level = getSkillLevel(progress, skill.id);
  const prerequisites = getPrerequisiteStates(skill, progress);
  const unmet = getUnmetPrerequisites(skill, progress);
  const descendants = getDescendantCount(skill.id);
  const variants = getVariantsForSkill(skill.id);
  const parentSkill = skill.parentSkillId ? getSkill(skill.parentSkillId) : undefined;
  const tabs =
    variants.length > 0
      ? [
          TABS[0],
          TABS[1],
          TABS[2],
          { id: 'variants' as const, label: `细分 ${variants.length}`, icon: Layers },
          TABS[3],
        ]
      : TABS;
  const activeTab = tab === 'variants' && variants.length === 0 ? 'overview' : tab;
  const assessments = [...(progress[skill.id]?.assessments ?? [])].sort(
    (a, b) => b.date.localeCompare(a.date),
  );

  const goBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(`/map?domain=${backDomain ?? skill.domainId}`);
    }
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回图谱
      </button>

      <header className="app-card relative overflow-hidden p-5 md:p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-line"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <DomainBadge domainId={skill.domainId} />
            {skill.isAnchor ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-court-soft px-2 py-1 text-[10px] font-semibold text-court">
                <Sparkles className="h-3 w-3" />
                领域锚点
              </span>
            ) : null}
            {skill.contentStatus === 'draft' ? (
              <span className="rounded-full border border-line px-2 py-1 text-[10px] font-medium text-faint">
                内容草案
              </span>
            ) : null}
            {parentSkill ? (
              <Link
                to={`/map/${parentSkill.id}?domain=${parentSkill.domainId}`}
                className="inline-flex items-center gap-1 rounded-full bg-court-soft px-2 py-1 text-[10px] font-semibold text-court hover:underline"
              >
                <Layers className="h-3 w-3" />
                细分自 {parentSkill.name}
              </Link>
            ) : null}
            {variants.length > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-court-soft px-2 py-1 text-[10px] font-semibold text-court">
                <Layers className="h-3 w-3" />
                {variants.length} 个细分
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">{skill.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{skill.summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <LevelPips level={level} />
              <span className="text-xs font-semibold text-muted">
                L{level} · {LEVEL_NAMES[level]}
              </span>
            </div>
            <StatusBadge level={level} />
            <span className="text-xs text-faint">
              {domain.name} · {skill.keyPoints.length} 个要点 · {skill.drills.length} 个练习
            </span>
          </div>
        </div>
      </header>

      <LevelCard
        skill={skill}
        level={level}
        canQuickMark={Boolean(skill.isAnchor || skill.parentSkillId || variants.length > 0)}
        onSelect={(nextLevel) => setQuickLevel(skill.id, nextLevel)}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="app-card overflow-hidden" aria-label="技能详情">
          <div
            className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-3 pt-3"
            role="tablist"
            aria-label="技能详情分区"
          >
            {tabs.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${item.id}`}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-t-xl border-b-2 px-3.5 text-xs font-semibold transition-colors',
                    active
                      ? 'border-court text-court'
                      : 'border-transparent text-muted hover:text-ink',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 md:p-6">
            {activeTab === 'overview' ? (
              <div
                role="tabpanel"
                id="panel-overview"
                aria-labelledby="tab-overview"
                className="space-y-7"
              >
                <SectionTitle index="01" title="动作要点" subtitle="先抓结构，再抠细节" />
                <ol className="space-y-3">
                  {skill.keyPoints.map((point, index) => (
                    <li key={point} className="flex gap-3 text-sm leading-6">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-court-soft text-[11px] font-bold text-court">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ol>

                <SectionTitle index="02" title="常见错误" subtitle="练习时重点检查" />
                <div className="grid gap-2 md:grid-cols-2">
                  {skill.commonErrors.map((error) => (
                    <div
                      key={error}
                      className="rounded-2xl border border-line bg-bg/50 p-3.5 text-xs leading-5 text-muted"
                    >
                      {error}
                    </div>
                  ))}
                </div>

                {skill.contentStatus === 'draft' ? <DraftNote /> : null}
              </div>
            ) : null}

            {activeTab === 'rubric' ? (
              <div
                role="tabpanel"
                id="panel-rubric"
                aria-labelledby="tab-rubric"
                className="space-y-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">0–4 级掌握标准</h2>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      升级需要逐项确认标准，而不是按训练次数自动升级。
                    </p>
                  </div>
                  {skill.isAnchor ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-court">
                      <Target className="h-3.5 w-3.5" />
                      当前可在上方快速标记
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3">
                  {([1, 2, 3, 4] as const).map((rubricLevel) => {
                    const achieved = level >= rubricLevel;
                    const isNext = level + 1 === rubricLevel;
                    return (
                      <div
                        key={rubricLevel}
                        className={cn(
                          'rounded-2xl border p-4',
                          achieved && 'border-court/30 bg-court-soft/30',
                          isNext && 'border-amber/40 bg-amber-soft/40',
                          !achieved && !isNext && 'border-line bg-bg/40',
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-surface text-xs font-bold">
                              L{rubricLevel}
                            </span>
                            <div>
                              <p className="text-sm font-bold">{LEVEL_NAMES[rubricLevel]}</p>
                              <p className="text-[11px] text-muted">
                                {LEVEL_DESCRIPTIONS[rubricLevel]}
                              </p>
                            </div>
                          </div>
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 text-[10px] font-semibold',
                              achieved
                                ? 'bg-court text-[var(--court-contrast)]'
                                : isNext
                                  ? 'bg-amber-soft text-amber'
                                  : 'bg-surface2 text-faint',
                            )}
                          >
                            {achieved ? '已达成' : isNext ? '下一级' : '未开始'}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-2 border-t border-line/70 pt-3">
                          {skill.rubric[rubricLevel].map((criterion) => (
                            <li key={criterion} className="flex items-start gap-2 text-xs leading-5">
                              {achieved ? (
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-court" />
                              ) : (
                                <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
                              )}
                              <span className={achieved ? 'text-muted' : 'text-ink'}>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {skill.contentStatus === 'draft' ? <DraftNote /> : null}
              </div>
            ) : null}

            {activeTab === 'practice' ? (
              <div
                role="tabpanel"
                id="panel-practice"
                aria-labelledby="tab-practice"
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold tracking-tight">练习方法</h2>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    把练习拆成可重复的小任务；每次训练只抓一个重点。
                  </p>
                </div>
                <div className="space-y-3">
                  {skill.drills.map((drill, index) => (
                    <div key={drill.name} className="rounded-2xl border border-line bg-bg/40 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-court-soft text-[11px] font-bold text-court">
                            {index + 1}
                          </span>
                          <h3 className="text-sm font-bold">{drill.name}</h3>
                        </div>
                        {drill.prescription ? (
                          <span className="rounded-full border border-line px-2 py-1 text-[10px] font-medium text-muted">
                            {drill.prescription}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 pl-9 text-xs leading-5 text-muted">{drill.description}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-dashed border-line p-4 text-xs leading-5 text-muted">
                  训练记录会在 Phase 3 接入。到那时，这里的练习可以直接关联一次训练，并记录成功率和视频链接。
                </div>
              </div>
            ) : null}

            {activeTab === 'variants' ? (
              <div
                role="tabpanel"
                id="panel-variants"
                aria-labelledby="tab-variants"
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold tracking-tight">细分技术</h2>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {skill.name}下的{` ${variants.length} `}个细分。每个细分独立按 0–4 级记录，点进去可以查看要点、练习和等级。
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {variants.map((variant) => {
                    const variantLevel = getSkillLevel(progress, variant.id);
                    const variantUnmet = getUnmetPrerequisites(variant, progress);
                    return (
                      <Link
                        key={variant.id}
                        to={`/map/${variant.id}?domain=${skill.domainId}`}
                        className="group rounded-2xl border border-line bg-bg/40 p-4 transition-colors hover:border-court/40 hover:bg-surface2/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold tracking-tight group-hover:text-court">
                              {variant.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                              {variant.summary}
                            </p>
                          </div>
                          <StatusBadge level={variantLevel} className="shrink-0" />
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <LevelPips level={variantLevel} size="sm" />
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-faint">
                            {variantUnmet.length > 0 ? '前置待补' : '查看细分'}
                            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-dashed border-line bg-bg/40 p-4 text-xs leading-5 text-muted">
                  细分技术当前是可快速标记的草案内容。先独立记录等级，后续再把训练记录、成功率和完整 rubric 评估接进来。
                </div>
              </div>
            ) : null}

            {activeTab === 'history' ? (
              <div
                role="tabpanel"
                id="panel-history"
                aria-labelledby="tab-history"
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold tracking-tight">等级历史</h2>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    每次等级变化都会留下记录；Phase 1 的快速标记会以「起点估值」保存。
                  </p>
                </div>

                {assessments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line p-8 text-center">
                    <History className="mx-auto h-5 w-5 text-faint" />
                    <p className="mt-2 text-sm font-semibold">还没有评估记录</p>
                    <p className="mt-1 text-xs text-muted">
                      先在顶部标记一个起点等级，历史会从这里开始。
                    </p>
                  </div>
                ) : (
                  <ol className="relative space-y-4 border-l border-line pl-5">
                    {assessments.map((assessment) => (
                      <li key={assessment.id} className="relative">
                        <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-court" />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold">{LEVEL_NAMES[assessment.level]}</span>
                          <span className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-medium text-muted">
                            {ASSESSMENT_KIND_LABELS[assessment.kind]}
                          </span>
                          <span className="text-[11px] text-faint">
                            {formatChineseDate(assessment.date)} · L{assessment.level}
                          </span>
                        </div>
                        {assessment.note ? (
                          <p className="mt-1.5 text-xs leading-5 text-muted">{assessment.note}</p>
                        ) : null}
                        {assessment.criteriaSnapshot.length > 0 ? (
                          <p className="mt-1.5 text-[11px] text-faint">
                            确认了 {assessment.criteriaSnapshot.length} 条标准
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ) : null}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="app-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold">前置技能</h2>
              <span className="text-[11px] text-faint">{prerequisites.length} 项</span>
            </div>

            {prerequisites.length === 0 ? (
              <p className="mt-3 text-xs leading-5 text-muted">
                没有前置要求，可以把它作为起点开始练。
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {prerequisites.map((prerequisite) => (
                  <li key={prerequisite.skill.id}>
                    <Link
                      to={`/map/${prerequisite.skill.id}?domain=${prerequisite.skill.domainId}`}
                      className="group block rounded-xl border border-line bg-bg/40 p-3 transition-colors hover:border-court/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold group-hover:text-court">
                          {prerequisite.skill.name}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
                            prerequisite.met
                              ? 'bg-court-soft text-court'
                              : 'bg-amber-soft text-amber',
                          )}
                        >
                          {prerequisite.met ? '已满足' : `需 L${prerequisite.minLevel}`}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <LevelPips level={prerequisite.currentLevel} size="sm" />
                        <span className="text-[10px] text-faint">
                          当前 L{prerequisite.currentLevel}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {unmet.length > 0 ? (
              <div className="mt-3 rounded-xl border border-amber/30 bg-amber-soft/50 p-3 text-[11px] leading-5 text-amber">
                建议先补足 {unmet.map((item) => item.skill.name).join('、')}，再进入这个技能会更顺。
              </div>
            ) : null}
          </section>

          <section className="app-card p-5">
            <h2 className="text-sm font-bold">更多信息</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-2 py-1 text-[10px] font-medium text-muted"
                >
                  {TAG_LABELS[tag] ?? tag}
                </span>
              ))}
            </div>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">后续可解锁</dt>
                <dd className="font-semibold">{descendants} 个技能</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">内容状态</dt>
                <dd className="font-semibold">
                  {skill.contentStatus === 'complete' ? '完整' : '草案'}
                </dd>
              </div>
            </dl>

            {skill.relatedSkillIds && skill.relatedSkillIds.length > 0 ? (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-[11px] font-semibold text-muted">相关技能</p>
                <ul className="mt-2 space-y-1.5">
                  {skill.relatedSkillIds.map((relatedId) => {
                    const related = getSkill(relatedId);
                    if (!related) return null;
                    return (
                      <li key={relatedId}>
                        <Link
                          to={`/map/${related.id}?domain=${related.domainId}`}
                          className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-muted hover:bg-surface2 hover:text-ink"
                        >
                          <span>{related.name}</span>
                          <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}

function LevelCard({
  skill,
  level,
  canQuickMark,
  onSelect,
}: {
  skill: Skill;
  level: Level;
  canQuickMark: boolean;
  onSelect: (level: Level) => void;
}) {
  return (
    <section className="app-card p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              当前等级
            </span>
            <span className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-semibold text-muted">
              L{level} · {LEVEL_NAMES[level]}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <LevelPips level={level} />
            <p className="text-sm leading-6 text-muted">{LEVEL_DESCRIPTIONS[level]}</p>
          </div>
        </div>

        {canQuickMark ? (
          <div className="shrink-0">
            <div
              className="grid grid-cols-5 gap-1.5 rounded-2xl border border-line bg-bg/50 p-1.5"
              role="group"
              aria-label="快速标记等级"
            >
              {([0, 1, 2, 3, 4] as const).map((option) => {
                const active = option === level;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelect(option)}
                    aria-pressed={active}
                    className={cn(
                      'flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl px-1 text-center transition-colors',
                      active
                        ? 'bg-court text-[var(--court-contrast)]'
                        : 'text-muted hover:bg-surface2 hover:text-ink',
                    )}
                  >
                    <span className="text-xs font-bold">L{option}</span>
                    <span className="mt-0.5 text-[9px] font-medium opacity-80">
                      {LEVEL_NAMES[option]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 max-w-[280px] text-right text-[10px] leading-4 text-faint">
              {skill.isAnchor
                ? 'Phase 1 快速标记为起点估值；完整标准评估将在 Phase 2 接入。'
                : skill.parentSkillId
                  ? '细分技术可独立标记；完整标准评估将在 Phase 2 接入。'
                  : '主技术可快速标记；细分技术可在「细分」页签独立标记。'}
            </p>
          </div>
        ) : (
          <div className="max-w-xs rounded-2xl border border-dashed border-line bg-bg/40 p-4 text-xs leading-5 text-muted">
            <p className="font-semibold text-ink">完整评估将在 Phase 2 开放</p>
            <p className="mt-1">当前节点内容为草案，可以查看要点与标准；暂不支持标记等级。</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionTitle({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line pb-2">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[10px] font-bold tabular-nums text-faint">{index}</span>
        <h2 className="text-sm font-bold tracking-tight">{title}</h2>
      </div>
      <span className="text-[10px] text-faint">{subtitle}</span>
    </div>
  );
}

function DraftNote() {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-bg/40 p-4 text-xs leading-5 text-muted">
      <p className="font-semibold text-ink">这是 Phase 1 内容草案</p>
      <p className="mt-1">
        当前节点的动作要点和标准已可参考，但每级标准尚未补足到 2–4 条。Phase 2 会逐项完善，并在你评审后再用于正式评估。
      </p>
    </div>
  );
}
