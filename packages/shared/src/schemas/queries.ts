import {z} from 'zod';
import {PaginationSchema} from './pagination.js';

export const ChoreQuerySchema = PaginationSchema.extend({
  status: z.enum(['pending', 'completed', 'approved']).optional(),
  chore_type: z.enum(['required', 'bonus']).optional(),
  user_id: z.coerce.number().int().optional(),
  sort_by: z.enum(['created_at', 'start_date', 'due_date']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const GoalQuerySchema = PaginationSchema.extend({
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
  user_id: z.coerce.number().int().optional(),
});
