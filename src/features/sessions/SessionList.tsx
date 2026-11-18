import { Link } from 'react-router-dom';
import { CalendarDays, Clock3, Flame, Pencil, Trash2, Video } from 'lucide-react';
import type { Session } from '../../data/schema';
import { getDomain } from '../../data/domains';
import { getSkill } from '../../data';
import { formatChineseDateWithYear } from '../../lib/dates';
import { groupSessionsByDate } from '../../lib/sessions';

export function SessionList({
  sessions,
  onEdit,
  onDelete,
  emptyTitle = '还没有训练记录',
  emptyMessage = '记下第一次训练，图谱里的技能和训练频率才会开始积累。',
}: {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onDelete: (session: Session) => void;
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  if (sessions.length === 0) {
    return (
      <div className="app-card p-8 text-center">
        <CalendarDays className="mx-auto h-5 w-5 text-faint" />
        <p className="mt-2 text-sm font-semibold">{emptyTitle}</p>
        <p className="mt-1 text-xs leading-5 text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groupSessionsByDate(sessions).map((group) => (
        <section key={group.date} aria-label={group.date}>
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <h2 className="text-xs font-bold tracking-wide text-muted">
              {formatChineseDateWithYear(group.date)}
            </h2>
            <span className="text-[10px] text-faint">{group.sessions.length} 次</span>
          </div>
          <div className="space-y-2">
            {group.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={() => onEdit(session)}
                onDelete={() => onDelete(session)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SessionCard({
  session,
  onEdit,
  onDelete,
}: {
  session: Session;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="app-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-court-soft px-2 py-1 text-[10px] font-semibold text-court">
            {session.type}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted">
            <Clock3 className="h-3 w-3 text-faint" />
            {session.durationMin} 分钟
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted">
            <Flame className="h-3 w-3 text-faint" />
            强度 {session.intensity} / 5
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-surface2 hover:text-court"
            aria-label="编辑训练记录"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-surface2 hover:text-amber"
            aria-label="删除训练记录"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{session.content}</p>

      {session.focus.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {session.focus.map((item) => {
            const skill = getSkill(item.skillId);
            if (!skill) return null;
            return (
              <Link
                key={item.skillId}
                to={`/map/${skill.id}?domain=${skill.domainId}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/40 px-2 py-1 text-[10px] font-medium text-muted hover:border-court/40 hover:text-court"
              >
                {skill.name}
                <span className="text-faint">{getDomain(skill.domainId).shortName}</span>
                {item.successRate !== undefined ? (
                  <span className="rounded-full bg-surface2 px-1.5 py-0.5 text-[9px] text-ink">
                    {item.successRate}%
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}

      {session.notes ? (
        <p className="mt-3 rounded-xl bg-bg/50 px-3 py-2 text-xs leading-5 text-muted">
          {session.notes}
        </p>
      ) : null}

      {session.videoUrl ? (
        <a
          href={session.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-court hover:underline"
        >
          <Video className="h-3.5 w-3.5" />
          查看训练视频
        </a>
      ) : null}
    </article>
  );
}
