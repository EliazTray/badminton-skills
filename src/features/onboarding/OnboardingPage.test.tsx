import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_APP_DATA } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import { OnboardingPage } from './OnboardingPage';

describe('onboarding page', () => {
  beforeEach(() => {
    useAppStore.setState({ data: DEFAULT_APP_DATA, hydrated: true });
  });

  it('walks through the three steps and completes onboarding', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('先标出你的起点')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /下一步：标起点/ }));
    expect(screen.getByText('正手握拍')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /查看起点/ }));
    expect(screen.getByText('你的起点已准备好')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /开始使用/ }));

    expect(useAppStore.getState().data.profile.onboardedAt).toBeTruthy();
  });
});
