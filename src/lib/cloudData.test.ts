import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_DATA } from '../data/schema';
import type { AppData } from '../data/schema';
import {
  appDataByteSize,
  decideInitialSync,
  hasMeaningfulData,
  stableStringify,
  type CloudState,
} from './cloudData';

function withProgress(data: AppData): AppData {
  return {
    ...data,
    progress: {
      'net-spin': { level: 2, assessments: [] },
    },
  };
}

function cloud(data: AppData, revision = 3): CloudState {
  return {
    data,
    revision,
    clientUpdatedAt: '2026-11-18T12:00:00.000Z',
    clientId: 'remote',
  };
}

describe('cloud sync helpers', () => {
  it('stringifies objects regardless of key order', () => {
    expect(stableStringify({ b: 2, a: { d: 4, c: 3 } })).toBe(
      stableStringify({ a: { c: 3, d: 4 }, b: 2 }),
    );
  });

  it('detects meaningful local data', () => {
    expect(hasMeaningfulData(DEFAULT_APP_DATA)).toBe(false);
    expect(hasMeaningfulData(withProgress(DEFAULT_APP_DATA))).toBe(true);
  });

  it('decides initial sync and preserves local data on conflict', () => {
    const empty = DEFAULT_APP_DATA;
    const local = withProgress(empty);
    expect(decideInitialSync(local, null)).toBe('create');
    expect(decideInitialSync(local, cloud(local))).toBe('equal');
    expect(decideInitialSync(empty, cloud(local))).toBe('adopt-cloud');
    expect(decideInitialSync(local, cloud(empty))).toBe('conflict');
  });

  it('measures payload size in bytes', () => {
    expect(appDataByteSize(DEFAULT_APP_DATA)).toBeGreaterThan(0);
  });
});
