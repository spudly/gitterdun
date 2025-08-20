import type {Config} from 'jest';
// eslint-disable-next-line import/extensions -- jest needs the extension
import base from './jest.config.base.ts';
import {execSync} from 'node:child_process';

const config: Config = {
  ...base,
  rootDir: '.',
  testEnvironment: 'node',
  projects: execSync(`find packages -name 'jest.config.*'`)
    .toString()
    .trim()
    .split('\n'),
};

export default config;
