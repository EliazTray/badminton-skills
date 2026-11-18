import { describe, expect, it } from 'vitest';
import type { Session, SkillProgress } from '../data/schema';
import {
  getLastPracticeBySkill,
  getRecentSessions,
  getStaleSkills,
  getWeekSessionStats,
  groupSessionsByDate,
  sortSessionsNewest,
} from './sessions';

function session(id: string, date: string, skillId = 'net-spin'): Session {
  return {
    id,
    date,
    type: '多球',
    durationMin: 60,
    intensity: 3,
    focus: [{ skillId, successRate: 70 }],
    content: '训练内容',
    createdAt: `${date}T10:00:00.000Z`,
    updatedAt: `${date}T10:00:00.000Z`,
  };
}

const sessions = [
  session('a', '2026-10-01', 'forehand-grip'),
  session('b', '2026-11-10'),
  session('c', '2026-11-17'),
  session('d', '2026-11-18'),
];

const progress: Record<string, SkillProgress> = {
  'net-spin': { level: 3, assessments: [] },
  'forehand-grip': { level: 2, assessments: [] },
};

describe('session helpers', () => {
  it('sorts newest first and groups by date', () => {
    expect(sortSessionsNewest(sessions).map((item) => item.id)).toEqual(['d', 'c', 'b', 'a']);
    expect(groupSessionsByDate(sessions).map((group) => group.date)).toEqual([
      '2026-11-18',
      '2026-11-17',
      '2026-11-10',
      '2026-10-01',
    ]);
  });

  it('finds the most recent practice per skill', () => {
    const last = getLastPracticeBySkill(sessions);
    expect(last.get('net-spin')).toBe('2026-11-18');
    expect(last.get('forehand-grip')).toBe('2026-10-01');
  });

  it('identifies stale L2+ skills with practice history', () => {
    const stale = getStaleSkills(progress, sessions, 21, new Date('2026-11-18T12:00:00'));
    expect(stale.map((item) => item.skill.id)).toContain('forehand-grip');
    expect(stale.map((item) => item.skill.id)).not.toContain('net-spin');
  });

  it('limits recent sessions and calculates weekly stats', () => {
    expect(getRecentSessions(sessions, 2).map((item) => item.id)).toEqual(['d', 'c']);
    expect(getWeekSessionStats(sessions, '2026-11-16')).toEqual({ count: 2, minutes: 120 });
  });
});
