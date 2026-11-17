import { useEffect, useRef, useState } from 'react';
import { Check, Circle, TriangleAlert, X } from 'lucide-react';
import type { Level, Skill } from '../../data/schema';
import { LEVEL_DESCRIPTIONS, LEVEL_NAMES } from '../../data/schema';
import { cn } from '../../lib/cn';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { LevelPips } from '../../components/ui/LevelPips';

export type TargetLevel = 1 | 2 | 3 | 4;

export interface AssessmentResult {
  level: TargetLevel;
  criteria: string[];
  note?: string;
}

interface AssessmentDialogProps {
  skill: Skill;
  currentLevel: Level;
  initialTarget: TargetLevel;
  onClose: () => void;
  onConfirm: (result: AssessmentResult) => void;
}

export function AssessmentDialog({
  skill,
  currentLevel,
  initialTarget,
  onClose,
  onConfirm,
}: AssessmentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [target, setTarget] = useState<TargetLevel>(initialTarget);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [note, setNote] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const criteria = skill.rubric[target];
  const allChecked = criteria.every((criterion) => checked.has(criterion));
  const availableLevels = ([1, 2, 3, 4] as const).filter((level) => level > currentLevel);

  const chooseTarget = (level: TargetLevel) => {
    setTarget(level);
    setChecked(new Set());
  };

  const toggleCriterion = (criterion: string) => {
    setChecked((previous) => {
      const next = new Set(previous);
      if (next.has(criterion)) next.delete(criterion);
      else next.add(criterion);
      return next;
    });
  };

  const confirm = () => {
    if (!allChecked) return;
    onConfirm({ level: target, criteria, note: note.trim() || undefined });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="assessment-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(94vw,720px)] max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/45 backdrop:backdrop-blur-sm"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur md:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-court">
            Skill assessment
          </p>
          <h2 id="assessment-title" className="mt-1 text-xl font-bold tracking-tight">
            评估等级 · {skill.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>当前</span>
            <LevelPips level={currentLevel} size="sm" />
            <span>
              L{currentLevel} · {LEVEL_NAMES[currentLevel]}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-ink"
          aria-label="关闭评估"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-6 px-5 py-5 md:px-6">
        <section>
          <h3 className="text-sm font-bold">选择目标等级</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            等级必须逐项确认标准；不能只按训练次数升级。
          </p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {([1, 2, 3, 4] as const).map((level) => {
              const disabled = !availableLevels.includes(level);
              const active = target === level;
              return (
                <button
                  key={level}
                  type="button"
                  disabled={disabled}
                  onClick={() => chooseTarget(level)}
                  className={cn(
                    'flex min-h-14 flex-col items-center justify-center rounded-2xl border px-2 text-center transition-colors',
                    active
                      ? 'border-court bg-court text-[var(--court-contrast)]'
                      : 'border-line bg-bg/40 text-muted hover:text-ink',
                    disabled && 'cursor-not-allowed opacity-35',
                  )}
                >
                  <span className="text-sm font-bold">L{level}</span>
                  <span className="mt-0.5 text-[10px] font-medium">{LEVEL_NAMES[level]}</span>
                </button>
              );
            })}
          </div>
          {target > currentLevel + 1 ? (
            <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-amber-soft/60 px-3 py-2 text-[11px] leading-5 text-amber">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              这是一次跳级评估。建议先逐级确认，但如果这些标准都已经稳定，也可以继续。
            </p>
          ) : null}
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold">L{target} · {LEVEL_NAMES[target]} 标准</h3>
              <p className="mt-1 text-xs leading-5 text-muted">{LEVEL_DESCRIPTIONS[target]}</p>
            </div>
            <span className="text-[11px] font-semibold text-court">
              {checked.size} / {criteria.length} 已确认
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {criteria.map((criterion) => {
              const isChecked = checked.has(criterion);
              return (
                <label
                  key={criterion}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors',
                    isChecked
                      ? 'border-court/40 bg-court-soft/35'
                      : 'border-line bg-bg/40 hover:border-court/30',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCriterion(criterion)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                      isChecked
                        ? 'border-court bg-court text-[var(--court-contrast)]'
                        : 'border-line text-faint',
                    )}
                    aria-hidden="true"
                  >
                    {isChecked ? <Check className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5" />}
                  </span>
                  <span className={cn('text-xs leading-5', isChecked ? 'text-muted' : 'text-ink')}>
                    {criterion}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <section>
          <label htmlFor="assessment-note" className="text-sm font-bold">
            评估备注
          </label>
          <textarea
            id="assessment-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={500}
            placeholder="可选。记录今天的训练条件、成功率或需要继续观察的点。"
            className="mt-2 w-full resize-none rounded-2xl border border-line bg-bg/40 px-3.5 py-3 text-sm leading-6 text-ink outline-none placeholder:text-faint focus:border-court"
          />
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={buttonClassName('secondary')}>
            取消
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={!allChecked}
            className={buttonClassName('primary')}
          >
            确认升级到 L{target}
          </button>
        </div>
      </div>
    </dialog>
  );
}
