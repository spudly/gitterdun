import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';

export const NotificationSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  message: z.string().min(1),
  type: z.enum([
    'chore_due',
    'chore_completed',
    'chore_approved',
    'overdue',
    'streak',
    'badge',
    'reward',
  ]),
  is_read: z.boolean().default(false),
  related_id: z.number().optional(),
  created_at: z.iso.datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;
