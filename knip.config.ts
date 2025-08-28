import type {KnipConfig} from 'knip';

const config: KnipConfig = {
  $schema: 'https://unpkg.com/knip@5/schema.json',

  workspaces: {
    '.': {
      ignoreDependencies: [
        'husky', // Used by Git hooks, not imported
      ],
      ignoreBinaries: [],
    },

    'packages/web': {
      entry: ['src/main.tsx'], // Single entry point for Vite React app

      // Include all TS/TSX files but exclude demo and test files from analysis
      project: ['src/**/*.{ts,tsx}'],
      ignoreDependencies: [
        '@babel/preset-typescript', // Used by jest transform via babelConfig in web/jest.config.ts
        'babel-plugin-dynamic-import-node', // Used by jest transform via babelConfig in web/jest.config.ts
      ],
    },

    'packages/api': {
      entry: ['src/server.ts'], // Server entry point

      // Include all TS files except tests
      project: ['src/**/*.{ts,tsx}'],

      ignoreDependencies: [
        'pino-pretty', // Used by pino logger for pretty printing, not directly imported
      ],
    },

    'packages/shared': {
      entry: ['src/index.ts'], // Library entry point

      // Include all TS files except tests
      project: ['src/**/*.{ts,tsx}'],
    },
  },

  // Global ignore patterns
  ignore: [
    '**/coverage/**', // Test coverage reports
    '**/dist/**', // Build output
    '**/.turbo/**', // Turbo cache
    'types/eslint-plugin-eslint-comments.ts', // Ambient type shim used by ESLint config
  ],
};

export default config;
