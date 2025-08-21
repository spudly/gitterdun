import {RuleTester} from 'eslint';
import {rules} from '../index.js';

const ruleTester = new RuleTester({
  languageOptions: {ecmaVersion: 2022, sourceType: 'module'},
});

// eslint-disable-next-line jest/require-hook -- not following typical jest patterns
ruleTester.run('no-missing-i18n-messages', rules['no-missing-i18n-messages'], {
  valid: [
    {
      filename: '/any/other/path/foo.ts',
      code: 'export const x = 1;',
      options: [{enPath: 'packages/web/src/i18n/extracted/en.json'}],
    },
  ],
  invalid: [],
});

// eslint-disable-next-line jest/require-hook -- not following typical jest patterns
ruleTester.run('no-extra-i18n-messages', rules['no-extra-i18n-messages'], {
  valid: [
    {
      filename: '/any/other/path/foo.ts',
      code: 'export const x = 1;',
      options: [{enPath: 'packages/web/src/i18n/extracted/en.json'}],
    },
  ],
  invalid: [],
});
