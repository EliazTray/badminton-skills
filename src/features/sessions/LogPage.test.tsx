import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_APP_DATA } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import { LogPage } from './LogPage';

describe('training log page', () => {
  beforeEach(() => {
    useAppStore.setState({ data: DEFAULT_APP_DATA, hydrated: true });
  });

  afterEach(() => {
    useAppStore.setState({ data: DEFAULT_APP_DATA, hydrated: true });
  });

  it('shows an empty history and saves a new session', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LogPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '记一次训练' })).toBeTruthy();
    expect(screen.getByText('还没有训练记录')).toBeTruthy();

    await user.type(
      screen.getByPlaceholderText('例如：正手高远球多球，重点练击球点；最后打了 15 分钟半场对抗。'),
      '正手高远球多球',
    );
    await user.click(screen.getByRole('button', { name: '保存训练' }));

    expect(screen.getByText('训练记录已保存。')).toBeTruthy();
    expect(screen.getByText('正手高远球多球')).toBeTruthy();
    expect(useAppStore.getState().data.sessions).toHaveLength(1);
  });
});
