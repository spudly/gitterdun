import {RRuleSet, DateTime} from 'rrule-rust';

type WeeklyRule = {freq: 'WEEKLY'; byDay?: ReadonlyArray<string>};
type DailyRule = {freq: 'DAILY'};
type ParsedRule = WeeklyRule | DailyRule | null;

const parseByDay = (
  value: string | undefined,
): ReadonlyArray<string> | undefined => {
  if (value == null || value === '') {
    return undefined;
  }
  return value
    .split(',')
    .map(part => part.trim().toUpperCase())
    .filter(Boolean);
};

const parseRecurrenceRule = (rule: string | null | undefined): ParsedRule => {
  if (rule == null || rule.trim() === '') {
    return null;
  }
  const pairs = rule.split(';').reduce<Record<string, string>>((acc, chunk) => {
    const [key, rawVal] = chunk.split('=');
    const hasKey = typeof key === 'string' && key !== '';
    const hasVal = typeof rawVal === 'string' && rawVal !== '';
    if (hasKey && hasVal) {
      acc[key.toUpperCase()] = rawVal;
    }
    return acc;
  }, {});
  const freq = (pairs['FREQ'] ?? '').toUpperCase();
  if (freq === 'DAILY') {
    return {freq: 'DAILY'};
  }
  if (freq === 'WEEKLY') {
    const byDay = parseByDay(pairs['BYDAY']);
    if (byDay === undefined) {
      return {freq: 'WEEKLY'};
    }
    return {freq: 'WEEKLY', byDay};
  }
  return null;
};

const getIsoWeekday = (date: Date): string => {
  const dayAbbrevs: ReadonlyArray<string> = [
    'SU',
    'MO',
    'TU',
    'WE',
    'TH',
    'FR',
    'SA',
  ];
  const idx = date.getUTCDay();
  return dayAbbrevs[idx] ?? 'SU';
};

const occursByRRule = (
  recurrenceRule: string,
  startDateIso: string | null | undefined,
  targetDate: Date,
): boolean => {
  const dt = targetDate;
  const hasStart = startDateIso != null && startDateIso !== '';
  const dtstart = hasStart
    ? new Date(startDateIso)
    : new Date(
        Date.UTC(
          dt.getUTCFullYear(),
          dt.getUTCMonth(),
          dt.getUTCDate(),
          0,
          0,
          0,
        ),
      );
  let rruleString = recurrenceRule.trim();
  if (!/^RRULE:/i.test(rruleString)) {
    rruleString = `RRULE:${rruleString}`;
  }
  const set = new RRuleSet({
    dtstart: DateTime.create(
      dtstart.getUTCFullYear(),
      dtstart.getUTCMonth() + 1,
      dtstart.getUTCDate(),
      dtstart.getUTCHours(),
      dtstart.getUTCMinutes(),
      dtstart.getUTCSeconds(),
      true,
    ),
  }).setFromString(rruleString);
  const ZERO = 0;
  const END_HOUR = 23;
  const END_MINUTE = 59;
  const END_SECOND = 59;
  const startOfDay = DateTime.create(
    dt.getUTCFullYear(),
    dt.getUTCMonth() + 1,
    dt.getUTCDate(),
    ZERO,
    ZERO,
    ZERO,
    true,
  );
  const endOfDay = DateTime.create(
    dt.getUTCFullYear(),
    dt.getUTCMonth() + 1,
    dt.getUTCDate(),
    END_HOUR,
    END_MINUTE,
    END_SECOND,
    true,
  );
  const occurrences = set.between(startOfDay, endOfDay, true);
  return occurrences.length > 0;
};

const occursBySimpleRule = (
  parsed: ParsedRule,
  startDateIso: string | null | undefined,
  targetDate: Date,
): boolean => {
  const startTime =
    startDateIso != null ? Date.parse(startDateIso) : Number.NaN;
  const normalizedTarget = new Date(
    Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
    ),
  );

  const isBeforeStart = (): boolean => {
    if (Number.isNaN(startTime)) {
      return false;
    }
    const startDay = new Date(startTime);
    const startNormalized = new Date(
      Date.UTC(
        startDay.getUTCFullYear(),
        startDay.getUTCMonth(),
        startDay.getUTCDate(),
      ),
    );
    return normalizedTarget.getTime() < startNormalized.getTime();
  };

  if (isBeforeStart()) {
    return false;
  }

  if (parsed === null) {
    if (startDateIso == null || startDateIso.trim() === '') {
      return false;
    }
    const start = new Date(startTime);
    return (
      start.getUTCFullYear() === normalizedTarget.getUTCFullYear()
      && start.getUTCMonth() === normalizedTarget.getUTCMonth()
      && start.getUTCDate() === normalizedTarget.getUTCDate()
    );
  }

  if (parsed.freq === 'DAILY') {
    return true;
  }
  const weekday = getIsoWeekday(normalizedTarget);
  if (!parsed.byDay || parsed.byDay.length === 0) {
    if (startDateIso == null || startDateIso.trim() === '') {
      return true;
    }
    const startWeekday = getIsoWeekday(new Date(startTime));
    return weekday === startWeekday;
  }
  return parsed.byDay.includes(weekday);
};

export const occursOnDate = (
  recurrenceRule: string | null | undefined,
  startDateIso: string | null | undefined,
  targetDate: Date,
): boolean => {
  if (typeof recurrenceRule === 'string' && recurrenceRule.trim() !== '') {
    return occursByRRule(recurrenceRule, startDateIso, targetDate);
  }
  const parsed = parseRecurrenceRule(recurrenceRule);
  return occursBySimpleRule(parsed, startDateIso, targetDate);
};
