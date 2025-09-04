import {describe, expect, test} from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

describe('postgres schema includes required tables', () => {
  const schemaPath = path.join(__dirname, '../schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  test('has sessions table', () => {
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS sessions');
  });

  test('has password_resets table', () => {
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS password_resets');
  });

  test('has family_invitations table', () => {
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS family_invitations');
  });
});
