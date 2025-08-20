import {z} from 'zod';

export const TokenSearchParamsSchema = z.object({token: z.string().min(1)});
