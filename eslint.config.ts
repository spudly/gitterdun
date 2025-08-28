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
import gitterdunPlugin from 'eslint-plugin-gitterdun';
import turboPlugin from 'eslint-plugin-turbo';
import playwrightPlugin from 'eslint-plugin-playwright';
import uiTestingPlugin from 'eslint-plugin-ui-testing';

const WORKSPACE_ROOT_DIR = dirname(fileURLToPath(import.meta.url));

const eslintConfig = [
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'node_modules/**',
      'packages/eslint-plugin-i18n/**',
    ],
  },
  {
    plugins: {
      import: importPlugin,
      react: reactPlugin,

      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooks,

      comments: commentsPlugin,
      jest: jestPlugin,

      tailwindcss: tailwindcssPlugin,
      gitterdun: gitterdunPlugin,
      turbo: turboPlugin,
      playwright: playwrightPlugin,

      'ui-testing': uiTestingPlugin,
    },
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs,mts,cts}'],
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
      // i18n rules are enabled via per-file overrides below
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
      'brace-style': 'off', // using Prettier for styling
      camelcase: 'off',
      'jsx-a11y/click-events-have-key-events': 'error',
      'comma-dangle': 'off', // using Prettier for styling
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
      curly: ['error', 'all'],
      'import/default': 'off',
      'default-param-last': 'off', //  use @typescript-eslint version instead
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
      indent: 'off', // using Prettier for styling
      'jsx-a11y/interactive-supports-focus': 'error',
      'react/jsx-curly-newline': 'off', // using Prettier for styling
      'react/jsx-filename-extension': [
        'error',
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
      // turbo plugin rules as warnings
      'turbo/no-undeclared-env-vars': 'error',
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
      'lines-between-class-members': 'off', // using Prettier for styling
      'max-len': 'off', // using Prettier for styling
      'jsx-a11y/media-has-caption': [
        'error',
        {audio: [], video: [], track: []},
      ],
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/newline-after-import': 'off', // using Prettier for styling
      'newline-per-chained-call': 'off', // using Prettier for styling
      'import/no-absolute-path': 'error',
      'jsx-a11y/no-access-key': 'error',
      'import/no-amd': 'error',
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
      'no-dupe-class-members': 'off', //  use @typescript-eslint version instead
      'no-dupe-keys': 'off',
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'error',
      'no-empty-function': 'off', //  use @typescript-eslint version instead
      'no-extra-parens': 'off',
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
      'no-implied-eval': 'off', //  use @typescript-eslint version instead
      'no-import-assign': 'off',
      'import/no-import-module-exports': ['error', {exceptions: []}],
      'jsx-a11y/no-interactive-element-to-noninteractive-role': [
        'error',
        {tr: ['none', 'presentation']},
      ],
      'no-loop-func': 'off', //  use @typescript-eslint version instead
      'no-loss-of-precision': 'off', //  use @typescript-eslint version instead
      'no-magic-numbers': 'off', //  use @typescript-eslint version instead
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
      'no-redeclare': 'off', //  use @typescript-eslint version instead
      'jsx-a11y/no-redundant-roles': 'error',
      'import/no-relative-packages': 'error',
      'import/no-relative-parent-imports': 'off',
      'no-return-await': 'off',
      'import/no-self-import': 'error',
      'no-setter-return': 'off',
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
      'no-unused-expressions': 'off', //  use @typescript-eslint version instead
      'no-unused-vars': 'off', //  use @typescript-eslint version instead
      'no-use-before-define': 'off', //  use @typescript-eslint version instead
      'no-useless-constructor': 'off', //  use @typescript-eslint version instead
      'import/no-useless-path-segments': ['error', {commonjs: true}],
      'import/no-webpack-loader-syntax': 'error',
      'nonblock-statement-body-position': 'off', // using Prettier for styling
      'object-curly-newline': 'off', // using Prettier for styling
      'object-curly-spacing': 'off', // using Prettier for styling
      'operator-linebreak': 'off', // using Prettier for styling
      'import/order': 'off', // using Prettier for styling
      'import/prefer-default-export': 'off',
      quotes: 'off', // using Prettier for styling
      'react-hooks/react-compiler': 'error',
      'react/react-in-jsx-scope': 'off',
      'require-await': 'off',
      'react/require-default-props': 'off',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'jsx-a11y/scope': 'error',
      semi: 'off', // using Prettier for styling
      'space-before-blocks': 'off', // using Prettier for styling
      'space-before-function-paren': 'off', // using Prettier for styling
      'space-infix-ops': 'off', // using Prettier for styling
      strict: ['error', 'never'],
      'jsx-a11y/tabindex-no-positive': 'error',
      'import/unambiguous': 'off',
      'valid-typeof': 'off',
      'import/consistent-type-specifier-style': 'error',
      'import/enforce-node-protocol-usage': ['error', 'always'],
      'import/max-dependencies': ['error', {max: 20}],
      'import/no-anonymous-default-export': 'error',
      'import/no-deprecated': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/no-internal-modules': 'off', // this one is bizarre
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default': 'error',
      'import/no-namespace': 'error',
      'import/no-nodejs-modules': 'off', // needed for scripts
      'import/no-restricted-paths': 'error',
      'import/no-unused-modules': 'error',
      'jsx-a11y/anchor-ambiguous-text': 'error',
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'jsx-a11y/prefer-tag-over-role': 'error',
      'comments/disable-enable-pair': 'error',
      'comments/no-aggregating-enable': 'error',
      'comments/no-duplicate-disable': 'error',
      'comments/no-restricted-disable': 'error',
      'comments/no-unlimited-disable': 'error',
      'comments/no-unused-disable': 'error',
      'comments/no-unused-enable': 'error',
      'comments/no-use': 'off', // we need to disable for edge cases
      'comments/require-description': ['error', {ignore: ['eslint-enable']}],
      'react/boolean-prop-naming': 'error',
      'react/button-has-type': 'error',
      'react/checked-requires-onchange-or-readonly': 'error',
      'react/default-props-match-prop-types': 'error',
      'react/destructuring-assignment': 'error',
      'react/display-name': 'error',
      'react/forbid-component-props': [
        'error',
        {
          forbid: [
            {propName: 'className', allowedFor: ['Link']},
            {propName: 'style', allowedFor: ['Link']},
          ],
        },
      ],
      'react/forbid-dom-props': 'error',
      'react/forbid-elements': 'error',
      'react/forbid-foreign-prop-types': 'error',
      'react/forbid-prop-types': 'error',
      'react/forward-ref-uses-ref': 'error',
      'react/hook-use-state': 'error',
      'react/iframe-missing-sandbox': 'error',
      'react/jsx-boolean-value': 'error',
      'react/jsx-child-element-spacing': 'error',
      'react/jsx-closing-bracket-location': 'error',
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-curly-brace-presence': 'error',
      'react/jsx-curly-spacing': 'error',
      'react/jsx-equals-spacing': 'error',
      'react/jsx-fragments': 'error',
      'react/jsx-handler-names': 'error',
      'react/jsx-key': 'error',
      'react/jsx-max-depth': ['error', {max: 10}],
      'react/jsx-max-props-per-line': 'off', // use Prettier for styling
      'react/jsx-newline': 'off', // use Prettier for styling
      'react/jsx-no-bind': 'off', // react-compiler handles these types of issues
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-props-no-spread-multi': 'error',
      'react/jsx-sort-props': 'error',
      'react/jsx-tag-spacing': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-access-state-in-setstate': 'error',
      'react/no-adjacent-inline-elements': 'error',
      'react/no-array-index-key': 'error',
      'react/no-arrow-function-lifecycle': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-invalid-html-attribute': 'error',
      'react/no-is-mounted': 'error',
      'react/no-multi-comp': 'error',
      'react/no-namespace': 'error',
      'react/no-object-type-as-default-prop': 'error',
      'react/no-redundant-should-component-update': 'error',
      'react/no-render-return-value': 'error',
      'react/no-set-state': 'error',
      'react/no-string-refs': 'error',
      'react/no-this-in-sfc': 'error',
      'react/no-typos': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/no-unused-class-component-methods': 'error',
      'react/no-unused-prop-types': 'error',
      'react/no-unused-state': 'error',
      'react/no-will-update-set-state': 'error',
      'react/prefer-es6-class': 'error',
      'react/prefer-exact-props': 'error',
      'react/prefer-read-only-props': 'off', // noisy
      'react/prefer-stateless-function': 'error',
      'react/prop-types': 'off', // propTypes are so last decade
      'react/require-optimization': 'error',
      'react/require-render-return': 'error',
      'react/self-closing-comp': 'error',
      'react/sort-comp': 'error',
      'react/sort-default-props': 'error',
      'react/sort-prop-types': 'error',
      'react/state-in-constructor': 'error',
      'react/static-property-placement': 'error',
      'react/style-prop-object': 'error',
      'react/void-dom-elements-no-children': 'error',
      'accessor-pairs': 'error',
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'capitalized-comments': 'off', // use Prettier for styling
      'class-methods-use-this': 'error',
      complexity: 'error',
      'consistent-return': 'error',
      'consistent-this': 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      eqeqeq: ['error', 'always', {null: 'ignore'}],
      'for-direction': 'error',
      'func-name-matching': 'error',
      'func-names': 'error',
      'func-style': 'error',
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'error',
      'id-denylist': 'error',
      'id-length': 'error',
      'id-match': 'error',
      'init-declarations': 'off', // typescript makes sure variables are initialized before use
      'line-comment-position': 'off', // use Prettier for styling
      'logical-assignment-operators': 'error',
      'max-classes-per-file': 'error',
      'max-depth': 'error',
      'max-lines': ['error', 200],
      'max-lines-per-function': 'off', // ['error', {max: 20, skipBlankLines: true, skipComments: true, IIFEs: true},], // TODO: re-enable
      'max-nested-callbacks': 'error',
      'max-params': ['error', {max: 5}],
      'max-statements': ['error', {max: 20}],
      'multiline-comment-style': 'off', // use Prettier for styling
      'new-cap': 'error',
      'no-alert': 'error',
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-console': 'error',
      'no-constant-binary-expression': 'error',
      'no-constant-condition': 'error',
      'no-constructor-return': 'error',
      'no-continue': 'off', // comes in handy
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-div-regex': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'off', // if we import both a type and a value, we'll get a duplicate import error
      'no-else-return': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-empty-static-block': 'error',
      'no-eq-null': 'off', // allow == and != with null
      'no-undefined': 'off', // prefer undefined over null for TypeScript optional properties
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-label': 'error',
      'no-fallthrough': 'error',
      'no-global-assign': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-inline-comments': 'off', // use Prettier for styling
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-invalid-this': 'error',
      'no-irregular-whitespace': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-misleading-character-class': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-negated-condition': 'off',
      'no-new': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-new-wrappers': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-object-constructor': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-plusplus': 'off', // these are only confusing if you don't know the language
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-prototype-builtins': 'error',
      'no-regex-spaces': 'error',
      'no-restricted-exports': 'error',
      'no-restricted-globals': 'error',
      'no-restricted-imports': 'error',
      'no-restricted-properties': 'error',
      'no-restricted-syntax': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-ternary': 'off',
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unused-labels': 'error',
      'no-unused-private-class-members': 'error',
      'no-useless-backreference': 'error',
      'no-useless-call': 'error',
      'no-useless-catch': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'no-warning-comments': 'off', // TODO: re-enable
      'no-with': 'error',
      'object-shorthand': 'error',
      'one-var': 'off', // use Prettier for styling
      'operator-assignment': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      radix: 'error',
      'require-atomic-updates': 'error',
      'require-unicode-regexp': 'off', // almost always unnecessary
      'require-yield': 'error',
      'sort-imports': 'off', // handled by import/order
      'sort-keys': 'off', // order affects readability. we can always sort on-demand
      'sort-vars': 'off', // order affects readability. we can always sort on-demand
      'symbol-description': 'error',
      'unicode-bom': 'error',
      'use-isnan': 'error',
      'vars-on-top': 'error',
      yoda: 'error',
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
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'error',
      'tailwindcss/no-arbitrary-value': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      'gitterdun/no-tailwind-margins': 'error',
      'playwright/expect-expect': 'off', // enabled later in this file, only for e2e tests
      'playwright/max-expects': 'off', // enabled later in this file, only for e2e tests
      'playwright/max-nested-describe': 'off', // enabled later in this file, only for e2e tests
      'playwright/missing-playwright-await': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-commented-out-tests': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-conditional-expect': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-conditional-in-test': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-duplicate-hooks': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-element-handle': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-eval': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-focused-test': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-force-option': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-get-by-title': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-hooks': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-nested-step': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-networkidle': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-nth-methods': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-page-pause': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-raw-locators': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-restricted-matchers': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-skipped-test': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-standalone-expect': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-unsafe-references': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-useless-await': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-useless-not': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-wait-for-selector': 'off', // enabled later in this file, only for e2e tests
      'playwright/no-wait-for-timeout': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-comparison-matcher': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-equality-matcher': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-hooks-in-order': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-hooks-on-top': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-lowercase-title': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-native-locators': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-locator': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-strict-equal': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-to-be': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-to-contain': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-to-have-count': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-to-have-length': 'off', // enabled later in this file, only for e2e tests
      'playwright/prefer-web-first-assertions': 'off', // enabled later in this file, only for e2e tests
      'playwright/require-hook': 'off', // enabled later in this file, only for e2e tests
      'playwright/require-soft-assertions': 'off', // enabled later in this file, only for e2e tests
      'playwright/require-to-throw-message': 'off', // enabled later in this file, only for e2e tests
      'playwright/require-top-level-describe': 'off', // enabled later in this file, only for e2e tests
      'playwright/valid-describe-callback': 'off', // enabled later in this file, only for e2e tests
      'playwright/valid-expect-in-promise': 'off', // enabled later in this file, only for e2e tests
      'playwright/valid-expect': 'off', // enabled later in this file, only for e2e tests
      'playwright/valid-title': 'off', // enabled later in this file, only for e2e tests
      'ui-testing/missing-assertion-in-test': 'off', // enabled later in this file, only for e2e tests
      'ui-testing/no-assertions-in-hooks': 'off', // enabled later in this file, only for e2e tests
      'ui-testing/no-browser-commands-in-tests': 'off', // enabled later in this file, only for e2e tests
      'ui-testing/no-css-page-layout-selector': 'off', // enabled later in this file, only for e2e tests
      'ui-testing/no-disabled-tests': 'off', // enabled later in this file, only for e2e tests
      'ui-testing/no-focused-tests': 'off', // enabled later in this file, only for e2e tests
      'ui-testing/no-hard-wait': 'off', // enabled later in this file, only for e2e tests
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: {'@typescript-eslint': typescriptEslint},
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.base.json'],
        tsconfigRootDir: WORKSPACE_ROOT_DIR,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      '@typescript-eslint/brace-style': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/comma-spacing': 'off',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/dot-notation': ['error', {allowKeywords: true}],
      '@typescript-eslint/func-call-spacing': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/keyword-spacing': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {selector: 'function', format: ['camelCase', 'PascalCase']},
        {selector: 'typeLike', format: ['PascalCase']},
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/no-empty-function': [
        'error',
        {allow: ['arrowFunctions', 'functions', 'methods']},
      ],
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
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-loop-func': ['error'],
      '@typescript-eslint/no-loss-of-precision': 'error',
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, -1, 1],
          ignoreArrayIndexes: false,
          enforceConst: true,
          detectObjects: false,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
        },
      ],
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
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
      '@typescript-eslint/no-use-before-define': [
        'error',
        {functions: true, classes: true, variables: true},
      ],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/object-curly-spacing': 'off',
      '@typescript-eslint/quotes': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/semi': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/space-infix-ops': 'off',
      // Auto-added: unconfigured plugin rules set to warn
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {default: 'generic', readonly: 'generic'},
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/ban-tslint-comment': 'error',
      '@typescript-eslint/class-literal-property-style': 'error',
      '@typescript-eslint/class-methods-use-this': 'error',
      '@typescript-eslint/consistent-generic-constructors': 'error',
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/max-params': ['error', {max: 5}],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-array-delete': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-invalid-this': 'error',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-misused-spread': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-restricted-imports': 'error',
      '@typescript-eslint/no-restricted-types': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-parameter-property-assignment':
        'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unnecessary-type-conversion': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off', // fixing these errors usually makes the code worse
      '@typescript-eslint/no-unsafe-call': 'off', // fixing these errors usually makes the code worse
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-type-assertion': 'off', // fixing these errors usually makes the code worse
      '@typescript-eslint/no-unsafe-unary-minus': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/parameter-properties': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-destructuring': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/prefer-find': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-literal-enum-member': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/related-getter-setter-pairs': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'max-lines-per-function': 'off', // TODO: re-enable this after fixing other issues
      'gitterdun/require-i18n-formatting': 'error',
    },
  },
  {
    files: ['**/messages/*.ts'],
    ignores: ['**/messages/index.ts'],
    rules: {
      'gitterdun/no-missing-i18n-messages': [
        'error',
        {enPath: 'packages/web/src/i18n/extracted/en.json'},
      ],
      'gitterdun/no-extra-i18n-messages': [
        'error',
        {enPath: 'packages/web/src/i18n/extracted/en.json'},
      ],
      'import/no-anonymous-default-export': 'off',
    },
  },
  {
    files: ['**/*.demo.tsx', '**/widgets/demo-utils/**'],
    rules: {
      // Allow literal strings in widget demo files
      'react/jsx-no-literals': 'off',
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test/**',
      '**/jest.setup.ts',
      '**/tests/**',
    ],
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
      'jest/consistent-test-it': [
        'error',
        {fn: 'test', withinDescribe: 'test'},
      ],
      'jest/expect-expect': 'error',
      'jest/max-expects': 'off', // more expects is fine by me
      'jest/max-nested-describe': 'error',
      'jest/no-alias-methods': 'error',
      'jest/no-commented-out-tests': 'error',
      'jest/no-conditional-expect': 'error',
      'jest/no-conditional-in-test': 'error',
      'jest/no-confusing-set-timeout': 'error',
      'jest/no-deprecated-functions': 'error',
      'jest/no-disabled-tests': 'error',
      'jest/no-done-callback': 'error',
      'jest/no-duplicate-hooks': 'error',
      'jest/no-export': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-hooks': 'off', // no hooks? but why?
      'jest/no-identical-title': 'error',
      'jest/no-interpolation-in-snapshots': 'error',
      'jest/no-jasmine-globals': 'error',
      'jest/no-large-snapshots': 'error',
      'jest/no-mocks-import': 'error',
      'jest/no-restricted-jest-methods': 'error',
      'jest/no-restricted-matchers': 'error',
      'jest/no-standalone-expect': 'error',
      'jest/no-test-prefixes': 'error',
      'jest/no-test-return-statement': 'error',
      'jest/no-untyped-mock-factory': 'off', // we can be more loose in unit tests
      'jest/padding-around-after-all-blocks': 'off', // use Prettier for styling
      'jest/padding-around-after-each-blocks': 'off', // use Prettier for styling
      'jest/padding-around-all': 'off', // use Prettier for styling
      'jest/padding-around-before-all-blocks': 'off', // use Prettier for styling
      'jest/padding-around-before-each-blocks': 'off', // use Prettier for styling
      'jest/padding-around-describe-blocks': 'off', // use Prettier for styling
      'jest/padding-around-expect-groups': 'off', // use Prettier for styling
      'jest/padding-around-test-blocks': 'off', // use Prettier for styling
      'jest/prefer-called-with': 'error',
      'jest/prefer-comparison-matcher': 'error',
      'jest/prefer-each': 'error',
      'jest/prefer-ending-with-an-expect': 'off', // false positive when expect is in a loop
      'jest/prefer-equality-matcher': 'error',
      'jest/prefer-expect-assertions': 'off', // annoying
      'jest/prefer-expect-resolves': 'error',
      'jest/prefer-hooks-in-order': 'error',
      'jest/prefer-hooks-on-top': 'error',
      'jest/prefer-importing-jest-globals': 'error',
      'jest/prefer-jest-mocked': 'error',
      'jest/prefer-lowercase-title': 'error',
      'jest/prefer-mock-promise-shorthand': 'error',
      'jest/prefer-snapshot-hint': 'error',
      'jest/prefer-spy-on': 'error',
      'jest/prefer-strict-equal': 'off', // i like this idea, but toStrictEqual has issues with arrays being created from inside a jest worker, resulting in false positive errors
      'jest/prefer-to-be': 'error',
      'jest/prefer-to-contain': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/prefer-todo': 'error',
      'jest/require-hook': 'error',
      'jest/require-to-throw-message': 'error',
      'jest/require-top-level-describe': 'off', // why enforce extra boilerplate?
      'jest/unbound-method': 'error',
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
      'jest/valid-title': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off', // we can be more loose in unit tests
      '@typescript-eslint/no-unsafe-argument': 'off', // we can be more loose in unit tests
      '@typescript-eslint/no-explicit-any': 'off', // we can be more loose in unit tests
      '@typescript-eslint/no-magic-numbers': 'off', // we can be more loose in unit tests
    },
  },
  {files: ['**/scripts/**'], rules: {'no-console': 'off'}},
  {
    files: ['**/*.config.*'],
    rules: {'@typescript-eslint/no-magic-numbers': 'off'},
  },
  {
    files: [
      '**/e2e/**/*.test.ts',
      '**/e2e/**/*.test.tsx',
      '**/e2e/**/*.spec.ts',
      '**/e2e/**/*.spec.tsx',
    ],
    rules: {
      // disable all jest rules for e2e tests
      'jest/consistent-test-it': 'off', // not a jest test
      'jest/expect-expect': 'off', // not a jest test
      'jest/max-expects': 'off', // not a jest test
      'jest/max-nested-describe': 'off', // not a jest test
      'jest/no-alias-methods': 'off', // not a jest test
      'jest/no-commented-out-tests': 'off', // not a jest test
      'jest/no-conditional-expect': 'off', // not a jest test
      'jest/no-conditional-in-test': 'off', // not a jest test
      'jest/no-confusing-set-timeout': 'off', // not a jest test
      'jest/no-deprecated-functions': 'off', // not a jest test
      'jest/no-disabled-tests': 'off', // not a jest test
      'jest/no-done-callback': 'off', // not a jest test
      'jest/no-duplicate-hooks': 'off', // not a jest test
      'jest/no-export': 'off', // not a jest test
      'jest/no-focused-tests': 'off', // not a jest test
      'jest/no-hooks': 'off', // not a jest test
      'jest/no-identical-title': 'off', // not a jest test
      'jest/no-interpolation-in-snapshots': 'off', // not a jest test
      'jest/no-jasmine-globals': 'off', // not a jest test
      'jest/no-large-snapshots': 'off', // not a jest test
      'jest/no-mocks-import': 'off', // not a jest test
      'jest/no-restricted-jest-methods': 'off', // not a jest test
      'jest/no-restricted-matchers': 'off', // not a jest test
      'jest/no-standalone-expect': 'off', // not a jest test
      'jest/no-test-prefixes': 'off', // not a jest test
      'jest/no-test-return-statement': 'off', // not a jest test
      'jest/no-untyped-mock-factory': 'off', // not a jest test
      'jest/padding-around-after-all-blocks': 'off', // not a jest test
      'jest/padding-around-after-each-blocks': 'off', // not a jest test
      'jest/padding-around-all': 'off', // not a jest test
      'jest/padding-around-before-all-blocks': 'off', // not a jest test
      'jest/padding-around-before-each-blocks': 'off', // not a jest test
      'jest/padding-around-describe-blocks': 'off', // not a jest test
      'jest/padding-around-expect-groups': 'off', // not a jest test
      'jest/padding-around-test-blocks': 'off', // not a jest test
      'jest/prefer-called-with': 'off', // not a jest test
      'jest/prefer-comparison-matcher': 'off', // not a jest test
      'jest/prefer-each': 'off', // not a jest test
      'jest/prefer-ending-with-an-expect': 'off', // not a jest test
      'jest/prefer-equality-matcher': 'off', // not a jest test
      'jest/prefer-expect-assertions': 'off', // not a jest test
      'jest/prefer-expect-resolves': 'off', // not a jest test
      'jest/prefer-hooks-in-order': 'off', // not a jest test
      'jest/prefer-hooks-on-top': 'off', // not a jest test
      'jest/prefer-importing-jest-globals': 'off', // not a jest test
      'jest/prefer-jest-mocked': 'off', // not a jest test
      'jest/prefer-lowercase-title': 'off', // not a jest test
      'jest/prefer-mock-promise-shorthand': 'off', // not a jest test
      'jest/prefer-snapshot-hint': 'off', // not a jest test
      'jest/prefer-spy-on': 'off', // not a jest test
      'jest/prefer-strict-equal': 'off', // not a jest test
      'jest/prefer-to-be': 'off', // not a jest test
      'jest/prefer-to-contain': 'off', // not a jest test
      'jest/prefer-to-have-length': 'off', // not a jest test
      'jest/prefer-todo': 'off', // not a jest test
      'jest/require-hook': 'off', // not a jest test
      'jest/require-to-throw-message': 'off', // not a jest test
      'jest/require-top-level-describe': 'off', // not a jest test
      'jest/unbound-method': 'off', // not a jest test
      'jest/valid-describe-callback': 'off', // not a jest test
      'jest/valid-expect-in-promise': 'off', // not a jest test
      'jest/valid-expect': 'off', // not a jest test
      'jest/valid-title': 'off', // not a jest test
      'playwright/expect-expect': 'error',
      'playwright/max-expects': 'error',
      'playwright/max-nested-describe': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-commented-out-tests': 'error',
      'playwright/no-conditional-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-duplicate-hooks': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-get-by-title': 'error',
      'playwright/no-hooks': 'error',
      'playwright/no-nested-step': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-nth-methods': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-raw-locators': 'error',
      'playwright/no-restricted-matchers': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-standalone-expect': 'error',
      'playwright/no-unsafe-references': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/no-wait-for-selector': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/prefer-comparison-matcher': 'error',
      'playwright/prefer-equality-matcher': 'error',
      'playwright/prefer-hooks-in-order': 'error',
      'playwright/prefer-hooks-on-top': 'error',
      'playwright/prefer-lowercase-title': 'error',
      'playwright/prefer-native-locators': 'error',
      'playwright/prefer-locator': 'error',
      'playwright/prefer-strict-equal': 'error',
      'playwright/prefer-to-be': 'error',
      'playwright/prefer-to-contain': 'error',
      'playwright/prefer-to-have-count': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/require-hook': 'error',
      'playwright/require-soft-assertions': 'error',
      'playwright/require-to-throw-message': 'error',
      'playwright/require-top-level-describe': 'error',
      'playwright/valid-describe-callback': 'error',
      'playwright/valid-expect-in-promise': 'error',
      'playwright/valid-expect': 'error',
      'playwright/valid-title': 'error',
      'ui-testing/missing-assertion-in-test': 'error',
      'ui-testing/no-assertions-in-hooks': 'error',
      'ui-testing/no-browser-commands-in-tests': ['error', 'playwright'],
      'ui-testing/no-css-page-layout-selector': ['error', 'playwright'],
      'ui-testing/no-disabled-tests': 'error',
      'ui-testing/no-focused-tests': 'error',
      'ui-testing/no-hard-wait': ['error', 'playwright'],
    },
  },
];

export default eslintConfig;
/* eslint-enable max-lines */
