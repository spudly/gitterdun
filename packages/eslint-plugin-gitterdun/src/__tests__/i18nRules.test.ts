import {RuleTester} from 'eslint';
import {rules} from '../index.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {ecmaFeatures: {jsx: true}},
  },
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

// eslint-disable-next-line jest/require-hook -- not following typical jest patterns
ruleTester.run('require-i18n-formatting', rules['require-i18n-formatting'], {
  valid: [
    {
      filename: '/project/packages/web/src/foo.tsx',
      code: `
      import {FormattedMessage} from 'react-intl';
      const descriptor = {defaultMessage: 'Hello', id: 'x.hello'};
      export const A = () => <FormattedMessage {...descriptor} />;
      `,
    },
    {
      filename: '/project/packages/web/src/foo.tsx',
      code: `
      import {useIntl} from 'react-intl';
      const descriptor = {defaultMessage: 'Hello', id: 'x.hello'};
      export const A = () => { const intl = useIntl(); return <div>{intl.formatMessage(descriptor)}</div>; };
      `,
    },
  ],
  invalid: [
    {
      filename: '/project/packages/web/src/foo.tsx',
      code: `
      const descriptor = {defaultMessage: 'Hello', id: 'x.hello'};
      export const A = () => <div>{descriptor.defaultMessage}</div>;
      `,
      errors: [{messageId: 'requireFormatting'}],
    },
    {
      filename: '/project/packages/web/src/foo.tsx',
      code: `
      const descriptor = {defaultMessage: 'Hello', id: 'x.hello'};
      const log = (x) => console.log(x);
      log(descriptor.defaultMessage);
      `,
      errors: [{messageId: 'requireFormatting'}],
    },
  ],
});
