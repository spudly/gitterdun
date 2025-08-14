// API utility functions using native fetch
// Prefer hitting the API server directly rather than relying on the Vite proxy
// Note: Avoid direct `import.meta` so tests (CJS) can parse this file.
const API_ORIGIN = 'http://localhost:3000';
const API_BASE_URL = `${API_ORIGIN}/api`;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  pagination?: {page: number; limit: number; total: number; totalPages: number};
}

interface ApiError {
  message: string;
  details?: any;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public details?: any,
  ) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // GET request
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data ? JSON.stringify(data) : null,
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data ? JSON.stringify(data) : null,
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data ? JSON.stringify(data) : null,
    });

    return handleResponse<ApiResponse<T>>(response);
  },
};

// Auth API functions
export const authApi = {
  login: (credentials: {email: string; password: string}) =>
    api.post<{
      id: number;
      username: string;
      email: string;
      role: string;
      points: number;
      streak_count: number;
    }>('/auth/login', credentials),

  register: (userData: {
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
    }>('/auth/register', userData),

  logout: () => api.post('/auth/logout'),
  me: () =>
    api.get<{
      id: number;
      username: string;
      email: string;
      role: string;
      points: number;
      streak_count: number;
    }>('/auth/me'),
  forgotPassword: (payload: {email: string}) =>
    api.post('/auth/forgot', payload),
  resetPassword: (payload: {token: string; password: string}) =>
    api.post('/auth/reset', payload),
};

// Chores API functions
export const choresApi = {
  getAll: (params?: {
    status?: string;
    chore_type?: string;
    user_id?: number;
    page?: number;
    limit?: number;
  }) =>
    api.get<
      Array<{
        id: number;
        title: string;
        description?: string;
        point_reward: number;
        bonus_points: number;
        penalty_points: number;
        due_date?: string;
        recurrence_rule?: string;
        chore_type: string;
        status: string;
        created_by: number;
        created_at: string;
        updated_at: string;
        created_by_username?: string;
      }>
    >('/chores', params),

  getById: (id: number) =>
    api.get<{
      id: number;
      title: string;
      description?: string;
      point_reward: number;
      bonus_points: number;
      penalty_points: number;
      due_date?: string;
      recurrence_rule?: string;
      chore_type: string;
      status: string;
      created_by: number;
      created_at: string;
      updated_at: string;
      created_by_username?: string;
    }>(`/chores/${id}`),

  create: (choreData: {
    title: string;
    description?: string;
    point_reward: number;
    bonus_points?: number;
    penalty_points?: number;
    due_date?: string;
    recurrence_rule?: string;
    chore_type: string;
    assigned_users?: number[];
  }) => api.post('/chores', choreData),

  update: (
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
  ) => api.put(`/chores/${id}`, choreData),

  delete: (id: number) => api.delete(`/chores/${id}`),

  complete: (id: number, data: {userId: number; notes?: string}) =>
    api.post(`/chores/${id}/complete`, data),
};

// Goals API functions
export const goalsApi = {
  getAll: (params?: {
    user_id: number;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<
      Array<{
        id: number;
        user_id: number;
        title: string;
        description?: string;
        target_points: number;
        current_points: number;
        status: string;
        created_at: string;
        updated_at: string;
      }>
    >('/goals', params),

  getById: (id: number) =>
    api.get<{
      id: number;
      user_id: number;
      title: string;
      description?: string;
      target_points: number;
      current_points: number;
      status: string;
      created_at: string;
      updated_at: string;
    }>(`/goals/${id}`),

  create: (goalData: {
    title: string;
    description?: string;
    target_points: number;
  }) => api.post('/goals', goalData),

  update: (
    id: number,
    goalData: {
      title?: string;
      description?: string;
      target_points?: number;
      current_points?: number;
      status?: string;
    },
  ) => api.put(`/goals/${id}`, goalData),

  delete: (id: number) => api.delete(`/goals/${id}`),
};

// Leaderboard API functions
export const leaderboardApi = {
  get: (params?: {limit?: number; sortBy?: 'points' | 'streak'}) =>
    api.get<{
      leaderboard: Array<{
        rank: number;
        id: number;
        username: string;
        points: number;
        streak_count: number;
        badges_earned: number;
        chores_completed: number;
      }>;
      sortBy: string;
      totalUsers: number;
    }>('/leaderboard', params),
};

// Families API
export const familiesApi = {
  create: (data: {name: string}) => api.post('/families', data),
  myFamilies: () =>
    api.get<
      Array<{id: number; name: string; owner_id: number; created_at: string}>
    >('/families/mine'),
  listMembers: (familyId: number) =>
    api.get<
      Array<{
        family_id: number;
        user_id: number;
        role: 'parent' | 'child';
        username: string;
        email: string;
      }>
    >(`/families/${familyId}/members`),
  createChild: (
    familyId: number,
    data: {username: string; email: string; password: string},
  ) => api.post(`/families/${familyId}/children`, data),
};

export const invitationsApi = {
  create: (familyId: number, data: {email: string; role: 'parent' | 'child'}) =>
    api.post(`/invitations/${familyId}`, data),
  accept: (data: {token: string; username: string; password: string}) =>
    api.post('/invitations/accept', data),
};

export {ApiError};
export type {ApiResponse};
