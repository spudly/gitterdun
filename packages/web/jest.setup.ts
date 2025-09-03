import {jest} from '@jest/globals';

jest.mock('./src/globals', () => ({}));

global.__TEST__ = true;
global.__ENV__ = 'test';
global.__DEV__ = false;
global.__PROD__ = true;
