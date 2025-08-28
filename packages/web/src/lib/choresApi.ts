// Chores API functions
import {z} from 'zod';
import {ChoreSchema, ChoreWithUsernameSchema} from '@gitterdun/shared';
import {api} from './apiCore';

export const choresApi = {
  getAll: async (params?: {
    status?: string;
    chore_type?: string;
    user_id?: number;
    page?: number;
    limit?: number;
    sort_by?: 'created_at' | 'start_date' | 'due_date';
    order?: 'asc' | 'desc';
  }) => api.get('/chores', z.array(ChoreWithUsernameSchema), params),

  getById: async (id: number) =>
    api.get(`/chores/${id}`, ChoreWithUsernameSchema),

  create: async (choreData: {
    title: string;
    description?: string;
    point_reward: number;
    bonus_points?: number;
    penalty_points?: number;
    start_date?: string;
    due_date?: string;
    recurrence_rule?: string;
    chore_type: string;
    assigned_users?: Array<number>;
  }) => api.post('/chores', ChoreSchema, choreData),

  update: async (
    id: number,
    choreData: {
      title?: string;
      description?: string;
      point_reward?: number;
      bonus_points?: number;
      penalty_points?: number;
      start_date?: string;
      due_date?: string;
      recurrence_rule?: string;
      chore_type?: string;
      status?: string;
    },
  ) => api.put(`/chores/${id}`, ChoreSchema, choreData),

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
