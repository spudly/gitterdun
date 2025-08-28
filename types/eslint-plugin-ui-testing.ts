declare module 'eslint-plugin-ui-testing' {
  import type {ESLint} from 'eslint';

  // ESLint plugin for UI testing frameworks like Playwright, Cypress, etc.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- plugin interface varies
  const plugin: ESLint.Plugin & {
    rules: Record<string, any>;
    configs?: Record<string, any>;
  };

  export default plugin;
}
