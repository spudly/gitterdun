import {describe, expect, test} from '@jest/globals';
import {sql} from './sql';

describe('sql', () => {
  test('returns the raw string when there are no substitutions', () => {
    const result = sql`
      SELECT
        *
      FROM
        users
    `;
    expect(result).toBe(sql`
      SELECT
        *
      FROM
        users
    `);
  });

  test('includes substitutions as-is if specified', () => {
    const col = 'user_id';
    expect(sql`
      SELECT
        ${col}
      FROM
        users
    `).toBe(sql`
      SELECT
        user_id
      FROM
        users
    `);
  });
});
