import {z} from 'zod';
import {
  MIN_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MAX_NAME_LENGTH,
} from '../constants.js';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(MAX_USERNAME_LENGTH),
  email: z.email().max(MAX_NAME_LENGTH).nullable(),
  role: z.enum(['admin', 'user']),
  points: z.number().int().min(0),
  streak_count: z.number().int().min(0),
  created_at: z.string(),
  updated_at: z.string(),
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
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
