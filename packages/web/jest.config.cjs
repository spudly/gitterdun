const base = require('../../jest.config.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    // Extend base setup with package-specific setup
    ...base.setupFilesAfterEnv,
    '<rootDir>/jest.setup.ts',
  ],
  displayName: 'web',
};
