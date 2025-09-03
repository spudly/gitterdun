import {beforeEach, jest} from '@jest/globals';

// silence all console output during tests
beforeEach(() => {
  if (process.env['DEBUG'] == null) {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  }
});
