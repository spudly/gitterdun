/* eslint-disable max-lines -- config file */
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
// eslint-disable-next-line import/no-namespace -- this is the way
import * as reactHooks from 'eslint-plugin-react-hooks';
import commentsPlugin from 'eslint-plugin-eslint-comments';
import jestPlugin from 'eslint-plugin-jest';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';

const WORKSPACE_ROOT_DIR = dirname(fileURLToPath(import.meta.url));

const eslintConfig = [
  {ignores: ['**/dist/**', '**/build/**', '**/coverage/**', 'node_modules/**']},
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      react: reactPlugin,

      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooks,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- not my types
      comments: commentsPlugin,
      jest: jestPlugin,

      tailwindcss: tailwindcssPlugin,
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.base.json'],
        tsconfigRootDir: WORKSPACE_ROOT_DIR,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    settings: {
      react: {version: 'detect', pragma: 'React'},
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
      propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
    },
    rules: {
      'jsx-a11y/accessible-emoji': 'off',
      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img', 'object', 'area', 'input[type="image"]'],
          img: [],
          object: [],
          area: [],
          'input[type="image"]': [],
        },
      ],
      'jsx-a11y/anchor-has-content': ['error', {components: []}],
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['to'],
          aspects: ['noHref', 'invalidHref', 'preferButton'],
        },
      ],
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': ['error', {ignoreNonDOM: false}],
      'jsx-a11y/aria-unsupported-elements': 'error',
      'arrow-body-style': 'off', // using Prettier for styling
      'arrow-parens': 'off', // using Prettier for styling
      'jsx-a11y/autocomplete-valid': ['off', {inputComponents: []}],
      '@typescript-eslint/brace-style': 'off', // using Prettier for styling
      'brace-style': 'off', // using Prettier for styling
      camelcase: 'off',
      'jsx-a11y/click-events-have-key-events': 'error',
      '@typescript-eslint/comma-dangle': 'off', // using Prettier for styling
      'comma-dangle': 'off', // using Prettier for styling
      '@typescript-eslint/comma-spacing': 'off', // using Prettier for styling
      'comma-spacing': 'off', // using Prettier for styling
      'constructor-super': 'off',
      'jsx-a11y/control-has-associated-label': [
        'error',
        {
          labelAttributes: ['label'],
          controlComponents: [],
          ignoreElements: [
            'audio',
            'canvas',
            'embed',
            'input',
            'textarea',
            'tr',
            'video',
          ],
          ignoreRoles: [
            'grid',
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'row',
            'tablist',
            'toolbar',
            'tree',
            'treegrid',
          ],
          depth: 5,
        },
      ],
      curly: ['warn', 'all'],
      'import/default': 'off',
      '@typescript-eslint/default-param-last': 'error',
      'default-param-last': 'off', //  use @typescript-eslint version instead
      '@typescript-eslint/dot-notation': ['error', {allowKeywords: true}],
      'dot-notation': 'off', //  use @typescript-eslint version instead
      'import/dynamic-import-chunkname': [
        'off',
        {importFunctions: [], webpackChunknameFormat: '[0-9a-zA-Z-_/.]+'},
      ],
      'react-hooks/exhaustive-deps': 'error',
      'import/export': 'error',
      'import/exports-last': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {js: 'never', mjs: 'never', jsx: 'never', ts: 'never', tsx: 'never'},
      ],
      'import/first': 'error',
      '@typescript-eslint/func-call-spacing': 'off', // using Prettier for styling
      'func-call-spacing': 'off', // using Prettier for styling
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'function-paren-newline': 'off', // using Prettier for styling
      'getter-return': 'off',
      'import/group-exports': 'off',
      'jsx-a11y/heading-has-content': ['error', {components: ['']}],
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'implicit-arrow-linebreak': 'off', // using Prettier for styling
      '@typescript-eslint/indent': 'off', // using Prettier for styling
      indent: 'off', // using Prettier for styling
      'jsx-a11y/interactive-supports-focus': 'error',
      'react/jsx-curly-newline': 'off', // using Prettier for styling
      'react/jsx-filename-extension': [
        'warn',
        {allow: 'as-needed', extensions: ['.tsx']},
      ],
      'react/jsx-first-prop-new-line': 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-wrap-multilines': 'off',
      // Enable to force all UI copy through i18n
      'react/jsx-no-literals': [
        'error',
        {noStrings: true, ignoreProps: true, allowedStrings: ['*', '%']},
      ],
      '@typescript-eslint/keyword-spacing': 'off', // using Prettier for styling
      'keyword-spacing': 'off', // using Prettier for styling
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelComponents: ['Label'],
          labelAttributes: ['htmlFor'],
          controlComponents: ['TextInput', 'SelectInput'],
          assert: 'both',
          depth: 25,
        },
      ],
      'jsx-a11y/label-has-for': [
        'off',
        {
          components: [],
          required: {every: ['nesting', 'id']},
          allowChildren: false,
        },
      ],
      'jsx-a11y/lang': 'error',
      '@typescript-eslint/lines-between-class-members': 'off', // using Prettier for styling
      'lines-between-class-members': 'off', // using Prettier for styling
      'max-len': 'off', // using Prettier for styling
      'jsx-a11y/media-has-caption': [
        'error',
        {audio: [], video: [], track: []},
      ],
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'import/named': 'off',
      'import/namespace': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {selector: 'function', format: ['camelCase', 'PascalCase']},
        {selector: 'typeLike', format: ['PascalCase']},
      ],
      'import/newline-after-import': 'off', // using Prettier for styling
      'newline-per-chained-call': 'off', // using Prettier for styling
      'import/no-absolute-path': 'error',
      'jsx-a11y/no-access-key': 'error',
      'import/no-amd': 'error',
      '@typescript-eslint/no-array-constructor': 'error',
      'no-array-constructor': 'off', //  use @typescript-eslint version instead
      'jsx-a11y/no-autofocus': ['error', {ignoreNonDOM: true}],
      'import/no-commonjs': 'off',
      'no-confusing-arrow': 'off', // using Prettier for styling
      'no-const-assign': 'off',
      'import/no-cycle': ['error', {maxDepth: '∞'}],
      'import/no-default-export': 'off',
      'jsx-a11y/no-distracting-elements': [
        'error',
        {elements: ['marquee', 'blink']},
      ],
      'no-dupe-args': 'off',
      '@typescript-eslint/no-dupe-class-members': 'error',
      'no-dupe-class-members': 'off', //  use @typescript-eslint version instead
      'no-dupe-keys': 'off',
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'error',
      '@typescript-eslint/no-empty-function': [
        'error',
        {allow: ['arrowFunctions', 'functions', 'methods']},
      ],
      'no-empty-function': 'off', //  use @typescript-eslint version instead
      '@typescript-eslint/no-extra-parens': [
        'off',
        'all',
        {
          conditionalAssign: true,
          nestedBinaryExpressions: false,
          returnAssign: false,
          ignoreJSX: 'all',
          enforceForArrowConditionals: false,
        },
      ],
      'no-extra-parens': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      'no-extra-semi': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/test/**',
            '**/tests/**',
            '**/spec/**',
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/test.{js,jsx,ts,tsx}',
            '**/test-*.{js,jsx,ts,tsx}',
            '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}',
            '**/jest.config.{js,jsx,ts,tsx}',
            '**/jest.setup.{js,jsx,ts,tsx}',
            '**/vue.config.{js,jsx,ts,tsx}',
            '**/webpack.config.{js,jsx,ts,tsx}',
            '**/webpack.config.*.{js,jsx,ts,tsx}',
            '**/rollup.config.{js,jsx,ts,tsx}',
            '**/rollup.config.*.{js,jsx,ts,tsx}',
            '**/gulpfile.{js,jsx,ts,tsx}',
            '**/gulpfile.*.{js,jsx,ts,tsx}',
            '**/Gruntfile{,.{js,jsx,ts,tsx}}',
            '**/protractor.conf.{js,jsx,ts,tsx}',
            '**/protractor.conf.*.{js,jsx,ts,tsx}',
            '**/karma.conf.{js,jsx,ts,tsx}',
            '**/.eslintrc.{js,jsx,ts,tsx}',
            '**/*.config.{js,jsx,ts,tsx}',
            '**/*.d.ts',
          ],
          optionalDependencies: false,
        },
      ],
      'no-func-assign': 'off',
      '@typescript-eslint/no-implied-eval': 'error',
      'no-implied-eval': 'off', //  use @typescript-eslint version instead
      'no-import-assign': 'off',
      'import/no-import-module-exports': ['error', {exceptions: []}],
      'jsx-a11y/no-interactive-element-to-noninteractive-role': [
        'error',
        {tr: ['none', 'presentation']},
      ],
      '@typescript-eslint/no-loop-func': ['error'],
      'no-loop-func': 'off', //  use @typescript-eslint version instead
      '@typescript-eslint/no-loss-of-precision': 'error',
      'no-loss-of-precision': 'off', //  use @typescript-eslint version instead
      '@typescript-eslint/no-magic-numbers': [
        'off',
        {
          ignore: [],
          ignoreArrayIndexes: false,
          enforceConst: true,
          detectObjects: true,
        },
      ],
      'no-magic-numbers': 'off',
      'no-multiple-empty-lines': 'off', // using Prettier for styling
      'import/no-named-as-default-member': 'off',
      'import/no-named-default': 'error',
      'import/no-named-export': 'off',
      'no-nested-ternary': 'off',
      'no-new-func': 'off',
      'no-new-symbol': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
        },
      ],
      'jsx-a11y/no-noninteractive-element-to-interactive-role': [
        'error',
        {
          ul: [
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'tablist',
            'tree',
            'treegrid',
          ],
          ol: [
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'tablist',
            'tree',
            'treegrid',
          ],
          li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
          table: ['grid'],
          td: ['gridcell'],
        },
      ],
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        {tags: [], roles: ['tabpanel']},
      ],
      'no-obj-calls': 'off',
      'jsx-a11y/no-onchange': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-redeclare': 'off', //  use @typescript-eslint version instead
      'jsx-a11y/no-redundant-roles': 'error',
      'import/no-relative-packages': 'error',
      'import/no-relative-parent-imports': 'off',
      'no-return-await': 'off',
      'import/no-self-import': 'error',
      'no-setter-return': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-shadow': 'off', //  use @typescript-eslint version instead
      'jsx-a11y/no-static-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
        },
      ],
      'no-this-before-super': 'off',
      'no-throw-literal': 'off',
      'no-trailing-spaces': 'off', // using Prettier for styling
      'import/no-unassigned-import': 'off',
      'no-undef': 'off',
      'no-underscore-dangle': 'off',
      'no-unreachable': 'off',
      'import/no-unresolved': 'off',
      'no-unsafe-negation': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      'no-unused-expressions': 'off', //  use @typescript-eslint version instead
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
      'no-unused-vars': 'off', //  use @typescript-eslint version instead
      '@typescript-eslint/no-use-before-define': [
        'error',
        {functions: true, classes: true, variables: true},
      ],
      'no-use-before-define': 'off', //  use @typescript-eslint version instead
      '@typescript-eslint/no-useless-constructor': 'error',
      'no-useless-constructor': 'off', //  use @typescript-eslint version instead
      'import/no-useless-path-segments': ['error', {commonjs: true}],
      'import/no-webpack-loader-syntax': 'error',
      'nonblock-statement-body-position': 'off', // using Prettier for styling
      'object-curly-newline': 'off', // using Prettier for styling
      '@typescript-eslint/object-curly-spacing': 'off', // using Prettier for styling
      'object-curly-spacing': 'off', // using Prettier for styling
      'operator-linebreak': 'off', // using Prettier for styling
      'import/order': 'off', // using Prettier for styling
      'import/prefer-default-export': 'off',
      '@typescript-eslint/quotes': 'off', // using Prettier for styling
      quotes: 'off', // using Prettier for styling
      'react-hooks/react-compiler': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/require-await': 'off',
      'require-await': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/return-await': 'off',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'jsx-a11y/scope': 'error',
      '@typescript-eslint/semi': 'off', // using Prettier for styling
      semi: 'off', // using Prettier for styling
      'space-before-blocks': 'off', // using Prettier for styling
      '@typescript-eslint/space-before-function-paren': 'off', // using Prettier for styling
      'space-before-function-paren': 'off', // using Prettier for styling
      '@typescript-eslint/space-infix-ops': 'off', // using Prettier for styling
      'space-infix-ops': 'off', // using Prettier for styling
      strict: ['error', 'never'],
      'jsx-a11y/tabindex-no-positive': 'error',
      'import/unambiguous': 'off',
      'valid-typeof': 'off',
      // Auto-added: unconfigured plugin rules set to warn
      '@typescript-eslint/adjacent-overload-signatures': 'warn',
      '@typescript-eslint/array-type': [
        'warn',
        {default: 'generic', readonly: 'generic'},
      ],
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/ban-tslint-comment': 'warn',
      '@typescript-eslint/class-literal-property-style': 'warn',
      '@typescript-eslint/class-methods-use-this': 'warn',
      '@typescript-eslint/consistent-generic-constructors': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': 'warn',
      '@typescript-eslint/consistent-return': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off', // sometimes tyepof import() is the best way
      '@typescript-eslint/explicit-function-return-type': 'off', // too verbose
      '@typescript-eslint/explicit-member-accessibility': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off', // too verbose
      '@typescript-eslint/init-declarations': 'off', // typescript makes sure variables are initialized before use
      '@typescript-eslint/max-params': ['warn', {max: 5}],
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/method-signature-style': 'warn',
      '@typescript-eslint/no-array-delete': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-confusing-non-null-assertion': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'warn',
      '@typescript-eslint/no-duplicate-type-constituents': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-extra-non-null-assertion': 'warn',
      '@typescript-eslint/no-extraneous-class': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'warn',
      '@typescript-eslint/no-import-type-side-effects': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-invalid-this': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'warn',
      '@typescript-eslint/no-meaningless-void-operator': 'warn',
      '@typescript-eslint/no-misused-new': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-misused-spread': 'warn',
      '@typescript-eslint/no-mixed-enums': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-restricted-imports': 'warn',
      '@typescript-eslint/no-restricted-types': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'warn',
      '@typescript-eslint/no-unnecessary-qualifier': 'warn',
      '@typescript-eslint/no-unnecessary-template-expression': 'warn',
      '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
      '@typescript-eslint/no-unnecessary-type-conversion': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-declaration-merging': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-type-assertion': 'warn',
      '@typescript-eslint/no-unsafe-unary-minus': 'warn',
      '@typescript-eslint/no-useless-empty-export': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
      '@typescript-eslint/only-throw-error': 'warn',
      '@typescript-eslint/parameter-properties': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/prefer-destructuring': 'warn',
      '@typescript-eslint/prefer-enum-initializers': 'warn',
      '@typescript-eslint/prefer-find': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-literal-enum-member': 'warn',
      '@typescript-eslint/prefer-namespace-keyword': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // makes code too noisy
      '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
      '@typescript-eslint/prefer-regexp-exec': 'warn',
      '@typescript-eslint/prefer-return-this-type': 'warn',
      '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
      '@typescript-eslint/promise-function-async': 'warn',
      '@typescript-eslint/related-getter-setter-pairs': 'warn',
      '@typescript-eslint/require-array-sort-compare': 'warn',
      '@typescript-eslint/restrict-plus-operands': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',
      '@typescript-eslint/triple-slash-reference': 'warn',
      '@typescript-eslint/unbound-method': 'warn',
      '@typescript-eslint/unified-signatures': 'warn',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn',
      'import/consistent-type-specifier-style': 'warn',
      'import/enforce-node-protocol-usage': ['warn', 'always'],
      'import/max-dependencies': ['warn', {max: 20}],
      'import/no-anonymous-default-export': 'warn',
      'import/no-deprecated': 'warn',
      'import/no-empty-named-blocks': 'warn',
      'import/no-internal-modules': 'off', // this one is bizarre
      'import/no-mutable-exports': 'warn',
      'import/no-named-as-default': 'warn',
      'import/no-namespace': 'warn',
      'import/no-nodejs-modules': 'off', // needed for scripts
      'import/no-restricted-paths': 'warn',
      'import/no-unused-modules': 'warn',
      'jsx-a11y/anchor-ambiguous-text': 'warn',
      'jsx-a11y/no-aria-hidden-on-focusable': 'warn',
      'jsx-a11y/prefer-tag-over-role': 'warn',
      'comments/disable-enable-pair': 'warn',
      'comments/no-aggregating-enable': 'warn',
      'comments/no-duplicate-disable': 'warn',
      'comments/no-restricted-disable': 'warn',
      'comments/no-unlimited-disable': 'warn',
      'comments/no-unused-disable': 'warn',
      'comments/no-unused-enable': 'warn',
      'comments/no-use': 'off', // we need to disable for edge cases
      'comments/require-description': ['warn', {ignore: ['eslint-enable']}],
      'react/boolean-prop-naming': 'warn',
      'react/button-has-type': 'warn',
      'react/checked-requires-onchange-or-readonly': 'warn',
      'react/default-props-match-prop-types': 'warn',
      'react/destructuring-assignment': 'warn',
      'react/display-name': 'warn',
      'react/forbid-component-props': [
        'warn',
        {
          forbid: [
            {propName: 'className', allowedFor: ['Link']},
            {propName: 'style', allowedFor: ['Link']},
          ],
        },
      ],
      'react/forbid-dom-props': 'warn',
      'react/forbid-elements': 'warn',
      'react/forbid-foreign-prop-types': 'warn',
      'react/forbid-prop-types': 'warn',
      'react/forward-ref-uses-ref': 'warn',
      'react/hook-use-state': 'warn',
      'react/iframe-missing-sandbox': 'warn',
      'react/jsx-boolean-value': 'warn',
      'react/jsx-child-element-spacing': 'warn',
      'react/jsx-closing-bracket-location': 'warn',
      'react/jsx-closing-tag-location': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
      'react/jsx-curly-spacing': 'warn',
      'react/jsx-equals-spacing': 'warn',
      'react/jsx-fragments': 'warn',
      'react/jsx-handler-names': 'warn',
      'react/jsx-key': 'warn',
      'react/jsx-max-depth': ['warn', {max: 10}],
      'react/jsx-max-props-per-line': 'off', // use Prettier for styling
      'react/jsx-newline': 'off', // use Prettier for styling
      'react/jsx-no-bind': 'off', // react-compiler handles these types of issues
      'react/jsx-no-comment-textnodes': 'warn',
      'react/jsx-no-constructed-context-values': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-no-leaked-render': 'warn',
      'react/jsx-no-script-url': 'warn',
      'react/jsx-no-target-blank': 'warn',
      'react/jsx-no-undef': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-pascal-case': 'warn',
      'react/jsx-props-no-multi-spaces': 'warn',
      'react/jsx-props-no-spread-multi': 'warn',
      'react/jsx-sort-props': 'warn',
      'react/jsx-tag-spacing': 'warn',
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
      'react/no-access-state-in-setstate': 'warn',
      'react/no-adjacent-inline-elements': 'warn',
      'react/no-array-index-key': 'warn',
      'react/no-arrow-function-lifecycle': 'warn',
      'react/no-children-prop': 'warn',
      'react/no-danger': 'warn',
      'react/no-danger-with-children': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-did-mount-set-state': 'warn',
      'react/no-did-update-set-state': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react/no-find-dom-node': 'warn',
      'react/no-invalid-html-attribute': 'warn',
      'react/no-is-mounted': 'warn',
      'react/no-multi-comp': 'warn',
      'react/no-namespace': 'warn',
      'react/no-object-type-as-default-prop': 'warn',
      'react/no-redundant-should-component-update': 'warn',
      'react/no-render-return-value': 'warn',
      'react/no-set-state': 'warn',
      'react/no-string-refs': 'warn',
      'react/no-this-in-sfc': 'warn',
      'react/no-typos': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'warn',
      'react/no-unsafe': 'warn',
      'react/no-unstable-nested-components': 'warn',
      'react/no-unused-class-component-methods': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/no-unused-state': 'warn',
      'react/no-will-update-set-state': 'warn',
      'react/prefer-es6-class': 'warn',
      'react/prefer-exact-props': 'warn',
      'react/prefer-read-only-props': 'off', // noisy
      'react/prefer-stateless-function': 'warn',
      'react/prop-types': 'off', // propTypes are so last decade
      'react/require-optimization': 'warn',
      'react/require-render-return': 'warn',
      'react/self-closing-comp': 'warn',
      'react/sort-comp': 'warn',
      'react/sort-default-props': 'warn',
      'react/sort-prop-types': 'warn',
      'react/state-in-constructor': 'warn',
      'react/static-property-placement': 'warn',
      'react/style-prop-object': 'warn',
      'react/void-dom-elements-no-children': 'warn',
      'accessor-pairs': 'warn',
      'array-callback-return': 'warn',
      'block-scoped-var': 'warn',
      'capitalized-comments': 'off', // use Prettier for styling
      'class-methods-use-this': 'warn',
      complexity: 'warn',
      'consistent-return': 'warn',
      'consistent-this': 'warn',
      'default-case': 'warn',
      'default-case-last': 'warn',
      eqeqeq: ['warn', 'always', {null: 'ignore'}],
      'for-direction': 'warn',
      'func-name-matching': 'warn',
      'func-names': 'warn',
      'func-style': 'warn',
      'grouped-accessor-pairs': 'warn',
      'guard-for-in': 'warn',
      'id-denylist': 'warn',
      'id-length': 'warn',
      'id-match': 'warn',
      'init-declarations': 'off', // typescript makes sure variables are initialized before use
      'line-comment-position': 'off', // use Prettier for styling
      'logical-assignment-operators': 'warn',
      'max-classes-per-file': 'warn',
      'max-depth': 'warn',
      'max-lines': ['warn', 200],
      'max-lines-per-function': 'off', // ['warn', {max: 20, skipBlankLines: true, skipComments: true, IIFEs: true},], // TODO: re-enable
      'max-nested-callbacks': 'warn',
      'max-params': ['warn', {max: 5}],
      'max-statements': ['warn', {max: 20}],
      'multiline-comment-style': 'off', // use Prettier for styling
      'new-cap': 'warn',
      'no-alert': 'warn',
      'no-async-promise-executor': 'warn',
      'no-await-in-loop': 'warn',
      'no-bitwise': 'warn',
      'no-caller': 'warn',
      'no-case-declarations': 'warn',
      'no-class-assign': 'warn',
      'no-compare-neg-zero': 'warn',
      'no-cond-assign': 'warn',
      'no-console': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-constant-condition': 'warn',
      'no-constructor-return': 'warn',
      'no-continue': 'warn',
      'no-control-regex': 'warn',
      'no-debugger': 'warn',
      'no-delete-var': 'warn',
      'no-div-regex': 'warn',
      'no-dupe-else-if': 'warn',
      'no-duplicate-case': 'warn',
      'no-duplicate-imports': 'off', // if we import both a type and a value, we'll get a duplicate import error
      'no-else-return': 'warn',
      'no-empty': 'warn',
      'no-empty-character-class': 'warn',
      'no-empty-pattern': 'warn',
      'no-empty-static-block': 'warn',
      'no-eq-null': 'off', // allow == and != with null
      'no-undefined': 'off', // prefer undefined over null for TypeScript optional properties
      'no-eval': 'warn',
      'no-ex-assign': 'warn',
      'no-extend-native': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-boolean-cast': 'warn',
      'no-extra-label': 'warn',
      'no-fallthrough': 'warn',
      'no-global-assign': 'warn',
      'no-implicit-coercion': 'warn',
      'no-implicit-globals': 'warn',
      'no-inline-comments': 'off', // use Prettier for styling
      'no-inner-declarations': 'warn',
      'no-invalid-regexp': 'warn',
      'no-invalid-this': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-iterator': 'warn',
      'no-label-var': 'warn',
      'no-labels': 'warn',
      'no-lone-blocks': 'warn',
      'no-lonely-if': 'warn',
      'no-misleading-character-class': 'warn',
      'no-multi-assign': 'warn',
      'no-multi-str': 'warn',
      'no-negated-condition': 'off',
      'no-new': 'warn',
      'no-new-native-nonconstructor': 'warn',
      'no-new-wrappers': 'warn',
      'no-nonoctal-decimal-escape': 'warn',
      'no-object-constructor': 'warn',
      'no-octal': 'warn',
      'no-octal-escape': 'warn',
      'no-param-reassign': 'warn',
      'no-plusplus': 'off', // these are only confusing if you don't know the language
      'no-promise-executor-return': 'warn',
      'no-proto': 'warn',
      'no-prototype-builtins': 'warn',
      'no-regex-spaces': 'warn',
      'no-restricted-exports': 'warn',
      'no-restricted-globals': 'warn',
      'no-restricted-imports': 'warn',
      'no-restricted-properties': 'warn',
      'no-restricted-syntax': 'warn',
      'no-return-assign': 'warn',
      'no-script-url': 'warn',
      'no-self-assign': 'warn',
      'no-self-compare': 'warn',
      'no-sequences': 'warn',
      'no-shadow-restricted-names': 'warn',
      'no-sparse-arrays': 'warn',
      'no-template-curly-in-string': 'warn',
      'no-ternary': 'off',
      'no-undef-init': 'warn',
      'no-unexpected-multiline': 'warn',
      'no-unmodified-loop-condition': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-unreachable-loop': 'warn',
      'no-unsafe-finally': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-unused-labels': 'warn',
      'no-unused-private-class-members': 'warn',
      'no-useless-backreference': 'warn',
      'no-useless-call': 'warn',
      'no-useless-catch': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-rename': 'warn',
      'no-useless-return': 'warn',
      'no-var': 'warn',
      'no-void': 'warn',
      'no-warning-comments': 'off', // TODO: re-enable
      'no-with': 'warn',
      'object-shorthand': 'warn',
      'one-var': 'off', // use Prettier for styling
      'operator-assignment': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-const': 'warn',
      'prefer-destructuring': 'warn',
      'prefer-exponentiation-operator': 'warn',
      'prefer-named-capture-group': 'warn',
      'prefer-numeric-literals': 'warn',
      'prefer-object-has-own': 'warn',
      'prefer-object-spread': 'warn',
      'prefer-promise-reject-errors': 'warn',
      'prefer-regex-literals': 'warn',
      'prefer-rest-params': 'warn',
      'prefer-spread': 'warn',
      'prefer-template': 'warn',
      radix: 'warn',
      'require-atomic-updates': 'warn',
      'require-unicode-regexp': 'off', // almost always unnecessary
      'require-yield': 'warn',
      'sort-imports': 'off', // handled by import/order
      'sort-keys': 'off', // order affects readability. we can always sort on-demand
      'sort-vars': 'off', // order affects readability. we can always sort on-demand
      'symbol-description': 'warn',
      'unicode-bom': 'warn',
      'use-isnan': 'warn',
      'vars-on-top': 'warn',
      yoda: 'warn',
      'jest/consistent-test-it': 'off', // for tests only
      'jest/expect-expect': 'off', // for tests only
      'jest/max-expects': 'off', // for tests only
      'jest/max-nested-describe': 'off', // for tests only
      'jest/no-alias-methods': 'off', // for tests only
      'jest/no-commented-out-tests': 'off', // for tests only
      'jest/no-conditional-expect': 'off', // for tests only
      'jest/no-conditional-in-test': 'off', // for tests only
      'jest/no-confusing-set-timeout': 'off', // for tests only
      'jest/no-deprecated-functions': 'off', // for tests only
      'jest/no-disabled-tests': 'off', // for tests only
      'jest/no-done-callback': 'off', // for tests only
      'jest/no-duplicate-hooks': 'off', // for tests only
      'jest/no-export': 'off', // for tests only
      'jest/no-focused-tests': 'off', // for tests only
      'jest/no-hooks': 'off', // for tests only
      'jest/no-identical-title': 'off', // for tests only
      'jest/no-interpolation-in-snapshots': 'off', // for tests only
      'jest/no-jasmine-globals': 'off', // for tests only
      'jest/no-large-snapshots': 'off', // for tests only
      'jest/no-mocks-import': 'off', // for tests only
      'jest/no-restricted-jest-methods': 'off', // for tests only
      'jest/no-restricted-matchers': 'off', // for tests only
      'jest/no-standalone-expect': 'off', // for tests only
      'jest/no-test-prefixes': 'off', // for tests only
      'jest/no-test-return-statement': 'off', // for tests only
      'jest/no-untyped-mock-factory': 'off', // for tests only
      'jest/padding-around-after-all-blocks': 'off', // for tests only
      'jest/padding-around-after-each-blocks': 'off', // for tests only
      'jest/padding-around-all': 'off', // for tests only
      'jest/padding-around-before-all-blocks': 'off', // for tests only
      'jest/padding-around-before-each-blocks': 'off', // for tests only
      'jest/padding-around-describe-blocks': 'off', // for tests only
      'jest/padding-around-expect-groups': 'off', // for tests only
      'jest/padding-around-test-blocks': 'off', // for tests only
      'jest/prefer-called-with': 'off', // for tests only
      'jest/prefer-comparison-matcher': 'off', // for tests only
      'jest/prefer-each': 'off', // for tests only
      'jest/prefer-ending-with-an-expect': 'off', // for tests only
      'jest/prefer-equality-matcher': 'off', // for tests only
      'jest/prefer-expect-assertions': 'off', // for tests only
      'jest/prefer-expect-resolves': 'off', // for tests only
      'jest/prefer-hooks-in-order': 'off', // for tests only
      'jest/prefer-hooks-on-top': 'off', // for tests only
      'jest/prefer-importing-jest-globals': 'off', // for tests only
      'jest/prefer-jest-mocked': 'off', // for tests only
      'jest/prefer-lowercase-title': 'off', // for tests only
      'jest/prefer-mock-promise-shorthand': 'off', // for tests only
      'jest/prefer-snapshot-hint': 'off', // for tests only
      'jest/prefer-spy-on': 'off', // for tests only
      'jest/prefer-strict-equal': 'off', // for tests only
      'jest/prefer-to-be': 'off', // for tests only
      'jest/prefer-to-contain': 'off', // for tests only
      'jest/prefer-to-have-length': 'off', // for tests only
      'jest/prefer-todo': 'off', // for tests only
      'jest/require-hook': 'off', // for tests only
      'jest/require-to-throw-message': 'off', // for tests only
      'jest/require-top-level-describe': 'off', // for tests only
      'jest/unbound-method': 'off', // for tests only
      'jest/valid-describe-callback': 'off', // for tests only
      'jest/valid-expect': 'off', // for tests only
      'jest/valid-expect-in-promise': 'off', // for tests only
      'jest/valid-title': 'off', // for tests only
      'tailwindcss/classnames-order': 'off', // using prettier-plugin-tailwindcss for this
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/migration-from-tailwind-2': 'warn',
      'tailwindcss/no-arbitrary-value': 'warn',
      'tailwindcss/no-contradicting-classname': 'warn',
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'max-lines-per-function': 'off', // TODO: re-enable this after fixing other issues
    },
  },
  {
    files: ['**/*.demo.tsx'],
    rules: {
      // Allow literal strings in widget demo files
      'react/jsx-no-literals': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      // Allow literal strings in test files
      'react/jsx-no-literals': 'off',
      'import/no-namespace': 'off', // useful for mocking in jest
      '@typescript-eslint/no-non-null-assertion': 'off', // we can be more loose in unit tests
      '@typescript-eslint/no-unsafe-call': 'off', // we can be more loose in unit tests
      'react/no-multi-comp': 'off', // may need to create mini-components in unit tests
      '@typescript-eslint/no-unsafe-member-access': 'off', // we can be more loose in unit tests
      'max-lines': 'off', // test files can be longer for comprehensive coverage
      'max-lines-per-function': 'off', // test describe blocks can have many test cases
      'max-statements': 'off', // test describe blocks can have many test statements
      '@typescript-eslint/no-unsafe-type-assertion': 'off', // we can be more loose in unit tests
      'jest/consistent-test-it': ['warn', {fn: 'test', withinDescribe: 'test'}],
      'jest/expect-expect': 'warn',
      'jest/max-expects': 'off', // more expects is fine by me
      'jest/max-nested-describe': 'warn',
      'jest/no-alias-methods': 'warn',
      'jest/no-commented-out-tests': 'warn',
      'jest/no-conditional-expect': 'warn',
      'jest/no-conditional-in-test': 'warn',
      'jest/no-confusing-set-timeout': 'warn',
      'jest/no-deprecated-functions': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-done-callback': 'warn',
      'jest/no-duplicate-hooks': 'warn',
      'jest/no-export': 'warn',
      'jest/no-focused-tests': 'warn',
      'jest/no-hooks': 'off', // no hooks? but why?
      'jest/no-identical-title': 'warn',
      'jest/no-interpolation-in-snapshots': 'warn',
      'jest/no-jasmine-globals': 'warn',
      'jest/no-large-snapshots': 'warn',
      'jest/no-mocks-import': 'warn',
      'jest/no-restricted-jest-methods': 'warn',
      'jest/no-restricted-matchers': 'warn',
      'jest/no-standalone-expect': 'warn',
      'jest/no-test-prefixes': 'warn',
      'jest/no-test-return-statement': 'warn',
      'jest/no-untyped-mock-factory': 'off', // we can be more loose in unit tests
      'jest/padding-around-after-all-blocks': 'off', // use Prettier for styling
      'jest/padding-around-after-each-blocks': 'off', // use Prettier for styling
      'jest/padding-around-all': 'off', // use Prettier for styling
      'jest/padding-around-before-all-blocks': 'off', // use Prettier for styling
      'jest/padding-around-before-each-blocks': 'off', // use Prettier for styling
      'jest/padding-around-describe-blocks': 'off', // use Prettier for styling
      'jest/padding-around-expect-groups': 'off', // use Prettier for styling
      'jest/padding-around-test-blocks': 'off', // use Prettier for styling
      'jest/prefer-called-with': 'warn',
      'jest/prefer-comparison-matcher': 'warn',
      'jest/prefer-each': 'warn',
      'jest/prefer-ending-with-an-expect': 'off', // false positive when expect is in a loop
      'jest/prefer-equality-matcher': 'warn',
      'jest/prefer-expect-assertions': 'off', // annoying
      'jest/prefer-expect-resolves': 'warn',
      'jest/prefer-hooks-in-order': 'warn',
      'jest/prefer-hooks-on-top': 'warn',
      'jest/prefer-importing-jest-globals': 'warn',
      'jest/prefer-jest-mocked': 'warn',
      'jest/prefer-lowercase-title': 'warn',
      'jest/prefer-mock-promise-shorthand': 'warn',
      'jest/prefer-snapshot-hint': 'warn',
      'jest/prefer-spy-on': 'warn',
      'jest/prefer-strict-equal': 'off', // i like this idea, but toStrictEqual has issues with arrays being created from inside a jest worker, resulting in false positive errors
      'jest/prefer-to-be': 'warn',
      'jest/prefer-to-contain': 'warn',
      'jest/prefer-to-have-length': 'warn',
      'jest/prefer-todo': 'warn',
      'jest/require-hook': 'warn',
      'jest/require-to-throw-message': 'warn',
      'jest/require-top-level-describe': 'warn',
      'jest/unbound-method': 'warn',
      'jest/valid-describe-callback': 'warn',
      'jest/valid-expect': 'warn',
      'jest/valid-expect-in-promise': 'warn',
      'jest/valid-title': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off', // we can be more loose in unit tests
      '@typescript-eslint/no-unsafe-argument': 'off', // we can be more loose in unit tests
      '@typescript-eslint/no-explicit-any': 'off', // we can be more loose in unit tests
    },
  },
];

export default eslintConfig;
/* eslint-enable max-lines */
