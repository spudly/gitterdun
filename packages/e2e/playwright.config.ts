import {defineConfig, devices} from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env['CI']),
  /* Retry on CI only */
  retries: 3,
  /* Opt out of parallel tests on CI. */
  workers: Boolean(process.env['CI']) ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', {open: 'never'}],
    ['junit', {outputFile: 'test-results/junit.xml'}],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8001',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects */
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run dev --workspace=packages/api',
      url: 'http://localhost:8000/api/health',
      cwd: '../..',
      env: {NODE_ENV: 'test', LOG_LEVEL: 'info'},
      stderr: 'pipe',
      stdout: 'pipe',
    },
    {
      command:
        'npm run dev --workspace=packages/web -- --debug --clearScreen=false',
      url: 'http://localhost:8001',
      cwd: '../..',
      env: {NODE_ENV: 'test'},
      stderr: 'pipe',
      stdout: 'pipe',
    },
  ],
});
