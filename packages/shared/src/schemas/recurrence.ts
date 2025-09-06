import {z} from 'zod';

const WeekdayEnum = z.union([
  z.literal('MO'),
  z.literal('TU'),
  z.literal('WE'),
  z.literal('TH'),
  z.literal('FR'),
  z.literal('SA'),
  z.literal('SU'),
]);

export const MIN_WEEKDAY = 0;
export const MAX_WEEKDAY = 6;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const SECONDS_PER_MINUTE = 60;
export const MIN_MONTHDAY = 1;
export const MAX_MONTHDAY = 31;
export const MIN_MONTH = 1;
export const MAX_MONTH = 12;

export const RecurrenceSchema = z.object({
  frequency: z.enum([
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY',
    'HOURLY',
    'MINUTELY',
    'SECONDLY',
  ]),
  interval: z.number().int().min(1).optional(),
  count: z.number().int().min(1).optional(),
  until: z.number().int().optional(),
  by_weekday: z
    .array(
      z.union([
        WeekdayEnum,
        z.number().int().min(MIN_WEEKDAY).max(MAX_WEEKDAY),
        z.object({
          nth: z.number().int(),
          weekday: z.union([
            WeekdayEnum,
            z.number().int().min(MIN_WEEKDAY).max(MAX_WEEKDAY),
          ]),
        }),
      ]),
    )
    .optional(),
  by_hour: z
    .array(
      z
        .number()
        .int()
        .min(0)
        .max(HOURS_PER_DAY - 1),
    )
    .optional(),
  by_minute: z
    .array(
      z
        .number()
        .int()
        .min(0)
        .max(MINUTES_PER_HOUR - 1),
    )
    .optional(),
  by_second: z
    .array(
      z
        .number()
        .int()
        .min(0)
        .max(SECONDS_PER_MINUTE - 1),
    )
    .optional(),
  by_monthday: z
    .array(z.number().int().min(MIN_MONTHDAY).max(MAX_MONTHDAY))
    .optional(),
  by_setpos: z.array(z.number().int()).optional(),
  by_month: z.array(z.number().int().min(MIN_MONTH).max(MAX_MONTH)).optional(),
  by_weekno: z.array(z.number().int()).optional(),
  by_yearday: z.array(z.number().int()).optional(),
  weekstart: z
    .union([WeekdayEnum, z.number().int().min(MIN_WEEKDAY).max(MAX_WEEKDAY)])
    .optional(),
});

export type Recurrence = z.infer<typeof RecurrenceSchema>;
