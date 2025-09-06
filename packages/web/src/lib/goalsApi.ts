// Goals API functions
import {z} from 'zod';
import {IncomingGoalSchema} from '@gitterdun/shared';
import {api} from './apiCore.js';

export const goalsApi = {
  getAll: async (params?: {
    user_id: number;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/goals', z.array(IncomingGoalSchema), params),

  getById: async (id: number) => api.get(`/goals/${id}`, IncomingGoalSchema),

  create: async (goalData: {
    title: string;
    description?: string;
    target_points: number;
  }) => api.post('/goals', IncomingGoalSchema, goalData),

  update: async (
    id: number,
    goalData: {
      title?: string;
      description?: string;
      target_points?: number;
      current_points?: number;
      status?: string;
    },
  ) => api.put(`/goals/${id}`, IncomingGoalSchema, goalData),

  delete: async (id: number) =>
    api.delete(`/goals/${id}`, z.object({success: z.boolean()}).loose()),
};
