import {
  describe,
  expect,
  jest,
  test,
  beforeEach,
  afterEach,
} from '@jest/globals';
import fs from 'node:fs';
import * as mod from '../ensure-ports-free';

const ORIGINAL_PROCESS_VERSION = process.version;
const ORIGINAL_CWD = process.cwd();

describe('ensure-ports-free utilities', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore mutated globals
    Object.defineProperty(process, 'version', {
      value: ORIGINAL_PROCESS_VERSION,
      writable: false,
    });
    process.chdir(ORIGINAL_CWD);
  });

  describe('parseLsofPids', () => {
    test('extracts PIDs for a given command', () => {
      const lsof = [
        'COMMAND   PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME',
        'node     1234   user   10u  IPv4 0x1234567890abcdef      0t0  TCP 127.0.0.1:8000 (LISTEN)',
        'node     5678   user   10u  IPv4 0x1234567890abcdef      0t0  TCP 127.0.0.1:8001 (LISTEN)',
        'nginx    4321   root   10u  IPv4 0xabcdef               0t0  TCP *:80 (LISTEN)',
      ].join('\n');
      const pids = mod.parseLsofPids(lsof, 'node');
      expect([...pids].sort()).toEqual([1234, 5678]);
    });

    test('returns empty set when no matches', () => {
      const lsof = [
        'COMMAND   PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME',
        'nginx    4321   root   10u  IPv4 0xabcdef               0t0  TCP *:80 (LISTEN)',
      ].join('\n');
      const pids = mod.parseLsofPids(lsof, 'node');
      expect(pids.size).toBe(0);
    });
  });

  describe('autoKillByNameFromLsof', () => {
    test('invokes killer for each parsed PID', async () => {
      const lsof = [
        'COMMAND   PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME',
        'node     1111   user   10u  IPv4 ...',
        'node     2222   user   10u  IPv4 ...',
      ].join('\n');

      const killed: number[] = [];
      const killer = (pid: number) => {
        killed.push(pid);
      };
      await mod.autoKillByNameFromLsof('node', lsof, killer);
      expect(killed.sort()).toEqual([1111, 2222]);
    });
  });

  describe('checkNodeVersion', () => {
    const existsSpy = jest.spyOn(fs, 'existsSync');
    const readSpy = jest.spyOn(fs, 'readFileSync');

    const setProcessVersion = (version: string) => {
      Object.defineProperty(process, 'version', {
        value: `v${version}`,
        configurable: true,
      });
    };

    const mockNvmrc = (expectedVersion: string) => {
      existsSpy.mockReturnValue(true);
      readSpy.mockReturnValue(Buffer.from(`${expectedVersion}\n`));
    };

    test('passes when exact version matches', () => {
      mockNvmrc('22.18.0');
      setProcessVersion('22.18.0');
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      mod.checkNodeVersion();

      expect(exitSpy).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    });

    test('does not exit on patch/minor mismatch when major matches', () => {
      // .nvmrc wants 22.18.0, running 22.16.0 should warn but continue
      mockNvmrc('22.18.0');
      setProcessVersion('22.16.0');
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mod.checkNodeVersion();

      expect(exitSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    test('exits when major differs', () => {
      mockNvmrc('22.18.0');
      setProcessVersion('21.9.0');
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mod.checkNodeVersion();

      expect(errorSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});
