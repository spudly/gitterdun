import {z} from 'zod';
import {IncomingUserSchema} from '@gitterdun/shared';
import {api} from './apiCore.js';

const EmptyObjectSchema = z.object({});

export const usersApi = {
  list: async () => api.get('/users', z.array(IncomingUserSchema)),
  delete: async (id: number) => api.delete(`/users/${id}`, EmptyObjectSchema),
  getMe: async () => api.get('/users/me', IncomingUserSchema),
  updateProfile: async (data: {
    display_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  }) => api.patch('/users/me', IncomingUserSchema, data),
  deleteMe: async () => api.delete('/users/me', EmptyObjectSchema),
};
