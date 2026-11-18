import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock3, Filter, History, Timer } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { SESSION_TYPES, type Session, type SessionType } from '../../data/schema';
import { getWeekSessionStats, sortSessionsNewest } from '../../lib/sessions';
import { startOfCurrentWeek, todayISO } from '../../lib/dates';
import { SessionForm } from './SessionForm';
import { SessionList } from './SessionList';

type TypeFilter = SessionType | 'all';

export function LogPage() {
  const sessions = useAppStore((state) => state.data.sessions);
  const weeklyTarget = useAppStore((state) => state.data.profile.weeklyTargetSessions);
  const deleteSession = useAppStore((state) => state.deleteSession);
  const [searchParams] = useSearchParams();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const initialSkillId = searchParams.get('skill') ?? undefined;

  const editingSession = editingId
    ? sessions.find((session) => session.id === editingId)
    : undefined;
  const weekStats = useMemo(
    () => getWeekSessionStats(sessions, todayISO(startOfCurrentWeek())),
    [sessions],
  );
  const totalMinutes = useMemo(
    () => sessions.reduce((total, session) => total + session.durationMin, 0),
    [sessions],
  );
  const visibleSessions = useMemo(
    () =>
      sortSessionsNewest(
        typeFilter === 'all'
          ? sessions
          : sessions.filter((session) => session.type === typeFilter),
      ),
    [sessions, typeFilter],
  );

  const handleDelete = (session: Session) => {
    if (!window.confirm(`删除 ${session.date} 的这条训练记录？`)) return;
    deleteSession(session.id);
    if (editingId === session.id) setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">Training log</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">训练记录</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          记录每次训练练了什么、成功率如何。训练记录不会自动升级技能；它用来提醒你哪些技能练过、哪些已经开始生疏。
        </p>
      </header>

      <section aria-label="训练统计" className="grid grid-cols-3 gap-3">
        <div className="app-card p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <History className="h-3.5 w-3.5" />
            累计训练
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {sessions.length}
            <span className="ml-1 text-xs font-medium text-faint">次</span>
          </p>
        </div>
        <div className="app-card p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <Clock3 className="h-3.5 w-3.5" />
            累计时长
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {Math.round(totalMinutes / 60)}
            <span className="ml-1 text-xs font-medium text-faint">小时</span>
          </p>
        </div>
        <div className="app-card p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <Timer className="h-3.5 w-3.5" />
            本周
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {weekStats.count}
            <span className="ml-1 text-xs font-medium text-faint">/ {weeklyTarget} 次</span>
          </p>
          <p className="mt-0.5 text-[10px] text-faint">{weekStats.minutes} 分钟</p>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div>
          <SessionForm
            key={`${editingSession?.id ?? 'new'}-${initialSkillId ?? ''}`}
            session={editingSession}
            initialSkillId={initialSkillId}
            onSaved={() => setEditingId(null)}
            onCancel={editingSession ? () => setEditingId(null) : undefined}
          />
        </div>

        <section aria-labelledby="history-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint">History</p>
              <h2 id="history-title" className="mt-1 text-lg font-bold tracking-tight">
                训练历史
              </h2>
            </div>
            <label className="flex items-center gap-2 text-[11px] font-semibold text-muted">
              <Filter className="h-3.5 w-3.5" />
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
                className="min-h-9 rounded-xl border border-line bg-surface px-2.5 text-xs outline-none focus:border-court"
              >
                <option value="all">全部类型</option>
                {SESSION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3">
            <SessionList
              sessions={visibleSessions}
              onEdit={(session) => setEditingId(session.id)}
              onDelete={handleDelete}
              emptyTitle={sessions.length > 0 ? '没有匹配的训练' : '还没有训练记录'}
              emptyMessage={
                sessions.length > 0
                  ? '换一个类型筛选，或直接在上方记录一次新的训练。'
                  : '记下第一次训练，图谱里的技能和训练频率才会开始积累。'
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}
