const baseCfg = require('../../jest.config.base.cjs');

module.exports = {
  ...baseCfg,
  rootDir: '.',
  testEnvironment: 'node',
  displayName: 'e2e',
  testMatch: [
    '<rootDir>/scripts/**/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)',
    '<rootDir>/scripts/**/*.(spec|test).(ts|tsx|js|jsx)',
  ],
};
