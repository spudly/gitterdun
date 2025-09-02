import {describe, expect, test} from '@jest/globals';
import {choresMessages as messages} from './chores.messages';

describe('chores.messages ids', () => {
  test('uses pages.Chores.* ids and not admin AdminChoresManagement ids', () => {
    const ids = Object.values(messages).map(msg => msg.id);
    for (const id of ids) {
      expect(id.startsWith('pages.Chores.')).toBe(true);
      expect(id.includes('AdminChoresManagement')).toBe(false);
    }
  });
});
