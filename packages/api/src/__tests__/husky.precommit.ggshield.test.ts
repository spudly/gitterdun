import {describe, expect, it} from '@jest/globals';
import {readFileSync} from 'node:fs';
import path from 'node:path';

describe('Husky pre-commit ggshield integration', () => {
  it('pre-commit hook should run ggshield secret scan', () => {
    const repoRoot = path.resolve(__dirname, '../../../../');
    const hookPath = path.join(repoRoot, '.husky', 'pre-commit');
    const hook = readFileSync(hookPath, 'utf8');
    expect(hook).toMatch(/ggshield\s+secret\s+scan\s+--staged/);
  });
});
