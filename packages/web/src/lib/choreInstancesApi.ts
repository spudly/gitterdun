import {z} from 'zod';
import {api} from './apiCore.js';

const ChoreInstanceListItemSchema = z.object({
  chore_id: z.number(),
  title: z.string(),
  status: z.enum(['incomplete', 'complete']),
  approval_status: z.enum(['unapproved', 'approved', 'rejected']),
  notes: z.string().optional(),
});

const ChoreInstanceListSchema = z.array(ChoreInstanceListItemSchema);

export const choreInstancesApi = {
  async listForDay(params: {date: string}) {
    return api.get('/chore-instances', ChoreInstanceListSchema, params);
  },
  async upsert(data: {
    chore_id: number;
    date: string; // ISO or yyyy-mm-dd
    status?: 'incomplete' | 'complete';
    approval_status?: 'unapproved' | 'approved' | 'rejected';
    notes?: string;
  }) {
    return api.post('/chore-instances', z.object({success: z.boolean()}), data);
  },
};
