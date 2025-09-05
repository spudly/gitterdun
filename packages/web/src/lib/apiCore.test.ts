import {afterEach, describe, expect, jest, test} from '@jest/globals';
import {buildUrlWithParams} from './apiCore';

describe('buildUrlWithParams', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('appends simple params and stringifies objects, skips nullish', () => {
    const url = buildUrlWithParams('/api/x', {
      alpha: 1,
      beta: 'str',
      gamma: true,
      delta: null,
      epsilon: undefined,
      foxtrot: {nested: 1},
    });
    expect(url).toMatch(/alpha=1/u);
    expect(url).toMatch(/beta=str/u);
    expect(url).toMatch(/gamma=true/u);
    expect(url).not.toMatch(/delta=/u);
    expect(url).not.toMatch(/epsilon=/u);
    expect(url).toMatch(/foxtrot=%7B%22nested%22%3A1%7D/u);
  });
});
