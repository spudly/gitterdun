const base = require('../../jest.config.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  rootDir: '.',
  setupFilesAfterEnv: [],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(spec|test).(ts|tsx|js)'],
};
