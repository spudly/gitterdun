import matchers from '@testing-library/jest-dom/matchers';

type TestingLibraryMatchers = typeof matchers;

declare module '@jest/expect' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type -- extending an interface I don't have control over
  export interface Matchers<R extends void | Promise<void>, T = unknown>
    extends matchers.TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      R
    > {}
}
