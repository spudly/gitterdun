import {describe, expect, test} from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

describe('postgres schema ordering', () => {
  const schemaPath = path.join(__dirname, '../schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  test('families is created before chores', () => {
    const familiesIdx = schema.indexOf('CREATE TABLE IF NOT EXISTS families');
    const choresIdx = schema.indexOf('CREATE TABLE IF NOT EXISTS chores');
    expect(familiesIdx).toBeGreaterThanOrEqual(0);
    expect(choresIdx).toBeGreaterThanOrEqual(0);
    expect(familiesIdx).toBeLessThan(choresIdx);
  });

  test('family_members is created after families', () => {
    const familiesIdx = schema.indexOf('CREATE TABLE IF NOT EXISTS families');
    const membersIdx = schema.indexOf(
      'CREATE TABLE IF NOT EXISTS family_members',
    );
    expect(membersIdx).toBeGreaterThan(familiesIdx);
  });
});
