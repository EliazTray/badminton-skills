import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_DATA } from '../data/schema';
import type { AppData, Session } from '../data/schema';
import { buildRecommendations } from './recommendations';

function recommendationInput(data: AppData, sessions: Session[] = []) {
  return {
    progress: data.progress,
    sessions,
    profile: data.profile,
    settings: data.settings,
    now: new Date('2026-11-18T12:00:00'),
  };
}

const staleSession: Session = {
  id: 'stale-1',
  date: '2026-10-01',
  type: '多球',
  durationMin: 60,
  intensity: 3,
  focus: [{ skillId: 'net-spin' }],
  content: '网前搓球',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

describe('recommendations', () => {
  it('always returns up to three unique skills with slot labels', () => {
    const result = buildRecommendations(recommendationInput(DEFAULT_APP_DATA));
    expect(result.length).toBe(3);
    expect(new Set(result.map((item) => item.skill.id)).size).toBe(3);
    expect(result[0].slot).toBe('main');
    expect(result.map((item) => item.slot)).toContain('balance');
  });

  it('adds a stale high-level skill to the review slot', () => {
    const data: AppData = {
      ...DEFAULT_APP_DATA,
      progress: {
        'net-spin': { level: 4, assessments: [] },
      },
    };

    const result = buildRecommendations(recommendationInput(data, [staleSession]));
    expect(result.find((item) => item.slot === 'review')?.skill.id).toBe('net-spin');
  });

  it('is deterministic for the same inputs', () => {
    const input = recommendationInput(DEFAULT_APP_DATA);
    expect(buildRecommendations(input).map((item) => item.skill.id)).toEqual(
      buildRecommendations(input).map((item) => item.skill.id),
    );
  });

  it('honors recommendation snoozes', () => {
    const base = buildRecommendations(recommendationInput(DEFAULT_APP_DATA));
    const snoozedId = base[0].skill.id;
    const data: AppData = {
      ...DEFAULT_APP_DATA,
      settings: {
        ...DEFAULT_APP_DATA.settings,
        recommendationSnoozes: { [snoozedId]: '2026-12-01' },
      },
    };

    const result = buildRecommendations(recommendationInput(data));
    expect(result.map((item) => item.skill.id)).not.toContain(snoozedId);
  });
});
