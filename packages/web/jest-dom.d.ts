import matchers from '@testing-library/jest-dom/matchers';

type TestingLibraryMatchers = typeof matchers;

declare module '@jest/expect' {
  // eslint-disable-next-line ts/consistent-type-definitions, ts/no-unused-vars, ts/no-empty-object-type -- augmenting an interface from a third-party library; type signature must match
  export interface Matchers<R extends void | Promise<void>, T = unknown>
    extends matchers.TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      R
    > {}
}
