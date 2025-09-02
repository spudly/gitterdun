// Families, Leaderboard, and Invitations API functions
import {z} from 'zod';
import {
  FamilySchema,
  FamilyMemberSchema,
  LeaderboardResponseSchema,
  UpdateFamilyTimezoneSchema,
} from '@gitterdun/shared';
import type {LeaderboardResponse, FamilyMember} from '@gitterdun/shared';
import {api} from './apiCore';

export const leaderboardApi = {
  get: async (params?: {limit?: number; sortBy?: 'points' | 'streak'}) =>
    api.get<LeaderboardResponse>(
      '/leaderboard',
      LeaderboardResponseSchema,
      params,
    ),
};

export const familiesApi = {
  create: async (data: {name: string}) =>
    api.post('/families', FamilySchema, data),
  myFamily: async () => api.get('/families/mine', FamilySchema.nullable()),
  updateTimezone: async (familyId: number, data: {timezone: string}) => {
    // Validate request body before sending
    const validated = UpdateFamilyTimezoneSchema.parse(data);
    return api.put(`/families/${familyId}/timezone`, FamilySchema, validated);
  },
  listMembers: async (familyId: number) =>
    api.get<Array<FamilyMember>>(
      `/families/${familyId}/members`,
      z.array(FamilyMemberSchema),
    ),
  createChild: async (
    familyId: number,
    data: {username: string; email: string | undefined; password: string},
  ) =>
    api.post(
      `/families/${familyId}/children`,
      z.object({success: z.boolean()}).loose(),
      data,
    ),
};

export const invitationsApi = {
  create: async (
    familyId: number,
    data: {email: string; role: 'parent' | 'child'},
  ) =>
    api.post(
      `/invitations/${familyId}`,
      z.object({success: z.boolean(), token: z.string().optional()}).loose(),
      data,
    ),
  accept: async (data: {token: string; username: string; password: string}) =>
    api.post(
      '/invitations/accept',
      z.object({success: z.boolean()}).loose(),
      data,
    ),
};
