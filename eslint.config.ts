/* eslint sort-keys: "error" -- normally this is disabled but for eslint rules we need to be able to find stuff */
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
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import {Linter, ESLint} from 'eslint';
import type {SetRequired} from 'type-fest';

const WORKSPACE_ROOT_DIR = dirname(fileURLToPath(import.meta.url));

type SeverityFn = (groupName: GroupName) => Linter.RuleSeverity;

type MyRuleSeverity = Linter.RuleSeverity | SeverityFn;

type MyRuleSeverityAndOptions<Options extends Array<any> = Array<any>> = [
  MyRuleSeverity,
  ...Partial<Options>,
];

type MyRuleEntry<Options extends Array<any> = Array<any>> =
  | MyRuleSeverity
  | MyRuleSeverityAndOptions<Options>;

const enableFor =
  (...groupNames: Array<GroupName>): SeverityFn =>
  groupName =>
    groupNames.includes(groupName) ? 'error' : 'off';

const disableFor =
  (...groupNames: Array<GroupName>): SeverityFn =>
  groupName =>
    groupNames.includes(groupName) ? 'off' : 'error';

const OFF = 0;
const WARN = 1;
const ERROR = 2;

const toNumericSeverity = (severity: Linter.RuleSeverity) => {
  if (typeof severity === 'number') {
    return severity;
  }
  switch (severity) {
    case 'off':
      return OFF;
    case 'warn':
      return WARN;
    case 'error':
      return ERROR;
    default:
      throw new Error(`Invalid severity: ${String(severity)}`);
  }
};

const compose =
  (includeFn: SeverityFn, excludeFn: SeverityFn): SeverityFn =>
  groupName =>
    Math.min(
      toNumericSeverity(includeFn(groupName)),
      toNumericSeverity(excludeFn(groupName)),
    ) as Linter.RuleSeverity;

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
  react: {
    files: [`**/*.${extensionsGlob(REACT_EXTENSIONS)}`],
    settings: {react: {pragma: 'React', version: 'detect'}},
  },
  scripts: {files: [`**/scripts/**`]},
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
  unitTests: {
    files: [
      `**/*.{test,spec}.${extensionsGlob()}`, // unit test files
      '**/{test,tests,__test__,__tests__}/**', // files in unit test folders
      '**/jest.*', // jest config files
    ],
    ignores: ['**/e2e/**'],
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
): Linter.RuleSeverity => {
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
): Linter.RuleEntry => {
  const resolvedSeverity = resolveEntrySeverity(entry, groupName);

  if (Array.isArray(entry)) {
    return [resolvedSeverity, ...entry.slice(1)];
  }

  return resolvedSeverity;
};

const isSeverityOff = (severity: Linter.RuleSeverity) =>
  severity === 'off' || severity === 0;

const resolveGroupRules = (
  rules: MyRules,
  groupName: GroupName,
  type: 'off' | 'on',
) =>
  Object.entries(rules).reduce<Record<string, Linter.RuleEntry>>(
    (acc, [ruleName, ruleEntry]) => {
      const resolvedEntry = resolveEntry(ruleEntry, groupName);
      const foundType = isSeverityOff(
        resolveEntrySeverity(resolvedEntry, groupName),
      )
        ? 'off'
        : 'on';

      if (foundType === type) {
        return {...acc, [ruleName]: resolvedEntry};
      }

      return acc;
    },
    {},
  );

const resolveConfigs = (rules: MyRules): Array<Linter.Config> => {
  // Precompute which rules are enabled ("on") for each group
  const onRulesByGroup = (Object.keys(GROUPS) as Array<GroupName>).reduce(
    (acc, groupName) => {
      const onForGroup = resolveGroupRules(rules, groupName, 'on');
      acc[groupName] = new Set(Object.keys(onForGroup));
      return acc;
    },
    {} as Record<GroupName, Set<string>>,
  );

  return (['on', 'off'] as const).flatMap(type =>
    (Object.entries(GROUPS) as Array<[GroupName, Group]>).map(
      ([groupName, group]) => {
        let resolvedRules = resolveGroupRules(rules, groupName, type);

        // Do not emit "off" entries for the "all" group when the same rule
        // is enabled in any other group. This prevents broad "all/off" entries
        // from overriding more specific group enables.
        if (type === 'off' && groupName === 'all') {
          const enabledElsewhere = new Set<string>(
            (Object.keys(GROUPS) as Array<GroupName>)
              .filter(name => name !== 'all')
              .flatMap(name => Array.from(onRulesByGroup[name])),
          );
          resolvedRules = Object.fromEntries(
            Object.entries(resolvedRules).filter(
              ([ruleName]) => !enabledElsewhere.has(ruleName),
            ),
          );
        }

        return {
          files: group.files,
          languageOptions: group.languageOptions ?? {},
          plugins: resolveGroupPlugins(rules),
          rules: resolvedRules,
          settings: group.settings ?? {},
        };
      },
    ),
  );
};

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
  'default-param-last': disableFor('typescript'),
  'dot-notation': disableFor('typescript'),
  'eqeqeq': ['error', 'always', {null: 'ignore'}],
  'for-direction': 'error',
  'func-name-matching': 'error',
  'func-names': 'error',
  'func-style': 'error',
  'getter-return': 'off',
  'gitterdun/no-extra-i18n-messages': [
    enableFor('translations'),
    {enPath: 'packages/web/src/i18n/extracted/en.json'},
  ],
  'gitterdun/no-missing-i18n-messages': [
    enableFor('translations'),
    {enPath: 'packages/web/src/i18n/extracted/en.json'},
  ],
  'gitterdun/no-tailwind-margins': disableFor('unitTests'),
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
  'gitterdun/require-i18n-formatting': enableFor('react'),
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
    disableFor('scripts', 'configs'),
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
  'import/no-anonymous-default-export': disableFor('translations'),
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
  'import/no-namespace': disableFor('unitTests'),
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
    enableFor('unitTests'),
    {fn: 'test', withinDescribe: 'test'},
  ],
  'jest/expect-expect': enableFor('unitTests'),
  'jest/max-expects': 'off', // more expects is fine by me
  'jest/max-nested-describe': enableFor('unitTests'),
  'jest/no-alias-methods': enableFor('unitTests'),
  'jest/no-commented-out-tests': enableFor('unitTests'),
  'jest/no-conditional-expect': enableFor('unitTests'),
  'jest/no-conditional-in-test': enableFor('unitTests'),
  'jest/no-confusing-set-timeout': enableFor('unitTests'),
  'jest/no-deprecated-functions': enableFor('unitTests'),
  'jest/no-disabled-tests': enableFor('unitTests'),
  'jest/no-done-callback': enableFor('unitTests'),
  'jest/no-duplicate-hooks': enableFor('unitTests'),
  'jest/no-export': enableFor('unitTests'),
  'jest/no-focused-tests': enableFor('unitTests'),
  'jest/no-hooks': 'off', // no hooks? but why?
  'jest/no-identical-title': enableFor('unitTests'),
  'jest/no-interpolation-in-snapshots': enableFor('unitTests'),
  'jest/no-jasmine-globals': enableFor('unitTests'),
  'jest/no-large-snapshots': enableFor('unitTests'),
  'jest/no-mocks-import': enableFor('unitTests'),
  'jest/no-restricted-jest-methods': enableFor('unitTests'),
  'jest/no-restricted-matchers': enableFor('unitTests'),
  'jest/no-standalone-expect': enableFor('unitTests'),
  'jest/no-test-prefixes': enableFor('unitTests'),
  'jest/no-test-return-statement': enableFor('unitTests'),
  'jest/no-untyped-mock-factory': 'off', // we can be more loose in unit tests
  'jest/padding-around-after-all-blocks': 'off', // use Prettier for styling
  'jest/padding-around-after-each-blocks': 'off', // use Prettier for styling
  'jest/padding-around-all': 'off', // use Prettier for styling
  'jest/padding-around-before-all-blocks': 'off', // use Prettier for styling
  'jest/padding-around-before-each-blocks': 'off', // use Prettier for styling
  'jest/padding-around-describe-blocks': 'off', // use Prettier for styling
  'jest/padding-around-expect-groups': 'off', // use Prettier for styling
  'jest/padding-around-test-blocks': 'off', // use Prettier for styling
  'jest/prefer-called-with': enableFor('unitTests'),
  'jest/prefer-comparison-matcher': enableFor('unitTests'),
  'jest/prefer-each': enableFor('unitTests'),
  'jest/prefer-ending-with-an-expect': 'off', // false positive when expect is in a loop
  'jest/prefer-equality-matcher': enableFor('unitTests'),
  'jest/prefer-expect-assertions': 'off', // annoying
  'jest/prefer-expect-resolves': enableFor('unitTests'),
  'jest/prefer-hooks-in-order': enableFor('unitTests'),
  'jest/prefer-hooks-on-top': enableFor('unitTests'),
  'jest/prefer-importing-jest-globals': enableFor('unitTests'),
  'jest/prefer-jest-mocked': enableFor('unitTests'),
  'jest/prefer-lowercase-title': enableFor('unitTests'),
  'jest/prefer-mock-promise-shorthand': enableFor('unitTests'),
  'jest/prefer-snapshot-hint': enableFor('unitTests'),
  'jest/prefer-spy-on': enableFor('unitTests'),
  'jest/prefer-strict-equal': 'off', // i like this idea, but toStrictEqual has issues with arrays being created from inside a jest worker, resulting in false positive errors
  'jest/prefer-to-be': enableFor('unitTests'),
  'jest/prefer-to-contain': enableFor('unitTests'),
  'jest/prefer-to-have-length': enableFor('unitTests'),
  'jest/prefer-todo': enableFor('unitTests'),
  'jest/require-hook': enableFor('unitTests'),
  'jest/require-to-throw-message': enableFor('unitTests'),
  'jest/require-top-level-describe': 'off', // why enforce extra boilerplate?
  'jest/unbound-method': enableFor('unitTests'),
  'jest/valid-describe-callback': enableFor('unitTests'),
  'jest/valid-expect': enableFor('unitTests'),
  'jest/valid-expect-in-promise': enableFor('unitTests'),
  'jest/valid-title': enableFor('unitTests'),
  'jsx-a11y/alt-text': [
    enableFor('react'),
    {
      'area': [],
      'elements': ['img', 'object', 'area', 'input[type="image"]'],
      'img': [],
      'input[type="image"]': [],
      'object': [],
    },
  ],
  'jsx-a11y/anchor-ambiguous-text': 'error',
  'jsx-a11y/anchor-has-content': [enableFor('react'), {components: []}],
  'jsx-a11y/anchor-is-valid': [
    enableFor('react'),
    {
      aspects: ['noHref', 'invalidHref', 'preferButton'],
      components: ['Link'],
      specialLink: ['to'],
    },
  ],
  'jsx-a11y/aria-activedescendant-has-tabindex': enableFor('react'),
  'jsx-a11y/aria-props': enableFor('react'),
  'jsx-a11y/aria-proptypes': enableFor('react'),
  'jsx-a11y/aria-role': [enableFor('react'), {ignoreNonDOM: false}],
  'jsx-a11y/aria-unsupported-elements': enableFor('react'),
  'jsx-a11y/autocomplete-valid': ['off', {inputComponents: []}],
  'jsx-a11y/click-events-have-key-events': enableFor('react'),
  'jsx-a11y/control-has-associated-label': [
    enableFor('react'),
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
  'jsx-a11y/heading-has-content': ['error', {components: ['']}],
  'jsx-a11y/html-has-lang': 'error',
  'jsx-a11y/iframe-has-title': 'error',
  'jsx-a11y/img-redundant-alt': 'error',
  'jsx-a11y/interactive-supports-focus': 'error',
  'jsx-a11y/label-has-associated-control': [
    'error',
    {
      assert: 'both',
      controlComponents: ['TextInput', 'SelectInput'],
      depth: 25,
      labelAttributes: ['htmlFor'],
      labelComponents: ['Label'],
    },
  ],
  'jsx-a11y/lang': 'error',
  'jsx-a11y/media-has-caption': ['error', {audio: [], track: [], video: []}],
  'jsx-a11y/mouse-events-have-key-events': 'error',
  'jsx-a11y/no-access-key': 'error',
  'jsx-a11y/no-aria-hidden-on-focusable': 'error',
  'jsx-a11y/no-autofocus': ['error', {ignoreNonDOM: true}],
  'jsx-a11y/no-distracting-elements': [
    'error',
    {elements: ['marquee', 'blink']},
  ],
  'jsx-a11y/no-interactive-element-to-noninteractive-role': [
    'error',
    {tr: ['none', 'presentation']},
  ],
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
    'error',
    {roles: ['tabpanel'], tags: []},
  ],
  'jsx-a11y/no-redundant-roles': 'error',
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
  'jsx-a11y/prefer-tag-over-role': 'error',
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/role-supports-aria-props': 'error',
  'jsx-a11y/scope': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',
  'logical-assignment-operators': 'error',
  'max-classes-per-file': 'error',
  'max-depth': 'error',
  'max-lines': [disableFor('configs', 'unitTests', 'e2eTests', 'scripts'), 200],
  'max-lines-per-function': 'off', // ['error', {max: 20, skipBlankLines: true, skipComments: true, IIFEs: true},], // TODO: re-enable
  'max-nested-callbacks': 'error',
  'max-params': ['error', {max: 5}],
  'max-statements': [disableFor('configs', 'unitTests', 'e2eTests'), {max: 20}],
  'new-cap': 'error',
  'no-alert': 'error',
  'no-array-constructor': disableFor('typescript'),
  'no-async-promise-executor': 'error',
  'no-await-in-loop': 'error',
  'no-bitwise': 'error',
  'no-caller': 'error',
  'no-case-declarations': 'error',
  'no-class-assign': 'error',
  'no-compare-neg-zero': 'error',
  'no-cond-assign': 'error',
  'no-console': disableFor('scripts'),
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
  'no-dupe-class-members': disableFor('typescript'),
  'no-dupe-else-if': 'error',
  'no-dupe-keys': 'off',
  'no-duplicate-case': 'error',
  'no-duplicate-imports': 'off', // if we import both a type and a value, we'll get a duplicate import error
  'no-else-return': 'error',
  'no-empty': 'error',
  'no-empty-character-class': 'error',
  'no-empty-function': disableFor('typescript'),
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
  'no-implied-eval': disableFor('typescript'),
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
  'no-loop-func': disableFor('typescript'),
  'no-loss-of-precision': disableFor('typescript'),
  'no-magic-numbers': [
    disableFor('typescript', 'unitTests', 'configs', 'scripts'),
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
  'no-redeclare': disableFor('typescript'),
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
  'no-shadow': disableFor('typescript'),
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
  'no-unused-expressions': disableFor('typescript'),
  'no-unused-labels': 'error',
  'no-unused-private-class-members': 'error',
  'no-unused-vars': disableFor('typescript'),
  'no-use-before-define': disableFor('typescript'),
  'no-useless-assignment': 'error',
  'no-useless-backreference': 'error',
  'no-useless-call': 'error',
  'no-useless-catch': 'error',
  'no-useless-computed-key': 'error',
  'no-useless-concat': 'error',
  'no-useless-constructor': disableFor('typescript'),
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
  'playwright/expect-expect': enableFor('e2eTests'),
  'playwright/max-expects': 'off', // testing multiple things is good for e2e performance
  'playwright/max-nested-describe': enableFor('e2eTests'),
  'playwright/missing-playwright-await': enableFor('e2eTests'),
  'playwright/no-commented-out-tests': enableFor('e2eTests'),
  'playwright/no-conditional-expect': enableFor('e2eTests'),
  'playwright/no-conditional-in-test': enableFor('e2eTests'),
  'playwright/no-duplicate-hooks': enableFor('e2eTests'),
  'playwright/no-element-handle': enableFor('e2eTests'),
  'playwright/no-eval': enableFor('e2eTests'),
  'playwright/no-focused-test': enableFor('e2eTests'),
  'playwright/no-force-option': enableFor('e2eTests'),
  'playwright/no-get-by-title': enableFor('e2eTests'),
  'playwright/no-hooks': enableFor('e2eTests'),
  'playwright/no-nested-step': enableFor('e2eTests'),
  'playwright/no-networkidle': enableFor('e2eTests'),
  'playwright/no-nth-methods': enableFor('e2eTests'),
  'playwright/no-page-pause': enableFor('e2eTests'),
  'playwright/no-raw-locators': enableFor('e2eTests'),
  'playwright/no-restricted-matchers': enableFor('e2eTests'),
  'playwright/no-skipped-test': 'warn',
  'playwright/no-slowed-test': enableFor('e2eTests'),
  'playwright/no-standalone-expect': enableFor('e2eTests'),
  'playwright/no-unsafe-references': enableFor('e2eTests'),
  'playwright/no-useless-await': enableFor('e2eTests'),
  'playwright/no-useless-not': enableFor('e2eTests'),
  'playwright/no-wait-for-navigation': enableFor('e2eTests'),
  'playwright/no-wait-for-selector': enableFor('e2eTests'),
  'playwright/no-wait-for-timeout': enableFor('e2eTests'),
  'playwright/prefer-comparison-matcher': enableFor('e2eTests'),
  'playwright/prefer-equality-matcher': enableFor('e2eTests'),
  'playwright/prefer-hooks-in-order': enableFor('e2eTests'),
  'playwright/prefer-hooks-on-top': enableFor('e2eTests'),
  'playwright/prefer-locator': enableFor('e2eTests'),
  'playwright/prefer-lowercase-title': enableFor('e2eTests'),
  'playwright/prefer-native-locators': enableFor('e2eTests'),
  'playwright/prefer-strict-equal': enableFor('e2eTests'),
  'playwright/prefer-to-be': enableFor('e2eTests'),
  'playwright/prefer-to-contain': enableFor('e2eTests'),
  'playwright/prefer-to-have-count': enableFor('e2eTests'),
  'playwright/prefer-to-have-length': enableFor('e2eTests'),
  'playwright/prefer-web-first-assertions': enableFor('e2eTests'),
  'playwright/require-hook': enableFor('e2eTests'),
  'playwright/require-soft-assertions': 'off', // probably not a good idea
  'playwright/require-to-throw-message': enableFor('e2eTests'),
  'playwright/require-top-level-describe': enableFor('e2eTests'),
  'playwright/valid-describe-callback': enableFor('e2eTests'),
  'playwright/valid-expect': enableFor('e2eTests'),
  'playwright/valid-expect-in-promise': enableFor('e2eTests'),
  'playwright/valid-test-tags': enableFor('e2eTests'),
  'playwright/valid-title': enableFor('e2eTests'),
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
  'react-hooks/exhaustive-deps': enableFor('react'),
  'react-hooks/react-compiler': 'error',
  'react-hooks/rules-of-hooks': 'error',
  'react/boolean-prop-naming': enableFor('react'),
  'react/button-has-type': enableFor('react'),
  'react/checked-requires-onchange-or-readonly': enableFor('react'),
  'react/default-props-match-prop-types': enableFor('react'),
  'react/destructuring-assignment': enableFor('react'),
  'react/display-name': enableFor('react'),
  'react/forbid-component-props': [
    enableFor('react'),
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
  'react/forbid-dom-props': enableFor('react'),
  'react/forbid-elements': enableFor('react'),
  'react/forbid-foreign-prop-types': enableFor('react'),
  'react/forbid-prop-types': enableFor('react'),
  'react/forward-ref-uses-ref': enableFor('react'),
  'react/function-component-definition': [
    enableFor('react'),
    {namedComponents: 'arrow-function', unnamedComponents: 'arrow-function'},
  ],
  'react/hook-use-state': enableFor('react'),
  'react/iframe-missing-sandbox': enableFor('react'),
  'react/jsx-boolean-value': enableFor('react'),
  'react/jsx-child-element-spacing': enableFor('react'),
  'react/jsx-closing-bracket-location': enableFor('react'),
  'react/jsx-closing-tag-location': enableFor('react'),
  'react/jsx-curly-brace-presence': enableFor('react'),
  'react/jsx-curly-newline': 'off', // using Prettier for styling
  'react/jsx-curly-spacing': enableFor('react'),
  'react/jsx-equals-spacing': enableFor('react'),
  'react/jsx-filename-extension': [
    enableFor('react'),
    {allow: 'as-needed', extensions: ['.tsx']},
  ],
  'react/jsx-first-prop-new-line': 'off',
  'react/jsx-fragments': enableFor('react'),
  'react/jsx-handler-names': enableFor('react'),
  'react/jsx-indent': 'off',
  'react/jsx-indent-props': 'off',
  'react/jsx-key': enableFor('react'),
  'react/jsx-max-depth': [enableFor('react'), {max: 10}],
  'react/jsx-max-props-per-line': 'off', // use Prettier for styling
  'react/jsx-newline': 'off', // use Prettier for styling
  'react/jsx-no-bind': 'off', // react-compiler handles these types of issues
  'react/jsx-no-comment-textnodes': enableFor('react'),
  'react/jsx-no-constructed-context-values': enableFor('react'),
  'react/jsx-no-duplicate-props': enableFor('react'),
  'react/jsx-no-leaked-render': enableFor('react'),
  'react/jsx-no-literals': [
    compose(enableFor('react'), disableFor('unitTests', 'e2eTests', 'demos')),
    {allowedStrings: ['*', '%'], ignoreProps: true, noStrings: true},
  ],
  'react/jsx-no-script-url': enableFor('react'),
  'react/jsx-no-target-blank': enableFor('react'),
  'react/jsx-no-undef': enableFor('react'),
  'react/jsx-no-useless-fragment': enableFor('react'),
  'react/jsx-one-expression-per-line': 'off',
  'react/jsx-pascal-case': enableFor('react'),
  'react/jsx-props-no-multi-spaces': enableFor('react'),
  'react/jsx-props-no-spread-multi': enableFor('react'),
  'react/jsx-props-no-spreading': 'off',
  'react/jsx-sort-props': enableFor('react'),
  'react/jsx-tag-spacing': enableFor('react'),
  'react/jsx-uses-react': enableFor('react'),
  'react/jsx-uses-vars': enableFor('react'),
  'react/jsx-wrap-multilines': 'off',
  'react/no-access-state-in-setstate': enableFor('react'),
  'react/no-adjacent-inline-elements': enableFor('react'),
  'react/no-array-index-key': enableFor('react'),
  'react/no-arrow-function-lifecycle': enableFor('react'),
  'react/no-children-prop': enableFor('react'),
  'react/no-danger': enableFor('react'),
  'react/no-danger-with-children': enableFor('react'),
  'react/no-deprecated': enableFor('react'),
  'react/no-did-mount-set-state': enableFor('react'),
  'react/no-did-update-set-state': enableFor('react'),
  'react/no-direct-mutation-state': enableFor('react'),
  'react/no-find-dom-node': enableFor('react'),
  'react/no-invalid-html-attribute': enableFor('react'),
  'react/no-is-mounted': enableFor('react'),
  'react/no-multi-comp': compose(
    enableFor('react'),
    disableFor('unitTests', 'e2eTests'),
  ),
  'react/no-namespace': enableFor('react'),
  'react/no-object-type-as-default-prop': enableFor('react'),
  'react/no-redundant-should-component-update': enableFor('react'),
  'react/no-render-return-value': enableFor('react'),
  'react/no-set-state': enableFor('react'),
  'react/no-string-refs': enableFor('react'),
  'react/no-this-in-sfc': enableFor('react'),
  'react/no-typos': enableFor('react'),
  'react/no-unescaped-entities': enableFor('react'),
  'react/no-unknown-property': enableFor('react'),
  'react/no-unsafe': enableFor('react'),
  'react/no-unstable-nested-components': enableFor('react'),
  'react/no-unused-class-component-methods': enableFor('react'),
  'react/no-unused-prop-types': enableFor('react'),
  'react/no-unused-state': enableFor('react'),
  'react/no-will-update-set-state': enableFor('react'),
  'react/prefer-es6-class': enableFor('react'),
  'react/prefer-exact-props': enableFor('react'),
  'react/prefer-read-only-props': 'off', // noisy
  'react/prefer-stateless-function': enableFor('react'),
  'react/prop-types': 'off', // propTypes are so last decade
  'react/react-in-jsx-scope': 'off',
  'react/require-default-props': 'off',
  'react/require-optimization': enableFor('react'),
  'react/require-render-return': enableFor('react'),
  'react/self-closing-comp': enableFor('react'),
  'react/sort-comp': enableFor('react'),
  'react/sort-default-props': enableFor('react'),
  'react/sort-prop-types': enableFor('react'),
  'react/state-in-constructor': enableFor('react'),
  'react/static-property-placement': enableFor('react'),
  'react/style-prop-object': enableFor('react'),
  'react/void-dom-elements-no-children': enableFor('react'),
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
    enableFor('unitTests'),
    {
      testIdAttribute: 'data-testid',
      testIdPattern: '^{fileName}(\\.[a-z0-9]+)*$',
    },
  ],
  'testing-library/no-await-sync-events': 'off', // handled by ts/await-thenable
  'testing-library/no-await-sync-queries': 'off', // handled by ts/await-thenable
  'testing-library/no-container': enableFor('unitTests'),
  'testing-library/no-debugging-utils': enableFor('unitTests'),
  'testing-library/no-dom-import': [enableFor('unitTests'), 'react'],
  'testing-library/no-global-regexp-flag-in-query': enableFor('unitTests'),
  'testing-library/no-manual-cleanup': enableFor('unitTests'),
  'testing-library/no-node-access': enableFor('unitTests'),
  'testing-library/no-promise-in-fire-event': enableFor('unitTests'),
  'testing-library/no-render-in-lifecycle': enableFor('unitTests'),
  'testing-library/no-test-id-queries': 'off', // sometimes data-testid is necessary
  'testing-library/no-unnecessary-act': enableFor('unitTests'),
  'testing-library/no-wait-for-multiple-assertions': enableFor('unitTests'),
  'testing-library/no-wait-for-side-effects': enableFor('unitTests'),
  'testing-library/no-wait-for-snapshot': enableFor('unitTests'),
  'testing-library/prefer-explicit-assert': 'off', // handled by jest/expect-expect
  'testing-library/prefer-find-by': enableFor('unitTests'),
  'testing-library/prefer-implicit-assert': enableFor('unitTests'),
  'testing-library/prefer-presence-queries': enableFor('unitTests'),
  'testing-library/prefer-query-by-disappearance': enableFor('unitTests'),
  'testing-library/prefer-query-matchers': [
    enableFor('unitTests'),
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
  'testing-library/prefer-screen-queries': enableFor('unitTests'),
  'testing-library/prefer-user-event': enableFor('unitTests'),
  'testing-library/render-result-naming-convention': enableFor('unitTests'),
  'ts/adjacent-overload-signatures': enableFor('typescript'),
  'ts/array-type': [
    enableFor('typescript'),
    {default: 'generic', readonly: 'generic'},
  ],
  'ts/await-thenable': enableFor('typescript'),
  'ts/ban-ts-comment': enableFor('typescript'),
  'ts/ban-tslint-comment': enableFor('typescript'),
  'ts/class-literal-property-style': enableFor('typescript'),
  'ts/class-methods-use-this': enableFor('typescript'),
  'ts/consistent-generic-constructors': enableFor('typescript'),
  'ts/consistent-indexed-object-style': enableFor('typescript'),
  'ts/consistent-return': enableFor('typescript'),
  'ts/consistent-type-assertions': enableFor('typescript'),
  'ts/consistent-type-definitions': [enableFor('typescript'), 'type'],
  'ts/consistent-type-exports': enableFor('typescript'),
  'ts/consistent-type-imports': 'off',
  'ts/default-param-last': enableFor('typescript'),
  'ts/dot-notation': [enableFor('typescript'), {allowKeywords: true}],
  'ts/explicit-function-return-type': 'off',
  'ts/explicit-member-accessibility': 'off',
  'ts/explicit-module-boundary-types': 'off',
  'ts/init-declarations': 'off',
  'ts/max-params': [enableFor('typescript'), {max: 5}],
  'ts/member-ordering': enableFor('typescript'),
  'ts/method-signature-style': enableFor('typescript'),
  'ts/naming-convention': [
    enableFor('typescript'),
    {format: ['camelCase', 'PascalCase', 'UPPER_CASE'], selector: 'variable'},
    {format: ['camelCase', 'PascalCase'], selector: 'function'},
    {format: ['PascalCase'], selector: 'typeLike'},
  ],
  'ts/no-array-constructor': enableFor('typescript'),
  'ts/no-array-delete': enableFor('typescript'),
  'ts/no-base-to-string': enableFor('typescript'),
  'ts/no-confusing-non-null-assertion': enableFor('typescript'),
  'ts/no-confusing-void-expression': enableFor('typescript'),
  'ts/no-deprecated': enableFor('typescript'),
  'ts/no-dupe-class-members': enableFor('typescript'),
  'ts/no-duplicate-enum-values': enableFor('typescript'),
  'ts/no-duplicate-type-constituents': enableFor('typescript'),
  'ts/no-dynamic-delete': enableFor('typescript'),
  'ts/no-empty-function': [
    enableFor('typescript'),
    {allow: ['arrowFunctions', 'functions', 'methods']},
  ],
  'ts/no-empty-object-type': enableFor('typescript'),
  'ts/no-explicit-any': compose(
    enableFor('typescript'),
    disableFor('unitTests', 'configs'),
  ),
  'ts/no-extra-non-null-assertion': enableFor('typescript'),
  'ts/no-extraneous-class': enableFor('typescript'),
  'ts/no-floating-promises': enableFor('typescript'),
  'ts/no-for-in-array': enableFor('typescript'),
  'ts/no-implied-eval': enableFor('typescript'),
  'ts/no-import-type-side-effects': enableFor('typescript'),
  'ts/no-inferrable-types': enableFor('typescript'),
  'ts/no-invalid-this': enableFor('typescript'),
  'ts/no-invalid-void-type': enableFor('typescript'),
  'ts/no-loop-func': [enableFor('typescript')],
  'ts/no-magic-numbers': [
    compose(
      enableFor('typescript'),
      disableFor('unitTests', 'configs', 'scripts'),
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
  'ts/no-meaningless-void-operator': enableFor('typescript'),
  'ts/no-misused-new': enableFor('typescript'),
  'ts/no-misused-promises': enableFor('typescript'),
  'ts/no-misused-spread': enableFor('typescript'),
  'ts/no-mixed-enums': enableFor('typescript'),
  'ts/no-namespace': enableFor('typescript'),
  'ts/no-non-null-asserted-nullish-coalescing': enableFor('typescript'),
  'ts/no-non-null-asserted-optional-chain': enableFor('typescript'),
  'ts/no-non-null-assertion': compose(
    enableFor('typescript'),
    disableFor('unitTests'),
  ),
  'ts/no-redeclare': enableFor('typescript'),
  'ts/no-redundant-type-constituents': enableFor('typescript'),
  'ts/no-require-imports': enableFor('typescript'),
  'ts/no-restricted-imports': enableFor('typescript'),
  'ts/no-restricted-types': enableFor('typescript'),
  'ts/no-shadow': enableFor('typescript'),
  'ts/no-this-alias': enableFor('typescript'),
  'ts/no-unnecessary-boolean-literal-compare': enableFor('typescript'),
  'ts/no-unnecessary-condition': enableFor('typescript'),
  'ts/no-unnecessary-parameter-property-assignment': enableFor('typescript'),
  'ts/no-unnecessary-qualifier': enableFor('typescript'),
  'ts/no-unnecessary-template-expression': enableFor('typescript'),
  'ts/no-unnecessary-type-arguments': enableFor('typescript'),
  'ts/no-unnecessary-type-assertion': enableFor('typescript'),
  'ts/no-unnecessary-type-constraint': enableFor('typescript'),
  'ts/no-unnecessary-type-conversion': enableFor('typescript'),
  'ts/no-unnecessary-type-parameters': enableFor('typescript'),
  'ts/no-unsafe-argument': compose(
    compose(enableFor('typescript'), disableFor('unitTests')),
    disableFor('unitTests'),
  ),
  'ts/no-unsafe-assignment': 'off', // fixing these errors usually makes the code worse
  'ts/no-unsafe-call': 'off', // fixing these errors usually makes the code worse
  'ts/no-unsafe-declaration-merging': enableFor('typescript'),
  'ts/no-unsafe-enum-comparison': enableFor('typescript'),
  'ts/no-unsafe-function-type': enableFor('typescript'),
  'ts/no-unsafe-member-access': compose(
    enableFor('typescript'),
    disableFor('unitTests'),
  ),
  'ts/no-unsafe-return': enableFor('typescript'),
  'ts/no-unsafe-type-assertion': 'off', // fixing these errors usually makes the code worse
  'ts/no-unsafe-unary-minus': enableFor('typescript'),
  'ts/no-unused-expressions': [
    enableFor('typescript'),
    {
      allowShortCircuit: false,
      allowTaggedTemplates: false,
      allowTernary: false,
    },
  ],
  'ts/no-unused-vars': [
    enableFor('typescript'),
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
    enableFor('typescript'),
    {enums: true, ignoreTypeReferences: true, typedefs: true},
  ],
  'ts/no-useless-constructor': enableFor('typescript'),
  'ts/no-useless-empty-export': enableFor('typescript'),
  'ts/no-wrapper-object-types': enableFor('typescript'),
  'ts/non-nullable-type-assertion-style': enableFor('typescript'),
  'ts/only-throw-error': enableFor('typescript'),
  'ts/parameter-properties': enableFor('typescript'),
  'ts/prefer-as-const': enableFor('typescript'),
  'ts/prefer-destructuring': enableFor('typescript'),
  'ts/prefer-enum-initializers': enableFor('typescript'),
  'ts/prefer-find': enableFor('typescript'),
  'ts/prefer-for-of': enableFor('typescript'),
  'ts/prefer-function-type': enableFor('typescript'),
  'ts/prefer-includes': enableFor('typescript'),
  'ts/prefer-literal-enum-member': enableFor('typescript'),
  'ts/prefer-namespace-keyword': enableFor('typescript'),
  'ts/prefer-nullish-coalescing': enableFor('typescript'),
  'ts/prefer-optional-chain': enableFor('typescript'),
  'ts/prefer-promise-reject-errors': enableFor('typescript'),
  'ts/prefer-readonly': enableFor('typescript'),
  'ts/prefer-readonly-parameter-types': 'off',
  'ts/prefer-reduce-type-parameter': enableFor('typescript'),
  'ts/prefer-regexp-exec': enableFor('typescript'),
  'ts/prefer-return-this-type': enableFor('typescript'),
  'ts/prefer-string-starts-ends-with': enableFor('typescript'),
  'ts/promise-function-async': enableFor('typescript'),
  'ts/related-getter-setter-pairs': enableFor('typescript'),
  'ts/require-array-sort-compare': enableFor('typescript'),
  'ts/require-await': 'off',
  'ts/restrict-plus-operands': enableFor('typescript'),
  'ts/restrict-template-expressions': enableFor('typescript'),
  'ts/return-await': 'off',
  'ts/strict-boolean-expressions': enableFor('typescript'),
  'ts/switch-exhaustiveness-check': enableFor('typescript'),
  'ts/triple-slash-reference': enableFor('typescript'),
  'ts/unbound-method': enableFor('typescript'),
  'ts/unified-signatures': enableFor('typescript'),
  'ts/use-unknown-in-catch-callback-variable': enableFor('typescript'),
  'turbo/no-undeclared-env-vars': 'error',
  'ui-testing/missing-assertion-in-test': enableFor('e2eTests'),
  'ui-testing/no-absolute-url': [enableFor('e2eTests'), 'playwright'],
  'ui-testing/no-assertions-in-hooks': enableFor('e2eTests'),
  'ui-testing/no-browser-commands-in-tests': 'off', // not sure I like the idea of requiring an abstraction layer per page like it suggests
  'ui-testing/no-css-page-layout-selector': [
    enableFor('e2eTests'),
    'playwright',
  ],
  'ui-testing/no-disabled-tests': 'off', // handled by playwright/no-skipped-test
  'ui-testing/no-focused-tests': enableFor('e2eTests'),
  'ui-testing/no-hard-wait': [enableFor('e2eTests'), 'playwright'],
  'ui-testing/no-implicit-wait': enableFor('e2eTests'),
  'ui-testing/no-link-text-selector': enableFor('e2eTests'),
  'ui-testing/no-tag-name-selector': enableFor('e2eTests'),
  'ui-testing/no-wait-in-tests': [enableFor('e2eTests'), 'playwright'],
  'ui-testing/no-xpath-page-layout-selector': enableFor('e2eTests'),
  'ui-testing/no-xpath-selector': enableFor('e2eTests'),
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
    ],
  },
  ...resolveConfigs(RULES),
];

export default eslintConfig;
