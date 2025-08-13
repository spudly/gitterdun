import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../');

const isCI = !!process.env['CI'];
const viteCoverage = process.env['VITE_COVERAGE'] ?? 'true';

export default defineConfig({
  testDir: '.',
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  globalSetup: path.resolve(__dirname, './tests/global-setup.ts'),
  webServer: [
    {
      command: 'npm run dev:api',
      cwd: '../../',
      port: 3000,
      reuseExistingServer: !isCI,
      timeout: 120000,
      env: {DB_PATH: path.join(repoRoot, 'data', 'e2e.db')},
    },
    {
      command: 'npm run test:webserver',
      env: {VITE_COVERAGE: viteCoverage},
      port: 3001,
      reuseExistingServer: !isCI,
      timeout: 120000,
    },
  ],
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  ...(isCI ? {workers: 2} : {}),
});

