import {z} from 'zod';

export const CountRowSchema = z.object({count: z.coerce.number()});

export const IdParamSchema = z.object({id: z.coerce.number().int().min(1)});

export const FamilyIdParamSchema = z.object({
  familyId: z.coerce.number().int().min(1),
});

export const CompleteChoreBodySchema = z.object({
  userId: z.coerce.number().int().min(1),
  notes: z.string().optional(),
});
