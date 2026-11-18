import { useMemo, useState, type FormEvent } from 'react';
import {
  CalendarDays,
  Check,
  Clock3,
  Flame,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { ALL_SKILLS } from '../../data';
import { getDomain } from '../../data/domains';
import type { Session, SessionFocus, SessionType } from '../../data/schema';
import { SESSION_TYPES } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import { getSkillLevel } from '../../lib/progress';
import { todayISO } from '../../lib/dates';
import { buttonClassName } from '../../components/ui/buttonStyles';
import { LevelPips } from '../../components/ui/LevelPips';
import { cn } from '../../lib/cn';

const fieldClass =
  'mt-1.5 min-h-10 w-full rounded-xl border border-line bg-bg/60 px-3 text-sm outline-none focus:border-court';

interface SessionFormProps {
  session?: Session;
  initialSkillId?: string;
  onSaved: () => void;
  onCancel?: () => void;
}

export function SessionForm({ session, initialSkillId, onSaved, onCancel }: SessionFormProps) {
  const progress = useAppStore((state) => state.data.progress);
  const addSession = useAppStore((state) => state.addSession);
  const updateSession = useAppStore((state) => state.updateSession);
  const [date, setDate] = useState(session?.date ?? todayISO());
  const [type, setType] = useState<SessionType>(session?.type ?? '多球');
  const [durationMin, setDurationMin] = useState(String(session?.durationMin ?? 60));
  const [intensity, setIntensity] = useState(session?.intensity ?? 3);
  const [content, setContent] = useState(session?.content ?? '');
  const [notes, setNotes] = useState(session?.notes ?? '');
  const [videoUrl, setVideoUrl] = useState(session?.videoUrl ?? '');
  const [focus, setFocus] = useState<SessionFocus[]>(() => {
    if (session) return session.focus;
    if (initialSkillId && ALL_SKILLS.some((skill) => skill.id === initialSkillId)) {
      return [{ skillId: initialSkillId }];
    }
    return [];
  });
  const [skillQuery, setSkillQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const isEditing = Boolean(session);

  const filteredSkills = useMemo(() => {
    const query = skillQuery.trim().toLocaleLowerCase('zh-CN');
    if (!query) return [];
    const selected = new Set(focus.map((item) => item.skillId));
    return ALL_SKILLS.filter((skill) => {
      if (selected.has(skill.id)) return false;
      return (
        skill.name.toLocaleLowerCase('zh-CN').includes(query) ||
        skill.aliases?.some((alias) => alias.toLocaleLowerCase('zh-CN').includes(query))
      );
    }).slice(0, 8);
  }, [focus, skillQuery]);

  const addFocus = (skillId: string) => {
    if (focus.length >= 5 || focus.some((item) => item.skillId === skillId)) return;
    setFocus([...focus, { skillId }]);
    setSkillQuery('');
  };

  const removeFocus = (skillId: string) => {
    setFocus(focus.filter((item) => item.skillId !== skillId));
  };

  const updateSuccessRate = (skillId: string, value: string) => {
    const successRate =
      value === ''
        ? undefined
        : Math.max(0, Math.min(100, Number(value)));
    setFocus(
      focus.map((item) =>
        item.skillId === skillId
          ? {
              ...item,
              successRate:
                successRate !== undefined && Number.isFinite(successRate)
                  ? successRate
                  : undefined,
            }
          : item,
      ),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!content.trim()) {
      setError('请填写这次训练的内容。');
      return;
    }

    const trimmedVideo = videoUrl.trim();
    if (trimmedVideo) {
      try {
        const parsed = new URL(trimmedVideo);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          throw new Error('只支持 http / https 视频链接。');
        }
      } catch {
        setError('视频链接需要是完整的 http / https 地址。');
        return;
      }
    }

    const input = {
      date,
      type,
      durationMin: Math.round(Math.min(600, Math.max(1, Number(durationMin) || 1))),
      intensity,
      focus,
      content: content.trim(),
      notes: notes.trim() || undefined,
      videoUrl: trimmedVideo || undefined,
    };

    try {
      if (session) {
        updateSession(session.id, input);
      } else {
        addSession(input);
      }
      if (!session) {
        setContent('');
        setFocus([]);
        setNotes('');
        setVideoUrl('');
        setMessage('训练记录已保存。');
      } else {
        setMessage('训练记录已更新。');
      }
      onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '保存训练记录失败。');
    }
  };

  return (
    <form className="app-card p-5 md:p-6" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-court">
            {isEditing ? 'Edit session' : 'New session'}
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight">
            {isEditing ? '编辑训练' : '记一次训练'}
          </h2>
        </div>
        {isEditing && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-muted hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
            取消编辑
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <CalendarDays className="h-3.5 w-3.5" />
            日期
          </span>
          <input
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold text-muted">类型</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as SessionType)}
            className={fieldClass}
          >
            {SESSION_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <Clock3 className="h-3.5 w-3.5" />
            时长（分钟）
          </span>
          <input
            type="number"
            min={1}
            max={600}
            required
            value={durationMin}
            onChange={(event) => setDurationMin(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <Flame className="h-3.5 w-3.5" />
            强度
          </span>
          <select
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value) as 1 | 2 | 3 | 4 | 5)}
            className={fieldClass}
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <option key={option} value={option}>
                {option} / 5
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-[11px] font-semibold text-muted">训练内容</span>
        <textarea
          required
          rows={3}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="例如：正手高远球多球，重点练击球点；最后打了 15 分钟半场对抗。"
          className={cn(fieldClass, 'resize-y py-2.5')}
        />
      </label>

      <div className="mt-4 rounded-2xl border border-line bg-bg/40 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-muted">练到的技能</span>
          <span className="text-[10px] text-faint">{focus.length} / 5</span>
        </div>

        {focus.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {focus.map((item) => {
              const skill = ALL_SKILLS.find((candidate) => candidate.id === item.skillId);
              if (!skill) return null;
              return (
                <li
                  key={item.skillId}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{skill.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[10px] text-faint">
                      {getDomain(skill.domainId).name}
                      <LevelPips level={getSkillLevel(progress, skill.id)} size="sm" />
                    </p>
                  </div>
                  <label className="flex items-center gap-1 text-[10px] text-muted">
                    成功率
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.successRate ?? ''}
                      onChange={(event) => updateSuccessRate(item.skillId, event.target.value)}
                      placeholder="—"
                      className="h-8 w-14 rounded-lg border border-line bg-bg/60 px-2 text-right text-xs outline-none focus:border-court"
                    />
                    %
                  </label>
                  <button
                    type="button"
                    onClick={() => removeFocus(item.skillId)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-surface2 hover:text-amber"
                    aria-label={`移除 ${skill.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {focus.length < 5 ? (
          <div className="relative mt-2">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
              <Search className="h-4 w-4 text-faint" />
              <input
                type="search"
                value={skillQuery}
                onChange={(event) => setSkillQuery(event.target.value)}
                placeholder="搜索技能，例如：高远球、搓球"
                className="min-h-10 w-full bg-transparent text-xs outline-none"
              />
            </div>
            {skillQuery.trim() ? (
              <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-xl">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => addFocus(skill.id)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-surface2"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold">{skill.name}</span>
                        <span className="block text-[10px] text-faint">
                          {getDomain(skill.domainId).name}
                        </span>
                      </span>
                      <Plus className="h-3.5 w-3.5 shrink-0 text-court" />
                    </button>
                  ))
                ) : (
                  <p className="px-2.5 py-2 text-xs text-muted">没有找到匹配的技能。</p>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-[10px] text-faint">最多关联 5 个技能。</p>
        )}
      </div>

      <details className="mt-3 rounded-2xl border border-line bg-bg/30 px-3.5 py-3">
        <summary className="cursor-pointer text-xs font-semibold text-muted">
          补充细节（可选）
        </summary>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="text-[11px] font-semibold text-muted">备注</span>
            <textarea
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="今天的感受、问题或下次要调整的地方。"
              className={cn(fieldClass, 'resize-y py-2.5')}
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-muted">视频链接</span>
            <input
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://..."
              className={fieldClass}
            />
          </label>
        </div>
      </details>

      {error ? (
        <p className="mt-3 rounded-xl bg-amber-soft/60 px-3 py-2 text-xs leading-5 text-amber" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-court-soft/60 px-3 py-2 text-xs leading-5 text-court" role="status">
          <Check className="h-3.5 w-3.5" />
          {message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="submit" className={buttonClassName('primary')}>
          <Plus className="h-4 w-4" />
          {isEditing ? '保存修改' : '保存训练'}
        </button>
        {isEditing && onCancel ? (
          <button type="button" onClick={onCancel} className={buttonClassName('secondary')}>
            取消
          </button>
        ) : null}
      </div>
    </form>
  );
}
