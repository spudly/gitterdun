/* eslint sort-keys: "error" -- normally this is disabled but for eslint rules we need to be able to find stuff */
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
// eslint-disable-next-line import/no-namespace -- this is the way
import * as importPlugin from 'eslint-plugin-import';
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
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import {Linter, ESLint} from 'eslint';
import type {SetRequired} from 'type-fest';
// eslint-disable-next-line import/no-namespace -- this is the way
import * as reactCompilerPlugin from 'eslint-plugin-react-compiler';

const WORKSPACE_ROOT_DIR = dirname(fileURLToPath(import.meta.url));

type SeverityFn = (groupName: GroupName) => Linter.RuleSeverity | null;

type MyRuleSeverity = Linter.RuleSeverity | SeverityFn;

type MyRuleSeverityAndOptions<Options extends Array<any> = Array<any>> = [
  MyRuleSeverity,
  ...Partial<Options>,
];

type MyRuleEntry<Options extends Array<any> = Array<any>> =
  | MyRuleSeverity
  | MyRuleSeverityAndOptions<Options>;

const severityFor =
  (severity: Linter.RuleSeverity) =>
  (...groupNames: Array<GroupName>): SeverityFn =>
  groupName =>
    groupNames.includes(groupName) ? severity : null;

const errorFor = severityFor('error');
// @ts-expect-error -- will use later
const warnFor = severityFor('warn'); // eslint-disable-line ts/no-unused-vars -- will use later
const offFor = severityFor('off');

const composeSeverity =
  (includeFn: SeverityFn, excludeFn: SeverityFn): SeverityFn =>
  groupName => {
    // TODO: this is confusing. we need to handle upgrading severity (off => warn => error)
    const isExcluded = excludeFn(groupName);
    if (isExcluded != null) {
      return isExcluded;
    }
    // TODO: this is confusing. we need to handle downgrading severity (error => warn => off)
    const isIncluded = includeFn(groupName);
    if (isIncluded != null) {
      return isIncluded;
    }
    return null;
  };

type MyRules = Record<string, MyRuleEntry>;

export const PLUGINS = {
  'comments': commentsPlugin,
  'gitterdun': gitterdunPlugin,
  'import': importPlugin,
  'jest': jestPlugin,
  'jest-dom': jestDomPlugin,
  'jsx-a11y': jsxA11yPlugin,
  'playwright': playwrightPlugin,
  'react': reactPlugin,
  'react-compiler': reactCompilerPlugin,
  'react-hooks': reactHooks,
  'tailwindcss': tailwindcssPlugin,
  'testing-library': testingLibraryPlugin,
  'ts': typescriptEslint as unknown as ESLint.Plugin, // plugin has bad types
  'turbo': turboPlugin as unknown as ESLint.Plugin, // plugin has bad types
  'ui-testing': uiTestingPlugin,
} as const satisfies Record<string, ESLint.Plugin>;

type PluginName = keyof typeof PLUGINS;

const JAVASCRIPT_EXTENSIONS = ['js', 'cjs', 'mjs'];
const TYPESCRIPT_EXTENSIONS = ['ts', 'tsx', 'mts', 'cts', 'd.ts'];

const REACT_EXTENSIONS = ['tsx', 'jsx'];

const unique = <T>(array: Array<T>): Array<T> => [...new Set(array)];

const EXTENSIONS = unique([
  ...JAVASCRIPT_EXTENSIONS,
  ...TYPESCRIPT_EXTENSIONS,
  ...REACT_EXTENSIONS,
]);
const extensionsGlob = (extensions: Array<string> = EXTENSIONS) =>
  `{${extensions.join(',')}}`;

type Group = SetRequired<
  Pick<Linter.Config, 'files' | 'ignores' | 'languageOptions' | 'settings'>,
  'files'
>;

const withLeadingDot = (ext: string) => `.${ext}`;

const GROUPS = {
  all: {
    files: [`**/*.${extensionsGlob()}`],
    settings: {
      'import/extensions': JAVASCRIPT_EXTENSIONS.map(withLeadingDot),
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
      'import/resolver': {
        node: {extensions: JAVASCRIPT_EXTENSIONS.map(withLeadingDot)},
        typescript: {project: ['./tsconfig.base.json']},
      },
      'propWrapperFunctions': ['forbidExtraProps', 'exact', 'Object.freeze'],
    },
  },
  configs: {files: [`**/*.config.*`]},
  demos: {files: [`**/*.demo.${extensionsGlob()}`, '**/widgets/demo-utils/**']},
  e2eTests: {
    files: [
      `**/e2e/**/*.{test,spec}.${extensionsGlob()}`,
      '**/e2e/{test,tests,__test__,__tests__}/**/*',
    ],
  },
  eslintRules: {files: [`**/eslint-plugin-gitterdun/**`]},
  javascript: {files: [`**/*.${extensionsGlob(JAVASCRIPT_EXTENSIONS)}`]},
  react: {
    files: [`**/*.${extensionsGlob(REACT_EXTENSIONS)}`],
    settings: {react: {pragma: 'React', version: 'detect'}},
  },
  scripts: {files: [`**/scripts/**`]},
  tests: {
    files: [
      `**/*.{test,spec}.${extensionsGlob()}`, // test files
      '**/{test,tests,__test__,__tests__}/**', // files in test folders
      '**/jest.*', // jest config files
    ],
    ignores: ['**/e2e/**'],
  },
  translations: {
    files: [`**/messages/*.${extensionsGlob()}`],
    ignores: [`**/messages/index.${extensionsGlob()}`],
  },
  typescript: {
    files: [`**/*.${extensionsGlob(TYPESCRIPT_EXTENSIONS)}`],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.base.json'],
        tsconfigRootDir: WORKSPACE_ROOT_DIR,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    settings: {
      'import/extensions': EXTENSIONS.map(withLeadingDot),
      'import/parsers': {
        '@typescript-eslint/parser': TYPESCRIPT_EXTENSIONS.map(withLeadingDot),
      },
      'import/resolver': {
        node: {extensions: EXTENSIONS.map(ext => `.${ext}`)},
        typescript: {project: ['./tsconfig.base.json']},
      },
    },
  },
} as const satisfies Record<string, Group>;

type GroupName = keyof typeof GROUPS;

const isValidPluginName = (name: unknown): name is PluginName =>
  typeof name === 'string' && name in PLUGINS;

const resolveGroupPlugins = (
  rules: MyRules,
): Record<PluginName, ESLint.Plugin> => {
  return Object.keys(rules).reduce<Record<PluginName, ESLint.Plugin>>(
    (acc, ruleName) => {
      const [pluginPart, rulePart] = ruleName.split('/');

      if (
        rulePart != null
        && isValidPluginName(pluginPart)
        && !(pluginPart in acc)
      ) {
        acc[pluginPart] = PLUGINS[pluginPart];
      }

      return acc;
    },
    {} as Record<PluginName, ESLint.Plugin>,
  );
};

const resolveEntrySeverity = (
  entry: MyRuleEntry,
  groupName: GroupName,
): Linter.RuleSeverity | null => {
  if (typeof entry === 'function') {
    return entry(groupName);
  }
  if (Array.isArray(entry)) {
    if (typeof entry[0] === 'function') {
      return entry[0](groupName);
    }

    return entry[0];
  }

  return entry;
};

const resolveEntry = (
  entry: MyRuleEntry,
  groupName: GroupName,
): Linter.RuleEntry | null => {
  const resolvedSeverity = resolveEntrySeverity(entry, groupName);

  if (resolvedSeverity == null) {
    return null;
  }

  if (Array.isArray(entry)) {
    return [resolvedSeverity, ...entry.slice(1)];
  }

  return resolvedSeverity;
};

const resolveGroupRules = (
  rules: MyRules,
  groupName: GroupName,
  severityPredicate: 'off' | 'warn' | 'error',
) =>
  Object.entries(rules).reduce<Record<string, Linter.RuleEntry>>(
    (acc, [ruleName, ruleEntry]) => {
      const resolvedEntry = resolveEntry(ruleEntry, groupName);
      if (resolvedEntry == null) {
        return acc;
      }
      const severity = resolveEntrySeverity(resolvedEntry, groupName);
      if (severity !== severityPredicate) {
        return acc;
      }
      return {...acc, [ruleName]: resolvedEntry};
    },
    {},
  );

const resolveConfigs = (rules: MyRules): Array<Linter.Config> =>
  (['error', 'warn', 'off'] as const).flatMap(type =>
    (Object.entries(GROUPS) as Array<[GroupName, Group]>).map(
      ([groupName, group]) => {
        return {
          files: group.files,
          ignores: group.ignores ?? [],
          languageOptions: group.languageOptions ?? {},
          plugins: resolveGroupPlugins(rules),
          rules: resolveGroupRules(rules, groupName, type),
          settings: group.settings ?? {},
        };
      },
    ),
  );

export const RULES: MyRules = {
  'accessor-pairs': 'error',
  'array-callback-return': 'error',
  'arrow-body-style': 'off', // using Prettier for styling
  'block-scoped-var': 'error',
  'camelcase': 'off',
  'capitalized-comments': 'off', // use Prettier for styling
  'class-methods-use-this': 'error',
  'comments/disable-enable-pair': 'error',
  'comments/no-aggregating-enable': 'error',
  'comments/no-duplicate-disable': 'error',
  'comments/no-restricted-disable': 'error',
  'comments/no-unlimited-disable': 'error',
  'comments/no-unused-disable': 'error',
  'comments/no-unused-enable': 'error',
  'comments/no-use': 'off', // we need to disable for edge cases
  'comments/require-description': ['error', {ignore: ['eslint-enable']}],
  'complexity': 'error',
  'consistent-return': 'error',
  'consistent-this': 'error',
  'constructor-super': 'off',
  'curly': ['error', 'all'],
  'default-case': 'error',
  'default-case-last': 'error',
  'default-param-last': composeSeverity(errorFor('all'), offFor('typescript')),
  'dot-notation': composeSeverity(errorFor('all'), offFor('typescript')),
  'eqeqeq': ['error', 'always', {null: 'ignore'}],
  'for-direction': 'error',
  'func-name-matching': 'error',
  'func-names': 'error',
  'func-style': 'error',
  'getter-return': 'off',
  'gitterdun/no-extra-i18n-messages': [
    composeSeverity(errorFor('translations'), offFor('tests')),
    {enPath: 'packages/web/src/i18n/extracted/en.json'},
  ],
  'gitterdun/no-missing-i18n-messages': [
    composeSeverity(errorFor('translations'), offFor('tests')),
    {enPath: 'packages/web/src/i18n/extracted/en.json'},
  ],
  'gitterdun/no-tailwind-margins': composeSeverity(
    errorFor('all'),
    offFor('tests'),
  ),
  'gitterdun/no-unused-data-testid': [
    'error',
    {
      testFileGlobs: [
        'packages/web/src/**/*.{test,spec}.{ts,tsx}',
        'packages/shared/src/**/*.{test,spec}.{ts,tsx}',
        'packages/api/src/**/*.{test,spec}.{ts,tsx}',
        'packages/e2e/tests/**/*.{ts,tsx}',
      ],
    },
  ],
  'gitterdun/require-i18n-formatting': errorFor('react'),
  // Enforce promise-suffix only where TS types are available
  'gitterdun/require-promise-suffix-on-unawaited': errorFor('typescript'),
  'grouped-accessor-pairs': 'error',
  'guard-for-in': 'error',
  'id-denylist': 'error',
  'id-length': 'error',
  'id-match': 'error',
  'import/consistent-type-specifier-style': 'error',
  'import/default': 'off',
  'import/dynamic-import-chunkname': [
    'off',
    {importFunctions: [], webpackChunknameFormat: '[0-9a-zA-Z-_/.]+'},
  ],
  'import/enforce-node-protocol-usage': ['error', 'always'],
  'import/export': 'error',
  'import/exports-last': 'off',
  'import/extensions': [
    composeSeverity(errorFor('all'), offFor('scripts', 'configs')),
    'ignorePackages',
    EXTENSIONS.reduce<Record<string, 'never'>>((acc, ext) => {
      return {...acc, [ext]: 'never'};
    }, {}),
  ],
  'import/first': 'error',
  'import/group-exports': 'off',
  'import/max-dependencies': ['error', {max: 20}],
  'import/named': 'off',
  'import/namespace': 'off',
  'import/newline-after-import': 'off', // using Prettier for styling
  'import/no-absolute-path': 'error',
  'import/no-amd': 'error',
  'import/no-anonymous-default-export': composeSeverity(
    errorFor('all'),
    offFor('translations'),
  ),
  'import/no-commonjs': 'off',
  'import/no-cycle': ['error', {maxDepth: '∞'}],
  'import/no-default-export': 'off',
  'import/no-deprecated': 'error',
  'import/no-duplicates': 'error',
  'import/no-dynamic-require': 'error',
  'import/no-empty-named-blocks': 'error',
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: [
        '**/{test,tests,spec,specs,__mocks__,__tests__}/**',
        `**/*.{test,spec}.${extensionsGlob()}`,
        `**/*.{config,conf}.${extensionsGlob()}`,
        '**/jest.*',
        `**/.*rc.${extensionsGlob()}`,
        '**/*.d.ts',
        '**/scripts/**',
      ],
      optionalDependencies: false,
    },
  ],
  'import/no-import-module-exports': ['error', {exceptions: []}],
  'import/no-internal-modules': 'off', // this one is bizarre
  'import/no-mutable-exports': 'error',
  'import/no-named-as-default': 'error',
  'import/no-named-as-default-member': 'off',
  'import/no-named-default': 'error',
  'import/no-named-export': 'off',
  'import/no-namespace': composeSeverity(errorFor('all'), offFor('tests')),
  'import/no-nodejs-modules': 'off', // needed for scripts
  'import/no-relative-packages': 'error',
  'import/no-relative-parent-imports': 'off',
  'import/no-restricted-paths': 'error',
  'import/no-self-import': 'error',
  'import/no-unassigned-import': 'off',
  'import/no-unresolved': 'off',
  'import/no-unused-modules': 'error',
  'import/no-useless-path-segments': ['error', {commonjs: true}],
  'import/no-webpack-loader-syntax': 'error',
  'import/order': 'off', // using Prettier for styling
  'import/prefer-default-export': 'off',
  'import/unambiguous': 'off',
  'init-declarations': 'off', // typescript makes sure variables are initialized before use
  'jest-dom/prefer-checked': 'error',
  'jest-dom/prefer-empty': 'error',
  'jest-dom/prefer-enabled-disabled': 'error',
  'jest-dom/prefer-focus': 'error',
  'jest-dom/prefer-in-document': 'error',
  'jest-dom/prefer-required': 'error',
  'jest-dom/prefer-to-have-attribute': 'error',
  'jest-dom/prefer-to-have-class': 'error',
  'jest-dom/prefer-to-have-style': 'error',
  'jest-dom/prefer-to-have-text-content': 'error',
  'jest-dom/prefer-to-have-value': 'error',
  'jest/consistent-test-it': [
    errorFor('tests'),
    {fn: 'test', withinDescribe: 'test'},
  ],
  'jest/expect-expect': errorFor('tests'),
  'jest/max-expects': 'off', // more expects is fine by me
  'jest/max-nested-describe': errorFor('tests'),
  'jest/no-alias-methods': errorFor('tests'),
  'jest/no-commented-out-tests': errorFor('tests'),
  'jest/no-conditional-expect': errorFor('tests'),
  'jest/no-conditional-in-test': errorFor('tests'),
  'jest/no-confusing-set-timeout': errorFor('tests'),
  'jest/no-deprecated-functions': errorFor('tests'),
  'jest/no-disabled-tests': errorFor('tests'),
  'jest/no-done-callback': errorFor('tests'),
  'jest/no-duplicate-hooks': errorFor('tests'),
  'jest/no-export': errorFor('tests'),
  'jest/no-focused-tests': errorFor('tests'),
  'jest/no-hooks': 'off', // no hooks? but why?
  'jest/no-identical-title': errorFor('tests'),
  'jest/no-interpolation-in-snapshots': errorFor('tests'),
  'jest/no-jasmine-globals': errorFor('tests'),
  'jest/no-large-snapshots': errorFor('tests'),
  'jest/no-mocks-import': errorFor('tests'),
  'jest/no-restricted-jest-methods': errorFor('tests'),
  'jest/no-restricted-matchers': errorFor('tests'),
  'jest/no-standalone-expect': errorFor('tests'),
  'jest/no-test-prefixes': errorFor('tests'),
  'jest/no-test-return-statement': errorFor('tests'),
  'jest/no-untyped-mock-factory': 'off', // we can be more loose in unit tests
  'jest/padding-around-after-all-blocks': 'off', // use Prettier for styling
  'jest/padding-around-after-each-blocks': 'off', // use Prettier for styling
  'jest/padding-around-all': 'off', // use Prettier for styling
  'jest/padding-around-before-all-blocks': 'off', // use Prettier for styling
  'jest/padding-around-before-each-blocks': 'off', // use Prettier for styling
  'jest/padding-around-describe-blocks': 'off', // use Prettier for styling
  'jest/padding-around-expect-groups': 'off', // use Prettier for styling
  'jest/padding-around-test-blocks': 'off', // use Prettier for styling
  'jest/prefer-called-with': errorFor('tests'),
  'jest/prefer-comparison-matcher': errorFor('tests'),
  'jest/prefer-each': errorFor('tests'),
  'jest/prefer-ending-with-an-expect': 'off', // false positive when expect is in a loop
  'jest/prefer-equality-matcher': errorFor('tests'),
  'jest/prefer-expect-assertions': 'off', // annoying
  'jest/prefer-expect-resolves': errorFor('tests'),
  'jest/prefer-hooks-in-order': errorFor('tests'),
  'jest/prefer-hooks-on-top': errorFor('tests'),
  'jest/prefer-importing-jest-globals': errorFor('tests'),
  'jest/prefer-jest-mocked': errorFor('tests'),
  'jest/prefer-lowercase-title': errorFor('tests'),
  'jest/prefer-mock-promise-shorthand': errorFor('tests'),
  'jest/prefer-snapshot-hint': errorFor('tests'),
  'jest/prefer-spy-on': errorFor('tests'),
  'jest/prefer-strict-equal': 'off', // i like this idea, but toStrictEqual has issues with arrays being created from inside a jest worker, resulting in false positive errors
  'jest/prefer-to-be': errorFor('tests'),
  'jest/prefer-to-contain': errorFor('tests'),
  'jest/prefer-to-have-length': errorFor('tests'),
  'jest/prefer-todo': errorFor('tests'),
  'jest/require-hook': composeSeverity(errorFor('tests'), offFor('e2eTests')),
  'jest/require-to-throw-message': errorFor('tests'),
  'jest/require-top-level-describe': 'off', // why enforce extra boilerplate?
  'jest/unbound-method': composeSeverity(
    errorFor('tests'),
    offFor('javascript'),
  ),
  'jest/valid-describe-callback': errorFor('tests'),
  'jest/valid-expect': errorFor('tests'),
  'jest/valid-expect-in-promise': errorFor('tests'),
  'jest/valid-title': errorFor('tests'),
  'jsx-a11y/alt-text': [
    errorFor('react'),
    {
      'area': [],
      'elements': ['img', 'object', 'area', 'input[type="image"]'],
      'img': [],
      'input[type="image"]': [],
      'object': [],
    },
  ],
  'jsx-a11y/anchor-ambiguous-text': errorFor('react'),
  'jsx-a11y/anchor-has-content': [errorFor('react'), {components: []}],
  'jsx-a11y/anchor-is-valid': [
    errorFor('react'),
    {
      aspects: ['noHref', 'invalidHref', 'preferButton'],
      components: ['Link'],
      specialLink: ['to'],
    },
  ],
  'jsx-a11y/aria-activedescendant-has-tabindex': errorFor('react'),
  'jsx-a11y/aria-props': errorFor('react'),
  'jsx-a11y/aria-proptypes': errorFor('react'),
  'jsx-a11y/aria-role': [errorFor('react'), {ignoreNonDOM: false}],
  'jsx-a11y/aria-unsupported-elements': errorFor('react'),
  'jsx-a11y/autocomplete-valid': ['off', {inputComponents: []}],
  'jsx-a11y/click-events-have-key-events': errorFor('react'),
  'jsx-a11y/control-has-associated-label': [
    errorFor('react'),
    {
      controlComponents: [],
      depth: 5,
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
      labelAttributes: ['label'],
    },
  ],
  'jsx-a11y/heading-has-content': [errorFor('react'), {components: ['']}],
  'jsx-a11y/html-has-lang': errorFor('react'),
  'jsx-a11y/iframe-has-title': errorFor('react'),
  'jsx-a11y/img-redundant-alt': errorFor('react'),
  'jsx-a11y/interactive-supports-focus': errorFor('react'),
  'jsx-a11y/label-has-associated-control': [
    errorFor('react'),
    {
      assert: 'both',
      controlComponents: ['TextInput', 'SelectInput'],
      depth: 25,
      labelAttributes: ['htmlFor'],
      labelComponents: ['Label'],
    },
  ],
  'jsx-a11y/lang': errorFor('react'),
  'jsx-a11y/media-has-caption': [
    errorFor('react'),
    {audio: [], track: [], video: []},
  ],
  'jsx-a11y/mouse-events-have-key-events': errorFor('react'),
  'jsx-a11y/no-access-key': errorFor('react'),
  'jsx-a11y/no-aria-hidden-on-focusable': errorFor('react'),
  'jsx-a11y/no-autofocus': [errorFor('react'), {ignoreNonDOM: true}],
  'jsx-a11y/no-distracting-elements': [
    errorFor('react'),
    {elements: ['marquee', 'blink']},
  ],
  'jsx-a11y/no-interactive-element-to-noninteractive-role': [
    errorFor('react'),
    {tr: ['none', 'presentation']},
  ],
  'jsx-a11y/no-noninteractive-element-interactions': [
    errorFor('react'),
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
    errorFor('react'),
    {
      li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
      ol: [
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'tablist',
        'tree',
        'treegrid',
      ],
      table: ['grid'],
      td: ['gridcell'],
      ul: [
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'tablist',
        'tree',
        'treegrid',
      ],
    },
  ],
  'jsx-a11y/no-noninteractive-tabindex': [
    errorFor('react'),
    {roles: ['tabpanel'], tags: []},
  ],
  'jsx-a11y/no-redundant-roles': errorFor('react'),
  'jsx-a11y/no-static-element-interactions': [
    errorFor('react'),
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
  'jsx-a11y/prefer-tag-over-role': errorFor('react'),
  'jsx-a11y/role-has-required-aria-props': errorFor('react'),
  'jsx-a11y/role-supports-aria-props': errorFor('react'),
  'jsx-a11y/scope': errorFor('react'),
  'jsx-a11y/tabindex-no-positive': errorFor('react'),
  'logical-assignment-operators': 'error',
  'max-classes-per-file': 'error',
  'max-depth': 'error',
  'max-lines': [
    composeSeverity(
      errorFor('all'),
      offFor('configs', 'tests', 'e2eTests', 'scripts'),
    ),
    200,
  ],
  'max-lines-per-function': 'off', // ['error', {max: 20, skipBlankLines: true, skipComments: true, IIFEs: true},], // TODO: re-enable
  'max-nested-callbacks': 'error',
  'max-params': ['error', {max: 5}],
  'max-statements': [
    composeSeverity(
      errorFor('all'),
      offFor('configs', 'tests', 'e2eTests', 'eslintRules'),
    ),
    {max: 20},
  ],
  'new-cap': 'error',
  'no-alert': 'error',
  'no-array-constructor': composeSeverity(
    errorFor('all'),
    offFor('typescript'),
  ),
  'no-async-promise-executor': 'error',
  'no-await-in-loop': 'error',
  'no-bitwise': 'error',
  'no-caller': 'error',
  'no-case-declarations': 'error',
  'no-class-assign': 'error',
  'no-compare-neg-zero': 'error',
  'no-cond-assign': 'error',
  'no-console': composeSeverity(errorFor('all'), offFor('scripts', 'configs')),
  'no-const-assign': 'off',
  'no-constant-binary-expression': 'error',
  'no-constant-condition': 'error',
  'no-constructor-return': 'error',
  'no-continue': 'off', // comes in handy
  'no-control-regex': 'error',
  'no-debugger': 'error',
  'no-delete-var': 'error',
  'no-div-regex': 'error',
  'no-dupe-args': 'off',
  'no-dupe-class-members': composeSeverity(
    errorFor('all'),
    offFor('typescript'),
  ),
  'no-dupe-else-if': 'error',
  'no-dupe-keys': 'off',
  'no-duplicate-case': 'error',
  'no-duplicate-imports': 'off', // if we import both a type and a value, we'll get a duplicate import error
  'no-else-return': 'error',
  'no-empty': 'error',
  'no-empty-character-class': 'error',
  'no-empty-function': composeSeverity(errorFor('all'), offFor('typescript')),
  'no-empty-pattern': 'error',
  'no-empty-static-block': 'error',
  'no-eq-null': 'off', // allow == and != with null
  'no-eval': 'error',
  'no-ex-assign': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-extra-boolean-cast': 'error',
  'no-extra-label': 'error',
  'no-fallthrough': 'error',
  'no-func-assign': 'off',
  'no-global-assign': 'error',
  'no-implicit-coercion': 'error',
  'no-implicit-globals': 'error',
  'no-implied-eval': composeSeverity(errorFor('all'), offFor('typescript')),
  'no-import-assign': 'off',
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
  'no-loop-func': composeSeverity(errorFor('all'), offFor('typescript')),
  'no-loss-of-precision': composeSeverity(
    errorFor('all'),
    offFor('typescript'),
  ),
  'no-magic-numbers': [
    composeSeverity(
      errorFor('all'),
      offFor('typescript', 'tests', 'configs', 'scripts'),
    ),
    {
      detectObjects: false,
      enforceConst: true,
      ignore: [0, -1, 1],
      ignoreArrayIndexes: false,
      ignoreClassFieldInitialValues: true,
      ignoreDefaultValues: true,
    },
  ],
  'no-misleading-character-class': 'error',
  'no-multi-assign': 'error',
  'no-multi-str': 'error',
  'no-negated-condition': 'off',
  'no-nested-ternary': 'off',
  'no-new': 'error',
  'no-new-func': 'off',
  'no-new-native-nonconstructor': 'error',
  'no-new-wrappers': 'error',
  'no-nonoctal-decimal-escape': 'error',
  'no-obj-calls': 'off',
  'no-object-constructor': 'error',
  'no-octal': 'error',
  'no-octal-escape': 'error',
  'no-param-reassign': 'error',
  'no-plusplus': 'off', // these are only confusing if you don't know the language
  'no-promise-executor-return': 'error',
  'no-proto': 'error',
  'no-prototype-builtins': 'error',
  'no-redeclare': composeSeverity(errorFor('all'), offFor('typescript')),
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
  'no-setter-return': 'off',
  'no-shadow': composeSeverity(errorFor('all'), offFor('typescript')),
  'no-shadow-restricted-names': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'error',
  'no-ternary': 'off',
  'no-this-before-super': 'off',
  'no-throw-literal': 'off',
  'no-unassigned-vars': 'error',
  'no-undef': 'off',
  'no-undef-init': 'error',
  'no-undefined': 'off', // prefer undefined over null for TypeScript optional properties
  'no-underscore-dangle': 'off',
  'no-unexpected-multiline': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unneeded-ternary': 'error',
  'no-unreachable': 'off',
  'no-unreachable-loop': 'error',
  'no-unsafe-finally': 'error',
  'no-unsafe-negation': 'off',
  'no-unsafe-optional-chaining': 'error',
  'no-unused-expressions': composeSeverity(
    errorFor('all'),
    offFor('typescript'),
  ),
  'no-unused-labels': 'error',
  'no-unused-private-class-members': 'error',
  'no-unused-vars': composeSeverity(errorFor('all'), offFor('typescript')),
  'no-use-before-define': composeSeverity(
    errorFor('all'),
    offFor('typescript'),
  ),
  'no-useless-assignment': 'error',
  'no-useless-backreference': 'error',
  'no-useless-call': 'error',
  'no-useless-catch': 'error',
  'no-useless-computed-key': 'error',
  'no-useless-concat': 'error',
  'no-useless-constructor': composeSeverity(
    errorFor('all'),
    offFor('typescript'),
  ),
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
  'playwright/expect-expect': errorFor('e2eTests'),
  'playwright/max-expects': 'off', // testing multiple things is good for e2e performance
  'playwright/max-nested-describe': errorFor('e2eTests'),
  'playwright/missing-playwright-await': errorFor('e2eTests'),
  'playwright/no-commented-out-tests': errorFor('e2eTests'),
  'playwright/no-conditional-expect': errorFor('e2eTests'),
  'playwright/no-conditional-in-test': errorFor('e2eTests'),
  'playwright/no-duplicate-hooks': errorFor('e2eTests'),
  'playwright/no-element-handle': errorFor('e2eTests'),
  'playwright/no-eval': errorFor('e2eTests'),
  'playwright/no-focused-test': errorFor('e2eTests'),
  'playwright/no-force-option': errorFor('e2eTests'),
  'playwright/no-get-by-title': errorFor('e2eTests'),
  'playwright/no-hooks': errorFor('e2eTests'),
  'playwright/no-nested-step': errorFor('e2eTests'),
  'playwright/no-networkidle': errorFor('e2eTests'),
  'playwright/no-nth-methods': errorFor('e2eTests'),
  'playwright/no-page-pause': errorFor('e2eTests'),
  'playwright/no-raw-locators': errorFor('e2eTests'),
  'playwright/no-restricted-matchers': errorFor('e2eTests'),
  'playwright/no-skipped-test': 'warn',
  'playwright/no-slowed-test': errorFor('e2eTests'),
  'playwright/no-standalone-expect': errorFor('e2eTests'),
  'playwright/no-unsafe-references': errorFor('e2eTests'),
  'playwright/no-useless-await': errorFor('e2eTests'),
  'playwright/no-useless-not': errorFor('e2eTests'),
  'playwright/no-wait-for-navigation': errorFor('e2eTests'),
  'playwright/no-wait-for-selector': errorFor('e2eTests'),
  'playwright/no-wait-for-timeout': errorFor('e2eTests'),
  'playwright/prefer-comparison-matcher': errorFor('e2eTests'),
  'playwright/prefer-equality-matcher': errorFor('e2eTests'),
  'playwright/prefer-hooks-in-order': errorFor('e2eTests'),
  'playwright/prefer-hooks-on-top': errorFor('e2eTests'),
  'playwright/prefer-locator': errorFor('e2eTests'),
  'playwright/prefer-lowercase-title': errorFor('e2eTests'),
  'playwright/prefer-native-locators': errorFor('e2eTests'),
  'playwright/prefer-strict-equal': errorFor('e2eTests'),
  'playwright/prefer-to-be': errorFor('e2eTests'),
  'playwright/prefer-to-contain': errorFor('e2eTests'),
  'playwright/prefer-to-have-count': errorFor('e2eTests'),
  'playwright/prefer-to-have-length': errorFor('e2eTests'),
  'playwright/prefer-web-first-assertions': errorFor('e2eTests'),
  'playwright/require-hook': errorFor('e2eTests'),
  'playwright/require-soft-assertions': 'off', // probably not a good idea
  'playwright/require-to-throw-message': errorFor('e2eTests'),
  'playwright/require-top-level-describe': errorFor('e2eTests'),
  'playwright/valid-describe-callback': errorFor('e2eTests'),
  'playwright/valid-expect': errorFor('e2eTests'),
  'playwright/valid-expect-in-promise': errorFor('e2eTests'),
  'playwright/valid-test-tags': errorFor('e2eTests'),
  'playwright/valid-title': errorFor('e2eTests'),
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
  'radix': 'error',
  'react-compiler/react-compiler': errorFor('react'),
  'react-hooks/exhaustive-deps': errorFor('react'),
  'react-hooks/react-compiler': errorFor('react'),
  'react-hooks/rules-of-hooks': errorFor('react'),
  'react/boolean-prop-naming': errorFor('react'),
  'react/button-has-type': errorFor('react'),
  'react/checked-requires-onchange-or-readonly': errorFor('react'),
  'react/default-props-match-prop-types': errorFor('react'),
  'react/destructuring-assignment': errorFor('react'),
  'react/display-name': errorFor('react'),
  'react/forbid-component-props': [
    errorFor('react'),
    {
      forbid: [
        {allowedFor: ['Link'], propName: 'className'},
        {allowedFor: ['Link'], propName: 'style'},
        {
          propName: 'data-test-id',
        } /* use data-testid instead (no extra hyphen) */,
      ],
    },
  ],
  'react/forbid-dom-props': errorFor('react'),
  'react/forbid-elements': errorFor('react'),
  'react/forbid-foreign-prop-types': errorFor('react'),
  'react/forbid-prop-types': errorFor('react'),
  'react/forward-ref-uses-ref': errorFor('react'),
  'react/function-component-definition': [
    errorFor('react'),
    {namedComponents: 'arrow-function', unnamedComponents: 'arrow-function'},
  ],
  'react/hook-use-state': errorFor('react'),
  'react/iframe-missing-sandbox': errorFor('react'),
  'react/jsx-boolean-value': errorFor('react'),
  'react/jsx-child-element-spacing': errorFor('react'),
  'react/jsx-closing-bracket-location': errorFor('react'),
  'react/jsx-closing-tag-location': errorFor('react'),
  'react/jsx-curly-brace-presence': errorFor('react'),
  'react/jsx-curly-newline': 'off', // using Prettier for styling
  'react/jsx-curly-spacing': errorFor('react'),
  'react/jsx-equals-spacing': errorFor('react'),
  'react/jsx-filename-extension': [
    errorFor('react'),
    {allow: 'as-needed', extensions: ['.tsx']},
  ],
  'react/jsx-first-prop-new-line': 'off',
  'react/jsx-fragments': errorFor('react'),
  'react/jsx-handler-names': errorFor('react'),
  'react/jsx-indent': 'off',
  'react/jsx-indent-props': 'off',
  'react/jsx-key': errorFor('react'),
  'react/jsx-max-depth': [errorFor('react'), {max: 10}],
  'react/jsx-max-props-per-line': 'off', // use Prettier for styling
  'react/jsx-newline': 'off', // use Prettier for styling
  'react/jsx-no-bind': 'off', // react-compiler handles these types of issues
  'react/jsx-no-comment-textnodes': errorFor('react'),
  'react/jsx-no-constructed-context-values': errorFor('react'),
  'react/jsx-no-duplicate-props': errorFor('react'),
  'react/jsx-no-leaked-render': errorFor('react'),
  'react/jsx-no-literals': [
    composeSeverity(errorFor('react'), offFor('tests', 'e2eTests', 'demos')),
    {allowedStrings: ['*', '%'], ignoreProps: true, noStrings: true},
  ],
  'react/jsx-no-script-url': errorFor('react'),
  'react/jsx-no-target-blank': errorFor('react'),
  'react/jsx-no-undef': errorFor('react'),
  'react/jsx-no-useless-fragment': errorFor('react'),
  'react/jsx-one-expression-per-line': 'off',
  'react/jsx-pascal-case': errorFor('react'),
  'react/jsx-props-no-multi-spaces': errorFor('react'),
  'react/jsx-props-no-spread-multi': errorFor('react'),
  'react/jsx-props-no-spreading': 'off',
  'react/jsx-sort-props': errorFor('react'),
  'react/jsx-tag-spacing': errorFor('react'),
  'react/jsx-uses-react': errorFor('react'),
  'react/jsx-uses-vars': errorFor('react'),
  'react/jsx-wrap-multilines': 'off',
  'react/no-access-state-in-setstate': errorFor('react'),
  'react/no-adjacent-inline-elements': errorFor('react'),
  'react/no-array-index-key': errorFor('react'),
  'react/no-arrow-function-lifecycle': errorFor('react'),
  'react/no-children-prop': errorFor('react'),
  'react/no-danger': errorFor('react'),
  'react/no-danger-with-children': errorFor('react'),
  'react/no-deprecated': errorFor('react'),
  'react/no-did-mount-set-state': errorFor('react'),
  'react/no-did-update-set-state': errorFor('react'),
  'react/no-direct-mutation-state': errorFor('react'),
  'react/no-find-dom-node': errorFor('react'),
  'react/no-invalid-html-attribute': errorFor('react'),
  'react/no-is-mounted': errorFor('react'),
  'react/no-multi-comp': composeSeverity(
    errorFor('react'),
    offFor('tests', 'demos', 'e2eTests'),
  ),
  'react/no-namespace': errorFor('react'),
  'react/no-object-type-as-default-prop': errorFor('react'),
  'react/no-redundant-should-component-update': errorFor('react'),
  'react/no-render-return-value': errorFor('react'),
  'react/no-set-state': errorFor('react'),
  'react/no-string-refs': errorFor('react'),
  'react/no-this-in-sfc': errorFor('react'),
  'react/no-typos': errorFor('react'),
  'react/no-unescaped-entities': errorFor('react'),
  'react/no-unknown-property': errorFor('react'),
  'react/no-unsafe': errorFor('react'),
  'react/no-unstable-nested-components': errorFor('react'),
  'react/no-unused-class-component-methods': errorFor('react'),
  'react/no-unused-prop-types': errorFor('react'),
  'react/no-unused-state': errorFor('react'),
  'react/no-will-update-set-state': errorFor('react'),
  'react/prefer-es6-class': errorFor('react'),
  'react/prefer-exact-props': errorFor('react'),
  'react/prefer-read-only-props': 'off', // noisy
  'react/prefer-stateless-function': errorFor('react'),
  'react/prop-types': 'off', // propTypes are so last decade
  'react/react-in-jsx-scope': 'off',
  'react/require-default-props': 'off',
  'react/require-optimization': errorFor('react'),
  'react/require-render-return': errorFor('react'),
  'react/self-closing-comp': errorFor('react'),
  'react/sort-comp': errorFor('react'),
  'react/sort-default-props': errorFor('react'),
  'react/sort-prop-types': errorFor('react'),
  'react/state-in-constructor': errorFor('react'),
  'react/static-property-placement': errorFor('react'),
  'react/style-prop-object': errorFor('react'),
  'react/void-dom-elements-no-children': errorFor('react'),
  'require-atomic-updates': 'error',
  'require-await': 'off',
  'require-unicode-regexp': 'off', // almost always unnecessary
  'require-yield': 'error',
  'sort-imports': 'off', // handled by import/order
  'sort-keys': 'off', // order affects readability. we can always sort on-demand
  'sort-vars': 'off', // order affects readability. we can always sort on-demand
  'strict': ['error', 'never'],
  'symbol-description': 'error',
  'tailwindcss/classnames-order': 'off', // using prettier-plugin-tailwindcss for this
  'tailwindcss/enforces-negative-arbitrary-values': 'error',
  'tailwindcss/enforces-shorthand': 'error',
  'tailwindcss/migration-from-tailwind-2': 'error',
  'tailwindcss/no-arbitrary-value': 'error',
  'tailwindcss/no-contradicting-classname': 'error',
  'tailwindcss/no-custom-classname': 'error',
  'tailwindcss/no-unnecessary-arbitrary-value': 'error',
  'testing-library/await-async-events': 'off', // handled by ts/no-floating-promises
  'testing-library/await-async-queries': 'off', // handled by ts/no-floating-promises
  'testing-library/await-async-utils': 'off', // handled by ts/no-floating-promises
  'testing-library/consistent-data-testid': [
    composeSeverity(errorFor('tests'), offFor('e2eTests')),
    {
      testIdAttribute: 'data-testid',
      testIdPattern: '^{fileName}(\\.[a-z0-9]+)*$',
    },
  ],
  'testing-library/no-await-sync-events': 'off', // handled by ts/await-thenable
  'testing-library/no-await-sync-queries': 'off', // handled by ts/await-thenable
  'testing-library/no-container': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-debugging-utils': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-dom-import': [
    composeSeverity(errorFor('tests'), offFor('e2eTests')),
    'react',
  ],
  'testing-library/no-global-regexp-flag-in-query': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-manual-cleanup': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-node-access': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-promise-in-fire-event': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-render-in-lifecycle': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-test-id-queries': 'off', // sometimes data-testid is necessary
  'testing-library/no-unnecessary-act': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-wait-for-multiple-assertions': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-wait-for-side-effects': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/no-wait-for-snapshot': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/prefer-explicit-assert': 'off', // handled by jest/expect-expect
  'testing-library/prefer-find-by': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/prefer-implicit-assert': 'off', // getBy*().toBeInTheDocument() is best practice
  'testing-library/prefer-presence-queries': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/prefer-query-by-disappearance': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/prefer-query-matchers': [
    composeSeverity(errorFor('tests'), offFor('e2eTests')),
    {
      validEntries: [
        {matcher: 'toBeVisible', query: 'get'},
        {matcher: 'toBeEnabled', query: 'get'},
        {matcher: 'toBeDisabled', query: 'get'},
        {matcher: 'toHaveAccessibleName', query: 'get'},
        {matcher: 'toHaveTextContent', query: 'get'},
        {matcher: 'toHaveValue', query: 'get'},
        {matcher: 'toHaveAttribute', query: 'get'},
        {matcher: 'toHaveClass', query: 'get'},
        {matcher: 'toBeNull', query: 'query'},
      ],
    },
  ],
  'testing-library/prefer-screen-queries': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/prefer-user-event': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'testing-library/render-result-naming-convention': composeSeverity(
    errorFor('tests'),
    offFor('e2eTests'),
  ),
  'ts/adjacent-overload-signatures': errorFor('typescript'),
  'ts/array-type': [
    errorFor('typescript'),
    {default: 'generic', readonly: 'generic'},
  ],
  'ts/await-thenable': errorFor('typescript'),
  'ts/ban-ts-comment': errorFor('typescript'),
  'ts/ban-tslint-comment': errorFor('typescript'),
  'ts/class-literal-property-style': errorFor('typescript'),
  'ts/class-methods-use-this': errorFor('typescript'),
  'ts/consistent-generic-constructors': errorFor('typescript'),
  'ts/consistent-indexed-object-style': errorFor('typescript'),
  'ts/consistent-return': errorFor('typescript'),
  'ts/consistent-type-assertions': errorFor('typescript'),
  'ts/consistent-type-definitions': [errorFor('typescript'), 'type'],
  'ts/consistent-type-exports': errorFor('typescript'),
  'ts/consistent-type-imports': 'off',
  'ts/default-param-last': errorFor('typescript'),
  'ts/dot-notation': [errorFor('typescript'), {allowKeywords: true}],
  'ts/explicit-function-return-type': 'off',
  'ts/explicit-member-accessibility': 'off',
  'ts/explicit-module-boundary-types': 'off',
  'ts/init-declarations': 'off',
  'ts/max-params': [errorFor('typescript'), {max: 5}],
  'ts/member-ordering': errorFor('typescript'),
  'ts/method-signature-style': errorFor('typescript'),
  'ts/naming-convention': [
    errorFor('typescript'),
    {format: ['camelCase', 'PascalCase', 'UPPER_CASE'], selector: 'variable'},
    {format: ['camelCase', 'PascalCase'], selector: 'function'},
    {format: ['PascalCase'], selector: 'typeLike'},
  ],
  'ts/no-array-constructor': errorFor('typescript'),
  'ts/no-array-delete': errorFor('typescript'),
  'ts/no-base-to-string': errorFor('typescript'),
  'ts/no-confusing-non-null-assertion': errorFor('typescript'),
  'ts/no-confusing-void-expression': errorFor('typescript'),
  'ts/no-deprecated': errorFor('typescript'),
  'ts/no-dupe-class-members': errorFor('typescript'),
  'ts/no-duplicate-enum-values': errorFor('typescript'),
  'ts/no-duplicate-type-constituents': errorFor('typescript'),
  'ts/no-dynamic-delete': errorFor('typescript'),
  'ts/no-empty-function': [
    errorFor('typescript'),
    {allow: ['arrowFunctions', 'functions', 'methods']},
  ],
  'ts/no-empty-object-type': errorFor('typescript'),
  'ts/no-explicit-any': composeSeverity(
    errorFor('typescript'),
    offFor('tests', 'configs'),
  ),
  'ts/no-extra-non-null-assertion': errorFor('typescript'),
  'ts/no-extraneous-class': errorFor('typescript'),
  'ts/no-floating-promises': errorFor('typescript'),
  'ts/no-for-in-array': errorFor('typescript'),
  'ts/no-implied-eval': errorFor('typescript'),
  'ts/no-import-type-side-effects': errorFor('typescript'),
  'ts/no-inferrable-types': errorFor('typescript'),
  'ts/no-invalid-this': errorFor('typescript'),
  'ts/no-invalid-void-type': errorFor('typescript'),
  'ts/no-loop-func': [errorFor('typescript')],
  'ts/no-magic-numbers': [
    composeSeverity(
      errorFor('typescript'),
      offFor('tests', 'configs', 'scripts'),
    ),
    {
      detectObjects: false,
      enforceConst: true,
      ignore: [0, -1, 1],
      ignoreArrayIndexes: false,
      ignoreClassFieldInitialValues: true,
      ignoreDefaultValues: true,
      ignoreEnums: true,
      ignoreNumericLiteralTypes: true,
      ignoreReadonlyClassProperties: true,
      ignoreTypeIndexes: true,
    },
  ],
  'ts/no-meaningless-void-operator': errorFor('typescript'),
  'ts/no-misused-new': errorFor('typescript'),
  'ts/no-misused-promises': errorFor('typescript'),
  'ts/no-misused-spread': errorFor('typescript'),
  'ts/no-mixed-enums': errorFor('typescript'),
  'ts/no-namespace': errorFor('typescript'),
  'ts/no-non-null-asserted-nullish-coalescing': errorFor('typescript'),
  'ts/no-non-null-asserted-optional-chain': errorFor('typescript'),
  'ts/no-non-null-assertion': composeSeverity(
    errorFor('typescript'),
    offFor('tests'),
  ),
  'ts/no-redeclare': errorFor('typescript'),
  'ts/no-redundant-type-constituents': errorFor('typescript'),
  'ts/no-require-imports': errorFor('typescript'),
  'ts/no-restricted-imports': errorFor('typescript'),
  'ts/no-restricted-types': errorFor('typescript'),
  'ts/no-shadow': errorFor('typescript'),
  'ts/no-this-alias': errorFor('typescript'),
  'ts/no-unnecessary-boolean-literal-compare': errorFor('typescript'),
  'ts/no-unnecessary-condition': errorFor('typescript'),
  'ts/no-unnecessary-parameter-property-assignment': errorFor('typescript'),
  'ts/no-unnecessary-qualifier': errorFor('typescript'),
  'ts/no-unnecessary-template-expression': errorFor('typescript'),
  'ts/no-unnecessary-type-arguments': errorFor('typescript'),
  'ts/no-unnecessary-type-assertion': errorFor('typescript'),
  'ts/no-unnecessary-type-constraint': errorFor('typescript'),
  'ts/no-unnecessary-type-conversion': errorFor('typescript'),
  'ts/no-unnecessary-type-parameters': errorFor('typescript'),
  'ts/no-unsafe-argument': composeSeverity(
    composeSeverity(errorFor('typescript'), offFor('tests')),
    offFor('tests'),
  ),
  'ts/no-unsafe-assignment': 'off', // fixing these errors usually makes the code worse
  'ts/no-unsafe-call': 'off', // fixing these errors usually makes the code worse
  'ts/no-unsafe-declaration-merging': errorFor('typescript'),
  'ts/no-unsafe-enum-comparison': errorFor('typescript'),
  'ts/no-unsafe-function-type': errorFor('typescript'),
  'ts/no-unsafe-member-access': composeSeverity(
    errorFor('typescript'),
    offFor('tests'),
  ),
  'ts/no-unsafe-return': 'off', // fixing these errors usually makes the code worse
  'ts/no-unsafe-type-assertion': 'off', // fixing these errors usually makes the code worse
  'ts/no-unsafe-unary-minus': errorFor('typescript'),
  'ts/no-unused-expressions': [
    errorFor('typescript'),
    {
      allowShortCircuit: false,
      allowTaggedTemplates: false,
      allowTernary: false,
    },
  ],
  'ts/no-unused-vars': [
    errorFor('typescript'),
    {
      args: 'after-used',
      argsIgnorePattern: '^_',
      caughtErrors: 'all',
      caughtErrorsIgnorePattern: '^_',
      ignoreRestSiblings: true,
      vars: 'all',
      varsIgnorePattern: '^_',
    },
  ],
  'ts/no-use-before-define': [
    errorFor('typescript'),
    {enums: true, ignoreTypeReferences: true, typedefs: true},
  ],
  'ts/no-useless-constructor': errorFor('typescript'),
  'ts/no-useless-empty-export': errorFor('typescript'),
  'ts/no-wrapper-object-types': errorFor('typescript'),
  'ts/non-nullable-type-assertion-style': errorFor('typescript'),
  'ts/only-throw-error': errorFor('typescript'),
  'ts/parameter-properties': errorFor('typescript'),
  'ts/prefer-as-const': errorFor('typescript'),
  'ts/prefer-destructuring': errorFor('typescript'),
  'ts/prefer-enum-initializers': errorFor('typescript'),
  'ts/prefer-find': errorFor('typescript'),
  'ts/prefer-for-of': errorFor('typescript'),
  'ts/prefer-function-type': errorFor('typescript'),
  'ts/prefer-includes': errorFor('typescript'),
  'ts/prefer-literal-enum-member': errorFor('typescript'),
  'ts/prefer-namespace-keyword': errorFor('typescript'),
  'ts/prefer-nullish-coalescing': errorFor('typescript'),
  'ts/prefer-optional-chain': errorFor('typescript'),
  'ts/prefer-promise-reject-errors': errorFor('typescript'),
  'ts/prefer-readonly': errorFor('typescript'),
  'ts/prefer-readonly-parameter-types': 'off',
  'ts/prefer-reduce-type-parameter': errorFor('typescript'),
  'ts/prefer-regexp-exec': errorFor('typescript'),
  'ts/prefer-return-this-type': errorFor('typescript'),
  'ts/prefer-string-starts-ends-with': errorFor('typescript'),
  'ts/promise-function-async': errorFor('typescript'),
  'ts/related-getter-setter-pairs': errorFor('typescript'),
  'ts/require-array-sort-compare': errorFor('typescript'),
  'ts/require-await': 'off',
  'ts/restrict-plus-operands': errorFor('typescript'),
  'ts/restrict-template-expressions': errorFor('typescript'),
  'ts/return-await': 'off',
  'ts/strict-boolean-expressions': errorFor('typescript'),
  'ts/switch-exhaustiveness-check': errorFor('typescript'),
  'ts/triple-slash-reference': errorFor('typescript'),
  'ts/unbound-method': composeSeverity(errorFor('typescript'), offFor('tests')),
  'ts/unified-signatures': errorFor('typescript'),
  'ts/use-unknown-in-catch-callback-variable': errorFor('typescript'),
  'turbo/no-undeclared-env-vars': 'error',
  'ui-testing/missing-assertion-in-test': errorFor('e2eTests'),
  'ui-testing/no-absolute-url': [errorFor('e2eTests'), 'playwright'],
  'ui-testing/no-assertions-in-hooks': errorFor('e2eTests'),
  'ui-testing/no-browser-commands-in-tests': 'off', // not sure I like the idea of requiring an abstraction layer per page like it suggests
  'ui-testing/no-css-page-layout-selector': [
    errorFor('e2eTests'),
    'playwright',
  ],
  'ui-testing/no-disabled-tests': 'off', // handled by playwright/no-skipped-test
  'ui-testing/no-focused-tests': errorFor('e2eTests'),
  'ui-testing/no-hard-wait': [errorFor('e2eTests'), 'playwright'],
  'ui-testing/no-implicit-wait': errorFor('e2eTests'),
  'ui-testing/no-link-text-selector': errorFor('e2eTests'),
  'ui-testing/no-tag-name-selector': errorFor('e2eTests'),
  'ui-testing/no-wait-in-tests': [errorFor('e2eTests'), 'playwright'],
  'ui-testing/no-xpath-page-layout-selector': errorFor('e2eTests'),
  'ui-testing/no-xpath-selector': errorFor('e2eTests'),
  'unicode-bom': 'error',
  'use-isnan': 'error',
  'valid-typeof': 'off',
  'vars-on-top': 'error',
  'yoda': 'error',
};

const eslintConfig: Array<Linter.Config> = [
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/temp/**',
      '**/bundle/**',
      'node_modules/**',
      '**/playwright-report/**',
      '**/report/**',
      '**/coverage-ts/**',
    ],
  },
  ...resolveConfigs(RULES),
];

if (process.env['DEBUG'] != null) {
  console.log(
    JSON.stringify(
      eslintConfig,
      (key: string, value: unknown) => {
        if (key === 'plugins') {
          return undefined;
        }
        return value;
      },
      2,
    ),
  );
}

export default eslintConfig;
