import {describe, expect, test} from '@jest/globals';
import {asError, UserSchema} from '../index';

describe('@gitterdun/shared public API', () => {
  test('exports expected modules', () => {
    expect(typeof asError).toBe('function');
    expect(typeof UserSchema).toBe('object');
  });

  test('asError wraps non-error values', () => {
    const err = asError('x');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toMatch(/Non-Error thrown/u);
    expect(err.value).toBe('x');
  });
});
