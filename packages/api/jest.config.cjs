const base = require('../../jest.config.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(spec|test).(ts|js)'],
};
