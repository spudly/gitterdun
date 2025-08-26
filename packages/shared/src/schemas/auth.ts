import {z} from 'zod';

const IdentifierSchema = z
  .object({email: z.email()})
  .or(z.object({username: z.string().min(1)}));

export const LoginSchema = z.intersection(
  IdentifierSchema,
  z.object({password: z.string().min(1)}),
);

export const ForgotPasswordRequestSchema = z.object({email: z.email()});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export type Login = z.infer<typeof LoginSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
