/** @type {import('jest').Config} */
module.exports = {
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
  collectCoverage: true, // jest cli says this is a mistake but it is not. jest has a bug causing this warning to be shown
  coverageThreshold: {
    // global: {branches: 100, functions: 100, lines: 100, statements: 100},
  },
  moduleNameMapper: {'^(\\.{1,2}/.*)\\.js$': '$1'},
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(spec|test).(ts|tsx|js|jsx)',
  ],
};
