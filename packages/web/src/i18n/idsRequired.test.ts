import {describe, expect, test} from '@jest/globals';
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const extractIdsFromRaw = (rawJson: unknown): Array<string> => {
  if (Array.isArray(rawJson)) {
    return rawJson
      .map(item =>
        typeof item === 'object'
        && item !== null
        && 'id' in (item as Record<string, unknown>)
          ? String(item as Record<string, unknown>['id'])
          : '',
      )
      .filter(Boolean);
  }
  return Object.keys(rawJson as Record<string, unknown>);
};

describe('i18n ids', () => {
  test('all extracted messages have explicit, non-hash ids', () => {
    // Ensure extraction is up to date for this assertion
    execSync('npm run i18n:extract:raw', {
      cwd: path.join(__dirname, '..', '..'),
      stdio: 'ignore',
    });

    const rawPath = path.join(
      __dirname,
      '..',
      'i18n',
      'extracted',
      '_raw.json',
    );
    const raw = fs.readFileSync(rawPath, 'utf8');
    const data = JSON.parse(raw) as unknown;
    const ids = extractIdsFromRaw(data);

    // Hash-like ids from formatjs default are 6 chars from [A-Za-z0-9+/]
    const hashId = /^[A-Za-z0-9+/]{6}$/;
    const offenders = ids.filter(id => hashId.test(id));

    expect(offenders).toEqual([]);
  });
});
