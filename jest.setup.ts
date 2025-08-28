import {afterAll, beforeEach, jest} from '@jest/globals';

// Shared Jest setup for console silencing across all packages

// Store original console methods for restoration if needed
/* eslint-disable no-console -- silencing console output during tests */
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
};

beforeEach(() => {
  // Silence all console output during tests unless explicitly needed
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'debug').mockImplementation(() => {});

  // Keep console.error for debugging failed tests (but silence it)
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  // Restore console methods after all tests (optional)
  Object.assign(console, originalConsole);
});
/* eslint-enable no-console */
