const baseCfg = require('../../jest.config.base.cjs');

module.exports = {
  ...baseCfg,
  rootDir: '.',
  testEnvironment: 'node',
  displayName: 'shared',
};
