import {z} from 'zod';

export const FamilySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  owner_id: z.number(),
  created_at: z.string(),
});

export const CreateFamilySchema = z.object({name: z.string().min(1).max(100)});

export const FamilyMemberSchema = z.object({
  family_id: z.number(),
  user_id: z.number(),
  role: z.enum(['parent', 'child']),
  username: z.string(),
  email: z.email().nullable(),
});

export const CreateChildSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.preprocess(
    val => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.email().max(255).optional(),
  ),
  password: z.string().min(4),
});

export const CreateInvitationSchema = z.object({
  email: z.email().max(255),
  role: z.enum(['parent', 'child']),
});

export const AcceptInvitationSchema = z.object({
  token: z.string().min(1),
  username: z.string().min(1).max(50),
  password: z.string().min(4),
});

export type Family = z.infer<typeof FamilySchema>;
export type CreateFamily = z.infer<typeof CreateFamilySchema>;
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;
export type CreateChild = z.infer<typeof CreateChildSchema>;
export type CreateInvitation = z.infer<typeof CreateInvitationSchema>;
export type AcceptInvitation = z.infer<typeof AcceptInvitationSchema>;
