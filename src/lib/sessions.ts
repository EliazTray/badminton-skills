import { BASE_SKILLS } from '../data';
import type { Level, Session, Skill, SkillProgress } from '../data/schema';
import { daysSince } from './dates';

export interface SessionGroup {
  date: string;
  sessions: Session[];
}

export interface StaleSkill {
  skill: Skill;
  level: Level;
  lastDate: string;
  days: number;
}

export function sortSessionsNewest(sessions: Session[]): Session[] {
  return [...sessions].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function groupSessionsByDate(sessions: Session[]): SessionGroup[] {
  const groups = new Map<string, Session[]>();
  for (const session of sortSessionsNewest(sessions)) {
    const group = groups.get(session.date) ?? [];
    group.push(session);
    groups.set(session.date, group);
  }
  return [...groups.entries()].map(([date, items]) => ({ date, sessions: items }));
}

export function getLastPracticeBySkill(sessions: Session[]): Map<string, string> {
  const lastPractices = new Map<string, string>();
  for (const session of sessions) {
    for (const focus of session.focus) {
      const current = lastPractices.get(focus.skillId);
      if (!current || session.date > current) {
        lastPractices.set(focus.skillId, session.date);
      }
    }
  }
  return lastPractices;
}

export function getRecentSessions(sessions: Session[], limit = 3): Session[] {
  return sortSessionsNewest(sessions).slice(0, limit);
}

export function getStaleSkills(
  progress: Record<string, SkillProgress>,
  sessions: Session[],
  staleDays: number,
  now = new Date(),
): StaleSkill[] {
  const lastPractices = getLastPracticeBySkill(sessions);
  return BASE_SKILLS.flatMap((skill) => {
    const level = progress[skill.id]?.level ?? 0;
    const lastDate = lastPractices.get(skill.id);
    if (level < 2 || !lastDate) return [];

    const days = daysSince(lastDate, now);
    if (days <= staleDays) return [];
    return [{ skill, level, lastDate, days }];
  }).sort((a, b) => b.days - a.days || b.level - a.level);
}

export function getWeekSessionStats(
  sessions: Session[],
  weekStartISO: string,
): { count: number; minutes: number } {
  const weekSessions = sessions.filter((session) => session.date >= weekStartISO);
  return {
    count: weekSessions.length,
    minutes: weekSessions.reduce((total, session) => total + session.durationMin, 0),
  };
}
