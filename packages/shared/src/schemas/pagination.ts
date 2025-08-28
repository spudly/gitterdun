import {z} from 'zod';
import {MAX_PAGINATION_LIMIT, DEFAULT_PAGINATION_LIMIT} from '../constants.js';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGINATION_LIMIT)
    .default(DEFAULT_PAGINATION_LIMIT),
});
