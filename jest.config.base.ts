import type {Config} from 'jest';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {tsconfig: {jsx: 'react-jsx', esModuleInterop: true, module: 'commonjs'}},
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.demo.*',
    '!**/*.config.*',
    '!**/coverage/**',
  ],
  coverageThreshold: {},
  moduleNameMapper: {'^(\\.{1,2}/.*)\\.js$': '$1'},
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(spec|test).(ts|tsx|js|jsx)',
  ],
  detectOpenHandles: true,
  setupFilesAfterEnv: [`${__dirname}/jest.setup.ts`],
};

export default config;
