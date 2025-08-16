import {describe, expect, test} from '@jest/globals';
import * as shared from '../index';

describe('@gitterdun/shared public API', () => {
  test('exports expected modules', () => {
    // Ensure index exports schemas and utils namespaces
    expect(shared).toBeDefined();
    // Spot-check a few exports
    expect(typeof (shared as any).asError).toBe('function');
    expect(typeof (shared as any).UserSchema).toBe('object');
  });

  test('asError wraps non-error values', () => {
    const {asError} = shared as any;
    const err = asError('x');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toMatch(/Non-Error thrown/u);
    expect((err as any).value).toBe('x');
  });
});
