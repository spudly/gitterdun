const {execSync} = require('node:child_process');
const base = require('./jest.config.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  rootDir: '.',
  testEnvironment: 'node',
  projects: execSync(`find packages -name 'jest.config.*'`)
    .toString()
    .trim()
    .split('\n'),
};
