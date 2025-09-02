#!/usr/bin/env node
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const PORTS_TO_CHECK: Array<number> = [8000, 8001];
const LSOF_OUTPUT_MAX_LINES = 5;

export const checkNodeVersion = (): void => {
  const currentNodeVersion = process.version.replace(/^v/, ''); // Remove 'v' prefix
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = path.resolve(currentDir, '../../../');
  const nvmrcPath = path.join(workspaceRoot, '.nvmrc');

  if (!fs.existsSync(nvmrcPath)) {
    console.error('E2E precheck: .nvmrc file not found in workspace root');
    process.exit(1);
  }

  const expectedNodeVersion = fs.readFileSync(nvmrcPath, 'utf8').trim();

  if (currentNodeVersion !== expectedNodeVersion) {
    console.error(
      `E2E precheck: Node.js version mismatch!\nExpected: v${expectedNodeVersion} (from .nvmrc)\nCurrent:  v${currentNodeVersion}\nPlease run: nvm use`,
    );
    process.exit(1);
  }

  console.log(`✅ Node.js version check passed: v${currentNodeVersion}`);
};
type PortStatus = {port: number; available: boolean; error?: Error};

export const checkPort = async (port: number): Promise<PortStatus> =>
  new Promise(resolve => {
    const server = net.createServer();
    server.once('error', err => {
      resolve({port, available: false, error: err});
    });
    server.once('listening', () => {
      server.close(() => {
        resolve({port, available: true});
      });
    });
    server.listen({host: '127.0.0.1', port});
  });

export const parseLsofPids = (
  lsofOutput: string | Buffer,
  commandName: string,
): Set<number> => {
  const pids = new Set<number>();
  if (String(lsofOutput).length === 0) {
    return pids;
  }
  const lines = String(lsofOutput).split('\n');
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
    const rawLine = lines[lineIndex];
    if (rawLine === '') {
      continue;
    }
    const line = rawLine.trim();
    if (line === '') {
      continue;
    }
    // Split on any whitespace; columns are: COMMAND PID USER ...
    const columns = line.split(/\s+/);
    const [commandColumn, pidColumn] = columns;
    if (commandColumn === commandName) {
      const pid = Number(pidColumn);
      if (Number.isInteger(pid)) {
        pids.add(pid);
      }
    }
  }
  return pids;
};
const defaultKiller = (pid: number): void => {
  try {
    execSync(`kill -9 ${pid}`, {stdio: 'ignore'});
  } catch {
    // ignore kill errors (process may have already exited)
  }
};
export const autoKillByNameFromLsof = async (
  commandName: string,
  lsofOutput: string | Buffer,
  killer: (pid: number) => void = defaultKiller,
): Promise<void> => {
  const pids = parseLsofPids(lsofOutput, commandName);
  for (const pid of pids) {
    killer(pid);
  }
};

const listPortDetails = (port: number): string => {
  try {
    return execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN`, {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
};

const attemptAutoKillCursorOwnedPorts = async (
  blockedPorts: Array<PortStatus>,
): Promise<Array<void>> => {
  const killPromises: Array<Promise<void>> = [];
  for (const {port} of blockedPorts) {
    const details = listPortDetails(port);
    if (details === '') {
      continue;
    }
    const cursorPids = parseLsofPids(details, 'Cursor');
    if (cursorPids.size === 0) {
      continue;
    }
    console.error(
      `E2E precheck: port ${port} in use by Cursor. Attempting to terminate: ${[...cursorPids].join(', ')}`,
    );
    killPromises.push(autoKillByNameFromLsof('Cursor', details));
  }
  return Promise.all(killPromises);
};

const attemptAutoKillNodeOwnedPorts = async (
  blockedPorts: Array<PortStatus>,
): Promise<Array<void>> => {
  const killPromises: Array<Promise<void>> = [];
  for (const {port} of blockedPorts) {
    const details = listPortDetails(port);
    if (details === '') {
      continue;
    }
    const nodePids = parseLsofPids(details, 'node');
    if (nodePids.size === 0) {
      continue;
    }
    console.error(
      `E2E precheck: port ${port} in use by node. Attempting to terminate: ${[...nodePids].join(', ')}`,
    );
    killPromises.push(autoKillByNameFromLsof('node', details));
  }
  return Promise.all(killPromises);
};

const logBlockedPortsAndExit = (blockedPorts: Array<PortStatus>): void => {
  const list = blockedPorts.map((status: PortStatus) => status.port).join(', ');
  console.error(`E2E precheck: required ports in use: ${list}.`);

  for (const {port} of blockedPorts) {
    console.error(`\nPort ${port} details (macOS):`);
    const out = listPortDetails(port);
    if (out) {
      console.error(out.split('\n').slice(0, LSOF_OUTPUT_MAX_LINES).join('\n'));
    } else {
      console.error('(unable to retrieve details)');
    }
    console.error(
      `To free: lsof -nP -iTCP:${port} -sTCP:LISTEN  # find PID\nThen:   kill -9 <PID>`,
    );
  }
  console.error('\nPlease free the port(s) above and rerun tests.');
  process.exit(1);
};

const main = async (): Promise<void> => {
  // Check Node.js version first before doing anything else
  checkNodeVersion();

  let results: Array<PortStatus> = await Promise.all(
    PORTS_TO_CHECK.map(checkPort),
  );
  let blocked = results.filter(
    (portStatus: PortStatus) => !portStatus.available,
  );
  if (blocked.length === 0) {
    return;
  }

  await attemptAutoKillCursorOwnedPorts(blocked);

  // Re-check after attempting to free Cursor-owned ports
  results = await Promise.all(PORTS_TO_CHECK.map(checkPort));
  blocked = results.filter((portStatus: PortStatus) => !portStatus.available);
  if (blocked.length === 0) {
    return;
  }

  await attemptAutoKillNodeOwnedPorts(blocked);

  // Re-check after attempting to free node-owned ports
  results = await Promise.all(PORTS_TO_CHECK.map(checkPort));
  blocked = results.filter((portStatus: PortStatus) => !portStatus.available);
  if (blocked.length > 0) {
    logBlockedPortsAndExit(blocked);
  }
};

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err: unknown) => {
    console.error('E2E precheck failed:', err);
    process.exit(1);
  });
}
