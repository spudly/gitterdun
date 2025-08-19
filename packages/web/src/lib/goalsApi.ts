// Goals API functions
import {z} from 'zod';
import {GoalSchema} from '@gitterdun/shared';
import {api} from './apiCore';

export const goalsApi = {
  getAll: async (params?: {
    user_id: number;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/goals', z.array(GoalSchema), params),

  getById: async (id: number) => api.get(`/goals/${id}`, GoalSchema),

  create: async (goalData: {
    title: string;
    description?: string;
    target_points: number;
  }) => api.post('/goals', GoalSchema, goalData),

  update: async (
    id: number,
    goalData: {
      title?: string;
      description?: string;
      target_points?: number;
      current_points?: number;
      status?: string;
    },
  ) => api.put(`/goals/${id}`, GoalSchema, goalData),

  delete: async (id: number) =>
    api.delete(`/goals/${id}`, z.object({success: z.boolean()}).loose()),
};
