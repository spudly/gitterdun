import {describe, expect, test} from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = __dirname.replace(/\/__tests__$/u, '');

const shouldIgnore = (filePath: string) => {
  // Allow SQL only in utils/crud files, and ignore test files
  return filePath.includes('/utils/crud/') || filePath.includes('/__tests__/');
};

const getAllSourceFiles = (dir: string): Array<string> => {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  const files: Array<string> = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllSourceFiles(fullPath));
    } else if (/\.(?:t|j)sx?$/u.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
};

describe('sql-boundaries', () => {
  test('regex avoids capturing groups requirement', () => {
    const re = /\.(?:ts|tsx)$/u;
    expect(re.test('file.tsx')).toBe(true);
  });
});

describe('sQL boundary enforcement', () => {
  test('no db.prepare calls outside utils/crud', () => {
    const files = getAllSourceFiles(SRC_DIR);
    const offenders = files
      .filter(file => !shouldIgnore(file))
      .filter(file => fs.readFileSync(file, 'utf8').includes('db.prepare('));
    expect(offenders).toEqual([]);
  });
});
