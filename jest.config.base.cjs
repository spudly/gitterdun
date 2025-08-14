/** @type {import('jest').Config} */
module.exports = {
  passWithNoTests: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {tsconfig: {jsx: 'react-jsx', esModuleInterop: true, module: 'commonjs'}},
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    '**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.demo.*',
    '!**/*.config.*',
  ],
  moduleNameMapper: {'^(\\.{1,2}/.*)\\.js$': '$1'},
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(spec|test).(ts|tsx|js|jsx)',
  ],
};
