import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_APP_DATA } from '../data/schema';
import { useAppStore } from './appStore';

describe('onboarding store action', () => {
  beforeEach(() => {
    useAppStore.setState({ data: DEFAULT_APP_DATA, hydrated: true });
  });

  it('writes profile choices and baseline assessments without wiping data', () => {
    useAppStore.getState().completeOnboarding({
      primaryMode: 'singles',
      focusDomainIds: ['footwork', 'rear-court'],
      weeklyTargetSessions: 4,
      baselines: {
        'forehand-grip': 2,
        'cross-step': 1,
        'net-spin': 0,
      },
    });

    const data = useAppStore.getState().data;
    expect(data.profile.primaryMode).toBe('singles');
    expect(data.profile.focusDomainIds).toEqual(['footwork', 'rear-court']);
    expect(data.profile.weeklyTargetSessions).toBe(4);
    expect(data.profile.onboardedAt).toBeTruthy();
    expect(data.progress['forehand-grip'].level).toBe(2);
    expect(data.progress['forehand-grip'].assessments[0].kind).toBe('baseline');
    expect(data.progress['cross-step'].level).toBe(1);
    expect(data.progress['net-spin']).toBeUndefined();
  });
});
