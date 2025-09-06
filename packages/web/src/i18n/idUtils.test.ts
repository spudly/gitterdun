import {describe, expect, test} from '@jest/globals';
import {computeHumanReadableId, slugifyDefaultMessage} from './idUtils.js';

describe('slugifyDefaultMessage', () => {
  test('lowercases and replaces non-alphanumerics with hyphens', () => {
    expect(slugifyDefaultMessage('Reset Password! Now.')).toBe(
      'reset-password-now',
    );
  });

  test('trims leading/trailing hyphens', () => {
    expect(slugifyDefaultMessage('  Hello  ')).toBe('hello');
  });

  test('limits to 30 characters', () => {
    const long = 'A very very very very long message indeed';
    expect(slugifyDefaultMessage(long)).toBe('a-very-very-very-very-long-mes');
  });
});

describe('computeHumanReadableId', () => {
  test('builds id from file scope and message slug', () => {
    const file =
      '/Users/me/workspace/giterdone/packages/web/src/pages/Login.tsx';
    expect(computeHumanReadableId(file, 'Login')).toBe('pages.Login.login');
  });

  test('handles nested paths', () => {
    const file = '/root/packages/web/src/widgets/icons/CheckCircleIcon.tsx';
    expect(computeHumanReadableId(file, 'Approved')).toBe(
      'widgets.icons.CheckCircleIcon.approved',
    );
  });

  test('falls back gracefully if /src/ is not present', () => {
    const file = '/tmp/somewhere/NoSrcPath.tsx';
    expect(computeHumanReadableId(file, 'Hello')).toBe(
      'tmp.somewhere.NoSrcPath.hello',
    );
  });
});
