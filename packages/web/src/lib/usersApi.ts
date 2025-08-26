import {z} from 'zod';
import {UserSchema} from '@gitterdun/shared';
import {api} from './apiCore';

const EmptyObjectSchema = z.object({});

export const usersApi = {
  list: async () => api.get('/users', z.array(UserSchema)),
  delete: async (id: number) => api.delete(`/users/${id}`, EmptyObjectSchema),
};
