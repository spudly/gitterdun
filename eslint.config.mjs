import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({baseDirectory: __dirname});

const eslintConfig = [
  ...compat.extends('airbnb', 'airbnb/hooks', 'airbnb-typescript'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    settings: {
      react: {version: 'detect'},
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        },
      },
    },
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      curly: ['error', 'all'],
      'no-nested-ternary': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-unused-vars': ["error", {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "ignoreRestSiblings": true,
      }]
    },
  },
  ...compat.extends('plugin:prettier/recommended'),
];

export default eslintConfig;
