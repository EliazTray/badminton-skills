import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Compass, Target } from 'lucide-react';
import { DOMAINS, getAnchorSkill } from '../../data';
import type { DomainId, Level } from '../../data/schema';
import { LEVEL_DESCRIPTIONS, LEVEL_NAMES } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import { getSkillLevel } from '../../lib/progress';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { DomainDot } from '../../components/ui/DomainBadge';
import { cn } from '../../lib/cn';

const MODE_OPTIONS = [
  { id: 'singles', label: '单打', description: '优先单打技术和全场覆盖。' },
  { id: 'doubles', label: '双打', description: '优先双打站位、轮转和网前配合。' },
  { id: 'both', label: '兼顾', description: '单打和双打都保留。' },
] as const;

export function OnboardingPage() {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.data.profile);
  const progress = useAppStore((state) => state.data.progress);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const alreadyOnboarded = Boolean(profile.onboardedAt);

  const [step, setStep] = useState(0);
  const [primaryMode, setPrimaryMode] = useState(profile.primaryMode);
  const [focusDomainIds, setFocusDomainIds] = useState<DomainId[]>(
    profile.focusDomainIds.length > 0 ? profile.focusDomainIds : ['basics'],
  );
  const [weeklyTargetSessions, setWeeklyTargetSessions] = useState(
    profile.weeklyTargetSessions,
  );
  const [levels, setLevels] = useState<Record<string, Level>>(() => {
    const initial: Record<string, Level> = {};
    for (const domain of DOMAINS) {
      const anchor = getAnchorSkill(domain.id);
      if (anchor) initial[anchor.id] = getSkillLevel(progress, anchor.id);
    }
    return initial;
  });

  const anchors = useMemo(
    () =>
      DOMAINS.flatMap((domain) => {
        const skill = getAnchorSkill(domain.id);
        return skill ? [{ domain, skill }] : [];
      }),
    [],
  );

  const toggleFocusDomain = (domainId: DomainId) => {
    setFocusDomainIds((current) => {
      if (current.includes(domainId)) {
        return current.filter((item) => item !== domainId);
      }
      if (current.length >= 2) return current;
      return [...current, domainId];
    });
  };

  const finish = () => {
    completeOnboarding({
      primaryMode,
      focusDomainIds,
      weeklyTargetSessions,
      baselines: levels,
    });
    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">
          Start here · {step + 1} / 3
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          {alreadyOnboarded ? '更新你的起点' : '先标出你的起点'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          不需要精确定级，先给 8 个领域锚点一个大致位置。之后用标准逐条评估来修正。
        </p>
        {alreadyOnboarded ? (
          <Link
            to="/"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-court hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回概览
          </Link>
        ) : null}
      </header>

      {step === 0 ? (
        <section className="app-card space-y-5 p-5 md:p-6">
          <div>
            <h2 className="text-sm font-bold">你的目标</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPrimaryMode(option.id)}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition-colors',
                    primaryMode === option.id
                      ? 'border-court bg-court-soft/60'
                      : 'border-line bg-bg/40 hover:border-court/40',
                  )}
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-bold">
                    {option.label}
                    {primaryMode === option.id ? <Check className="h-4 w-4 text-court" /> : null}
                  </span>
                  <span className="mt-1 block text-[11px] leading-5 text-muted">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold">重点领域</h2>
              <span className="text-[10px] text-faint">最多 2 个</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DOMAINS.map((domain) => {
                const selected = focusDomainIds.includes(domain.id);
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => toggleFocusDomain(domain.id)}
                    className={cn(
                      'flex min-h-12 items-center gap-2 rounded-xl border px-3 text-left text-xs font-semibold transition-colors',
                      selected
                        ? 'border-court bg-court-soft/60 text-court'
                        : 'border-line bg-bg/40 text-muted hover:border-court/40',
                    )}
                  >
                    <DomainDot domainId={domain.id} />
                    {domain.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg/40 p-4">
            <span>
              <span className="block text-sm font-bold">每周目标</span>
              <span className="mt-1 block text-[11px] text-muted">先设一个现实的次数。</span>
            </span>
            <select
              value={weeklyTargetSessions}
              onChange={(event) => setWeeklyTargetSessions(Number(event.target.value))}
              className="min-h-10 rounded-xl border border-line bg-surface px-3 text-sm font-semibold outline-none focus:border-court"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <option key={value} value={value}>
                  {value} 次 / 周
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end">
            <button type="button" onClick={() => setStep(1)} className={buttonClassName('primary')}>
              下一步：标起点
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="space-y-3">
          {anchors.map(({ domain, skill }) => {
            const level = levels[skill.id] ?? 0;
            return (
              <div key={skill.id} className="app-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <DomainDot domainId={domain.id} />
                    <span className="text-[11px] font-semibold text-muted">{domain.name}</span>
                  </div>
                  <span className="text-[10px] text-faint">领域锚点</span>
                </div>
                <h2 className="mt-2 text-base font-bold tracking-tight">{skill.name}</h2>
                <p className="mt-1 text-xs leading-5 text-muted">{skill.summary}</p>
                <div className="mt-3 grid grid-cols-5 gap-1.5">
                  {([0, 1, 2, 3, 4] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setLevels((current) => ({ ...current, [skill.id]: option }))}
                      className={cn(
                        'min-h-11 rounded-xl border px-1 text-center text-[10px] font-semibold transition-colors',
                        level === option
                          ? 'border-court bg-court text-[var(--court-contrast)]'
                          : 'border-line bg-bg/40 text-muted hover:border-court/40',
                      )}
                    >
                      L{option}
                      <span className="mt-0.5 block text-[9px] font-normal opacity-80">
                        {option === 0 ? '不确定' : LEVEL_NAMES[option]}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] leading-4 text-faint">
                  {level === 0 ? '还不确定也没关系，之后可以随时评估。' : LEVEL_DESCRIPTIONS[level]}
                </p>
              </div>
            );
          })}

          <div className="flex flex-wrap justify-between gap-2">
            <button type="button" onClick={() => setStep(0)} className={buttonClassName('secondary')}>
              <ArrowLeft className="h-4 w-4" />
              上一步
            </button>
            <button type="button" onClick={() => setStep(2)} className={buttonClassName('primary')}>
              查看起点
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="app-card p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
              <Compass className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight">你的起点已准备好</h2>
              <p className="mt-1 text-xs leading-5 text-muted">
                先按这些估值开始。之后在技能详情里逐条勾选标准，等级会越来越准确。
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {anchors.map(({ domain, skill }) => (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg/40 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <DomainDot domainId={domain.id} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{skill.name}</p>
                    <p className="text-[10px] text-faint">{domain.shortName}</p>
                  </div>
                </div>
                <span className="rounded-full bg-surface2 px-2 py-1 text-[10px] font-semibold text-muted">
                  L{levels[skill.id] ?? 0} · {LEVEL_NAMES[levels[skill.id] ?? 0]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-court-soft/50 p-4 text-xs leading-5 text-court">
            <p className="flex items-center gap-2 font-semibold">
              <Target className="h-4 w-4" />
              之后可以随时调整
            </p>
            <p className="mt-1">
              起点只是估值，不是认证。技能评估会单独写入历史，不会覆盖这次起点记录。
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-2">
            <button type="button" onClick={() => setStep(1)} className={buttonClassName('secondary')}>
              <ArrowLeft className="h-4 w-4" />
              继续调整
            </button>
            <button type="button" onClick={finish} className={buttonClassName('primary')}>
              <Check className="h-4 w-4" />
              开始使用
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
