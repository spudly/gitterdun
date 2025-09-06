// Chores API functions
import {z} from 'zod';
import {
  IncomingChoreSchema,
  IncomingChoreWithUsernameSchema,
} from '@gitterdun/shared';
import {api} from './apiCore.js';

export const choresApi = {
  getAll: async (params?: {
    status?: string | undefined;
    chore_type?: string | undefined;
    user_id?: number | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sort_by?: 'created_at' | 'start_date' | 'due_date' | undefined;
    order?: 'asc' | 'desc' | undefined;
  }) => api.get('/chores', z.array(IncomingChoreWithUsernameSchema), params),

  getById: async (id: number) =>
    api.get(`/chores/${id}`, IncomingChoreWithUsernameSchema),

  create: async (choreData: {
    title: string;
    description?: string;
    reward_points?: number;
    penalty_points?: number;
    start_date?: number;
    due_date?: number;
    recurrence_rule?: string;
    chore_type: string;
    assigned_users?: Array<number>;
  }) => api.post('/chores', IncomingChoreSchema, choreData),

  update: async (
    id: number,
    choreData: {
      title?: string;
      description?: string;
      reward_points?: number;
      penalty_points?: number;
      start_date?: number;
      due_date?: number;
      recurrence_rule?: string;
      chore_type?: string;
      status?: string;
    },
  ) => api.put(`/chores/${id}`, IncomingChoreSchema, choreData),

  delete: async (id: number) =>
    api.delete(`/chores/${id}`, z.object({success: z.boolean()}).loose()),

  complete: async (id: number, data: {userId: number; notes?: string}) =>
    api.post(
      `/chores/${id}/complete`,
      z.object({success: z.boolean()}).loose(),
      data,
    ),

  assign: async (id: number, data: {userId: number}) =>
    api.post(
      `/chores/${id}/assign`,
      z.object({success: z.boolean()}).loose(),
      data,
    ),

  approve: async (id: number, data: {approvedBy: number}) =>
    api.post(
      `/chores/${id}/approve`,
      z.object({success: z.boolean()}).loose(),
      data,
    ),

  reject: async (id: number) =>
    api.post(
      `/chores/${id}/reject`,
      z.object({success: z.boolean()}).loose(),
      {},
    ),
};
