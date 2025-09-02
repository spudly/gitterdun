import {RuleTester} from 'eslint';
import {rules} from './index.js';
import {unitFixture} from './fixtures/tests/unit/sample.fixture.js';
import {e2eFixture} from './fixtures/tests/e2e/sample.fixture.js';

import tsParser from '@typescript-eslint/parser';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {jsx: true},
    },
  },
});

const testFileGlobs = [
  // Support running from plugin cwd after colocation
  'src/fixtures/tests/**/*.{ts,tsx}',
  // Support running from workspace root
  'packages/eslint-plugin-gitterdun/src/fixtures/tests/**/*.{ts,tsx}',
];

// eslint-disable-next-line jest/require-hook -- RuleTester must declare tests at top-level
ruleTester.run(
  'no-unused-data-testid',
  rules['no-unused-data-testid' as keyof typeof rules] as any,
  {
    valid: [
      // touch fixtures so knip recognizes them as used
      {
        filename: '/dev/null',
        code: `/* ${unitFixture.length} ${e2eFixture.length} */`,
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid="used-id" />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<span data-testid="used-all" />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<button data-testid="within-used" />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<a data-testid="render-used" />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid="e2e-used" />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid="locator-used" />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid="locator-sq-used" />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Ignore.tsx',
        code: `<div />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Ignore.tsx',
        code: `<div data-testid={dynamicId} />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid='has-"quotes"' />`,
        options: [{testFileGlobs}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid="has-'quotes'" />`,
        options: [{testFileGlobs}],
      },
    ],
    invalid: [
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid="never-used" />`,
        options: [{testFileGlobs}],
        errors: [{messageId: 'unusedDataTestId', data: {testId: 'never-used'}}],
      },
      {
        filename: '/project/packages/web/src/Component.tsx',
        code: `<div data-testid={"unused2"} />`,
        options: [{testFileGlobs}],
        errors: [{messageId: 'unusedDataTestId', data: {testId: 'unused2'}}],
      },
    ],
  },
);
