import {z} from 'zod';
import {UserSchema} from '@gitterdun/shared';
import {api} from './apiCore.js';

const EmptyObjectSchema = z.object({});
const UpdateProfileResponseSchema = z
  .object({ok: z.boolean()})
  .or(EmptyObjectSchema);

export const usersApi = {
  list: async () => api.get('/users', z.array(UserSchema)),
  delete: async (id: number) => api.delete(`/users/${id}`, EmptyObjectSchema),
  getMe: async () => api.get('/users/me', UserSchema),
  updateProfile: async (data: {
    display_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  }) => api.patch('/users/me', UpdateProfileResponseSchema, data),
  deleteMe: async () => api.delete('/users/me', EmptyObjectSchema),
};
