import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';

export const ChoreSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  reward_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).default(0),
  // Timestamps in ms since epoch
  start_date: z.number().int().optional(),
  due_date: z.number().int().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    }),
  // status is derived from chore instances; not part of chore definition
  status: z
    .string()
    .refine(val => ['pending', 'completed', 'approved'].includes(val), {
      message: 'status must be either "pending", "completed", or "approved"',
    })
    .optional(),
  created_by: z.number(),
  created_at: z.number().int(),
  updated_at: z.number().int(),
});

export const ChoreWithUsernameSchema = ChoreSchema.extend({
  created_by_username: z.string().optional(),
});

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
  frequency: z
    .string()
    .refine(
      val =>
        [
          'DAILY',
          'WEEKLY',
          'MONTHLY',
          'YEARLY',
          'HOURLY',
          'MINUTELY',
          'SECONDLY',
        ].includes(val.toUpperCase()),
      {
        message:
          'frequency must be one of DAILY, WEEKLY, MONTHLY, YEARLY, HOURLY, MINUTELY, SECONDLY',
      },
    ) as unknown as z.ZodType<
    | 'DAILY'
    | 'WEEKLY'
    | 'MONTHLY'
    | 'YEARLY'
    | 'HOURLY'
    | 'MINUTELY'
    | 'SECONDLY'
  >,
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

export const CreateChoreSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  reward_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).optional().default(0),
  start_date: z.number().int().optional(),
  due_date: z.number().int().optional(),
  recurrence: RecurrenceSchema.optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .default('required'),
  assigned_users: z.array(z.number()).optional(),
});

export const UpdateChoreSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
  description: z.string().optional(),
  reward_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).optional(),
  start_date: z.iso.datetime().optional(),
  due_date: z.iso.datetime().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .optional(),
  // status cannot be updated at chore definition level
});

export type Chore = z.infer<typeof ChoreSchema>;
export type ChoreWithUsername = z.infer<typeof ChoreWithUsernameSchema>;
export type CreateChore = z.infer<typeof CreateChoreSchema>;
export type UpdateChore = z.infer<typeof UpdateChoreSchema>;
