import type {Config} from 'jest';
import base from '../../jest.config.base.ts';

const config: Config = {
  ...base,
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    ...(base.setupFilesAfterEnv ?? []),
    '<rootDir>/jest.setup.ts',
  ],
  displayName: 'web',
};

export default config;
