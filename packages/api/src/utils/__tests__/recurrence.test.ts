import {describe, expect, test} from '@jest/globals';
import {occursOnDate} from '../recurrence.js';

describe('recurrence using rrule-rust', () => {
  test('daily rule occurs on target day after start', () => {
    const start = '2025-01-01T00:00:00.000Z';
    const rule = 'FREQ=DAILY';
    const target = new Date('2025-01-03T12:00:00.000Z');
    expect(occursOnDate(rule, start, target)).toBe(true);
  });

  test('weekly BYDAY only occurs on specified days', () => {
    const start = '2025-01-01T00:00:00.000Z';
    const rule = 'FREQ=WEEKLY;BYDAY=MO,WE,FR';
    const mon = new Date('2025-01-06T12:00:00.000Z');
    const tue = new Date('2025-01-07T12:00:00.000Z');
    expect(occursOnDate(rule, start, mon)).toBe(true);
    expect(occursOnDate(rule, start, tue)).toBe(false);
  });

  test('no rule matches only on start date', () => {
    const start = '2025-02-10T10:00:00.000Z';
    const targetSame = new Date('2025-02-10T23:00:00.000Z');
    const targetNext = new Date('2025-02-11T01:00:00.000Z');
    expect(occursOnDate(null, start, targetSame)).toBe(true);
    expect(occursOnDate(null, start, targetNext)).toBe(false);
  });
});
