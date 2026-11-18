import { describe, expect, it } from 'vitest';
import { isValidEmail, normalizeEmail } from './firebaseAccess';

describe('allowlist email helpers', () => {
  it('normalizes email before using it as a document id', () => {
    expect(normalizeEmail('  User@Example.COM ')).toBe('user@example.com');
  });

  it('validates common email addresses', () => {
    expect(isValidEmail('coach@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
  });
});
