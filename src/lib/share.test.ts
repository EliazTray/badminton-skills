import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_DATA } from '../data/schema';
import type { AppData } from '../data/schema';
import {
  buildShareSnapshot,
  buildShareUrl,
  getUnknownSharedSkillIds,
  progressFromShare,
} from './share';

const data: AppData = {
  ...DEFAULT_APP_DATA,
  progress: {
    'net-spin': {
      level: 3,
      assessments: [
        {
          id: 'a-1',
          date: '2026-11-18',
          level: 3,
          kind: 'rubric',
          criteriaSnapshot: ['定点搓球 10 次，至少 6 个过网并落在前场。'],
          contentVersion: '2026.11.3',
          note: '不应该出现在分享里',
        },
      ],
    },
    'forehand-grip': { level: 0, assessments: [] },
  },
  sessions: [
    {
      id: 's-1',
      date: '2026-11-18',
      type: '多球',
      durationMin: 60,
      intensity: 3,
      focus: [],
      content: '不应该出现在分享里',
      createdAt: '2026-11-18T10:00:00.000Z',
      updatedAt: '2026-11-18T10:00:00.000Z',
    },
  ],
};

describe('share snapshot', () => {
  it('contains only positive skill levels', () => {
    const snapshot = buildShareSnapshot(data, '  阿哲  ', new Date('2026-11-18T12:00:00.000Z'));
    expect(snapshot.displayName).toBe('阿哲');
    expect(snapshot.levels).toEqual({ 'net-spin': 3 });
    expect(snapshot.updatedAt).toBe('2026-11-18T12:00:00.000Z');
    expect(JSON.stringify(snapshot)).not.toContain('不应该出现在分享里');
  });

  it('rebuilds progress without private history', () => {
    const snapshot = buildShareSnapshot(data);
    const progress = progressFromShare(snapshot);
    expect(progress['net-spin'].level).toBe(3);
    expect(progress['net-spin'].assessments).toEqual([]);
    expect(progress['forehand-grip']).toBeUndefined();
  });

  it('reports unknown skill ids and builds a hash link', () => {
    const snapshot = buildShareSnapshot(data);
    snapshot.levels['not-in-catalog'] = 2;
    expect(getUnknownSharedSkillIds(snapshot)).toEqual(['not-in-catalog']);
    expect(buildShareUrl('abc123')).toContain('#/share/abc123');
  });
});
