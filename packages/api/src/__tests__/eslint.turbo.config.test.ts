import {describe, expect, it} from '@jest/globals';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import turboPlugin from 'eslint-plugin-turbo';

describe('eslint-plugin-turbo configuration (textual)', () => {
  it('includes the turbo plugin and sets all its rules to warn', () => {
    const repoRoot = path.resolve(__dirname, '../../../../');
    const eslintConfigPath = path.join(repoRoot, 'eslint.config.ts');
    const text = readFileSync(eslintConfigPath, 'utf8');

    // Plugin declared either by import or in plugins map
    expect(text).toMatch(/from\s+['"]eslint-plugin-turbo['"]/);
    expect(text).toMatch(/plugins:\s*\{[\s\S]*?turbo:/);

    const ruleNames = Object.keys(
      (turboPlugin as unknown as {rules: Record<string, unknown>}).rules ?? {},
    );
    expect(ruleNames.length).toBeGreaterThan(0);
    for (const ruleName of ruleNames) {
      const re = new RegExp(
        String.raw`['"]turbo\/${ruleName}['"\s]*:\s*['"]warn['"]`,
      );
      expect(text).toMatch(re);
    }
  });
});
