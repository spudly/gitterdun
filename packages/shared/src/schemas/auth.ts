import {z} from 'zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const ForgotPasswordRequestSchema = z.object({email: z.email()});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export type Login = z.infer<typeof LoginSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
