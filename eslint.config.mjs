import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';
import bestPractices from 'eslint-config-airbnb-base/rules/best-practices';
import errors from 'eslint-config-airbnb-base/rules/errors';
import es6 from 'eslint-config-airbnb-base/rules/es6';
import imports from 'eslint-config-airbnb-base/rules/imports';
import style from 'eslint-config-airbnb-base/rules/style';
import variables from 'eslint-config-airbnb-base/rules/variables';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import * as reactHooks from 'eslint-plugin-react-hooks';

// TODO: get rid of these
const {rules: baseBestPracticesRules} = bestPractices;
const {rules: baseErrorsRules} = errors;
const {rules: baseES6Rules} = es6;
const {rules: baseImportsRules} = imports;
const {rules: baseStyleRules} = style;
const {rules: baseVariablesRules} = variables;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({baseDirectory: __dirname});

const eslintConfig = [
  ...compat.extends('airbnb'),
  {
    plugins: {'@typescript-eslint': typescriptEslint},
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.base.json'],
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    settings: {
      react: {version: 'detect'},
      'import/resolver': {
        typescript: {project: ['./tsconfig.base.json']},
        node: {extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.d.ts']},
      },
      'import/parsers': {'@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts']},
      'import/extensions': [
        '.mjs',
        '.js',
        '.jsx',
        '.json',
        '.ts',
        '.tsx',
        '.d.ts',
      ],
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    },
    rules: {
      'react/jsx-filename-extension': ['error', {extensions: ['.jsx', '.tsx']}],
      // Replace Airbnb 'brace-style' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/brace-style.md
      'brace-style': 'off',
      // '@typescript-eslint/brace-style': baseStyleRules['brace-style'],

      // Replace Airbnb 'camelcase' rule with '@typescript-eslint/naming-convention'
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
      camelcase: 'off',
      // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
      '@typescript-eslint/naming-convention': [
        'error',
        // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        // Allow camelCase functions (23.2), and PascalCase functions (23.8)
        {selector: 'function', format: ['camelCase', 'PascalCase']},
        // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
        {selector: 'typeLike', format: ['PascalCase']},
      ],

      // Replace Airbnb 'comma-dangle' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-dangle.md
      // The TypeScript version also adds 3 new options, all of which should be set to the same value as the base config
      'comma-dangle': 'off',
      // '@typescript-eslint/comma-dangle': [
      //   baseStyleRules['comma-dangle'][0],
      //   {
      //     // @ts-expect-error -- we're in a js file so we can't just cast this to fix the type
      //     ...baseStyleRules['comma-dangle'][1],
      //     // @ts-expect-error -- we're in a js file so we can't just cast this to fix the type
      //     enums: baseStyleRules['comma-dangle'][1].arrays,
      //     // @ts-expect-error -- we're in a js file so we can't just cast this to fix the type
      //     generics: baseStyleRules['comma-dangle'][1].arrays,
      //     // @ts-expect-error -- we're in a js file so we can't just cast this to fix the type
      //     tuples: baseStyleRules['comma-dangle'][1].arrays,
      //   },
      // ],

      // Replace Airbnb 'comma-spacing' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-spacing.md
      'comma-spacing': 'off',
      // '@typescript-eslint/comma-spacing': baseStyleRules['comma-spacing'],

      // Replace Airbnb 'default-param-last' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/default-param-last.md
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last':
        baseBestPracticesRules['default-param-last'],

      // Replace Airbnb 'dot-notation' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': baseBestPracticesRules['dot-notation'],

      // Replace Airbnb 'func-call-spacing' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/func-call-spacing.md
      'func-call-spacing': 'off',
      // '@typescript-eslint/func-call-spacing':
      //   baseStyleRules['func-call-spacing'],

      // Replace Airbnb 'indent' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
      indent: 'off',
      // '@typescript-eslint/indent': baseStyleRules.indent,

      // Replace Airbnb 'keyword-spacing' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/keyword-spacing.md
      'keyword-spacing': 'off',
      // '@typescript-eslint/keyword-spacing': baseStyleRules['keyword-spacing'],

      // Replace Airbnb 'lines-between-class-members' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/lines-between-class-members.md
      'lines-between-class-members': 'off',
      // '@typescript-eslint/lines-between-class-members':
      //   baseStyleRules['lines-between-class-members'],

      // Replace Airbnb 'no-array-constructor' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor':
        baseStyleRules['no-array-constructor'],

      // Replace Airbnb 'no-dupe-class-members' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members':
        baseES6Rules['no-dupe-class-members'],

      // Replace Airbnb 'no-empty-function' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function':
        baseBestPracticesRules['no-empty-function'],

      // Replace Airbnb 'no-extra-parens' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
      'no-extra-parens': 'off',
      '@typescript-eslint/no-extra-parens': baseErrorsRules['no-extra-parens'],

      // Replace Airbnb 'no-extra-semi' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-semi.md
      'no-extra-semi': 'off',
      // '@typescript-eslint/no-extra-semi': baseErrorsRules['no-extra-semi'],

      // Replace Airbnb 'no-implied-eval' and 'no-new-func' rules with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
      'no-implied-eval': 'off',
      'no-new-func': 'off',
      '@typescript-eslint/no-implied-eval':
        baseBestPracticesRules['no-implied-eval'],

      // Replace Airbnb 'no-loss-of-precision' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loss-of-precision.md
      'no-loss-of-precision': 'off',
      '@typescript-eslint/no-loss-of-precision':
        baseErrorsRules['no-loss-of-precision'],

      // Replace Airbnb 'no-loop-func' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': baseBestPracticesRules['no-loop-func'],

      // Replace Airbnb 'no-magic-numbers' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers':
        baseBestPracticesRules['no-magic-numbers'],

      // Replace Airbnb 'no-redeclare' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': baseBestPracticesRules['no-redeclare'],

      // Replace Airbnb 'no-shadow' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': baseVariablesRules['no-shadow'],

      // Replace Airbnb 'space-before-blocks' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-blocks.md
      'space-before-blocks': 'off',
      // '@typescript-eslint/space-before-blocks':
      //   baseStyleRules['space-before-blocks'],

      // Replace Airbnb 'no-throw-literal' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-throw-literal.md
      'no-throw-literal': 'off',
      // '@typescript-eslint/no-throw-literal':
      //   baseBestPracticesRules['no-throw-literal'],

      // Replace Airbnb 'no-unused-expressions' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions':
        baseBestPracticesRules['no-unused-expressions'],

      // Replace Airbnb 'no-unused-vars' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Replace Airbnb 'no-use-before-define' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define':
        baseVariablesRules['no-use-before-define'],

      // Replace Airbnb 'no-useless-constructor' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor':
        baseES6Rules['no-useless-constructor'],

      // Replace Airbnb 'quotes' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
      quotes: 'off',
      // '@typescript-eslint/quotes': baseStyleRules.quotes,

      // Replace Airbnb 'semi' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
      semi: 'off',
      // '@typescript-eslint/semi': baseStyleRules.semi,

      // Replace Airbnb 'space-before-function-paren' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.md
      'space-before-function-paren': 'off',
      // '@typescript-eslint/space-before-function-paren':
      //   baseStyleRules['space-before-function-paren'],

      // Replace Airbnb 'require-await' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/require-await.md
      'require-await': 'off',
      '@typescript-eslint/require-await':
        baseBestPracticesRules['require-await'],

      // Replace Airbnb 'no-return-await' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
      'no-return-await': 'off',
      '@typescript-eslint/return-await': [
        baseBestPracticesRules['no-return-await'],
        'in-try-catch',
      ],

      // Replace Airbnb 'space-infix-ops' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-infix-ops.md
      'space-infix-ops': 'off',
      // '@typescript-eslint/space-infix-ops': baseStyleRules['space-infix-ops'],

      // Replace Airbnb 'object-curly-spacing' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/object-curly-spacing.md
      'object-curly-spacing': 'off',
      // '@typescript-eslint/object-curly-spacing':
      //   baseStyleRules['object-curly-spacing'],

      // Append 'ts' and 'tsx' to Airbnb 'import/extensions' rule
      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
      'import/extensions': [
        baseImportsRules['import/extensions'][0],
        baseImportsRules['import/extensions'][1],
        {
          // @ts-expect-error -- we're in a js file so we can't just cast this to fix the type
          ...baseImportsRules['import/extensions'][2],
          ts: 'never',
          tsx: 'never',
        },
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/test/**', // tape, common npm pattern
            '**/tests/**', // also common npm pattern
            '**/spec/**', // mocha, rspec-like pattern
            '**/__tests__/**', // jest pattern
            '**/__mocks__/**', // jest pattern
            '**/test.{js,jsx,ts,tsx}', // repos with a single test file
            '**/test-*.{js,jsx,ts,tsx}', // repos with multiple top-level test files
            '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
            '**/jest.config.{js,jsx,ts,tsx}', // jest config
            '**/jest.setup.{js,jsx,ts,tsx}', // jest setup
            '**/vue.config.{js,jsx,ts,tsx}', // vue-cli config
            '**/webpack.config.{js,jsx,ts,tsx}', // webpack config
            '**/webpack.config.*.{js,jsx,ts,tsx}', // webpack config
            '**/rollup.config.{js,jsx,ts,tsx}', // rollup config
            '**/rollup.config.*.{js,jsx,ts,tsx}', // rollup config
            '**/gulpfile.{js,jsx,ts,tsx}', // gulp config
            '**/gulpfile.*.{js,jsx,ts,tsx}', // gulp config
            '**/Gruntfile{,.{js,jsx,ts,tsx}}', // grunt config
            '**/protractor.conf.{js,jsx,ts,tsx}', // protractor config
            '**/protractor.conf.*.{js,jsx,ts,tsx}', // protractor config
            '**/karma.conf.{js,jsx,ts,tsx}', // karma config
            '**/.eslintrc.{js,jsx,ts,tsx}', // eslint config
            '**/*.config.{js,jsx,ts,tsx}', // config files
          ],
          optionalDependencies: false,
        },
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      curly: ['off'],
      'no-nested-ternary': 'off',
      'import/prefer-default-export': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-underscore-dangle': 'off',
      // Project conventions
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'arrow-parens': 'off',
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'arrow-body-style': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-wrap-multilines': 'off',
      'no-multiple-empty-lines': 'off',
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'newline-per-chained-call': 'off',
      'nonblock-statement-body-position': 'off',
      'react/jsx-curly-newline': 'off',
      'no-confusing-arrow': 'off', // not confusing to me
      'import/newline-after-import': 'off',
      'no-trailing-spaces': 'off',
      'react/jsx-first-prop-new-line': 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'max-len': 'off',
    },
  },
  // React Hooks RC + Compiler rule
  reactHooks.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // The following rules are enabled in Airbnb config, but are already checked (more thoroughly) by the TypeScript compiler
      // Some of the rules also fail in TypeScript files, for example: https://github.com/typescript-eslint/typescript-eslint/issues/662#issuecomment-507081586
      // Rules are inspired by: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts
      'constructor-super': 'off',
      'getter-return': 'off',
      'no-const-assign': 'off',
      'no-dupe-args': 'off',
      'no-dupe-class-members': 'off',
      'no-dupe-keys': 'off',
      'no-func-assign': 'off',
      'no-import-assign': 'off',
      'no-new-symbol': 'off',
      'no-obj-calls': 'off',
      'no-redeclare': 'off',
      'no-setter-return': 'off',
      'no-this-before-super': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-unsafe-negation': 'off',
      'valid-typeof': 'off',
      // The following rules are enabled in Airbnb config, but are recommended to be disabled within TypeScript projects
      // See: https://github.com/typescript-eslint/typescript-eslint/blob/13583e65f5973da2a7ae8384493c5e00014db51b/docs/linting/TROUBLESHOOTING.md#eslint-plugin-import
      'import/named': 'off',
      'import/no-named-as-default-member': 'off',
      // Disable `import/no-unresolved`, see README.md for details
      'import/no-unresolved': 'off',
      // Enable React Compiler rule via react-hooks RC
      'react-hooks/react-compiler': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {'no-restricted-syntax': 'off', 'no-await-in-loop': 'off'},
  },
];

export default eslintConfig;