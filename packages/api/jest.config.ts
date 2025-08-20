import type {Config} from 'jest';
import base from '../../jest.config.base.ts';

const config: Config = {
  ...base,
  rootDir: '.',
  testEnvironment: 'node',
  displayName: 'api',
};

export default config;
