import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';

// Base schema - uses Date objects for internal processing
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
  created_at: z.date(),
});

// Outgoing schema - transforms dates to timestamps for API requests
export const OutgoingNotificationSchema = z.object({
  ...NotificationSchema.shape,
  created_at: z.date().transform(date => date.getTime()),
});

// Incoming schema - transforms timestamps to dates from API responses
export const IncomingNotificationSchema = z.object({
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
  created_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
});

export type Notification = z.infer<typeof NotificationSchema>;
export type OutgoingNotification = z.infer<typeof OutgoingNotificationSchema>;
export type IncomingNotification = z.infer<typeof IncomingNotificationSchema>;
