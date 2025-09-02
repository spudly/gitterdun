const path = require('node:path');

module.exports = {
  testEnvironment: 'node',
  restoreMocks: true,
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
  moduleNameMapper: {'^(\\.{1,2}/.*)\\.js$': '$1'},
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(spec|test).(ts|tsx|js|jsx)',
  ],
  detectOpenHandles: true,
  setupFilesAfterEnv: [path.join(__dirname, 'jest.setup.afterEnv.ts')],
  setupFiles: [path.join(__dirname, 'jest.setup.ts')],
};
