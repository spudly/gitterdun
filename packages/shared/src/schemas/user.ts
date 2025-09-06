import {z} from 'zod';
import {
  MIN_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MAX_NAME_LENGTH,
} from '../constants.js';

// Base schema - uses Date objects for internal processing
export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(MAX_USERNAME_LENGTH),
  email: z.email().max(MAX_NAME_LENGTH).nullable(),
  role: z.enum(['admin', 'user']),
  points: z.number().int().min(0),
  streak_count: z.number().int().min(0),
  display_name: z.string().max(MAX_NAME_LENGTH).optional().nullable(),
  avatar_url: z.url().optional().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Outgoing schema - transforms dates to timestamps for API requests
export const OutgoingUserSchema = z.object({
  ...UserSchema.shape,
  created_at: z.date().transform(date => date.getTime()),
  updated_at: z.date().transform(date => date.getTime()),
});

// Incoming schema - transforms timestamps to dates from API responses
export const IncomingUserSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(MAX_USERNAME_LENGTH),
  email: z.email().max(MAX_NAME_LENGTH).nullable(),
  role: z.enum(['admin', 'user']),
  points: z.number().int().min(0),
  streak_count: z.number().int().min(0),
  display_name: z.string().max(MAX_NAME_LENGTH).optional().nullable(),
  avatar_url: z.url().optional().nullable(),
  created_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
  updated_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
});

export const CreateUserSchema = z.object({
  username: z.string().min(1).max(MAX_USERNAME_LENGTH),
  email: z.email().max(MAX_NAME_LENGTH).optional(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  role: z.enum(['admin', 'user']).optional().default('user'),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(1).max(MAX_USERNAME_LENGTH).optional(),
  email: z.email().max(MAX_NAME_LENGTH).optional(),
  points: z.number().int().min(0).optional(),
  streak_count: z.number().int().min(0).optional(),
  display_name: z.string().max(MAX_NAME_LENGTH).optional().nullable(),
  avatar_url: z.url().optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;
export type OutgoingUser = z.infer<typeof OutgoingUserSchema>;
export type IncomingUser = z.infer<typeof IncomingUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
