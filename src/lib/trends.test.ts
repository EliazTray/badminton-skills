import { describe, expect, it } from 'vitest';
import type { Session } from '../data/schema';
import { getWeeklyTrainingTrend } from './trends';

function session(id: string, date: string, minutes = 60): Session {
  return {
    id,
    date,
    type: '多球',
    durationMin: minutes,
    intensity: 3,
    focus: [],
    content: '训练',
    createdAt: `${date}T10:00:00.000Z`,
    updatedAt: `${date}T10:00:00.000Z`,
  };
}

describe('weekly training trend', () => {
  it('returns the requested number of weeks with counts and minutes', () => {
    const trend = getWeeklyTrainingTrend(
      [session('a', '2026-11-17', 60), session('b', '2026-11-18', 90), session('c', '2026-11-01')],
      4,
      new Date('2026-11-18T12:00:00'),
    );

    expect(trend).toHaveLength(4);
    expect(trend[3]).toMatchObject({ weekStart: '2026-11-16', count: 2, minutes: 150 });
    expect(trend[2]).toMatchObject({ weekStart: '2026-11-09', count: 0, minutes: 0 });
  });
});
