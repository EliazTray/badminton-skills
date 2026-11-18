import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../lib/firebase', () => ({
  isFirebaseConfigured: false,
  firebaseAuth: null,
  firebaseDb: null,
  missingFirebaseEnv: ['VITE_FIREBASE_API_KEY'],
  requireFirebaseAuth: () => {
    throw new Error('Firebase not configured in test');
  },
  requireFirebaseDb: () => {
    throw new Error('Firebase not configured in test');
  },
}));

import { AuthProvider } from './AuthProvider';
import { AccountPage } from './AccountPage';
import { CloudSyncProvider } from '../sync/CloudSyncProvider';

function renderWithProviders(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CloudSyncProvider>{ui}</CloudSyncProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('account page without Firebase configuration', () => {
  it('shows setup instructions instead of loading app data', () => {
    renderWithProviders(<AccountPage />);
    expect(screen.getByText('云同步还没有配置')).toBeTruthy();
    expect(screen.getByText('返回登录页')).toBeTruthy();
  });
});
