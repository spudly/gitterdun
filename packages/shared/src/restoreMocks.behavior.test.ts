import {expect, jest, test} from '@jest/globals';

const sharedTarget = {computeValue: () => 42};

test('first test overrides method using jest.spyOn', () => {
  const spy = jest
    .spyOn(sharedTarget, 'computeValue')
    .mockImplementation(() => 1);

  expect(sharedTarget.computeValue()).toBe(1);

  // Keep reference to avoid unused var elimination in some environments
  expect(spy).toBeDefined();
});

test('second test should see original method when restoreMocks is enabled', () => {
  // If restoreMocks is NOT enabled, this will still return 1 and the test will fail.
  expect(sharedTarget.computeValue()).toBe(42);
});
