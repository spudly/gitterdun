import {describe, expect, test} from '@jest/globals';
import {isObjectRecord} from './isObjectRecord.js';

describe('isObjectRecord', () => {
  test('returns true for plain object', () => {
    expect(isObjectRecord({ab: 1})).toBe(true);
  });

  test('returns false for null and primitives', () => {
    expect(isObjectRecord(null)).toBe(false);
    expect(isObjectRecord('x')).toBe(false);
    expect(isObjectRecord(42)).toBe(false);
    expect(isObjectRecord(false)).toBe(false);
  });
});
