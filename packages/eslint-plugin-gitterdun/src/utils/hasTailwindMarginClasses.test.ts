import {describe, expect, test} from '@jest/globals';
import {hasTailwindMarginClasses} from './hasTailwindMarginClasses';

describe('hasTailwindMarginClasses', () => {
  test('detects single margin class', () => {
    expect(hasTailwindMarginClasses('m-2 flex')).toEqual(['m-2']);
  });

  test('detects multiple margin classes', () => {
    expect(hasTailwindMarginClasses('mt-1 mb-2 px-4 -mx-3')).toEqual([
      'mt-1',
      'mb-2',
      '-mx-3',
    ]);
  });

  test('returns empty when no margin classes present', () => {
    expect(hasTailwindMarginClasses('flex text-sm p-2')).toEqual([]);
  });
});
