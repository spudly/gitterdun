// Auth API functions
import {z} from 'zod';
import {api} from './apiCore';

export const authApi = {
  login: async (credentials: {email: string; password: string}) =>
    api.post<Record<string, unknown>>(
      '/auth/login',
      z.object({}).loose(),
      credentials,
    ),

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) =>
    api.post<Record<string, unknown>>(
      '/auth/register',
      z.object({}).loose(),
      userData,
    ),

  logout: async () => api.post('/auth/logout', z.object({}).loose()),
  me: async () =>
    api.get<Record<string, unknown>>('/auth/me', z.object({}).loose()),
  forgotPassword: async (payload: {email: string}) =>
    api.post('/auth/forgot', z.object({}).loose(), payload),
  resetPassword: async (payload: {token: string; password: string}) =>
    api.post('/auth/reset', z.object({}).loose(), payload),
};
