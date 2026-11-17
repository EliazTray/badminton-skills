import { describe, expect, it } from 'vitest';
import { CONTENT_VERSION } from '../data';
import { DEFAULT_APP_DATA } from '../data/schema';
import type { AppData, Session } from '../data/schema';
import {
  bundleToAppData,
  createExportBundle,
  parseImportBundle,
} from './backup';

const session: Session = {
  id: 'session-1',
  date: '2026-11-17',
  type: '多球',
  durationMin: 60,
  intensity: 3,
  focus: [{ skillId: 'net-spin', successRate: 70 }],
  content: '网前搓球多球',
  notes: '反手展搓还需要练',
  createdAt: '2026-11-17T10:00:00.000Z',
  updatedAt: '2026-11-17T10:00:00.000Z',
};

const data: AppData = {
  ...DEFAULT_APP_DATA,
  profile: { ...DEFAULT_APP_DATA.profile, onboardedAt: '2026-11-17T10:00:00.000Z' },
  progress: {
    'net-spin': {
      level: 2,
      assessments: [
        {
          id: 'assessment-1',
          date: '2026-11-17',
          level: 2,
          kind: 'rubric',
          criteriaSnapshot: ['定点搓球 10 次，至少 6 个过网并落在前场。'],
          contentVersion: CONTENT_VERSION,
          note: '训练后自评',
        },
      ],
    },
  },
  sessions: [session],
};

describe('backup bundle', () => {
  it('creates a versioned bundle and round-trips app data', () => {
    const bundle = createExportBundle(data, new Date('2026-11-17T10:00:00.000Z'));
    expect(bundle.schemaVersion).toBe(1);
    expect(bundle.contentVersion).toBe(CONTENT_VERSION);
    expect(bundle.exportedAt).toBe('2026-11-17T10:00:00.000Z');
    expect(bundle.progress['net-spin'].level).toBe(2);
    expect(bundle.sessions).toHaveLength(1);

    const restored = bundleToAppData(bundle);
    expect(restored).toEqual(data);
  });

  it('parses a valid exported bundle', () => {
    const bundle = createExportBundle(data);
    expect(parseImportBundle(JSON.stringify(bundle))).toEqual(bundle);
  });

  it('rejects invalid JSON and invalid shape', () => {
    expect(() => parseImportBundle('{not-json')).toThrow('文件不是有效的 JSON');
    expect(() => parseImportBundle(JSON.stringify({ hello: 'world' }))).toThrow();
  });
});
