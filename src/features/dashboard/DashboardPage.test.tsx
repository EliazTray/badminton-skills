import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_APP_DATA } from '../../data/schema';
import { useAppStore } from '../../store/appStore';
import { DashboardPage } from './DashboardPage';

describe('dashboard', () => {
  beforeEach(() => {
    useAppStore.setState({ data: DEFAULT_APP_DATA, hydrated: true });
  });

  it('shows recommendations and training/review sections', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '接下来可以练' })).toBeTruthy();
    expect(screen.getByText('本周训练')).toBeTruthy();
    expect(screen.getByText('最近训练')).toBeTruthy();
    expect(screen.getByText('待复习')).toBeTruthy();
    expect(screen.getByText('主练')).toBeTruthy();
  });
});
