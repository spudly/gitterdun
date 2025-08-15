// API utility functions using native fetch
// Prefer hitting the API server directly rather than relying on the Vite proxy
// Note: Avoid direct `import.meta` so tests (CJS) can parse this file.
import {z} from 'zod';
import {
  ApiResponseSchema,
  ChoreSchema,
  ChoreWithUsernameSchema,
  GoalSchema,
  FamilyMemberSchema,
  FamilySchema,
  LeaderboardResponseSchema,
  UserSchema,
} from '@gitterdun/shared';
import type {LeaderboardResponse} from '@gitterdun/shared';

const API_ORIGIN = 'http://localhost:3000';
const API_BASE_URL = `${API_ORIGIN}/api`;

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: unknown;
  pagination?: {page: number; limit: number; total: number; totalPages: number};
};

// Removed unused ApiErrorShape

class ApiError extends Error {
  public status: number;
  public details?: unknown;
  public constructor(status: number, details?: unknown) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function handleResponseWithSchema<TData>(
  response: Response,
  dataSchema: z.ZodType<TData>,
): Promise<ApiResponse<TData>> {
  if (!response.ok) {
    const errorData: unknown = await response
      .json()
      .catch(() => ({}) as unknown);
    throw new ApiError(response.status, errorData);
  }

  const raw = (await response.json()) as unknown;
  return ApiResponseSchema(dataSchema).parse(raw);
}

export const api = {
  // GET request
  async get<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (
            typeof value === 'string'
            || typeof value === 'number'
            || typeof value === 'boolean'
          ) {
            url.searchParams.append(key, String(value));
          } else {
            url.searchParams.append(key, JSON.stringify(value));
          }
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // POST request
  async post<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data != null ? JSON.stringify(data) : null,
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // PUT request
  async put<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data != null ? JSON.stringify(data) : null,
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // DELETE request
  async delete<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // PATCH request
  async patch<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data != null ? JSON.stringify(data) : null,
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },
};

// Auth API functions
export const authApi = {
  login: async (credentials: {email: string; password: string}) =>
    api.post<{
      id: number;
      username: string;
      email: string;
      role: string;
      points: number;
      streak_count: number;
    }>(
      '/auth/login',
      UserSchema.pick({
        id: true,
        username: true,
        email: true,
        role: true,
        points: true,
        streak_count: true,
      }),
      credentials,
    ),

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) =>
    api.post<{
      id: number;
      username: string;
      email: string;
      role: string;
      points: number;
      streak_count: number;
    }>(
      '/auth/register',
      UserSchema.pick({
        id: true,
        username: true,
        email: true,
        role: true,
        points: true,
        streak_count: true,
      }),
      userData,
    ),

  logout: async () => api.post('/auth/logout', z.object({}).loose()),
  me: async () =>
    api.get<{
      id: number;
      username: string;
      email: string;
      role: string;
      points: number;
      streak_count: number;
    }>(
      '/auth/me',
      UserSchema.pick({
        id: true,
        username: true,
        email: true,
        role: true,
        points: true,
        streak_count: true,
      }),
    ),
  forgotPassword: async (payload: {email: string}) =>
    api.post('/auth/forgot', z.object({}).loose(), payload),
  resetPassword: async (payload: {token: string; password: string}) =>
    api.post('/auth/reset', z.object({}).loose(), payload),
};

// Chores API functions
export const choresApi = {
  getAll: async (params?: {
    status?: string;
    chore_type?: string;
    user_id?: number;
    page?: number;
    limit?: number;
  }) => api.get('/chores', z.array(ChoreWithUsernameSchema), params),

  getById: async (id: number) =>
    api.get(`/chores/${id}`, ChoreWithUsernameSchema),

  create: async (choreData: {
    title: string;
    description?: string;
    point_reward: number;
    bonus_points?: number;
    penalty_points?: number;
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
};

// Goals API functions
export const goalsApi = {
  getAll: async (params?: {
    user_id: number;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<Array<unknown>>('/goals', z.array(GoalSchema), params),

  getById: async (id: number) => api.get<unknown>(`/goals/${id}`, GoalSchema),

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

// Leaderboard API functions
export const leaderboardApi = {
  get: async (params?: {limit?: number; sortBy?: 'points' | 'streak'}) =>
    api.get<LeaderboardResponse>(
      '/leaderboard',
      LeaderboardResponseSchema,
      params,
    ),
};

// Families API
export const familiesApi = {
  create: async (data: {name: string}) =>
    api.post('/families', FamilySchema, data),
  myFamilies: async () => api.get('/families/mine', z.array(FamilySchema)),
  listMembers: async (familyId: number) =>
    api.get<Array<unknown>>(
      `/families/${familyId}/members`,
      z.array(FamilyMemberSchema),
    ),
  createChild: async (
    familyId: number,
    data: {username: string; email: string; password: string},
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

export {ApiError};
export type {ApiResponse};
