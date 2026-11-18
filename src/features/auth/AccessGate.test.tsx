import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

import { AccessGate } from './AccessGate';
import { AuthProvider } from './AuthProvider';

describe('access gate without Firebase configuration', () => {
  it('does not render the app when whitelist verification is unavailable', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AccessGate />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('应用尚未配置 Firebase')).toBeTruthy();
    expect(screen.queryByText('概览')).toBeNull();
  });
});
