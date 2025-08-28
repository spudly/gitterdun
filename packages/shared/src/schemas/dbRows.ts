import {z} from 'zod';
import {MAX_USERNAME_LENGTH, MAX_NAME_LENGTH} from '../constants.js';

export const SessionRowSchema = z.object({
  user_id: z.number(),
  expires_at: z.string(),
});

export const IdRowSchema = z.object({id: z.number()});

export const RoleRowSchema = z.object({role: z.enum(['parent', 'child'])});

export const PasswordResetRowSchema = z.object({
  token: z.string(),
  user_id: z.number(),
  expires_at: z.string(),
  used: z.number(),
});

export const FamilyInvitationRowSchema = z.object({
  token: z.string(),
  family_id: z.number(),
  email: z.email(),
  role: z.enum(['parent', 'child']),
  invited_by: z.number(),
  expires_at: z.string(),
  accepted: z.number(),
});

export const UserPasswordHashRowSchema = z.object({
  id: z.number(),
  password_hash: z.string(),
});

export const UserWithPasswordRowSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(MAX_USERNAME_LENGTH),
  email: z.email().max(MAX_NAME_LENGTH).nullable(),
  password_hash: z.string(),
  role: z.enum(['admin', 'user']),
  points: z.number().int().min(0),
  streak_count: z.number().int().min(0),
  created_at: z.string(),
  updated_at: z.string(),
});
