import {describe, expect, test} from '@jest/globals';
import {buildRRuleString} from '../recurrence.js';

describe('buildRRuleString', () => {
  test('builds FREQ with INTERVAL and COUNT', () => {
    const result = buildRRuleString({
      frequency: 'WEEKLY',
      interval: 2,
      count: 5,
    });
    expect(result).toBe('FREQ=WEEKLY;INTERVAL=2;COUNT=5');
  });

  test('formats UNTIL as UTC YYYYMMDDTHHMMSSZ', () => {
    const until = Date.UTC(2025, 0, 15, 13, 45, 30);
    const result = buildRRuleString({frequency: 'DAILY', until});
    expect(result).toBe('FREQ=DAILY;UNTIL=20250115T134530Z');
  });

  test('handles BYDAY from mixed inputs', () => {
    const result = buildRRuleString({
      frequency: 'WEEKLY',
      by_weekday: [
        'mo',
        'WE',
        'FR',
        {nth: 1, weekday: 'SU'},
        {nth: -1, weekday: 2},
      ],
    });
    expect(result).toBe('FREQ=WEEKLY;BYDAY=MO,WE,FR,1SU,-1WE');
  });

  test('minimal rule only includes FREQ', () => {
    const result = buildRRuleString({frequency: 'MONTHLY'});
    expect(result).toBe('FREQ=MONTHLY');
  });
});
