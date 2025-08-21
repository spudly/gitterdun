import {z} from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(50),
  email: z.email().max(255),
  role: z.enum(['admin', 'user']),
  points: z.number().int().min(0),
  streak_count: z.number().int().min(0),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateUserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.email().max(255),
  password: z.string().min(6),
  role: z.enum(['admin', 'user']).optional().default('user'),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  email: z.email().max(255).optional(),
  points: z.number().int().min(0).optional(),
  streak_count: z.number().int().min(0).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
