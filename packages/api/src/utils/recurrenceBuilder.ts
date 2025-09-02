type FullRecurrence = {
  readonly frequency:
    | 'DAILY'
    | 'WEEKLY'
    | 'MONTHLY'
    | 'YEARLY'
    | 'HOURLY'
    | 'MINUTELY'
    | 'SECONDLY';
  readonly interval?: number | undefined;
  readonly count?: number | undefined;
  readonly until?: number | undefined; // epoch millis
  readonly by_weekday?:
    | ReadonlyArray<string | number | {nth: number; weekday: string | number}>
    | undefined;
  readonly by_hour?: ReadonlyArray<number> | undefined;
  readonly by_minute?: ReadonlyArray<number> | undefined;
  readonly by_second?: ReadonlyArray<number> | undefined;
  readonly by_monthday?: ReadonlyArray<number> | undefined;
  readonly by_setpos?: ReadonlyArray<number> | undefined;
  readonly by_month?: ReadonlyArray<number> | undefined;
  readonly by_weekno?: ReadonlyArray<number> | undefined;
  readonly by_yearday?: ReadonlyArray<number> | undefined;
  readonly weekstart?: string | number | undefined;
};

export const buildRRuleString = (rec: FullRecurrence): string => {
  const parts: Array<string> = [];
  parts.push(`FREQ=${rec.frequency.toUpperCase()}`);
  if (rec.interval != null) {
    parts.push(`INTERVAL=${rec.interval}`);
  }
  if (rec.count != null) {
    parts.push(`COUNT=${rec.count}`);
  }
  if (rec.until != null) {
    const date = new Date(rec.until);
    const PAD_TO_TWO = 2;
    const pad2 = (num: number) => String(num).padStart(PAD_TO_TWO, '0');
    const untilStr = `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
    parts.push(`UNTIL=${untilStr}`);
  }
  if (rec.by_weekday != null && rec.by_weekday.length > 0) {
    const dayToAbbrev = (value: string | number): string | undefined => {
      if (typeof value === 'string') {
        return value.toUpperCase();
      }
      return ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'][value];
    };
    const byday = rec.by_weekday
      .map(value => {
        if (typeof value === 'string' || typeof value === 'number') {
          return dayToAbbrev(value);
        }
        const abbr = dayToAbbrev(value.weekday);
        return abbr != null ? `${value.nth}${abbr}` : undefined;
      })
      .filter((value): value is string => typeof value === 'string')
      .join(',');
    if (byday !== '') {
      parts.push(`BYDAY=${byday}`);
    }
  }
  return parts.join(';');
};
