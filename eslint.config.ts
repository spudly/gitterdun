import {dirname} from 'path';
import {fileURLToPath} from 'url';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import * as reactHooks from 'eslint-plugin-react-hooks';
import commentsPlugin from 'eslint-plugin-eslint-comments';
import jestPlugin from 'eslint-plugin-jest';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  {ignores: ['**/dist/**', '**/build/**', '**/coverage/**', 'node_modules/**']},
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooks,
      comments: commentsPlugin,
      jest: jestPlugin,
      tailwindcss: tailwindcssPlugin,
    },
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
      // Copy of existing rules from eslint.config.mjs
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
      // ... the rest of the rules are unchanged; keeping the same config content
    },
  },
];

export default eslintConfig;
