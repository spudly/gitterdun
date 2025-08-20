const base = require('../../jest.config.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  rootDir: '.',
  testEnvironment: 'node',
  // Uses base.setupFilesAfterEnv (includes global console silencing)
  displayName: 'shared',
};
